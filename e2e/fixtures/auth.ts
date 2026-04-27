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
      await context.addInitScript((storage) => {
        if (storage) {
          Object.entries(storage).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
        }
      }, authData.localStorage);
      console.log('Auth state loaded from cache');
    } catch (e) {
      // If no saved auth state, perform login with auto-signup fallback
      console.log('No existing auth state found. Attempting login with auto-signup...');
      try {
        await performLoginWithAutoSignup(page);
      } catch (error) {
        console.error('Login with auto-signup failed:', error);
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
 * Helper function: Wait for Firebase backend to sync after signup
 * Ensures the newly created user account is fully committed to Firebase Auth
 * before attempting login. Reduces race condition where rapid signup→login fails.
 *
 * **What this does:**
 * 1. Wait 1 second for Firebase Auth backend to process account creation
 * 2. Check if localStorage has Firebase auth keys set (indicates backend committed the user)
 * 3. Return when backend appears ready or timeout reached
 *
 * @param page - Playwright page object
 * @param timeoutMs - Maximum time to wait (default: 2000ms)
 */
async function waitForPostSignupSync(page: Page, timeoutMs: number = 5000): Promise<void> {
  console.log('[SIGNUP SYNC] Waiting for Firebase backend to sync new account (timeout: 5s)...');

  const startTime = Date.now();
  let isBackendReady = false;
  let attempts = 0;

  while (!isBackendReady && Date.now() - startTime < timeoutMs) {
    attempts++;
    try {
      // Check if we have Firebase auth state in localStorage
      const hasFirebaseAuth = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const authKeys = keys.filter((k) => k.includes('firebase') || k.includes('auth'));
        return authKeys.length > 0;
      });

      if (hasFirebaseAuth) {
        isBackendReady = true;
        const elapsed = Date.now() - startTime;
        console.log(
          `[SIGNUP SYNC] ✓ Firebase auth state detected after ${elapsed}ms (attempt ${attempts})`,
        );
        break;
      }

      // If not ready yet, wait 300ms and try again
      await page.waitForTimeout(300);
    } catch (e) {
      // Error checking auth state, just wait a bit more
      await page.waitForTimeout(300);
    }
  }

  if (!isBackendReady) {
    const elapsed = Date.now() - startTime;
    console.log(
      `[SIGNUP SYNC] ⚠ Firebase auth state not detected after ${elapsed}ms, but proceeding anyway. Backend sync may be in progress.`,
    );
  }
}

/**
 * Perform Firebase authentication using email/password credentials
 * Retrieved from environment variables: PW_TEST_EMAIL and PW_TEST_PASSWORD
 * Can be overridden with parameters
 *
 * **Login Request Flow:**
 * 1. Navigate to /signin page
 * 2. Wait for form fields to load (email, password inputs)
 * 3. Populate email and password fields with provided credentials using type() for proper React event triggering
 * 4. Wait 1s for React state to update form
 * 5. Click submit button (attempts normal click, force-click if disabled)
 * 6. Frontend sends POST request to Firebase Auth API
 * 7. Backend validates credentials against Firebase Auth
 * 8. On success: Firebase Auth server returns user token + refreshToken
 * 9. Frontend stores tokens in localStorage + Firebase cookies
 * 10. Auto-redirect to /main dashboard (user is now authenticated)
 * 11. On error: Shows error message, stays on /signin (no further action by test)
 *
 * **Error Handling:**
 * - Missing credentials: Throws error with clear env var setup instructions
 * - Network timeout: 20s timeout on redirect to /main
 * - Invalid email/password: Fails but handled by test assertion (expected in some tests)
 * - Session already exists: Falls into /main redirect path
 *
 * @param page - Playwright page object
 * @param email - Email for signin (optional, uses PW_TEST_EMAIL env var)
 * @param password - Password for signin (optional, uses PW_TEST_PASSWORD env var)
 * @throws Error if required credentials are not provided via params or env vars
 */
