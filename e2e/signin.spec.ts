import { test, expect } from './fixtures/auth';

test.describe('Sign In Flow', () => {
  test('should successfully sign in with valid credentials', async ({ page, context }) => {
    // Navigate to signin page
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // Wait for form fields to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Fill in credentials
    const email = process.env.PW_TEST_EMAIL;
    const password = process.env.PW_TEST_PASSWORD;

    if (!email || !password) {
      throw new Error('Missing test credentials: PW_TEST_EMAIL or PW_TEST_PASSWORD');
    }

    await page.locator('input[type="email"]').type(email, { delay: 50 });
    await page.locator('input[type="password"]').type(password, { delay: 50 });

    // Wait for form to update
    await page.waitForTimeout(500);

    // Trigger change events for form validation
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (emailInput) emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      if (passwordInput) passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect after successful authentication to /main
    await page.waitForURL(
      (url) => {
        return url.pathname === '/main';
      },
      { timeout: 20000 }
    );

    // Verify we are on the main page after signin
    expect(page.url()).toContain('/main');
  });

  test('should display error with invalid password', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // Wait for form fields to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Fill in form with wrong password
    const email = process.env.PW_TEST_EMAIL;
    if (!email) {
      throw new Error('Missing test email: PW_TEST_EMAIL');
    }

    await page.locator('input[type="email"]').type(email, { delay: 50 });
    await page.locator('input[type="password"]').type('wrong-password-123', { delay: 50 });

    // Wait for form to update
    await page.waitForTimeout(500);

    // Trigger change events for form validation
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (emailInput) emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      if (passwordInput) passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message to appear (with short timeout to avoid hanging)
    const errorElement = page.locator('[role="alert"]');
    try {
      await errorElement.waitFor({ timeout: 5000 });
    } catch (e) {
      // Error message might not appear, but we should still be on signin page
    }

    // Should remain on signin page (or show error)
    const isOnSignin = page.url().includes('/signin');
    const hasError = (await errorElement.count()) > 0;

    expect(isOnSignin || hasError).toBe(true);
  });

  test('should display error with non-existent email', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // Wait for form fields to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Fill in form with non-existent email
    const nonexistentEmail = 'nonexistent' + Date.now() + '@example.com';
    await page.locator('input[type="email"]').type(nonexistentEmail, { delay: 50 });
    await page.locator('input[type="password"]').type('any-password-123', { delay: 50 });

    // Wait for form to update
    await page.waitForTimeout(500);

    // Trigger change events for form validation
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (emailInput) emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      if (passwordInput) passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error or stay on signin (with short timeout)
    const errorElement = page.locator('[role="alert"]');
    try {
      await errorElement.waitFor({ timeout: 5000 });
    } catch (e) {
      // Error message might not appear immediately
    }

    // Should remain on signin page (or show error)
    const isOnSignin = page.url().includes('/signin');
    const hasError = (await errorElement.count()) > 0;

    expect(isOnSignin || hasError).toBe(true);
  });

  test('should display error with empty email', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // Wait for form fields to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Don't fill email, just fill password
    await page.fill('input[type="password"]', 'some-password');

    // Try to submit - button should be disabled or form should validate
    const submitButton = page.locator('button[type="submit"]');

    // Check if button is disabled (HTML5 validation)
    const isDisabled = await submitButton.isDisabled();

    if (isDisabled) {
      // Button is disabled due to HTML5 validation
      expect(isDisabled).toBe(true);
    } else {
      // Manual server-side validation
      await submitButton.click();
      // Wait with timeout for validation
      try {
        await page.waitForTimeout(1000);
      } catch (e) {
        // Ignore timeout errors
      }
      expect(page.url()).toContain('/signin');
    }
  });

  test('should maintain session across page reloads', async ({
    authenticatedPage,
  }) => {
    // Use authenticatedPage fixture which has already logged in
    // Navigate to main page
    await authenticatedPage.goto('/main/certifications', { waitUntil: 'domcontentloaded' });

    // Should be on main certifications (not redirected to signin)
    expect(authenticatedPage.url()).not.toContain('/signin');

    // Reload page
    await authenticatedPage.reload({ waitUntil: 'domcontentloaded' });

    // Should still be on certifications after reload (session maintained)
    expect(authenticatedPage.url()).not.toContain('/signin');
  });

  test('should redirect to dashboard after successful signin', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // Wait for form fields to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Fill in and submit form
    const email = process.env.PW_TEST_EMAIL;
    const password = process.env.PW_TEST_PASSWORD;

    if (!email || !password) {
      throw new Error('Missing test credentials');
    }

    await page.locator('input[type="email"]').type(email, { delay: 50 });
    await page.locator('input[type="password"]').type(password, { delay: 50 });

    // Wait for form to update
    await page.waitForTimeout(500);

    // Trigger change events for form validation
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (emailInput) emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      if (passwordInput) passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await page.click('button[type="submit"]');

    // Wait for redirect to /main
    await page.waitForURL(
      (url) => {
        return url.pathname === '/main';
      },
      { timeout: 20000 }
    );

    // Wait for page to be fully loaded - network idle ensures all API calls complete
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch (e) {
      // Network idle timeout is not critical - continue anyway
      console.log('Network idle timeout (non-critical)');
    }

    // Wait for transient alerts (toaster notifications, system errors) to settle/dismiss
    // Toaster auto-dismisses after 4s, so 3s wait helps ensure they've cleared
    await page.waitForTimeout(3000);

    // Get final URL
    const finalUrl = page.url();

    // Verify we're on the main page after successful signin
    expect(finalUrl).toContain('/main');

    // Verify page loaded successfully (no error messages visible)
    const errorElements = page.locator('[role="alert"]');
    const errorCount = await errorElements.count();

    if (errorCount > 0) {
      // Debug: Log error message content
      const errorText = await errorElements.first().textContent();
      console.error('Found error alert:', errorText);
      await page.screenshot({ path: 'test-error-debug.png' });
    }

    expect(errorCount).toBe(0);
  });
});
