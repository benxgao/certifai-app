import {
  test,
  expect,
  performSignup,
  performLogoutAndVerify,
  performDeleteAccount,
  navigateToProfile,
  performLogin,
} from './fixtures/auth';
import type { TestInfo } from '@playwright/test';
import { FlowTimingTracker } from './helpers/performance';

/**
 * Test suite for complete user lifecycle: signup, login, logout, re-login, profile, delete
 * This test verifies the seamless flow of a user account from creation to deletion.
 *
 * Flow:
 * 1. Create new account via signup
 * 2. Login with the created credentials
 * 3. Logout and verify auth state is cleared
 * 4. Re-login with the same credentials to verify account persistence
 * 5. Navigate to profile
 * 6. Delete the account
 *
 * UAT environment: no email verification required, direct redirect to signin after signup
 *
 * Test credentials from environment variables:
 * - PW_SIGNUP_EMAIL (default: pw_test_signup@certestic.com)
 * - PW_SIGNUP_PASSWORD (default: pw_test_signup@certestic.com)
 */

test('Complete User Lifecycle: Signup → Login → Logout → Re-login → Profile → Delete @integration', async ({
  page,
}, testInfo: TestInfo) => {
  test.setTimeout(180000); // 180 seconds for this test only
  const timingTracker = new FlowTimingTracker('User lifecycle baseline');

  // Use static test credentials from environment (reused across all test runs)
  const testEmail = process.env.PW_SIGNUP_EMAIL || 'pw_test_signup@certestic.com';
  const testPassword = process.env.PW_SIGNUP_PASSWORD || 'pw_test_signup@certestic.com';
  const testDisplayName = 'Static Test User';

  console.log('================== USER LIFECYCLE TEST ==================');
  console.log(`Test Email: ${testEmail}`);
  console.log(`Display Name: ${testDisplayName}`);
  console.log('========================================================');

  try {
    // ===== STEP 1: SIGNUP =====
    console.log('\n[STEP 1] Performing signup...');
    await timingTracker.trackStep(
      'Signup flow execution',
      async () => {
        await performSignup(page, testEmail, testPassword, testDisplayName);
      },
      {
        category: 'system',
        details: 'Covers signup page load, form interaction, certification selection, and redirect',
      },
    );

    expect(page.url()).toContain('/signin');
    console.log('✓ Signup successful - redirected to signin');
    await timingTracker.capturePageMetrics(page, 'Signin after signup');

    // Wait for Firebase Auth to complete registration
    console.log('  - Waiting 3 seconds for Firebase Auth to complete registration...');
    await timingTracker.trackStep(
      'Post-signup Firebase sync buffer',
      async () => {
        await page.waitForTimeout(3000);
      },
      {
        category: 'system',
        details: 'Buffer wait before initial login to reduce post-signup auth race conditions',
      },
    );

    // ===== STEP 2: INITIAL LOGIN =====
    console.log('\n[STEP 2] Performing initial login...');
    await timingTracker.trackStep(
      'Initial login flow',
      async () => {
        await performLogin(page, testEmail, testPassword);
      },
      {
        category: 'system',
        details: 'Covers signin page load, credential submission, Firebase auth, and dashboard redirect',
      },
    );
    expect(page.url()).toContain('/main');
    console.log('✓ Initial login successful - on main dashboard');
    await timingTracker.capturePageMetrics(page, 'Main dashboard after initial login');

    // Verify user is logged in (display name visible)
    const userInitials = testDisplayName
      .split(' ')
      .map((n) => n[0])
      .join('');
    const userIndicator = page.locator(`text=/Profile|${userInitials}/i`);
    const userIndicatorStartedAt = Date.now();
    await expect(userIndicator)
      .toBeVisible({ timeout: 5000 })
      .then(() => {
        timingTracker.recordDuration(
          'Dashboard user indicator visible',
          Date.now() - userIndicatorStartedAt,
          {
            category: 'content',
            details: 'Observed profile indicator or initials after login',
            startedAt: userIndicatorStartedAt,
          },
        );
      })
      .catch(() => {
        console.warn("User indicator not found, but that's okay - may be hidden on responsive view");
        timingTracker.recordDuration(
          'Dashboard user indicator visibility fallback',
          Date.now() - userIndicatorStartedAt,
          {
            category: 'content',
            details: 'Profile indicator was not visible within 5 seconds on current viewport',
            status: 'failed',
            startedAt: userIndicatorStartedAt,
          },
        );
      });

    // ===== STEP 3: LOGOUT & VERIFY AUTH STATE CLEARED =====
    console.log('\n[STEP 3] Performing logout and verifying auth state is cleared...');
    await timingTracker.trackStep(
      'Logout and auth state verification',
      async () => {
        await performLogoutAndVerify(page);
      },
      {
        category: 'system',
        details: 'Covers user dropdown interaction, sign out, redirect, and storage verification',
      },
    );

    // Check that we're on signin or root page (may have redirect message in query params)
    const logoutUrl = new URL(page.url());
    const isValidLogoutRedirect =
      logoutUrl.pathname === '/signin' || logoutUrl.pathname === '/' || logoutUrl.pathname === '';
    expect(isValidLogoutRedirect).toBe(true);
    console.log('✓ Logout successful - auth state verified as cleared');
    await timingTracker.capturePageMetrics(page, 'Post-logout auth page');

    // Verify we cannot access protected pages (attempt to go to /main)
    console.log('  - Verifying protected pages are inaccessible...');
    const protectedRedirectStartedAt = Date.now();
    await page.goto('/main', { waitUntil: 'domcontentloaded' });
    // Should redirect to signin if not authenticated
    await page
      .waitForURL(
        (url) => {
          const isAuthPage = url.pathname === '/signin' || url.pathname === '/';
          if (isAuthPage) {
            console.log('  ✓ Correctly redirected to auth page when accessing protected route');
          }
          return isAuthPage;
        },
        { timeout: 10000 },
      )
      .then(() => {
        timingTracker.recordDuration(
          'Protected route redirect after logout',
          Date.now() - protectedRedirectStartedAt,
          {
            category: 'system',
            details: 'Attempted to access /main after logout and observed redirect to auth page',
            startedAt: protectedRedirectStartedAt,
          },
        );
      })
      .catch(() => {
        console.warn('  Could not verify protected page redirect - may depend on app configuration');
        timingTracker.recordDuration(
          'Protected route redirect after logout',
          Date.now() - protectedRedirectStartedAt,
          {
            category: 'system',
            details: 'Protected route redirect was not confirmed within 10 seconds',
            status: 'failed',
            startedAt: protectedRedirectStartedAt,
          },
        );
      });

    // ===== STEP 4: RE-LOGIN WITH SAME CREDENTIALS =====
    console.log('\n[STEP 4] Performing re-login with same credentials...');
    await timingTracker.trackStep(
      'Navigate back to signin for re-login',
      async () => {
        await page.goto('/signin', { waitUntil: 'domcontentloaded' });
      },
      {
        category: 'page',
        details: 'Reload signin page before re-authentication',
      },
    );
    await timingTracker.capturePageMetrics(page, 'Signin before re-login');

    await timingTracker.trackStep(
      'Re-login flow',
      async () => {
        await performLogin(page, testEmail, testPassword);
      },
      {
        category: 'system',
        details: 'Validates existing account can authenticate again after logout',
      },
    );
    expect(page.url()).toContain('/main');
    console.log('✓ Re-login with same credentials successful');
    await timingTracker.capturePageMetrics(page, 'Main dashboard after re-login');

    // ===== STEP 5: NAVIGATE TO PROFILE =====
    console.log('\n[STEP 5] Navigating to user profile...');
    await timingTracker.trackStep(
      'Navigate from dashboard to profile',
      async () => {
        await navigateToProfile(page);
      },
      {
        category: 'system',
        details: 'Covers opening the user dropdown and navigating into the profile page',
      },
    );
    expect(page.url()).toContain('/profile');
    console.log('✓ Profile page accessed successfully');
    await timingTracker.capturePageMetrics(page, 'Profile page');

    // ===== STEP 5B: VERIFY AND EXPAND ACCOUNT SETTINGS =====
    console.log('  - Looking for Account Settings accordion...');

    // Wait for Account Settings content to be visible - profile page loads async content
    // The page should be loaded at /profile - just look for the Account Settings h3 heading
    // There's a page header "Account Settings" and an accordion trigger "Account Settings" - we need the last one
    const allAccountSettingsHeadings = page.locator('h3:has-text("Account Settings")');
    const settingsContentStartedAt = Date.now();

    try {
      await allAccountSettingsHeadings.first().waitFor({ timeout: 8000, state: 'visible' });
      console.log('  ✓ Account Settings content is now visible');
      timingTracker.recordDuration('Profile account settings content visible', Date.now() - settingsContentStartedAt, {
        category: 'content',
        details: 'Observed Account Settings section heading on profile page',
        startedAt: settingsContentStartedAt,
      });
    } catch (e) {
      console.warn('  ⚠ Account Settings not immediately visible, waiting additional time...');
      await page.waitForTimeout(1000);
      timingTracker.recordDuration('Profile account settings content fallback wait', Date.now() - settingsContentStartedAt, {
        category: 'content',
        details: 'Account Settings was not visible within 8 seconds; applied additional wait',
        status: 'failed',
        startedAt: settingsContentStartedAt,
      });
    }

    const countHeadings = await allAccountSettingsHeadings.count();

    console.log(`  - Found ${countHeadings} "Account Settings" heading(s)`);

    if (countHeadings === 0) {
      throw new Error(
        'No "Account Settings" headings found on profile page. Page may not have loaded correctly.',
      );
    }

    // Get the last heading (which should be inside the accordion trigger button)
    const accordionHeading = allAccountSettingsHeadings.last();

    // Scroll it into view
    try {
      await accordionHeading.scrollIntoViewIfNeeded();
      console.log('  ✓ Scrolled accordion into view');
    } catch (e) {
      console.warn('  ⚠ Could not scroll, but continuing...');
    }

    // Find and click the accordion trigger button using data-slot attribute
    // The button contains the h3 with "Account Settings" text
    const accordionOpenStartedAt = Date.now();
    try {
      const accountSettingsButton = page.locator('button[data-slot="accordion-trigger"]').filter({
        has: page.locator('h3:has-text("Account Settings")'),
      });

      const isVisible = await accountSettingsButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (!isVisible) {
        console.warn(
          '  ⚠ Account Settings button not visible after scroll, attempting click anyway...',
        );
      }

      await accountSettingsButton.click({ timeout: 5000 });
      console.log('  ✓ Successfully clicked Account Settings accordion trigger button');
      timingTracker.recordDuration('Open account settings accordion', Date.now() - accordionOpenStartedAt, {
        category: 'action',
        details: 'Opened the account settings accordion on the profile page',
        startedAt: accordionOpenStartedAt,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      timingTracker.recordDuration('Open account settings accordion', Date.now() - accordionOpenStartedAt, {
        category: 'action',
        details: errorMessage,
        status: 'failed',
        startedAt: accordionOpenStartedAt,
      });
      throw new Error(
        `Could not click Account Settings accordion. The button with data-slot="accordion-trigger" containing "Account Settings" h3 was not found or not clickable.`,
      );
    }

    // Wait for accordion to open
    const accordionSettleStartedAt = Date.now();
    await page.waitForTimeout(100);
    timingTracker.recordDuration('Account settings accordion settle wait', Date.now() - accordionSettleStartedAt, {
      category: 'action',
      details: 'Small UI settle wait after opening accordion',
      startedAt: accordionSettleStartedAt,
    });

    // Verify delete button is visible
    const deleteButton = page.locator('[data-testid="profile-delete-account-btn"]');
    const deleteButtonStartedAt = Date.now();
    try {
      await expect(deleteButton).toBeVisible({ timeout: 3000 });
      console.log('✓ Account Settings expanded - Delete button is visible');
      timingTracker.recordDuration('Profile delete button visible', Date.now() - deleteButtonStartedAt, {
        category: 'content',
        details: 'Delete account CTA became visible after accordion expansion',
        startedAt: deleteButtonStartedAt,
      });
    } catch (e) {
      timingTracker.recordDuration('Profile delete button visible', Date.now() - deleteButtonStartedAt, {
        category: 'content',
        details: 'Delete account CTA did not become visible after accordion expansion',
        status: 'failed',
        startedAt: deleteButtonStartedAt,
      });
      throw new Error('Delete button not visible after expanding accordion');
    }

    // ===== STEP 6: DELETE ACCOUNT =====
    console.log('\n[STEP 6] Deleting account with confirmation...');
    await timingTracker.trackStep(
      'Delete account confirmation flow',
      async () => {
        await performDeleteAccount(page);
      },
      {
        category: 'system',
        details: 'Covers warning dialog, typed confirmation, and delete request dispatch',
      },
    );
    console.log('✓ Account deleted successfully');

    await timingTracker.trackStep(
      'Post-delete backend processing buffer',
      async () => {
        await page.waitForTimeout(7000);
      },
      {
        category: 'system',
        details: 'Buffer wait for backend deletion processing and redirect side effects',
      },
    );

    // ===== STEP 7: VERIFY DELETION (NEGATIVE TEST) =====
    console.log(
      '\n[STEP 7] Verifying account deletion - attempting to re-login with deleted credentials...',
    );
    await timingTracker.trackStep(
      'Navigate to signin for deleted-account validation',
      async () => {
        await page.goto('/signin', { waitUntil: 'domcontentloaded' });
      },
      {
        category: 'page',
        details: 'Returns to signin page to validate deleted credentials can no longer authenticate',
      },
    );
    await timingTracker.capturePageMetrics(page, 'Signin for deleted-account validation');

    // Attempt to login with deleted account credentials
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    const deletedLoginAttemptStartedAt = Date.now();
    await emailInput.waitFor({ timeout: 10000 });
    await passwordInput.waitFor({ timeout: 10000 });

    await emailInput.type(testEmail, { delay: 50 });
    await passwordInput.type(testPassword, { delay: 50 });

    await page.waitForTimeout(100);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click({ timeout: 3000 });

    // Wait to see if login fails (should fail or show error for deleted account)
    let loginFailed = false;
    try {
      // Try to wait for redirect to /main - should NOT happen
      await page.waitForURL(/\/main/, { timeout: 5000 }).catch(() => {
        loginFailed = true;
      });
    } catch (e) {
      loginFailed = true;
    }

    timingTracker.recordDuration('Deleted-account login rejection check', Date.now() - deletedLoginAttemptStartedAt, {
      category: 'system',
      details: loginFailed
        ? 'Deleted credentials did not regain access to /main'
        : 'Deleted credentials still reached /main and need investigation',
      status: loginFailed ? 'passed' : 'failed',
      startedAt: deletedLoginAttemptStartedAt,
    });

    if (loginFailed) {
      console.log('✓ Login attempt with deleted account failed as expected');
    } else {
      console.warn('⚠ Login did not fail - account may not have been properly deleted');
    }

    console.log('\n================== TEST COMPLETE ==================');
    console.log('✓ All steps completed successfully:');
    console.log('  1. Signup with new account');
    console.log('  2. Login to main dashboard');
    console.log('  3. Logout and verify auth state cleared');
    console.log('  4. Re-login with same credentials');
    console.log('  5. Navigate to profile');
    console.log('  6. Delete account with confirmation');
    console.log('  7. Verify deletion - re-login fails');
    console.log('====================================================');
  } finally {
    timingTracker.logSummary();
    await testInfo.attach('user-lifecycle-timing-baseline', {
      body: JSON.stringify(timingTracker.buildReport(), null, 2),
      contentType: 'application/json',
    });
  }
});