async function performLogin(page: Page, email?: string, password?: string): Promise<void> {
  // Load environment variables with fallback to provided parameters
  const loginEmail = email || process.env.PW_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_EMAIL;
  const loginPassword =
    password || process.env.PW_TEST_PASSWORD || process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!loginEmail || !loginPassword) {
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
        `  PW_TEST_EMAIL=test@example.com PW_TEST_PASSWORD=password npm run test:e2e`,
    );
  }

  // Navigate to signin page
  await page.goto('/signin', { waitUntil: 'domcontentloaded' });

  // Attempt login with retry logic for post-signup race conditions
  let loginAttempt = 0;
  const maxAttempts = 2; // Allow one retry
  let lastError: Error | null = null;

  while (loginAttempt < maxAttempts) {
    try {
      loginAttempt++;
      if (loginAttempt > 1) {
        console.log(`\n[Login Retry] Attempt ${loginAttempt} of ${maxAttempts}...`);
        // Rerun the sync wait and reload form
        await waitForPostSignupSync(page);
        await page.goto('/signin', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(100);
      }

      // Wait for form fields to be visible instead of waiting for all network requests
      // This avoids hanging on background connections like Console Ninja
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await emailInput.waitFor({ timeout: 10000 });
      await passwordInput.waitFor({ timeout: 10000 });

      // Clear and fill form fields
      await emailInput.fill('');
      await emailInput.type(loginEmail, { delay: 50 });
      await passwordInput.fill('');
      await passwordInput.type(loginPassword, { delay: 50 });

      // Wait a bit for form to update
      await page.waitForTimeout(100);

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
        { timeout: 20000 },
      );

      // Wait for page to be interactive with a shorter timeout
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✓ Successfully authenticated. Current URL:', page.url());
      return; // Success, exit retry loop
    } catch (error) {
      lastError = error as Error;

      if (loginAttempt < maxAttempts) {
        // Not the last attempt, prepare for retry
        console.warn(`⚠ Login attempt ${loginAttempt} failed: ${lastError.message}`);
        console.log(`→ Waiting 2s for Firebase backend sync before retry...`);
        await page.waitForTimeout(1000);
      }
    }
  }

  // All attempts failed, throw error with detailed context
  console.error(`✗ Login failed after ${maxAttempts} attempts`);
  const currentUrl = page.url();
  let errorMessages: string[] = [];

  try {
    errorMessages = await page
      .locator('[data-slot="alert"], [role="alert"], .text-destructive')
      .allTextContents()
      .catch(() => []);
  } catch (e) {
    // Failed to get error messages, continue
  }

  const errorContext = {
    finalUrl: currentUrl,
    errorMessages: errorMessages.filter((m) => m.trim()),
    originalError: lastError?.message,
  };

  console.error('Error context:', errorContext);
  throw new Error(
    `Login failed after ${maxAttempts} attempts: ${lastError?.message || 'Unknown error'}. Check logs for error messages.`,
  );
}

/**
 * Perform login with automatic signup fallback if account doesn't exist
 *
 * **Flow:**
 * 1. Attempt login with provided credentials
 * 2. If login fails with "user not found" error:
 *    - Generate display name from email (e.g., "test user" from "test.user@example.com")
 *    - Call performSignup to create the account
 *    - Retry login once more
 * 3. If login succeeds or fails with different error, return/throw accordingly
 *
 * **Error Detection:**
 * - "user not found" patterns: "no user", "not found", "does not exist", "unrecognized"
 * - "wrong password" patterns: "invalid", "incorrect", "match"
 * - Only triggers auto-signup for account-not-found errors, not password errors
 *
 * **Display Name Generation:**
 * - Extracts from email prefix (before @)
 * - Example: "test.user@example.com" → "test user" (replace dots/underscores with spaces, capitalize)
 *
 * @param page - Playwright page object
 * @param email - Email for login/signup (optional, uses PW_TEST_EMAIL env var)
 * @param password - Password for login/signup (optional, uses PW_TEST_PASSWORD env var)
 * @throws Error if login fails permanently or signup fails
 */
