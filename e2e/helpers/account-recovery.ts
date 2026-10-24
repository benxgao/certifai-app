/**
 * Account recycling for the backend's daily exam-creation cap (3 exams / 24h).
 *
 * Standalone and reusable: nothing but a `Page` is required, so any spec or
 * helper can drive it directly.
 *
 * ```ts
 * import { DailyExamLimitError, recoverFromDailyExamLimit } from './helpers/account-recovery';
 *
 * try {
 *   await createExam(page);
 * } catch (error) {
 *   if (!(error instanceof DailyExamLimitError)) throw error;
 *   await recoverFromDailyExamLimit(page, { reason: error.message });
 *   await createExam(page); // fresh account, fresh quota
 * }
 * ```
 *
 * Steps: delete the signed-in account through /main/profile → wait for the
 * post-delete redirect → re-register and log in → register a certification if
 * the new account has none → land on its exams page → assert the quota is
 * actually fresh → persist the new session to `.auth/user.json`.
 *
 * Its only consumer today is `handleExamCreation` (helpers/exams.ts); the module
 * deliberately carries no exam-flow logic of its own so other specs can adopt it
 * without pulling that in.
 */
import type { Page } from '@playwright/test';

import {
  performDeleteAccount,
  performLogin,
  performSignup,
} from '../fixtures/auth';
import {
  AUTH_STATE_PATH,
  clearActiveTestAccount,
  resolveTestAccountEmail,
  writeActiveTestAccount,
  writeAuthMeta,
} from '../fixtures/auth-state';
import { waitForHydration } from './hydration';
import type { FlowTimingTracker } from './performance';
import { readDailyExamQuota } from './quota';

/**
 * Raised when the backend refuses to create another exam because the test
 * account already created its daily maximum (currently 3 exams / 24h).
 *
 * It is a distinct type so the creation helper can tell "quota exhausted, the
 * account is the problem" apart from real failures (modal never opened, network
 * error, ...) and only trigger account recovery for the former.
 */
export class DailyExamLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DailyExamLimitError';
  }
}

const EXAM_PAGE_URL = /\/main\/certifications\/(\d+)\/exams/;

/**
 * The backend purges Firestore docs, Prisma rows, and the Firebase Auth user in
 * sequence. Signing up again while that is still running surfaces as
 * "email-already-in-use" or a login that resolves to the half-deleted account,
 * so give the deletion a moment to settle before re-registering.
 */
const ACCOUNT_PURGE_BUFFER_MS = 5_000;

export type AccountRecoveryResult = {
  email: string;
  certId: string;
  /** True when re-registering the original email failed and a plus-alias was used. */
  usedFallbackEmail: boolean;
};

export function readCertIdFromUrl(page: Page): string | null {
  const match = page.url().match(EXAM_PAGE_URL);
  return match ? match[1] : null;
}

function resolveCredentials(): { email: string; password: string } {
  // Must match the account the suite signs in with, otherwise recovery would
  // delete an account nobody is using.
  const email = resolveTestAccountEmail();
  const password = process.env.PW_TEST_PASSWORD || process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Account recovery needs an email (PW_TEST_EMAIL) and PW_TEST_PASSWORD to re-register. ' +
        'Set them in .env.local (see e2e/instructions.md).',
    );
  }

  return { email, password };
}

/** `pw_test_exam@certestic.com` → `pw_test_exam+pw1729...@certestic.com` */
function withUniqueAlias(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!domain) return `pw${Date.now()}@certestic.com`;
  return `${localPart}+pw${Date.now()}@${domain}`;
}

