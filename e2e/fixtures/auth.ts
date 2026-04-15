import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Authentication fixture that logs in once and reuses the session across tests.
 * This significantly speeds up test execution by avoiding redundant Firebase auth calls.
 *
 * Usage:
 *   test('my test', async ({ authenticatedPage }) => {
 *     await authenticatedPage.goto('/dashboard');
 *     // Page is already authenticated
 *   });
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    const authFile = path.join(__dirname, '../../.auth/user.json');
    const fs = await import('fs').then((m) => m.promises);

    try {
      // Try to load existing auth state
      const authData = JSON.parse(await fs.readFile(authFile, 'utf-8'));
      await context.addCookies(authData.cookies || []);
      await context.addInitScript(
        (storage) => {
          if (storage) {
            Object.entries(storage).forEach(([key, value]) => {
              localStorage.setItem(key, value as string);
            });
          }
        },
        authData.localStorage
      );
      console.log('Auth state loaded from cache');
    } catch (e) {
      // If no saved auth state, perform login
      console.log('No existing auth state found. Logging in...');
      try {
        await performLogin(page);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }

      // Save auth state for future tests
      try {
        const cookies = await context.cookies();
        const localStorage = await page.evaluate(() => {
          const items: Record<string, string> = {};
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key) {
              items[key] = window.localStorage.getItem(key) || '';
            }
          }
          return items;
        });

        const authData = { cookies, localStorage };
        const dir = path.dirname(authFile);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(authFile, JSON.stringify(authData, null, 2));
        console.log('Auth state saved to:', authFile);
      } catch (saveError) {
        console.warn('Failed to save auth state:', saveError);
      }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    // Cleanup: close page to prevent hanging
    await page.close().catch(() => {
      // Page may already be closed
    });
  },
});

/**
 * Perform Firebase authentication using email/password credentials
 * Retrieved from environment variables: PW_TEST_EMAIL and PW_TEST_PASSWORD
 */
async function performLogin(page: Page): Promise<void> {
  // Load environment variables with fallback
  const email = process.env.PW_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_EMAIL;
  const password = process.env.PW_TEST_PASSWORD || process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!email || !password) {
    console.error('Environment variables available:');
    console.error('PW_TEST_EMAIL:', process.env.PW_TEST_EMAIL ? '✓ SET' : '✗ NOT SET');
    console.error('PW_TEST_PASSWORD:', process.env.PW_TEST_PASSWORD ? '✓ SET' : '✗ NOT SET');
    console.error('\nAvailable env vars starting with PW_ or PLAYWRIGHT_:');
    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith('PW_') || key.startsWith('PLAYWRIGHT_')) {
        console.error(`  ${key}: ${value ? '✓ SET' : '✗ NOT SET'}`);
      }
    });

    throw new Error(
      `Missing test credentials.\n\nPlease set environment variables:\n` +
      `  PW_TEST_EMAIL=your-test-email@example.com\n` +
      `  PW_TEST_PASSWORD=your-test-password\n\n` +
      `Steps:\n` +
      `  1. Copy .env.local.example to .env.local\n` +
      `  2. Edit .env.local with your Firebase test account credentials\n` +
      `  3. Run: npm install (to install dotenv)\n` +
      `  4. Try the tests again\n\n` +
      `Or pass credentials as environment variables:\n` +
      `  PW_TEST_EMAIL=test@example.com PW_TEST_PASSWORD=password npm run test:e2e`
    );
  }

  // Navigate to signin page
  await page.goto('/signin', { waitUntil: 'domcontentloaded' });

  // Wait for form fields to be visible instead of waiting for all network requests
  // This avoids hanging on background connections like Console Ninja
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');

  await emailInput.waitFor({ timeout: 10000 });
  await passwordInput.waitFor({ timeout: 10000 });

  // Fill in email and password using type for better React event triggering
  await emailInput.type(email, { delay: 50 });
  await passwordInput.type(password, { delay: 50 });

  // Wait a bit for form to update
  await page.waitForTimeout(1000);

  // Get submit button reference
  const submitButton = page.locator('button[type="submit"]');

  // Try to click normally first
  try {
    await submitButton.click({ timeout: 3000 });
  } catch (e) {
    // If button is disabled, try force clicking via JavaScript
    console.log('Button appears disabled, attempting force click...');
    await submitButton.click({ force: true, timeout: 3000 });
  }

  // Wait for successful authentication - should redirect to /main
  await page.waitForURL(
    (url) => {
      return url.pathname === '/main';
    },
    { timeout: 20000 }
  );

  // Wait for page to be interactive with a shorter timeout
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  console.log('Successfully authenticated. Current URL:', page.url());
}

/**
 * Export expect for use in tests
 */
export { expect };