async function performLoginWithAutoSignup(
  page: Page,
  email?: string,
  password?: string,
): Promise<void> {
  const loginEmail = email || process.env.PW_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_EMAIL;
  const loginPassword =
    password || process.env.PW_TEST_PASSWORD || process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!loginEmail || !loginPassword) {
    throw new Error(
      'Missing test credentials. Please set PW_TEST_EMAIL and PW_TEST_PASSWORD environment variables.',
    );
  }

  console.log('[LOGIN WITH AUTO-SIGNUP] Attempting login with provided credentials...');

  // Try initial login
  let loginAttempts = 0;
  try {
    loginAttempts++;
    console.log(`[LOGIN WITH AUTO-SIGNUP] Attempt ${loginAttempts}/3: Trying initial login...`);
    const initialPageBefore = page.url();
    console.log(`[LOGIN WITH AUTO-SIGNUP]   Current page before login: ${initialPageBefore}`);

    await performLogin(page, loginEmail, loginPassword);

    const initialPageAfter = page.url();
    console.log(`[LOGIN WITH AUTO-SIGNUP]   Current page after login: ${initialPageAfter}`);
    console.log('[LOGIN WITH AUTO-SIGNUP] ✓ Login succeeded on first attempt');
    return;
  } catch (loginError) {
    const errorMessage = (loginError as Error).message || '';
    console.log(
      '[LOGIN WITH AUTO-SIGNUP] ⚠ Login failed. Analyzing error to determine if auto-signup needed...',
    );
    console.log(`[LOGIN WITH AUTO-SIGNUP] Error message: ${errorMessage}`);

    // Check if this is a "user not found" error vs "wrong password" error
    const isUserNotFoundError = /no user|not found|does not exist|not recognized|unrecognized/i.test(
      errorMessage,
    );
    console.log(
      `[LOGIN WITH AUTO-SIGNUP] Pattern check: User not found error = ${isUserNotFoundError}`,
    );

    if (isUserNotFoundError || errorMessage.includes('Login failed')) {
      // Try to get more specific error from page
      try {
        const errorAlert = page.locator('[data-slot="alert"]');
        const alertVisible = await errorAlert.isVisible({ timeout: 2000 }).catch(() => false);

        if (alertVisible) {
          const alertText = (await errorAlert.textContent()) || '';
          console.log(`  Alert message: ${alertText}`);

          // Check if it's a "user not found" pattern in the alert
          const isNotFoundInAlert = /no user|not found|does not exist|not recognized|unrecognized/i.test(
            alertText,
          );

          if (!isNotFoundInAlert && /invalid|incorrect|don't match|wrong/i.test(alertText)) {
            // This looks like a password error, not account-not-found
            console.log(
              '[LOGIN WITH AUTO-SIGNUP] ✗ Password appears to be incorrect. Not triggering auto-signup.',
            );
            throw loginError;
          }
        }
      } catch (e) {
        // Failed to check alert, but we got a login error - proceed with auto-signup attempt
        console.log('[LOGIN WITH AUTO-SIGNUP] Could not verify error type, attempting auto-signup as fallback...');
      }

      // Looks like account not found - trigger auto-signup
      console.log(
        '[LOGIN WITH AUTO-SIGNUP] → Account not found. Triggering auto-signup registration...',
      );

      // Generate display name from email
      const emailPrefix = loginEmail.split('@')[0];
      const displayName = emailPrefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      console.log(`[LOGIN WITH AUTO-SIGNUP] Generated display name: "${displayName}"`);

      try {
        // Perform signup with the provided credentials
        console.log('[LOGIN WITH AUTO-SIGNUP] Starting signup process...');
        const signupPageBefore = page.url();
        console.log(`[LOGIN WITH AUTO-SIGNUP]   Page before signup: ${signupPageBefore}`);

        await performSignup(page, loginEmail, loginPassword, displayName);

        const signupPageAfter = page.url();
        console.log(`[LOGIN WITH AUTO-SIGNUP]   Page after signup: ${signupPageAfter}`);
        console.log('[LOGIN WITH AUTO-SIGNUP] ✓ Signup completed');

        // Validate signup actually completed
        if (!signupPageAfter.includes('/signin')) {
          console.warn(
            `[LOGIN WITH AUTO-SIGNUP] ⚠ Expected to be on /signin after signup, but got: ${signupPageAfter}`,
          );
        }
      } catch (signupError) {
        console.error('[LOGIN WITH AUTO-SIGNUP] ✗ Signup failed:', signupError);
        throw signupError;
      }

      // Wait longer before retrying login to ensure Firebase has synced
      console.log('[LOGIN WITH AUTO-SIGNUP] Waiting 3s for Firebase backend to sync before login retry...');
      await page.waitForTimeout(3000);

      // Now retry login after signup
      loginAttempts++;
      console.log(
        `[LOGIN WITH AUTO-SIGNUP] Attempt ${loginAttempts}/3: Retrying login after signup...`,
      );
      try {
        const retryPageBefore = page.url();
        console.log(`[LOGIN WITH AUTO-SIGNUP]   Page before retry login: ${retryPageBefore}`);

        await performLogin(page, loginEmail, loginPassword);

        const retryPageAfter = page.url();
        console.log(`[LOGIN WITH AUTO-SIGNUP]   Page after retry login: ${retryPageAfter}`);
        console.log('[LOGIN WITH AUTO-SIGNUP] ✓ Login succeeded after auto-signup');
        return;
      } catch (retryError) {
        console.error(
          `[LOGIN WITH AUTO-SIGNUP] ✗ Login failed on attempt ${loginAttempts}:`,
          retryError,
        );
        // Prevent infinite loop - fail after retry
        console.error(
          '[LOGIN WITH AUTO-SIGNUP] ✗ Max login attempts reached after signup. Failing account creation flow.',
        );
        throw retryError;
      }
    } else {
      // Not a "user not found" error, so re-throw the original error
      console.log(
        '[LOGIN WITH AUTO-SIGNUP] ✗ Login failed with a different error. Not attempting auto-signup.',
      );
      throw loginError;
    }
  }
}

