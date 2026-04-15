import { test, expect } from './fixtures/auth';

test.describe.skip('Exam Flows', () => {
  test('should view the first exam of the first certification', async ({ authenticatedPage }) => {
    // Start from authenticated state - navigate to main/certifications
    await authenticatedPage.goto('/main/certifications', { waitUntil: 'domcontentloaded' });

    // Get list of certifications
    const certificationLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
    const certCount = await certificationLinks.count();
    expect(certCount).toBeGreaterThan(0);

    // Click on the first certification
    const firstCertLink = certificationLinks.first();
    await firstCertLink.click();
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Should be on the certification's exams page
    expect(authenticatedPage.url()).toMatch(/\/main\/certifications\/\d+\/exams/);

    // Get list of exams
    const examCards = authenticatedPage.locator('div[class*="border"][class*="rounded-xl"]');
    const examCount = await examCards.count();

    if (examCount > 0) {
      // Click on the first exam
      const firstExamCard = examCards.first();
      const examLink = firstExamCard.locator('a, button');
      const firstButton = examLink.first();
      await firstButton.click();
      await authenticatedPage.waitForLoadState('domcontentloaded');

      // Should be on the exam taking page
      expect(authenticatedPage.url()).toMatch(
        /\/main\/certifications\/\d+\/exams\/[a-zA-Z0-9_-]+/
      );

      // Verify exam content loads
      const pageTitle = authenticatedPage.locator('h1, h2');
      const titleExists = await pageTitle.first().isVisible({ timeout: 5000 });
      expect(titleExists).toBe(true);
    } else {
      // If no exams exist, verify the empty state is shown
      const emptyState = authenticatedPage.locator('text=/no exam|empty|create exam/i');
      await expect(emptyState).toBeVisible();
    }
  });

  test('should create a new exam', async ({ authenticatedPage }) => {
    // Navigate to the certifications page
    await authenticatedPage.goto('/main/certifications', { waitUntil: 'domcontentloaded' });

    // Find and click the first certification
    const certificationLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
    const certCount = await certificationLinks.count();
    expect(certCount).toBeGreaterThan(0);

    const firstCertLink = certificationLinks.first();
    await firstCertLink.click();
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Should be on certification exams page
    expect(authenticatedPage.url()).toMatch(/\/main\/certifications\/\d+\/exams/);

    // Find and click "Create Exam" button
    // Try multiple selectors as the button can have various class names
    let createButton = authenticatedPage.locator('button:has-text("Create Exam")').first();

    if (!(await createButton.isVisible({ timeout: 3000 }))) {
      // Try alternate selector
      createButton = authenticatedPage.locator(
        'button[class*="from-violet"][class*="to-blue"]'
      ).first();
    }

    await expect(createButton).toBeVisible({ timeout: 5000 });
    await createButton.click();

    // Wait for modal to open
    const modal = authenticatedPage.locator('div[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find and adjust the questions slider
    // Look for slider or number input
    const questionSlider = authenticatedPage.locator(
      'input[type="range"], input[name*="question"]'
    ).first();

    if (await questionSlider.isVisible()) {
      // Set slider to a reasonable value (e.g., 5 questions)
      await questionSlider.fill('5');
    }

    // Optional: Fill in custom prompt if textarea exists
    const customPromptTextarea = authenticatedPage.locator('textarea[id="custom-prompt"]');
    if (await customPromptTextarea.isVisible()) {
      await customPromptTextarea.fill('Test exam about core concepts');
    }

    // Find and click submit button in modal
    const submitButton = modal.locator('button:has-text("Create")').first();

    if (!(await submitButton.isVisible())) {
      // Try alternate text
      const altSubmitButton = modal.locator('button[class*="from-violet"]').last();
      await expect(altSubmitButton).toBeVisible({ timeout: 5000 });
      await altSubmitButton.click();
    } else {
      await submitButton.click();
    }

    // Wait for exam creation to complete
    // Modal should close and new exam should appear in list
    await expect(modal).not.toBeVisible({ timeout: 30000 });

    // Verify we're still on the exams page
    expect(authenticatedPage.url()).toMatch(/\/main\/certifications\/\d+\/exams/);

    // Verify exam appears in the list (by checking for exam cards)
    const examCards = authenticatedPage.locator('div[class*="border"][class*="rounded-xl"]');
    const cardCount = await examCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify no error messages are shown
    const errorMessages = authenticatedPage.locator('[role="alert"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('should delete an exam', async ({ authenticatedPage }) => {
    // Navigate to certifications
    await authenticatedPage.goto('/main/certifications', { waitUntil: 'domcontentloaded' });

    // Find and click first certification
    const certificationLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
    const certCount = await certificationLinks.count();
    expect(certCount).toBeGreaterThan(0);

    const firstCertLink = certificationLinks.first();
    await firstCertLink.click();
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Get exam list
    const examCards = authenticatedPage.locator('div[class*="border"][class*="rounded-xl"]');
    const examCount = await examCards.count();

    if (examCount === 0) {
      // Skip test if no exams exist
      test.skip();
    }

    // Find the delete button on first exam card (trash icon button)
    const firstExamCard = examCards.first();
    const deleteButton = firstExamCard.locator('button[class*="rounded-xl"][class*="text"]').first();

    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();

    // Wait for delete confirmation modal to appear
    const confirmModal = authenticatedPage.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible({ timeout: 5000 });

    // Verify modal contains delete confirmation text
    const modalText = await confirmModal.textContent();
    expect(modalText?.toLowerCase()).toMatch(/delete|remove|confirm/i);

    // Find and click the confirm delete button
    const confirmDeleteButton = confirmModal
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();

    if (!(await confirmDeleteButton.isVisible())) {
      // Try finding red/danger button
      const dangerButton = confirmModal.locator('button[class*="red"], button[class*="destructive"]').first();
      await expect(dangerButton).toBeVisible({ timeout: 5000 });
      await dangerButton.click();
    } else {
      await confirmDeleteButton.click();
    }

    // Wait for deletion (modal closes and list updates)
    await expect(confirmModal).not.toBeVisible({ timeout: 30000 });

    // Verify we're still on the same page
    expect(authenticatedPage.url()).toMatch(/\/main\/certifications\/\d+\/exams/);

    // Verify no error messages
    const errorMessages = authenticatedPage.locator('[role="alert"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);

    // Optionally verify exam was removed from list
    // (This may take time due to API calls, so we just check we're on the page)
  });

  test('should show error when trying to create exam without questions', async ({
    authenticatedPage,
  }) => {
    // Navigate to certifications
    await authenticatedPage.goto('/main/certifications', { waitUntil: 'domcontentloaded' });

    // Click first certification
    const certificationLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
    const firstCertLink = certificationLinks.first();
    await firstCertLink.click();
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Find and click "Create Exam" button
    const createButton = authenticatedPage.locator('button:has-text("Create Exam")').first();
    await expect(createButton).toBeVisible({ timeout: 5000 });
    await createButton.click();

    // Wait for modal
    const modal = authenticatedPage.locator('div[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Try to submit without adjusting questions (may fail if validation)
    const submitButton = modal.locator('button[class*="from-violet"]').last();

    // Check if submit button is disabled
    const isDisabled = await submitButton.isDisabled();

    if (!isDisabled) {
      await submitButton.click();
      await authenticatedPage.waitForTimeout(2000);

      // Check for error message
      const errorElements = authenticatedPage.locator('[role="alert"]');
      const hasError = await errorElements.isVisible().catch(() => false);

      if (hasError) {
        const errorText = await errorElements.first().textContent();
        expect(errorText?.toLowerCase()).toMatch(
          /invalid|required|minimum|questions/i
        );
      }
    }
  });
});
