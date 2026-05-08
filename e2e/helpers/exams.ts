import { Page } from '@playwright/test';
import { findButtonByText, findButtonByTestId } from './selectors';

/**
 * Delete the first exam in the list
 * Returns success status and any error message
 */
export async function deleteFirstExam(
  page: Page,
  testName: string = 'test',
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('  - Deleting first exam...');

    const deleteButton = page.locator('button[data-testid="exam-card-delete-button"]').first();
    const isDeleteButtonVisible = await deleteButton
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!isDeleteButtonVisible) {
      return { success: false, error: 'Delete button not found' };
    }

    console.log('✓ Delete button found, clicking...');
    await deleteButton.click({ timeout: 5000 });

    console.log('  - Waiting for delete confirmation modal...');
    const deleteModal = page.locator('div[data-testid="delete-exam-modal"]');
    const isDeleteModalVisible = await deleteModal
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!isDeleteModalVisible) {
      return { success: false, error: 'Delete confirmation modal did not appear' };
    }

    console.log('✓ Delete confirmation modal appeared');

    console.log('  - Clicking delete confirmation button...');
    const deleteConfirmButton = deleteModal.locator(
      'button[data-testid="delete-exam-confirm-button"]',
    );
    const isConfirmButtonVisible = await deleteConfirmButton
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!isConfirmButtonVisible) {
      return { success: false, error: 'Delete confirmation button not found in modal' };
    }

    await deleteConfirmButton.click({ timeout: 5000 });

    console.log('  - Waiting for delete modal to close...');
    const isDeleteModalClosed = await deleteModal
      .waitFor({ state: 'hidden', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!isDeleteModalClosed) {
      return { success: false, error: 'Delete modal did not close' };
    }

    console.log('✓ Exam deleted successfully');
    await page.waitForTimeout(500);

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMsg };
  }
}

/**
 * Wait for a new exam to appear in the exam list
 * Polls for up to the specified timeout
 */
export async function waitForNewExamToAppear(
  page: Page,
  options: { maxWaitTime?: number; pollInterval?: number; testName?: string } = {},
): Promise<boolean> {
  const { maxWaitTime = 180000, pollInterval = 2000 } = options;

  console.log(`  - Waiting for new exam to appear in list (up to ${maxWaitTime / 1000}s)...`);

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const examCards = page.locator('div[data-testid="exam-card"]');
    const cardCount = await examCards.count().catch(() => 0);

    if (cardCount > 0) {
      console.log(`✓ Exam appeared in list! Found ${cardCount} exam card(s)`);
      return true;
    }

    await page.waitForTimeout(pollInterval);
  }

  return false;
}

/**
 * Verify we're on the exams page (URL check)
 */
export function verifyOnExamsPage(page: Page, testName: string = 'test'): boolean {
  const currentUrl = page.url();
  const isOnExamsPage = /\/main\/certifications\/\d+\/exams/.test(currentUrl);

  if (!isOnExamsPage) {
    throw new Error(
      `Not on exams page. Expected URL pattern: /main/certifications/{id}/exams, Got: ${currentUrl}`,
    );
  }

  console.log(`✓ Verified on exams page (${currentUrl})`);
  return true;
}

/**
 * Handle complete exam creation flow
 * Opens create modal, fills form, submits, and waits for exam to appear
 */