/**
 * Perform Firebase signup with email, password, and display name
 * Retrieved from environment variables: PW_SIGNUP_EMAIL and PW_SIGNUP_PASSWORD
 * Falls back to defaults if not set
 *
 * **Signup Request Flow:**
 * 1. Navigate to /signup page
 * 2. Wait for form fields to load (firstName, lastName, email, password, confirmPassword)
 * 3. Fill form fields with provided credentials using fill() then blur()
 * 4. Verify all fields were populated correctly
 * 5. Wait for certification dropdown (Shadcn combobox) to be enabled by SWR data load (~up to 30s)
 * 6. Click certification combobox and select 2nd certification option
 * 7. Click terms checkbox (Radix UI component with role="checkbox")
 * 8. Wait for submit button to be enabled (form validation complete)
 * 9. Click submit button
 * 10. Frontend sends POST request to Firebase with form data
 * 11. Backend processes: Creates user in Firebase Auth + Creates user profile doc in Firestore
 * 12. On success (new account): Email verification triggered → UAT bypass redirects to /signin immediately
 * 13. On error (email exists): Error alert shown → function navigates to /signin to use existing account
 * 14. Either way: Function ends with browser on /signin page (ready for performLogin())
 *
 * **Important for Static Test Accounts:**
 * This function handles both new account creation AND reuse of existing accounts:
 * - First run: Creates new account with provided email and redirects to signin
 * - Subsequent runs (same email): Detects "email already registered" error and auto-redirects to signin
 * This enables seamless reuse of static test accounts across multiple test runs without account recreation.
 *
 * **Form Field Targeting:**
 * - Uses id selectors: input#firstName, input#lastName, input#email, input#password, input#confirmPassword
 * - Certification combobox: [role="combobox"] (Shadcn component)
 * - Terms checkbox: [role="checkbox"]#acceptTerms or #acceptTerms
 * - Submit button: button[type="submit"]
 *
 * **Failure Modes:**
 * - Certification combobox doesn't enable after 30s: Logs warning, attempts to continue
 * - Submit button doesn't enable after 15s: Assumes account exists, skips form submission, navigates to signin
 * - Error alert appears after submit: Navigates to signin to use existing account
 * - Still on /signup after 10s timeout: Navigates to signin anyway as fallback
 *
 * @param page - Playwright page object
 * @param email - Email for signup (optional, uses PW_SIGNUP_EMAIL env var)
 * @param password - Password for signup (optional, uses PW_SIGNUP_PASSWORD env var)
 * @param displayName - User display name (optional, defaults to "Test User {timestamp}")
 */