/** Mirrors the display-name derivation used by the login/signup fixture. */
function deriveDisplayName(email: string): string {
  const prefix = email.split('@')[0].split('+')[0];
  return prefix
    .replace(/[._-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Delete the signed-in account through the profile UI and wait for the
 * post-delete redirect to /signin.
 *
 * Navigates straight to /main/profile instead of driving the header dropdown
 * (`navigateToProfile`): the header only mounts once AuthGuard resolves
 * `apiUserId`, and mid-flow that can take longer than the dropdown wait.
 */
async function deleteAccountThroughUi(page: Page): Promise<void> {
  console.log('  - Opening the profile page...');
  await page.goto('/main/profile', { waitUntil: 'domcontentloaded' });
  await waitForHydration(page).catch(() => {
    console.log('  ⚠ Hydration not detected on /main/profile, continuing...');
  });

  const accountSettings = page.locator('h3:has-text("Account Settings")').last();
  if (
    !(await accountSettings
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => true)
      .catch(() => false))
  ) {
    throw new Error(
      `Profile page did not render "Account Settings" (url: ${page.url()}) — cannot delete the account.`,
    );
  }
  console.log('✓ Profile page opened');

  await performDeleteAccount(page);
  console.log('  - Waiting for the post-delete redirect to /signin...');

  const redirected = await page
    .waitForURL((url) => url.pathname === '/signin', { timeout: 45_000 })
    .then(() => true)
    .catch(() => false);

  if (!redirected) {
    const toastText = await page
      .locator('[data-sonner-toast], [role="status"], [role="alert"]')
      .allInnerTexts()
      .catch(() => []);
    const detail = toastText
      .map((text) => text.trim())
      .filter(Boolean)
      .join(' | ');

    throw new Error(
      `Account deletion did not redirect to /signin (still on ${page.url()}). ` +
        'Check DELETE /api/users/{id} on the backend — recovery cannot continue without it.' +
        (detail ? ` UI feedback: "${detail}"` : ''),
    );
  }

  console.log('✓ Account deleted and redirected to /signin');
}

/**
 * After deletion the browser still holds the deleted user's Firebase session
 * (localStorage `firebase:authUser:*` + the `authToken` cookie). `/signup` then
 * sees a signed-in user and redirects to `/main` in its mount effect, so the
 * form unmounts mid-fill and the certification selector never appears.
 *
 * Clearing the persisted state is enough: the next `goto('/signup')` is a full
 * document load and the SDK re-initialises with nothing to restore.
 */
async function clearDeletedAccountSession(page: Page): Promise<void> {
  const AUTH_KEY_SOURCE = '^firebase:|auth[_-]?token|session_token|^authUser';

  for (let attempt = 1; attempt <= 3; attempt++) {
    const clearedKeys = await page
      .evaluate((patternSource) => {
        const re = new RegExp(patternSource, 'i');
        const keys = Object.keys(localStorage).filter((key) => re.test(key));
        keys.forEach((key) => localStorage.removeItem(key));
        return keys.length;
      }, AUTH_KEY_SOURCE)
      .catch(() => -1);

    if (clearedKeys >= 0) {
      console.log(`  - Cleared ${clearedKeys} persisted auth key(s) from the deleted session`);
    } else {
      // The execution context was destroyed by an in-flight redirect.
      await page.waitForLoadState('domcontentloaded').catch(() => {});
    }

    await page.context().clearCookies();
    await page.goto('/signin', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await waitForHydration(page).catch(() => {});

    // With no persisted user the SDK cannot restore a session, so /signin must
    // stay put. If it bounces to /main a session survived — clear and retry.
    if (!new URL(page.url()).pathname.startsWith('/main')) return;

    console.log('  ⚠ Deleted session survived the reset, retrying...');
  }

  throw new Error(
    'Could not clear the deleted account session before re-registering — /signin keeps redirecting to /main.',
  );
}

/**
 * Register a brand-new account and log in with it.
 * Leaves the browser on /main.
 */
async function registerAndLogIn(
  page: Page,
  email: string,
  password: string,
  displayName: string,
): Promise<void> {
  await clearDeletedAccountSession(page);

  console.log(`  - Signing up ${email}...`);
  const signup = await performSignup(page, email, password, displayName);

  if (signup.outcome === 'email-exists') {
    // Deletion is a server-side operation and the Firebase Auth user can survive
    // it, so the email stays reserved. Skipping the doomed login saves ~90s.
    throw new Error(
      `Signup rejected the email as already registered${signup.errorText ? `: "${signup.errorText}"` : ''}`,
    );
  }

  console.log('  - Logging in with the new account...');
  await performLogin(page, email, password);
  console.log('✓ Re-registered and logged in');
}

const DASHBOARD_SURFACE_SELECTOR =
  'button:has-text("Register for Certification"), a[href*="/main/certifications/"], h2:has-text("Your Registered Certifications")';

async function waitForDashboard(page: Page, timeout = 30_000): Promise<boolean> {
  return page
    .locator(DASHBOARD_SURFACE_SELECTOR)
    .first()
    .waitFor({ state: 'visible', timeout })
    .then(() => true)
    .catch(() => false);
}

/**
 * Open the exams page for the freshly created account.
 *
 * A brand-new account has no certification registered yet (`initCertId` only
 * lands in the ID token claims, not in the backend's certification table), so
 * this registers the first available certification when the dashboard has no
 * cert card — otherwise there is no exam surface to create an exam on.
 */
async function openExamsPageForFreshAccount(
  page: Page,
  credentials: { email: string; password: string },
): Promise<string> {
  // Use the document that already exists after the login redirect: the auth
  // cookie is written asynchronously, and a hard reload too early bounces
  // through AuthGuard back to /signin.
  let dashboardReady = await waitForDashboard(page);

  if (!dashboardReady && !new URL(page.url()).pathname.startsWith('/main')) {
    await page.goto('/main', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page).catch(() => {});
    dashboardReady = await waitForDashboard(page);
  }

  if (!dashboardReady) {
    console.log('  ⚠ Dashboard did not render after login, reloading once...');
    await page.goto('/main', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page).catch(() => {});
    dashboardReady = await waitForDashboard(page);
  }

  if (!dashboardReady && new URL(page.url()).pathname.startsWith('/signin')) {
    console.log('  ⚠ Session was dropped after signup, logging in again...');
    await performLogin(page, credentials.email, credentials.password);
    await page.goto('/main', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page).catch(() => {});
    dashboardReady = await waitForDashboard(page);
  }

  if (!dashboardReady) {
    const bodyText = (await page
      .locator('body')
      .innerText()
      .catch(() => ''))
      .replace(/\s+/g, ' ')
      .slice(0, 200);

    throw new Error(
      `New account dashboard did not render (url: ${page.url()}). Body starts with: "${bodyText}"`,
    );
  }

  const certCard = page.locator('a[href*="/main/certifications/"]').first();
  const hasCertCard = await certCard
    .waitFor({ state: 'visible', timeout: 20_000 })
    .then(() => true)
    .catch(() => false);

  if (hasCertCard) {
    console.log('✓ New account already has a registered certification');
    await certCard.click();
  } else {
    console.log('  - New account has no certification yet, registering one...');

    const registerCta = page.locator('button:has-text("Register for Certification")').first();
    if (!(await registerCta.isVisible({ timeout: 15_000 }).catch(() => false))) {
      throw new Error(
        'New account dashboard shows neither a certification card nor the ' +
          `"Register for Certification" CTA (url: ${page.url()}) — cannot reach an exams page.`,
      );
    }

    await registerCta.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 15_000 });

    const viewExamsButton = page.locator('button:has-text("View Exams")').first();
    const alreadyRegistered = await viewExamsButton
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (alreadyRegistered) {
      console.log('  ℹ Certification was registered during signup (View Exams available)');
      await viewExamsButton.click();
    } else {
      const registerNow = page.locator('button:has-text("Register Now")').first();
      if (!(await registerNow.waitFor({ state: 'visible', timeout: 20_000 }).then(() => true).catch(() => false))) {
        throw new Error(
          'No "Register Now" button on the certifications page — cannot register a certification for the new account.',
        );
      }

      await registerNow.click();

      const modalConfirm = page.locator('button:has-text("Register for this Certification")').first();
      const modalReady = await modalConfirm
        .waitFor({ state: 'visible', timeout: 10_000 })
        .then(() => true)
        .catch(() => false);

      if (modalReady) {
        await modalConfirm.click();
      } else {
        console.log('  ⚠ Exact modal selector failed, trying any Register button in a dialog...');
        const dialogRegister = page
          .locator('div[role="dialog"] button')
          .filter({ hasText: /Register/ })
          .last();

        if (!(await dialogRegister.isVisible({ timeout: 3_000 }).catch(() => false))) {
          throw new Error('Certification registration modal did not appear.');
        }
        await dialogRegister.click();
      }

      const registered = await viewExamsButton
        .waitFor({ state: 'visible', timeout: 25_000 })
        .then(() => true)
        .catch(() => false);

      if (!registered) {
        throw new Error(
          'Certification registration did not complete — "View Exams" never appeared for the new account.',
        );
      }

      await viewExamsButton.click();
    }
  }

  await page.waitForURL(EXAM_PAGE_URL, { timeout: 25_000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 15_000 });

  const certId = readCertIdFromUrl(page);
  if (!certId) {
    throw new Error(
      `Expected an exams page (/main/certifications/{id}/exams) after recovery, got: ${page.url()}`,
    );
  }

  console.log(`✓ Exams page ready for the new account (certification ${certId})`);
  return certId;
}

/**
 * The daily-limit widget only renders when the exams API returns a `rateLimit`
 * payload, which a brand-new account (0 exams) does not always produce. The
 * "New Exam" CTA is the reliable proxy: it is disabled exactly when the quota
 * is exhausted.
 */
async function waitForNewExamButtonEnabled(page: Page, timeoutMs = 20_000): Promise<boolean> {
  const newExamButton = page.locator('button:has-text("New Exam")').first();
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await newExamButton.isEnabled().catch(() => false)) return true;
    await page.waitForTimeout(500);
  }

  return false;
}