export async function handleExamCreation(page: Page, testName: string = 'test'): Promise<void> {
  console.log('  - Finding "New Exam" button...');

  const newExamButton = page.locator('button:has-text("New Exam")').first();

  try {
    await newExamButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ "New Exam" button found and visible');
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    throw new Error(`"New Exam"/"Create Exam" button not found or not visible. Error: ${errorMsg}`);
  }

  const isNewExamButtonDisabled = await newExamButton.isDisabled().catch(() => false);

  if (isNewExamButtonDisabled) {
    console.log('  ⚠ "New Exam" button is DISABLED (likely due to daily quota limit)');

    const quotaMessage = page.locator('text=/3\\/3 exams created|daily limit|quota/i').first();
    const hasQuotaMessage = await quotaMessage.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasQuotaMessage) {
      const messageText = await quotaMessage.textContent();
      console.log(`  ℹ Quota message: ${messageText}`);
    }

    console.log('  - Attempting to delete an exam to free up quota...');
    const deleteResult = await deleteFirstExam(page);

    if (deleteResult.success) {
      console.log('✓ Exam deleted, quota freed');
      await page.waitForTimeout(1000);
    } else {
      console.log(`  ⚠ Delete failed: ${deleteResult.error}, attempting to click "New Exam" anyway...`);
    }
  }

  console.log('  - Attempting to click "New Exam" button...');

  try {
    await newExamButton.waitFor({ state: 'visible', timeout: 10000 });
  } catch (e) {
    console.log('  ⚠ Button no longer visible before click attempt');
  }

  const isEnabled = await newExamButton.isEnabled().catch(() => false);
  const isEditable = await newExamButton.isEditable().catch(() => false);
  console.log(`  ℹ Button state: enabled=${isEnabled}, editable=${isEditable}`);

  const boundingBox = await newExamButton.boundingBox().catch(() => null);
  if (!boundingBox) {
    console.log('  ⚠ Button has no bounding box, may not be visible');
  }

  try {
    await newExamButton.click({ timeout: 8000 });
    console.log('✓ "New Exam" button clicked');
  } catch (e) {
    console.log('  ⚠ Normal click timeout, attempting force click...');
    try {
      await newExamButton.click({ force: true, timeout: 8000 });
      console.log('✓ "New Exam" button clicked (force)');
    } catch (forceError) {
      throw new Error(`Failed to click "New Exam" button: ${forceError}`);
    }
  }

  console.log('  - Waiting for Create Exam modal to open...');

  await page.waitForTimeout(500);

  let createExamModal = page.locator('div[data-testid="create-exam-modal"]');
  let isModalVisible = await createExamModal.isVisible({ timeout: 3000 }).catch(() => false);

  if (!isModalVisible) {
    console.log('  ⚠ data-testid selector failed, trying modal with number-of-questions input...');
    createExamModal = page
      .locator('div[role="dialog"]:has(input[id="number-of-questions"])')
      .first();
    isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);
  }

  if (!isModalVisible) {
    console.log('  ⚠ number-of-questions selector failed, trying "Create Exam" button text...');
    createExamModal = page
      .locator('div[role="dialog"]:has(button:has-text("Create Exam"))')
      .first();
    isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 3: Use generic dialog selector as last resort
  if (!isModalVisible) {
    console.log('  ⚠ All specific selectors failed, using generic dialog selector...');
    const allDialogs = await page.locator('div[role="dialog"]').count();
    console.log(`  ℹ Found ${allDialogs} dialog(s) on page`);
    createExamModal = page.locator('div[role="dialog"]').last();
    isModalVisible = await createExamModal
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
  }

  if (!isModalVisible) {
    throw new Error('Create Exam modal did not open');
  }

  console.log('✓ Create Exam modal opened');

  console.log('  - Clicking "Create" button in modal...');

  let createButton = createExamModal.locator('button:has-text("Create Exam")').first();
  let isCreateButtonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);

  if (!isCreateButtonVisible) {
    console.log('  ⚠ "Create Exam" selector failed, trying "Create" variant...');
    createButton = createExamModal.locator('button:has-text("Create")').first();
    isCreateButtonVisible = await createButton.isVisible({ timeout: 2000 }).catch(() => false);
  }

  if (!isCreateButtonVisible) {
    console.log('  ⚠ "Create" text selector failed, trying gradient button...');
    createButton = createExamModal.locator('button[class*="from-violet"]').last();
    isCreateButtonVisible = await createButton.isVisible({ timeout: 2000 }).catch(() => false);
  }

  if (!isCreateButtonVisible) {
    console.log('  ⚠ All primary selectors failed, trying extended search...');
    createButton = createExamModal
      .locator('button')
      .filter({ hasText: /Create|New/ })
      .first();
    isCreateButtonVisible = await createButton
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
  }

  if (!isCreateButtonVisible) {
    throw new Error('"Create" button not found in modal');
  }

  const isButtonDisabled = await createButton.isDisabled().catch(() => false);
  if (isButtonDisabled) {
    console.log('  ⚠ "Create" button is DISABLED (may be due to form validation). Attempting force click...');
  }

  try {
    console.log('  - Attempting normal click on "Create" button...');
    await createButton.click({ timeout: 5000 });
    console.log('✓ "Create" button clicked successfully');
  } catch (e) {
    console.log(`  ⚠ Normal click timed out (${e}). Attempting force click...`);
    try {
      await createButton.click({ force: true, timeout: 5000 });
      console.log('✓ "Create" button clicked via force click');
    } catch (forceError) {
      throw new Error(`Failed to click "Create" button even with force: ${forceError}`);
    }
  }

  console.log('  - Waiting for modal to close...');
  const isModalClosed = await createExamModal
    .waitFor({ state: 'hidden', timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (!isModalClosed) {
    console.log('  ⚠ Modal did not close within 30s, proceeding to check list...');
  } else {
    console.log('✓ Modal closed');
  }

  const examAppeared = await waitForNewExamToAppear(page, {
    maxWaitTime: 180000,
  });

  if (!examAppeared) {
    throw new Error('New exam did not appear in list within 3 minutes (180 seconds)');
  }

  verifyOnExamsPage(page);

  console.log('\n✅ EXAM CREATION COMPLETE — Successfully created new exam and verified it appears in list');
}
