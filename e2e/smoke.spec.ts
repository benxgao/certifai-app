import { test, expect } from '@playwright/test';

/**
 * Smoke tests — minimal health checks tagged @smoke.
 *
 * These tests verify that the app boots, routes resolve, and critical
 * pages render their key elements. They do NOT require authentication
 * credentials, making them suitable as a fast CI gate via:
 *
 *   npm run test:e2e:smoke      # playwright test --grep @smoke
 *
 * Run jointly with the @smoke-tagged tests in other spec files.
 */

test.describe('Smoke health checks', () => {
  test('homepage renders without error @smoke', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The page should load successfully (HTTP 200 — Playwright fails navigation
    // automatically on 4xx/5xx, but we assert the body has content)
    await expect(page.locator('body')).not.toBeEmpty();

    // The landing page renders a header with the brand name
    await expect(page.locator('body')).toContainText(/certest/i);

    // No uncaught JavaScript errors should reach the page level
    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toHaveLength(0);
  });

  test('signin page loads with form fields @smoke', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });

    // The "Sign In" heading should be visible
    await expect(page.locator('h1, h2').filter({ hasText: /sign\s*in/i })).toBeVisible({
      timeout: 10_000,
    });

    // Email input must exist and be an email type
    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Password input must exist and be a password type
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Submit button must exist
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible({ timeout: 10_000 });
  });

  test('signup page loads with form fields @smoke', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });

    // The signup page should render an email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10_000 });

    // Both password fields must exist (signup has password + confirm password,
    // so id-based locators are required to avoid strict mode violations)
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
    const confirmPasswordInput = page.locator('input#confirmPassword');
    await expect(confirmPasswordInput).toBeVisible({ timeout: 10_000 });
  });
});
