import { test, expect, type Page } from '@playwright/test';

async function dismissCookieConsentIfVisible(page: Page) {
  const cookieDialog = page.getByRole('dialog', { name: 'Cookie consent' });
  if (await cookieDialog.isVisible().catch(() => false)) {
    await cookieDialog.getByRole('button', { name: 'Accept' }).click();
    await expect(cookieDialog).toBeHidden();
  }
}

async function revealCredentialsViaConsentModal(page: Page) {
  const displayButton = page.getByRole('button', {
    name: 'Show demo login details',
  });

  await expect(displayButton).toBeVisible();
  await expect(displayButton).toBeEnabled();
  await displayButton.click();

  const consentDialog = page.getByRole('dialog', {
    name: 'Before we display demo credentials',
  });
  await expect(consentDialog).toBeVisible();

  await expect(consentDialog.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  await expect(consentDialog.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();

  const agreeButton = consentDialog.getByRole('button', { name: 'Agree' });
  await expect(agreeButton).toBeDisabled();

  const consentCheckbox = consentDialog.getByLabel(
    'I have read and agree to the Privacy Policy and Terms & Conditions for demo account use.',
  );
  await consentCheckbox.click();

  await expect(agreeButton).toBeEnabled();

  const revealResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/demo-credentials') && response.request().method() === 'GET',
  );
  await agreeButton.click();
  await revealResponse;

  await expect(consentDialog).toBeHidden();
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

  test.skip('requires click to reveal and hides again after refresh', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await dismissCookieConsentIfVisible(page);

    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    await revealCredentialsViaConsentModal(page);

    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await dismissCookieConsentIfVisible(page);

    await expect(page.getByRole('button', { name: 'Show demo login details' })).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    await revealCredentialsViaConsentModal(page);
    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');
  });

  test('applies the same reveal-on-click behavior on signup', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });
    await dismissCookieConsentIfVisible(page);

    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );

    await revealCredentialsViaConsentModal(page);

    await expect(page.locator('body')).toContainText('username/password: demo@certestic.com');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await dismissCookieConsentIfVisible(page);

    await expect(page.getByRole('button', { name: 'Show demo login details' })).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'username/password: demo@certestic.com',
    );
  });
});