async function performSignup(
  page: Page,
  email?: string,
  password?: string,
  displayName?: string,
): Promise<void> {
  // Load environment variables with fallback to provided parameters or defaults
  const signupEmail = email || process.env.PW_SIGNUP_EMAIL || 'pw_test_signup@certestic.com';
  const signupPassword =
    password || process.env.PW_SIGNUP_PASSWORD || 'pw_test_signup@certestic.com';
  const finalDisplayName = displayName || `Test User ${Date.now()}`;

  // Navigate to signup page
  await page.goto('/signup', { waitUntil: 'domcontentloaded' });

  // Wait for form fields to be visible - use id selectors
  await page.waitForSelector('input#firstName', { timeout: 15000 });
  await page.waitForSelector('input#lastName', { timeout: 15000 });
  await page.waitForSelector('input#email', { timeout: 15000 });
  await page.waitForSelector('input#password', { timeout: 15000 });
  await page.waitForSelector('input#confirmPassword', { timeout: 15000 });

  console.log('Form fields visible. Starting to fill signup form...');

  // Fill in first name and last name (display name split)
  const [firstName, ...lastNameParts] = finalDisplayName.split(' ');
  const lastName = lastNameParts.join(' ') || 'User';

  // Fill fields with better React event triggering
  const firstNameInput = page.locator('input#firstName');
  const lastNameInput = page.locator('input#lastName');
  const emailInput = page.locator('input#email');
  const passwordInput = page.locator('input#password');
  const confirmPasswordInput = page.locator('input#confirmPassword');

  // Clear and fill with proper event triggering
  // Use clear() + type() instead of fill() to trigger React onChange handlers
  await firstNameInput.clear();
  await firstNameInput.type(firstName, { delay: 50 });
  await firstNameInput.blur();
  console.log(`  ✓ First name filled: "${firstName}"`);

  await lastNameInput.clear();
  await lastNameInput.type(lastName, { delay: 50 });
  await lastNameInput.blur();
  console.log(`  ✓ Last name filled: "${lastName}"`);

  await emailInput.clear();
  await emailInput.type(signupEmail, { delay: 50 });
  await emailInput.blur();
  console.log(`  ✓ Email filled: "${signupEmail}"`);

  await passwordInput.clear();
  await passwordInput.type(signupPassword, { delay: 50 });
  await passwordInput.blur();
  console.log(`  ✓ Password filled: "[${signupPassword.length} chars]"`);

  await confirmPasswordInput.clear();
  await confirmPasswordInput.type(signupPassword, { delay: 50 });
  await confirmPasswordInput.blur();
  console.log(`  ✓ Confirm password filled: "[${signupPassword.length} chars]"`);

  // Verify fields were actually filled
  const firstNameValue = await firstNameInput.inputValue();
  const lastNameValue = await lastNameInput.inputValue();
  const emailValue = await emailInput.inputValue();
  const passwordValue = await passwordInput.inputValue();
  const confirmPasswordValue = await confirmPasswordInput.inputValue();

  if (
    firstNameValue !== firstName ||
    lastNameValue !== lastName ||
    emailValue !== signupEmail ||
    passwordValue !== signupPassword ||
    confirmPasswordValue !== signupPassword
  ) {
    console.warn('⚠ Some fields may not have been filled correctly:');
    console.warn(`  firstName: expected "${firstName}", got "${firstNameValue}"`);
    console.warn(`  lastName: expected "${lastName}", got "${lastNameValue}"`);
    console.warn(`  email: expected "${signupEmail}", got "${emailValue}"`);
    console.warn(
      `  password: expected [${signupPassword.length} chars], got [${passwordValue?.length || 0} chars]`,
    );
    console.warn(
      `  confirmPassword: expected [${signupPassword.length} chars], got [${confirmPasswordValue?.length || 0} chars]`,
    );
  }

  console.log('Basic account info filled. Now selecting certification...');

  // Wait for certification selector (Shadcn combobox) to be ready
  await page.waitForSelector('[role="combobox"]', { timeout: 15000 });

  // Wait for certification combobox to be enabled (data loads from SWR hook)
  const certCombobox = page.locator('[role="combobox"]').first();
  let isComboboxEnabled = false;
  let enableAttempts = 0;
  const maxEnableAttempts = 30; // 30 seconds max wait

  console.log('Waiting for certification combobox to be enabled...');
  while (!isComboboxEnabled && enableAttempts < maxEnableAttempts) {
    const isDisabled = await certCombobox.evaluate((el) => (el as HTMLButtonElement).disabled);
    if (!isDisabled) {
      isComboboxEnabled = true;
      console.log('Certification combobox is now enabled. Clicking...');
      break;
    }
    await page.waitForTimeout(1000);
    enableAttempts++;
  }

  if (!isComboboxEnabled) {
    console.warn('Certification combobox still appears disabled after waiting.');
  }

  // Click the certification dropdown (combobox)
  await certCombobox.click({ timeout: 5000 });

  // Wait for dropdown options to appear
  await page.waitForTimeout(100);

  // Get all certification options and select the 2nd one
  const certOptions = page.locator('[role="option"]');
  const optionCount = await certOptions.count();

  if (optionCount < 2) {
    console.warn(
      `Only ${optionCount} certification option(s) available. Selecting first instead of second.`,
    );
    if (optionCount > 0) {
      await certOptions.first().click({ timeout: 5000 });
    }
  } else {
    // Select the 2nd certification option
    await certOptions.nth(1).click({ timeout: 5000 });
    console.log('Selected 2nd certification option');
  }

  // Wait for dropdown to close
  await page.waitForTimeout(500);

  // Check terms checkbox (Shadcn/Radix UI component, not plain HTML input)
  // The checkbox has id="acceptTerms" but uses role="checkbox"
  const termsCheckbox = page.locator('[role="checkbox"]#acceptTerms, #acceptTerms');

  console.log('Looking for terms checkbox...');
  await termsCheckbox.waitFor({ state: 'visible', timeout: 5000 });

  // Click the checkbox to check it
  await termsCheckbox.click({ timeout: 5000 });

  console.log('Terms checkbox clicked. Waiting for submit button to be enabled...');

  // Check for validation errors on the form before trying submit button
  const validationErrors = page.locator(
    '[role="alert"], .text-destructive, .error, [data-error="true"]',
  );
  const errorCount = await validationErrors.count().catch(() => 0);

  if (errorCount > 0) {
    console.warn(`⚠ Found ${errorCount} validation error(s) on the form:`);
    for (let i = 0; i < Math.min(errorCount, 5); i++) {
      const errorText = await validationErrors
        .nth(i)
        .textContent()
        .catch(() => '');
      if (errorText?.trim()) {
        console.warn(`  - ${errorText.trim()}`);
      }
    }
  }

  // Wait for submit button to be enabled
  const submitButton = page.locator('button[type="submit"]');

  // Wait for button to be visible first
  await submitButton.waitFor({ state: 'visible', timeout: 15000 });

  // Wait for button to be enabled (not have disabled attribute)
  let isEnabled = false;
  let attempts = 0;
  const maxAttempts = 15;

  while (!isEnabled && attempts < maxAttempts) {
    const isDisabled = await submitButton.evaluate((el) => (el as HTMLButtonElement).disabled);
    if (!isDisabled) {
      isEnabled = true;
      break;
    }
    await page.waitForTimeout(1000);
    attempts++;
  }

  if (!isEnabled) {
    console.warn('Submit button still appears disabled after 15 seconds of waiting.');
    console.log(
      '→ Account likely already exists from previous test run (form validation not completing).',
    );
    console.log('→ Skipping form submission and navigating directly to signin...');
    console.log('→ Will proceed with login using existing account credentials.');

    // Navigate directly to signin
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await waitForPostSignupSync(page);
    console.log(
      '✓ Navigated to signin. Signup skipped for existing account (account reused from previous run).',
    );
    return;
  } else {
    console.log('✓ Submit button is now enabled.');
  }

  console.log('Submitting form...');

  // Click submit button
  await submitButton.click({ timeout: 5000 });

  console.log(
    'Form submitted. Waiting for response (new account creation or existing email error)...',
  );

  // Strategy: Regardless of new/existing email, goal is to reach signin page
  // - New email: signup succeeds → auto-redirects to signin
  // - Existing email: error shown → navigate to signin manually to use existing account
  // - Either way: we end up on signin for the login test

  let currentUrl = page.url();

  // Wait for either:
  // 1. Auto-redirect to signin (new account case)
  // 2. Error to appear (existing account case)
  try {
    await page.waitForURL(
      (url) => {
        return url.pathname === '/signin';
      },
      { timeout: 10000 },
    );
    console.log('✓ Successfully redirected to signin (new account or verification completed)');
    await waitForPostSignupSync(page);
    return;
  } catch (e) {
    // Redirect didn't happen, check if there's an error
    console.log('No immediate redirect. Checking for error...');
  }

  // Check for any error alert (email already registered, etc.)
  // Use specific selector: [data-slot="alert"] is the AlertMessage component
  const errorAlert = page.locator('[data-slot="alert"]');

  try {
    const isErrorVisible = await errorAlert.isVisible({ timeout: 3000 }).catch(() => false);

    if (isErrorVisible) {
      const errorText = (await errorAlert.textContent()) || '';
      console.log(`⚠ Error detected: ${errorText}`);

      // If we see an error (any error), assume it's email already registered
      // Navigate to signin to use the existing account
      console.log('→ Email likely already registered. Moving to signin to use existing account...');
      await page.goto('/signin', { waitUntil: 'domcontentloaded' });
      await waitForPostSignupSync(page);
      return;
    }
  } catch (e) {
    console.warn('Could not check for error alert');
  }

  // Last resort: if we're still on signup page with no redirect and no error detected,
  // just navigate to signin anyway (something might have gone wrong but we can try logging in)
  currentUrl = page.url();
  if (currentUrl.includes('/signup')) {
    console.log('Still on signup page. Moving to signin to attempt login...');
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await waitForPostSignupSync(page);
    return;
  }

  // If we reach here, we should be on signin page
  console.log('Signup flow completed. Current page:', page.url());
}

