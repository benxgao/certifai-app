import fs from 'fs';
import path from 'path';

/**
 * Shared definition of the Playwright auth-state artifact.
 *
 * Why a separate module: both `global-auth-setup.ts` (writes it) and the
 * authenticated spec files (consume it via `test.use({ storageState })`)
 * must agree on the exact path, and the freshness rules live in one place.
 */

const AUTH_DIR = path.join(process.cwd(), '.auth');

export const AUTH_STATE_PATH = path.join(AUTH_DIR, 'user.json');
export const AUTH_META_PATH = path.join(AUTH_DIR, 'user.meta.json');
export const ACTIVE_TEST_ACCOUNT_PATH = path.join(AUTH_DIR, 'test-account.json');

/**
 * Firebase ID tokens live ~1h. Keep a margin so a run never starts on an
 * already-expired session: 40min.
 */
export const AUTH_STATE_TTL_MS = 40 * 60 * 1000;

export type AuthMeta = {
  savedAt: number;
  baseURL: string;
};

export function readAuthMeta(): AuthMeta | null {
  try {
    return JSON.parse(fs.readFileSync(AUTH_META_PATH, 'utf-8')) as AuthMeta;
  } catch {
    return null;
  }
}

export function writeAuthMeta(meta: AuthMeta): void {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(AUTH_META_PATH, JSON.stringify(meta, null, 2));
}

/**
 * A stored session is reusable only when ALL of these hold:
 *  - state + meta files exist
 *  - it is younger than the TTL (token not expired)
 *  - it was captured against the same baseURL (localhost state is useless on UAT)
 */
export function isStoredAuthReusable(baseURL: string, now = Date.now()): boolean {
  if (!fs.existsSync(AUTH_STATE_PATH)) return false;

  const meta = readAuthMeta();
  if (!meta) return false;

  if (now - meta.savedAt > AUTH_STATE_TTL_MS) return false;
  if (meta.baseURL !== baseURL) return false;

  return true;
}

export function clearStoredAuth(): void {
  for (const file of [AUTH_STATE_PATH, AUTH_META_PATH]) {
    try {
      fs.rmSync(file, { force: true });
    } catch {
      // Best effort: a missing file is a valid "clean" state.
    }
  }
}

/**
 * The account the suite should sign in with.
 *
 * Normally this is `PW_TEST_EMAIL`. It only diverges when a run had to recycle
 * the account (see `helpers/account-recovery.ts`): deleting the account is
 * server-side and the Firebase Auth user can survive it, which makes the
 * original email unusable for signing up again — recovery then adopts a
 * plus-alias account and records it here so the NEXT run signs in with an
 * account that actually works.
 *
 * Reset with `npm run test:e2e:auth` (drops `.auth/`).
 */
export type ActiveTestAccount = {
  email: string;
  updatedAt: number;
  reason: string;
};

export function readActiveTestAccount(): ActiveTestAccount | null {
  try {
    return JSON.parse(fs.readFileSync(ACTIVE_TEST_ACCOUNT_PATH, 'utf-8')) as ActiveTestAccount;
  } catch {
    return null;
  }
}

export function writeActiveTestAccount(account: {
  email: string;
  reason: string;
}): void {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(
    ACTIVE_TEST_ACCOUNT_PATH,
    JSON.stringify({ ...account, updatedAt: Date.now() }, null, 2),
  );
}

export function clearActiveTestAccount(): void {
  try {
    fs.rmSync(ACTIVE_TEST_ACCOUNT_PATH, { force: true });
  } catch {
    // Best effort.
  }
}

/**
 * Email to authenticate with: the adopted recovery account when present,
 * otherwise `PW_TEST_EMAIL` / `PLAYWRIGHT_TEST_EMAIL`.
 */
export function resolveTestAccountEmail(): string | undefined {
  const adopted = readActiveTestAccount()?.email;
  if (adopted) {
    console.log(
      `[auth-state] Using recovered test account ${adopted} from .auth/test-account.json ` +
        '(reset with `npm run test:e2e:auth`).',
    );
    return adopted;
  }

  return process.env.PW_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_EMAIL;
}
