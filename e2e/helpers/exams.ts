import { Page } from '@playwright/test';
import { DailyExamLimitError, recoverFromDailyExamLimit } from './account-recovery';
import { FlowTimingTracker } from './performance';
import { readDailyExamQuota } from './quota';

export { readDailyExamQuota };

type ExamTimingOptions = {
  tracker?: FlowTimingTracker;
};

export type ExamCreationOptions = ExamTimingOptions & {
  /** Recycle the test account when the daily cap is hit. Defaults to true. */
  recoverFromDailyLimit?: boolean;
};

/**
 * Delete the first exam in the list
 * Returns success status and any error message
 */
export async function deleteFirstExam(
  page: Page,
  options: ExamTimingOptions = {},
): Promise<{ success: boolean; error?: string }> {
  const { tracker } = options;
  const deleteStartedAt = Date.now();

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

    tracker?.recordDuration('Delete existing exam for quota recovery', Date.now() - deleteStartedAt, {
      category: 'system',
      details: 'Removed the first exam card to free daily exam quota',
      startedAt: deleteStartedAt,
    });

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    tracker?.recordDuration('Delete existing exam for quota recovery', Date.now() - deleteStartedAt, {
      category: 'system',
      details: errorMsg,
      status: 'failed',
      startedAt: deleteStartedAt,
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Wait for a new exam to appear in the exam list
 * Polls for up to the specified timeout
 */
export async function waitForNewExamToAppear(
  page: Page,
  options: {
    maxWaitTime?: number;
    pollInterval?: number;
    tracker?: FlowTimingTracker;
    /** Card count that must be reached. Guards against silently reusing pre-existing cards. */
    minCardCount?: number;
  } = {},
): Promise<boolean> {
  const { maxWaitTime = 180000, pollInterval = 2000, tracker, minCardCount = 1 } = options;

  console.log(
    `  - Waiting for new exam to appear in list (up to ${maxWaitTime / 1000}s, need ${minCardCount} card(s))...`,
  );

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const examCards = page.locator('div[data-testid="exam-card"]');
    const cardCount = await examCards.count().catch(() => 0);

    if (cardCount >= minCardCount) {
      console.log(`✓ Exam appeared in list! Found ${cardCount} exam card(s)`);
      tracker?.recordDuration('Wait for exam card to appear after creation', Date.now() - startTime, {
        category: 'polling',
        details: `Exam list returned ${cardCount} card(s)`,
        startedAt: startTime,
      });
      return true;
    }

    await page.waitForTimeout(pollInterval);
  }

  tracker?.recordDuration('Wait for exam card to appear after creation', Date.now() - startTime, {
    category: 'polling',
    details: `Timed out after ${maxWaitTime / 1000}s of polling`,
    status: 'failed',
    startedAt: startTime,
  });

  return false;
}

/**
 * Verify we're on the exams page (URL check)
 */
export function verifyOnExamsPage(page: Page): boolean {
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
 *
 * When the account has exhausted its daily creation cap (see
 * `DEFAULT_MAX_EXAMS_PER_24_HOURS` = 3 in src/lib/rateLimitUtils.ts) the helper
 * recycles the test account once — delete → re-register → log in — and retries,
 * so a long test session is never blocked on a quota that only resets after 24h.
 * Set `recoverFromDailyLimit: false` (or `E2E_DISABLE_ACCOUNT_RECOVERY=1`) to
 * keep the hard failure instead.
 */
export async function handleExamCreation(
  page: Page,
  options: ExamCreationOptions = {},
): Promise<void> {
  const { recoverFromDailyLimit = process.env.E2E_DISABLE_ACCOUNT_RECOVERY !== '1' } = options;

  try {
    await createExamOnce(page, options);
    return;
  } catch (error) {
    if (!(error instanceof DailyExamLimitError) || !recoverFromDailyLimit) {
      throw error;
    }

    console.log(`\n  ⚠ ${error.message}`);
  }

  await recoverFromDailyExamLimit(page, {
    tracker: options.tracker,
    reason: 'daily exam limit reached while creating an exam',
  });

  console.log('  - Retrying exam creation on the freshly registered account...');

  try {
    await createExamOnce(page, options);
  } catch (error) {
    if (error instanceof DailyExamLimitError) {
      throw new DailyExamLimitError(
        `Daily exam limit is still exhausted right after account recovery — the new account did not receive a fresh quota. ${error.message}`,
      );
    }
    throw error;
  }
}

async function createExamOnce(page: Page, options: ExamTimingOptions = {}): Promise<void> {
  const { tracker } = options;
  const creationStartedAt = Date.now();

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
    console.log('  ⚠ "New Exam" button is DISABLED');

    const quota = await readDailyExamQuota(page);
    if (quota) {
      console.log(`  ℹ Daily exam quota: ${quota.created}/${quota.max}`);
    }

    // The backend limit counts exams CREATED today, so deleting an existing exam
    // does NOT restore it. Force-clicking the disabled button just opens a
    // dialog the rest of the flow can't drive, and the failure surfaces 3
    // minutes later as a bogus "exam never became startable" timeout.
    if (quota && quota.created >= quota.max) {
      throw new DailyExamLimitError(
        `Daily exam limit reached (${quota.created}/${quota.max} exams created today). ` +
          'Deleting an exam does not restore this quota.',
      );
    }

    console.log('  - Attempting to delete an exam to free up quota...');
    const deleteResult = await deleteFirstExam(page, { tracker });

    if (deleteResult.success) {
      console.log('✓ Exam deleted, quota freed');
      await page.waitForTimeout(1000);
    } else {
      console.log(`  ⚠ Delete failed: ${deleteResult.error}, attempting to click "New Exam" anyway...`);
    }
  }

  console.log('  - Attempting to click "New Exam" button...');
  const modalOpenStartedAt = Date.now();

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
  tracker?.recordDuration('Open create exam modal', Date.now() - modalOpenStartedAt, {
    category: 'action',
    details: 'From clicking the New Exam button until the create modal became visible',
    startedAt: modalOpenStartedAt,
  });

  console.log('  - Clicking "Create" button in modal...');
  const submitStartedAt = Date.now();

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

  // Baseline before submitting: creation must ADD a card. Without this, a
  // rejected request (e.g. 429 daily exam limit) silently "passes" because the
  // list already contains older exams, and the caller then waits on a stale card.
  const cardsBeforeSubmit = await page
    .locator('div[data-testid="exam-card"]')
    .count()
    .catch(() => 0);

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
    tracker?.recordDuration('Submit exam creation request', Date.now() - submitStartedAt, {
      category: 'system',
      details: 'Create request sent but modal close was not observed within 30 seconds',
      startedAt: submitStartedAt,
    });
  } else {
    console.log('✓ Modal closed');
    tracker?.recordDuration('Submit exam creation request', Date.now() - submitStartedAt, {
      category: 'system',
      details: 'From clicking Create until the modal closed',
      startedAt: submitStartedAt,
    });
  }

  // Fail fast when the backend explicitly rejected the request (e.g. 429 daily
  // exam limit). Polling 3 minutes on a list that can never grow hides the cause.
  const rejectionToast = page
    .locator('text=/Exam creation limit reached|maximum \\d+ exams allowed/i')
    .first();
  const rejected = await rejectionToast
    .waitFor({ state: 'visible', timeout: 8000 })
    .then(() => true)
    .catch(() => false);

  if (rejected) {
    const cardsAfter = await page
      .locator('div[data-testid="exam-card"]')
      .count()
      .catch(() => cardsBeforeSubmit);

    if (cardsAfter <= cardsBeforeSubmit) {
      const toastText = (await rejectionToast.textContent().catch(() => ''))?.trim();
      throw new DailyExamLimitError(
        `Exam creation was rejected by the backend${toastText ? `: "${toastText}"` : ''}. ` +
          'The test account has reached its daily exam limit.',
      );
    }
  }

  const examAppeared = await waitForNewExamToAppear(page, {
    maxWaitTime: 180000,
    tracker,
    minCardCount: cardsBeforeSubmit + 1,
  });

  if (!examAppeared) {
    const quotaText = await page
      .locator('text=/daily exam limit|exams created today/i')
      .first()
      .textContent()
      .catch(() => null);

    throw new Error(
      'No NEW exam card appeared within 3 minutes (180 seconds). ' +
        `Cards before submit: ${cardsBeforeSubmit}. ` +
        (quotaText
          ? `The account appears to have hit its creation limit (found: "${quotaText.trim()}"). `
          : 'The creation request was likely rejected (rate limit / server error). ') +
        'Deleting an exam does not restore the daily quota — the account must be recycled or the reset awaited.',
    );
  }

  verifyOnExamsPage(page);

  tracker?.recordDuration('Complete exam creation helper', Date.now() - creationStartedAt, {
    category: 'system',
    details: 'Covers modal open, submit, backend processing, and exam card appearance',
    startedAt: creationStartedAt,
  });

  console.log('\n✅ EXAM CREATION COMPLETE — Successfully created new exam and verified it appears in list');
}