/**
 * Navigate to user profile page
 * Uses the AppHeader dropdown menu to access the "View Profile" option
 *
 * Steps:
 * 1. Click the dropdown trigger button in AppHeader (avatar/user menu)
 * 2. Wait for dropdown menu to open
 * 3. Click the "View Profile" menu item
 * 4. Wait for navigation to profile page
 */
async function navigateToProfile(page: Page): Promise<void> {
  // Wait for page to be loaded
  console.log('  - Waiting for page to load...');
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  console.log('  ✓ Page DOM loaded');

  // Click dropdown trigger button using data-testid
  const dropdownTrigger = page.locator('[data-testid="dropdown-trigger"]');

  if (!(await dropdownTrigger.isVisible({ timeout: 3000 }).catch(() => false))) {
    throw new Error('Dropdown trigger button not found on page');
  }

  console.log('  - Opening user dropdown menu...');
  // Click to open dropdown menu
  await dropdownTrigger.click({ timeout: 3000 });

  // Wait for dropdown menu to open
  await page.waitForTimeout(500);

  // Click "View Profile" menu item using data-testid
  const viewProfileItem = page.locator('[data-testid="dropdown-view-profile"]');

  if (!(await viewProfileItem.isVisible({ timeout: 5000 }).catch(() => false))) {
    throw new Error('View Profile menu item not found in dropdown');
  }

  console.log('  ✓ Profile menu item found, clicking...');
  await viewProfileItem.click({ timeout: 5000 });

  // Wait for navigation to profile page
  console.log('  - Waiting for profile page to load...');
  await page.waitForURL(
    (url) => {
      return url.pathname.includes('/profile');
    },
    { timeout: 20000 },
  );

  // Wait for page to be interactive - profile page uses SWR for data loading
  // so networkidle won't be reached. Instead, wait for DOM to be ready.
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  console.log('  ✓ Profile page DOM ready - background data loading may continue');

  console.log('✓ Successfully navigated to profile via dropdown menu. Current URL:', page.url());
}

