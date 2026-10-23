import { chromium, type FullConfig } from '@playwright/test';

import { performLoginWithAutoSignup } from './fixtures/auth';
import {
  AUTH_STATE_PATH,
  isStoredAuthReusable,
  writeAuthMeta,
} from './fixtures/auth-state';

/**
 * Logs in ONCE per `playwright test` invocation and persists the session to
 * `.auth/user.json` for specs that opt in via `test.use({ storageState })`.
 *
 * Why `globalSetup` and not a `setup` project:
 *   Project dependencies are silently skipped when the CLI is given a file
 *   filter (e.g. `playwright test e2e/exam.spec.ts`), which is the way this
 *   repo is usually run. `globalSetup` always runs, so the state file is
 *   guaranteed to exist before any spec asks for it.
 *
 * Why `storageState` works here:
 *   `src/firebase/firebaseWebConfig.ts` calls
 *   `setPersistence(auth, browserLocalPersistence)`, so the Firebase session
 *   lives in localStorage as `firebase:authUser:<apiKey>:[DEFAULT]`.
 *   `context.storageState()` captures both that localStorage entry and the
 *   `authToken` cookie the server APIs rely on.
 *
 * NOTE: restoring via `storageState` writes localStorage ONCE at context
 * creation. Do NOT restore with `addInitScript`, which replays the snapshot
 * before every navigation and clobbers the refresh token Firebase just rotated.
 */
export default async function globalAuthSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use?.baseURL || process.env.PLAYWRIGHT_TEST_BASEURL || 'http://localhost:3000';

  const forceFresh = process.env.E2E_FRESH_AUTH === '1';

  if (!forceFresh && isStoredAuthReusable(baseURL)) {
    console.log('[auth-setup] ✓ Reusing saved session from .auth/user.json');
    return;
  }

  console.log(
    `[auth-setup] No reusable session for ${baseURL} — signing in once for this run...`,
  );

  const browser = await chromium.launch({
    // Match playwright.config.ts: system Chrome is required on older macOS.
    ...(process.platform === 'darwin' ? { channel: 'chrome' as const } : {}),
  });

  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    await performLoginWithAutoSignup(page);

    // Strict readiness probe. A session is only worth saving when the
    // protected dashboard actually renders and stays there — a transient
    // render followed by a bounce to /signin is exactly the failure mode
    // this setup exists to prevent.
    await page.goto('/main', { waitUntil: 'domcontentloaded' });

    const registerCta = page.locator('button:has-text("Register for Certification")').first();
    await registerCta.waitFor({ state: 'visible', timeout: 30_000 });

    // Grace period: confirm AuthGuard does not kick us back after the first paint.
    await page.waitForTimeout(1_000);

    const pathname = new URL(page.url()).pathname;
    if (!pathname.startsWith('/main')) {
      throw new Error(
        `[auth-setup] Session bounced to ${pathname} instead of staying on /main. ` +
          'Refusing to save an invalid auth state.',
      );
    }

    await context.storageState({ path: AUTH_STATE_PATH });
    writeAuthMeta({ savedAt: Date.now(), baseURL });

    console.log(`[auth-setup] ✓ Session saved to ${AUTH_STATE_PATH}`);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
