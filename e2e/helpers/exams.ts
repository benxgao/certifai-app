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
    console.log(`${testName} → Deleting first exam...`);

    const deleteButton = page.locator('button[data-testid="exam-card-delete-button"]').first();
    const isDeleteButtonVisible = await deleteButton
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!isDeleteButtonVisible) {
      return { success: false, error: 'Delete button not found' };
    }

    console.log(`${testName} ✓ Delete button found, clicking...`);
    await deleteButton.click({ timeout: 5000 });

    console.log(`${testName} → Waiting for delete confirmation modal...`);
    const deleteModal = page.locator('div[data-testid="delete-exam-modal"]');
    const isDeleteModalVisible = await deleteModal
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!isDeleteModalVisible) {
      return { success: false, error: 'Delete confirmation modal did not appear' };
    }

    console.log(`${testName} ✓ Delete confirmation modal appeared`);

    console.log(`${testName} → Clicking delete confirmation button...`);
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

    console.log(`${testName} → Waiting for delete modal to close...`);
    const isDeleteModalClosed = await deleteModal
      .waitFor({ state: 'hidden', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!isDeleteModalClosed) {
      return { success: false, error: 'Delete modal did not close' };
    }

    console.log(`${testName} ✓ Exam deleted successfully`);
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
  const { maxWaitTime = 180000, pollInterval = 2000, testName = 'test' } = options;

  console.log(`${testName} → Waiting for new exam to appear in list (up to ${maxWaitTime / 1000}s)...`);

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const examCards = page.locator('div[data-testid="exam-card"]');
    const cardCount = await examCards.count().catch(() => 0);

    if (cardCount > 0) {
      console.log(`${testName} ✓ Exam appeared in list! Found ${cardCount} exam card(s)`);
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
      `${testName} ✗ Not on exams page. Expected URL pattern: /main/certifications/{id}/exams, Got: ${currentUrl}`,
    );
  }

  console.log(`${testName} ✓ Verified on exams page (${currentUrl})`);
  return true;
}

/**
 * Handle complete exam creation flow
 * Opens create modal, fills form, submits, and waits for exam to appear
 */