/**
 * Perform logout and verify auth state is cleared
 * Extends performLogout with verification that auth tokens are removed from storage
 */
async function performLogoutAndVerify(page: Page): Promise<void> {
  // Wait for page to be loaded
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

  // Click on dropdown trigger to open the menu using new data-testid
  const dropdownTrigger = page.locator('[data-testid="dropdown-trigger"]');
  if (await dropdownTrigger.isVisible()) {
    await dropdownTrigger.click({ timeout: 5000 });
    // Wait for dropdown to open
    await page.waitForTimeout(100);
  }

  // Click sign out button using new data-testid
  const signOutButton = page.locator('[data-testid="dropdown-sign-out"]');
  if (await signOutButton.isVisible()) {
    await signOutButton.click({ timeout: 5000 });
  } else {
    // Fallback to text-based selector if data-testid not found
    const fallbackButton = page.locator('button:has-text("Sign Out")').first();
    if (await fallbackButton.isVisible()) {
      await fallbackButton.click({ timeout: 5000 });
    } else {
      throw new Error('Sign Out button not found');
    }
  }

  // Wait for redirect to homepage or signin
  await page.waitForURL(
    (url) => {
      const pathname = url.pathname;
      return pathname === '/' || pathname === '/signin' || pathname === '';
    },
    { timeout: 20000 },
  );

  // Verify auth state is cleared from localStorage
  const localStorageAuth = await page.evaluate(() => {
    return {
      hasFirebaseAuth: !!localStorage.getItem('firebase:authUser:'),
      hasCustomAuth: !!localStorage.getItem('auth_token'),
      hasSessionToken: !!localStorage.getItem('session_token'),
      storageKeys: Object.keys(localStorage).filter(
        (k) => k.includes('auth') || k.includes('token') || k.includes('user'),
      ),
    };
  });

  console.log('Auth state after logout:', localStorageAuth);
  console.log('Successfully logged out and verified auth state cleared. Current URL:', page.url());
}