/**
 * Recover from the daily exam-creation limit by recycling the test account:
 *
 *   1. delete the account through the profile UI (backend purges exams too)
 *   2. re-register the same email (falls back to a plus-alias if the email is
 *      still held by Firebase)
 *   3. log in, register a certification if needed, land on its exams page
 *   4. persist the new session to `.auth/user.json` so the rest of the run keeps
 *      working with the new account
 *
 * Throws when the new account still reports a full quota, which means the old
 * account is still alive (deletion failed) — retrying would loop forever.
 */
export async function recoverFromDailyExamLimit(
  page: Page,
  options: { tracker?: FlowTimingTracker; reason?: string } = {},
): Promise<AccountRecoveryResult> {
  const { tracker, reason } = options;
  const startedAt = Date.now();

  const { email, password } = resolveCredentials();
  const previousCertId = readCertIdFromUrl(page);

  console.log('\n============ DAILY EXAM LIMIT RECOVERY ============');
  console.log(`  ℹ Trigger: ${reason ?? 'daily exam limit reached'}`);
  console.log(`  ℹ Plan: delete ${email} → re-register → log in → resume exam creation`);
  if (previousCertId) {
    console.log(`  ℹ Exam page before recovery: certification ${previousCertId}`);
  }

  await deleteAccountThroughUi(page);

  console.log(
    `  - Waiting ${ACCOUNT_PURGE_BUFFER_MS / 1000}s for the backend to finish purging the account...`,
  );
  await page.waitForTimeout(ACCOUNT_PURGE_BUFFER_MS);

  const displayName = deriveDisplayName(email);
  let activeEmail = email;
  let usedFallbackEmail = false;

  try {
    await registerAndLogIn(page, email, password, displayName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    usedFallbackEmail = true;
    activeEmail = withUniqueAlias(email);

    console.log(`  ⚠ Re-registering ${email} failed: ${message}`);
    console.log(`  ⚠ Falling back to a fresh alias account: ${activeEmail}`);

    // A previously deleted answer may still be cached; a new email sidesteps it.
    await registerAndLogIn(page, activeEmail, password, displayName);
  }

  // Persist which account the suite should use from now on. When the original
  // email could not be reused, the alias becomes the canonical test account —
  // otherwise the next run's login/signup would chase a half-deleted user.
  if (usedFallbackEmail) {
    writeActiveTestAccount({
      email: activeEmail,
      reason: 'recreated after the daily exam limit (original email was still registered in Firebase)',
    });
    console.log(`  ℹ Subsequent runs will sign in with ${activeEmail} (.auth/test-account.json)`);
  } else {
    clearActiveTestAccount();
  }

  // Persist the new session: `.auth/user.json` still points at the deleted
  // account, and every spec that opts into storageState would restore dead tokens.
  await page.context().storageState({ path: AUTH_STATE_PATH });
  writeAuthMeta({ savedAt: Date.now(), baseURL: new URL(page.url()).origin });
  console.log(`✓ Fresh session saved to ${AUTH_STATE_PATH}`);

  const certId = await openExamsPageForFreshAccount(page, { email: activeEmail, password });

  // Safety net: if deletion silently failed, performLogin would have succeeded
  // against the OLD account and the quota would still be exhausted. Retrying
  // creation in that state can only loop, so fail with the real cause instead.
  const quota = await readDailyExamQuota(page);
  if (quota && quota.created >= quota.max) {
    throw new Error(
      `Account recovery did not restore the exam quota (${quota.created}/${quota.max} exams created today). ` +
        'The previous account is probably still active — verify that DELETE /api/users/{id} ' +
        'actually purges the user, or bump PW_TEST_EMAIL to a different account.',
    );
  }

  if (quota) {
    console.log(`✓ Quota after recovery: ${quota.created}/${quota.max} exams created today`);
  } else {
    const canCreate = await waitForNewExamButtonEnabled(page);
    if (!canCreate) {
      throw new Error(
        'Account recovery left the "New Exam" button disabled — the new account does not have a ' +
          'usable quota (the previous account was probably never deleted).',
      );
    }
    console.log(
      '  ℹ Quota widget not rendered for the fresh account; verified via an enabled "New Exam" button',
    );
  }

  tracker?.recordDuration('Recover from daily exam limit (delete + re-register)', Date.now() - startedAt, {
    category: 'system',
    details: usedFallbackEmail
      ? `Recycled account via alias ${activeEmail}; exams page certification ${certId}`
      : `Recycled ${activeEmail}; exams page certification ${certId}`,
    startedAt,
  });

  console.log('============ RECOVERY COMPLETE — RESUMING ============\n');

  return { email: activeEmail, certId, usedFallbackEmail };
}