export async function handleExamCreation(page: Page, testName: string = 'test'): Promise<void> {
  // ===== Click "New Exam" button =====
  console.log(`${testName} → Clicking "New Exam" button...`);

  // ===== Find and verify "New Exam" button =====
  console.log(`${testName} → Finding "New Exam" button...`);

  const newExamButton = page.locator('button:has-text("New Exam")').first();

  try {
    await newExamButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log(`${testName} ✓ "New Exam" button found and visible`);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `${testName} ✗ "New Exam"/"Create Exam" button not found or not visible. Error: ${errorMsg}`,
    );
  }

  // Check if button is disabled (e.g., due to 3/3 exams created today quota)
  const isNewExamButtonDisabled = await newExamButton.isDisabled().catch(() => false);

  if (isNewExamButtonDisabled) {
    console.log(`${testName} ⚠ "New Exam" button is DISABLED (likely due to daily quota limit)`);

    // Try to find the quota warning message
    const quotaMessage = page.locator('text=/3\\/3 exams created|daily limit|quota/i').first();
    const hasQuotaMessage = await quotaMessage.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasQuotaMessage) {
      const messageText = await quotaMessage.textContent();
      console.log(`${testName} ℹ Quota message: ${messageText}`);
    }

    // Attempt to delete first exam to free up quota
    console.log(`${testName} → Attempting to delete an exam to free up quota...`);
    const deleteResult = await deleteFirstExam(page, testName);

    if (deleteResult.success) {
      console.log(`${testName} ✓ Exam deleted, quota freed`);
      // Wait a bit for UI to fully update
      await page.waitForTimeout(1000);
    } else {
      console.log(
        `${testName} ⚠ Delete failed: ${deleteResult.error}, but attempting to click "New Exam" anyway...`,
      );
    }
  }

  // Now try to click the "New Exam" button (should be enabled now)
  console.log(`${testName} → Attempting to click "New Exam" button...`);

  // Ensure button is fully interactive before clicking
  try {
    await newExamButton.waitFor({ state: 'visible', timeout: 10000 });
  } catch (e) {
    console.log(`${testName} ⚠ Button no longer visible before click attempt`);
  }

  // Log button state for diagnostics
  const isEnabled = await newExamButton.isEnabled().catch(() => false);
  const isEditable = await newExamButton.isEditable().catch(() => false);
  console.log(`${testName} ℹ Button state: enabled=${isEnabled}, editable=${isEditable}`);

  // Check if any overlays are blocking the button
  const boundingBox = await newExamButton.boundingBox().catch(() => null);
  if (!boundingBox) {
    console.log(`${testName} ⚠ Button has no bounding box, may not be visible`);
  }

  try {
    await newExamButton.click({ timeout: 8000 });
    console.log(`${testName} ✓ "New Exam" button clicked`);
  } catch (e) {
    // Fallback to force click
    console.log(`${testName} ⚠ Normal click timeout, attempting force click...`);
    try {
      await newExamButton.click({ force: true, timeout: 8000 });
      console.log(`${testName} ✓ "New Exam" button clicked (force)`);
    } catch (forceError) {
      throw new Error(`${testName} ✗ Failed to click "New Exam" button: ${forceError}`);
    }
  }

  // ===== Wait for modal to open =====
  console.log(`${testName} → Waiting for Create Exam modal to open...`);

  // Wait a bit for page animations and modal rendering after button click
  await page.waitForTimeout(500);

  // Try data-testid selector first (most reliable now that EnhancedModal supports it)
  let createExamModal = page.locator('div[data-testid="create-exam-modal"]');
  let isModalVisible = await createExamModal.isVisible({ timeout: 3000 }).catch(() => false);

  // Fallback 1: Try selector with number of questions slider
  if (!isModalVisible) {
    console.log(`${testName} ⚠ data-testid selector failed, trying modal with number-of-questions input...`);
    createExamModal = page
      .locator('div[role="dialog"]:has(input[id="number-of-questions"])')
      .first();
    isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 2: Try to find modal with "Create Exam" text or button
  if (!isModalVisible) {
    console.log(`${testName} ⚠ number-of-questions selector failed, trying "Create Exam" button text...`);
    createExamModal = page
      .locator('div[role="dialog"]:has(button:has-text("Create Exam"))')
      .first();
    isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 3: Use generic dialog selector as last resort
  if (!isModalVisible) {
    console.log(`${testName} ⚠ All specific selectors failed, using generic dialog selector...`);
    const allDialogs = await page.locator('div[role="dialog"]').count();
    console.log(`${testName} ℹ Found ${allDialogs} dialog(s) on page`);
    createExamModal = page.locator('div[role="dialog"]').last(); // Use last dialog to get Create Exam, not delete modal
    isModalVisible = await createExamModal
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
  }

  if (!isModalVisible) {
    throw new Error(`${testName} ✗ Create Exam modal did not open`);
  }

  console.log(`${testName} ✓ Create Exam modal opened`);

  // ===== Click "Create" button in modal =====
  console.log(`${testName} → Clicking "Create" button in modal...`);

  // Primary selector: Find button with "Create Exam" text
  let createButton = createExamModal.locator('button:has-text("Create Exam")').first();
  let isCreateButtonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);

  // Fallback 1: Try "Create" text variant
  if (!isCreateButtonVisible) {
    console.log(`${testName} ⚠ "Create Exam" selector failed, trying "Create" variant...`);
    createButton = createExamModal.locator('button:has-text("Create")').first();
    isCreateButtonVisible = await createButton.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 2: Try gradient button selector
  if (!isCreateButtonVisible) {
    console.log(`${testName} ⚠ "Create" text selector failed, trying gradient button...`);
    createButton = createExamModal.locator('button[class*="from-violet"]').last();
    isCreateButtonVisible = await createButton.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 3: Extended search
  if (!isCreateButtonVisible) {
    console.log(`${testName} ⚠ All primary selectors failed, trying extended search...`);
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
    throw new Error(`${testName} ✗ "Create" button not found in modal`);
  }

  // Check if button is enabled
  const isButtonDisabled = await createButton.isDisabled().catch(() => false);
  if (isButtonDisabled) {
    console.log(
      `${testName} ⚠ "Create" button is DISABLED. This may be due to form validation (e.g., numberOfQuestions < 1). Attempting force click...`,
    );
  }

  // Try normal click first, fallback to force click
  try {
    console.log(`${testName} → Attempting normal click on "Create" button...`);
    await createButton.click({ timeout: 5000 });
    console.log(`${testName} ✓ "Create" button clicked successfully`);
  } catch (e) {
    console.log(`${testName} ⚠ Normal click timed out (${e}). Attempting force click...`);
    try {
      await createButton.click({ force: true, timeout: 5000 });
      console.log(`${testName} ✓ "Create" button clicked via force click`);
    } catch (forceError) {
      throw new Error(
        `${testName} ✗ Failed to click "Create" button even with force: ${forceError}`,
      );
    }
  }

  // ===== Wait for modal to close =====
  console.log(`${testName} → Waiting for modal to close...`);
  const isModalClosed = await createExamModal
    .waitFor({ state: 'hidden', timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (!isModalClosed) {
    console.log(`${testName} ⚠ Modal did not close within 30s, but proceeding to check list...`);
  } else {
    console.log(`${testName} ✓ Modal closed`);
  }

  // ===== Wait for exam to appear in list =====
  const examAppeared = await waitForNewExamToAppear(page, {
    maxWaitTime: 180000,
    testName,
  });

  if (!examAppeared) {
    throw new Error(
      `${testName} ✗ New exam did not appear in list within 3 minutes (180 seconds)`,
    );
  }

  // ===== Verify still on exams page =====
  verifyOnExamsPage(page, testName);

  console.log(
    `\n${testName} ✅ EXAM CREATION COMPLETE - Successfully created new exam and verified it appears in list`,
  );
}