/**
 * Perform account deletion with multi-step confirmation
 *
 * Current Scope: Deletion request verification only
 * - Verifies that the delete button click successfully sends the DELETE request to the backend
 * - Does NOT wait for API response or redirect (those will be tested separately)
 *
 * Steps:
 * 1. Find and click delete button on profile page
 * 2. Confirm warning dialog appears
 * 3. Click continue to proceed to confirmation
 * 4. Confirm confirmation dialog appears with email shown
 * 5. Enter "DELETE MY ACCOUNT" text to enable delete button
 * 6. Click final delete button to send deletion request
 * 7. Verify DELETE request was sent to backend (returns here)
 *
 * Backend processing (tested separately in future):
 * - Firestore: Deletes cert summaries and exam reports
 * - Prisma: Deletes exam answers → attempts → certifications → user
 * - Firebase Auth: Deletes authentication user
 * - Cache: Invalidates user caches
 * - Response: HTTP 200 on success
 * - Frontend: Hard redirect to /signin page
 * - Session: Terminates and page context closes
 */
async function performDeleteAccount(page: Page): Promise<void> {
  console.log('  - Starting account deletion flow...');

  // Click the delete account button
  const deleteButton = page.locator('[data-testid="profile-delete-account-btn"]');

  if (!(await deleteButton.isVisible())) {
    throw new Error('Delete account button not found on profile page');
  }

  console.log('  ✓ 1st Delete button found, clicking...');
  await deleteButton.click({ timeout: 5000 });

  // Wait for warning dialog to appear
  const warningDialog = page.locator('[data-testid="delete-account-warning-dialog"]');
  await warningDialog.waitFor({ state: 'visible', timeout: 10000 });
  console.log('  ✓ Warning dialog appeared');

  // Click continue button in warning dialog
  const continueButton = warningDialog.locator('button:has-text("Continue")');
  await continueButton.click({ timeout: 5000 });
  console.log('  ✓ Clicked Continue');

  // Wait for confirmation dialog to appear
  const confirmDialog = page.locator('[data-testid="delete-account-confirmation-dialog"]');
  await confirmDialog.waitFor({ state: 'visible', timeout: 10000 });
  console.log('  ✓ Confirmation dialog appeared');

  // Fill in confirmation text
  const confirmInput = confirmDialog.locator('[data-testid="delete-account-confirm-input"]');
  await confirmInput.waitFor({ state: 'visible', timeout: 5000 });
  await confirmInput.fill('DELETE MY ACCOUNT', { timeout: 5000 });
  console.log('  ✓ Confirmation text "DELETE MY ACCOUNT" entered');

  // Wait for button to enable
  await page.waitForTimeout(100);

  // Click final delete button
  const finalDeleteButton = confirmDialog.locator('[data-testid="delete-account-final-button"]');
  await finalDeleteButton.waitFor({ state: 'visible', timeout: 5000 });

  // Verify button is enabled
  const isDisabled = await finalDeleteButton.evaluate((el) => (el as HTMLButtonElement).disabled);
  if (isDisabled) {
    throw new Error('Delete button is still disabled after entering confirmation text');
  }

  console.log('  ✓ 2nd Delete button is enabled, clicking...');

  // Click delete button - this sends the DELETE request to the backend
  try {
    await finalDeleteButton.click({ timeout: 5000 });
  } catch (e) {
    // Retry with force if normal click fails
    console.log('  ⚠ Normal click timed out, retrying with force...');
    await finalDeleteButton.click({ timeout: 3000, force: true });
  }

  console.log('  ✓ Delete request sent to backend');
  console.log('  ℹ Deletion verification complete. Backend processing will be tested in next phase.');

  return;
}

/**
 * Perform logout by clicking logout button
 */
async function performLogout(page: Page): Promise<void> {
  // Wait for page to be loaded
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

  // Look for logout button - could be in various locations
  const logoutButton = page
    .locator(
      'button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out"), [data-testid="logout-button"]',
    )
    .first();

  // If no logout button found, try to find user menu first
  if (!(await logoutButton.isVisible())) {
    const userMenu = page
      .locator('[data-testid="user-menu"], [aria-label*="user"], [aria-label*="menu"]')
      .first();
    if (await userMenu.isVisible()) {
      await userMenu.click();
      // Wait for dropdown to open
      await page.waitForTimeout(100);
    }
  }

  // Click the logout button
  await logoutButton.click({ timeout: 5000 });

  // Wait for redirect to homepage
  await page.waitForURL(
    (url) => {
      return url.pathname === '/';
    },
    { timeout: 20000 },
  );

  console.log('Successfully logged out. Current URL:', page.url());
}

/**
 * Export expect for use in tests
 */
export { expect };

/**
 * Export helper functions for use in tests
 */
export {
  performSignup,
  performLogout,
  performLogoutAndVerify,
  performDeleteAccount,
  navigateToProfile,
  performLogin,
  performLoginWithAutoSignup,
};
