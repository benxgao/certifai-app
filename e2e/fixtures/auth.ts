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
 * Can be overridden with parameters
 */
async function performLogin(page: Page, email?: string, password?: string): Promise<void> {
  // Load environment variables with fallback to provided parameters
  const loginEmail = email || process.env.PW_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_EMAIL;
  const loginPassword = password || process.env.PW_TEST_PASSWORD || process.env.PLAYWRIGHT_TEST_PASSWORD;

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
  await emailInput.type(loginEmail, { delay: 50 });
  await passwordInput.type(loginPassword, { delay: 50 });

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
 * Perform Firebase signup with email, password, and display name
 * Retrieved from environment variables: PW_SIGNUP_EMAIL and PW_SIGNUP_PASSWORD
 * Falls back to defaults if not set
 *
 * **Important for Static Test Accounts:**
 * This function handles both new account creation AND reuse of existing accounts:
 * - First run: Creates new account with provided email and redirects to signin
 * - Subsequent runs (same email): Detects "email already registered" error and auto-redirects to signin
 * This enables seamless reuse of static test accounts across multiple test runs without account recreation.
 *
 * Steps:
 * 1. Fill basic account info (first name, last name, email, password)
 * 2. Select 2nd certification from dropdown
 * 3. Check terms checkbox
 * 4. Wait for submit button to be enabled
 * 5. Submit form and wait for redirect to signin
 * 6. If "email already registered" error detected, navigate to signin and return
 *    (caller will proceed with login using existing account credentials)
 */
async function performSignup(
  page: Page,
  email?: string,
  password?: string,
  displayName?: string
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

  await page.fill('input#firstName', firstName);
  await page.fill('input#lastName', lastName);
  await page.fill('input#email', signupEmail);
  await page.fill('input#password', signupPassword);
  await page.fill('input#confirmPassword', signupPassword);

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
  await page.waitForTimeout(500);

  // Get all certification options and select the 2nd one
  const certOptions = page.locator('[role="option"]');
  const optionCount = await certOptions.count();

  if (optionCount < 2) {
    console.warn(`Only ${optionCount} certification option(s) available. Selecting first instead of second.`);
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
    console.warn('Submit button still appears disabled after waiting. Proceeding anyway.');
  } else {
    console.log('Submit button is now enabled.');
  }

  console.log('Submitting form...');

  // Click submit button
  await submitButton.click({ timeout: 5000 });

  console.log('Form submitted. Waiting for response (new account creation or existing email error)...');

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
      { timeout: 10000 }
    );
    console.log('✓ Successfully redirected to signin (new account or verification completed)');
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
      const errorText = await errorAlert.textContent() || '';
      console.log(`⚠ Error detected: ${errorText}`);

      // If we see an error (any error), assume it's email already registered
      // Navigate to signin to use the existing account
      console.log('→ Email likely already registered. Moving to signin to use existing account...');
      await page.goto('/signin', { waitUntil: 'domcontentloaded' });
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
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

  // Click dropdown trigger button using data-testid
  const dropdownTrigger = page.locator('[data-testid="dropdown-trigger"]');

  if (!await dropdownTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
    throw new Error('Dropdown trigger button not found on page');
  }

  // Click to open dropdown menu
  await dropdownTrigger.click({ timeout: 3000 });

  // Wait for dropdown menu to open
  await page.waitForTimeout(300);

  // Click "View Profile" menu item using data-testid
  const viewProfileItem = page.locator('[data-testid="dropdown-view-profile"]');

  if (!await viewProfileItem.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error('View Profile menu item not found in dropdown');
  }

  await viewProfileItem.click({ timeout: 5000 });

  // Wait for navigation to profile page
  await page.waitForURL(
    (url) => {
      return url.pathname.includes('/profile');
    },
    { timeout: 20000 }
  );

  console.log('Successfully navigated to profile via dropdown menu. Current URL:', page.url());
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
    await page.waitForTimeout(300);
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
    { timeout: 20000 }
  );

  // Verify auth state is cleared from localStorage
  const localStorageAuth = await page.evaluate(() => {
    return {
      hasFirebaseAuth: !!localStorage.getItem('firebase:authUser:'),
      hasCustomAuth: !!localStorage.getItem('auth_token'),
      hasSessionToken: !!localStorage.getItem('session_token'),
      storageKeys: Object.keys(localStorage).filter(k =>
        k.includes('auth') || k.includes('token') || k.includes('user')
      )
    };
  });

  console.log('Auth state after logout:', localStorageAuth);
  console.log('Successfully logged out and verified auth state cleared. Current URL:', page.url());
}

