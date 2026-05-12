import { test, expect, type Page } from '@playwright/test';

async function dismissCookieConsentIfVisible(page: Page) {
  const cookieDialog = page.getByRole('dialog', { name: 'Cookie consent' });
  if (await cookieDialog.isVisible().catch(() => false)) {
    await cookieDialog.getByRole('button', { name: 'Accept' }).click();
    await expect(cookieDialog).toBeHidden();
  }
}

test.describe('Demo credentials reveal consent flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/demo-credentials', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            username: 'demo@certestic.com',
            password: 'demo@certestic.com',
            updatedAt: '2026-05-12T00:00:00.000Z',
          },
        }),
      });
    });
  });

  test('requires click to reveal and hides again after refresh', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'networkidle' });
    await dismissCookieConsentIfVisible(page);

    const agreeButton = page.getByRole('button', {
      name: 'Agree and display demo account credentials',
    });

    await expect(agreeButton).toBeVisible();
    await expect(agreeButton).toBeEnabled();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    const firstRevealResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/demo-credentials') && response.request().method() === 'GET',
    );
    await agreeButton.click();
    await firstRevealResponse;

    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');

    await page.reload({ waitUntil: 'networkidle' });
    await dismissCookieConsentIfVisible(page);

    await expect(
      page.getByRole('button', { name: 'Agree and display demo account credentials' }),
    ).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    const secondRevealResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/demo-credentials') && response.request().method() === 'GET',
    );
    await page.getByRole('button', { name: 'Agree and display demo account credentials' }).click();
    await secondRevealResponse;
    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');
  });

  test('applies the same reveal-on-click behavior on signup', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle' });
    await dismissCookieConsentIfVisible(page);

    const agreeButton = page.getByRole('button', {
      name: 'Agree and display demo account credentials',
    });

    await expect(agreeButton).toBeVisible();
    await expect(agreeButton).toBeEnabled();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    const revealResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/demo-credentials') && response.request().method() === 'GET',
    );
    await agreeButton.click();
    await revealResponse;

    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');

    await page.reload({ waitUntil: 'networkidle' });
    await dismissCookieConsentIfVisible(page);

    await expect(
      page.getByRole('button', { name: 'Agree and display demo account credentials' }),
    ).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );
  });
});