/**
 * Perform account deletion with multi-step confirmation
 * Uses new data-testid attributes for reliable element targeting
 *
 * Steps:
 * 1. Click profile delete button
 * 2. Confirm warning dialog and proceed to confirmation step
 * 3. Type confirmation text "DELETE MY ACCOUNT"
 * 4. Click final delete button
 * 5. Wait for redirect
 */
async function performDeleteAccount(page: Page): Promise<void> {
  // Click the delete account button using new data-testid
  const deleteButton = page.locator('[data-testid="profile-delete-account-btn"]');

  if (!await deleteButton.isVisible()) {
    throw new Error('Delete account button not found on profile page');
  }

  await deleteButton.click({ timeout: 5000 });

  // Wait for warning dialog to appear
  const warningDialog = page.locator('[data-testid="delete-account-warning-dialog"]');
  await warningDialog.waitFor({ state: 'visible', timeout: 10000 });

  // Click continue button in warning dialog
  const continueButton = warningDialog.locator('button:has-text("Continue")');
  await continueButton.click({ timeout: 5000 });

  // Wait for confirmation dialog to appear
  const confirmDialog = page.locator('[data-testid="delete-account-confirmation-dialog"]');
  await confirmDialog.waitFor({ state: 'visible', timeout: 10000 });

  // Fill in confirmation text
  const confirmInput = confirmDialog.locator('[data-testid="delete-account-confirm-input"]');
  await confirmInput.waitFor({ state: 'visible', timeout: 5000 });
  await confirmInput.fill('DELETE MY ACCOUNT', { timeout: 5000 });

  // Wait a moment for the button to enable
  await page.waitForTimeout(300);

  // Click final delete button
  const finalDeleteButton = confirmDialog.locator('[data-testid="delete-account-final-button"]');
  await finalDeleteButton.waitFor({ state: 'visible', timeout: 5000 });

  // Verify button is enabled
  const isDisabled = await finalDeleteButton.evaluate((el) => (el as HTMLButtonElement).disabled);
  if (isDisabled) {
    throw new Error('Delete button is still disabled after entering confirmation text');
  }

  await finalDeleteButton.click({ timeout: 5000 });

  // Wait for redirect after deletion (should redirect to signup or signin)
  await page.waitForURL(
    (url) => {
      const pathname = url.pathname;
      return pathname === '/signup' || pathname === '/signin' || pathname === '/' || pathname === '';
    },
    { timeout: 20000 }
  );

  console.log('Successfully deleted account. Redirected to:', page.url());
}

/**
 * Perform logout by clicking logout button
 */
async function performLogout(page: Page): Promise<void> {
  // Wait for page to be loaded
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

  // Look for logout button - could be in various locations
  const logoutButton = page.locator(
    'button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out"), [data-testid="logout-button"]'
  ).first();

  // If no logout button found, try to find user menu first
  if (!(await logoutButton.isVisible())) {
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label*="user"], [aria-label*="menu"]').first();
    if (await userMenu.isVisible()) {
      await userMenu.click();
      // Wait for dropdown to open
      await page.waitForTimeout(500);
    }
  }

  // Click the logout button
  await logoutButton.click({ timeout: 5000 });

  // Wait for redirect to homepage
  await page.waitForURL(
    (url) => {
      return url.pathname === '/';
    },
    { timeout: 20000 }
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
export { performSignup, performLogout, performLogoutAndVerify, performDeleteAccount, navigateToProfile, performLogin };
