import { Page } from '@playwright/test';
import { DailyExamLimitError, recoverFromDailyExamLimit } from './account-recovery';
import { waitForHydration } from './hydration';
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

type CreateExamOnceOptions = ExamTimingOptions & {
  /**
   * Deleting exams right before a creation makes the app's exam list lag behind
   * the backend for a while, so the new card can take minutes to render. Give
   * that case a longer budget than a quiet list.
   */
  allowSlowList?: boolean;
};

/**
 * Wait until the exam list has rendered either cards or the explicit empty state.
 * Reading the quota widget instead is unreliable — it can still read x/y while
 * the list is empty (and vice versa).
 */
async function waitForExamListSettled(page: Page, timeout = 20000): Promise<boolean> {
  return page
    .locator('div[data-testid="exam-card"], h3:has-text("No Exams Available")')
    .first()
    .waitFor({ state: 'visible', timeout })
    .then(() => true)
    .catch(() => false);
}

/** Cards whose question generation is still in flight — deleting those is skipped. */
const GENERATING_CARD_BUTTON = 'button:has-text("Generating")';

/**
 * Delete every finished exam on the page, so the daily creation quota starts
 * fresh.
 *
 * The backend caps creation at 3 exams / 24h and refunds the slot when an exam is
 * deleted, so clearing before each creation keeps a long test session below the
 * cap; recycling the account stays as the last resort.
 *
 * Cards that are still `QUESTIONS_GENERATING` are left alone: deleting an exam
 * mid-generation confuses the backend (and the card then keeps its generating
 * state), so only settled cards are removed.
 *
 * Returns how many exams were deleted. Best effort: a card that refuses to
 * delete stops the loop instead of failing the test — creation then hits the
 * quota error path and account recovery takes over.
 */
export async function clearExistingExams(
  page: Page,
  options: ExamTimingOptions & { maxDeletions?: number } = {},
): Promise<number> {
  const { tracker, maxDeletions = 10 } = options;
  const examCards = page.locator('div[data-testid="exam-card"]');
  const deletableCards = examCards.filter({ hasNot: page.locator(GENERATING_CARD_BUTTON) });

  // Wait for the list to settle — cards, or the explicit empty state.
  await waitForExamListSettled(page).catch(() => {});

  const totalCount = await examCards.count().catch(() => 0);
  const initialCount = await deletableCards.count().catch(() => 0);
  const generatingCount = Math.max(totalCount - initialCount, 0);

  if (generatingCount > 0) {
    console.log(`  ℹ ${generatingCount} exam(s) still generating — left untouched`);
  }

  if (initialCount === 0) {
    console.log('  ℹ No finished exams to clear');
    return 0;
  }

  const quotaBefore = await readDailyExamQuota(page);

  console.log(
    `  - Clearing ${initialCount} existing exam(s) to free the daily quota` +
      (quotaBefore ? ` (currently ${quotaBefore.created}/${quotaBefore.max})` : '') +
      '...',
  );

  const startedAt = Date.now();
  // One deletion per card that was on screen. The list is cached server-side, so
  // a deleted card can linger in the DOM and be "deleted" again — capping the
  // loop by the initial count avoids hammering the same exam.
  const target = Math.min(initialCount, maxDeletions);
  let deleted = 0;

  while (deleted < target) {
    const result = await deleteFirstExam(page, { tracker, skipGenerating: true });
    if (!result.success) {
      console.log(`  ⚠ Could not delete an exam (${result.error}), continuing`);
      break;
    }

    deleted++;

    // Stop as soon as the quota is fully refunded — one free slot is not enough
    // for a run that might create more than one exam.
    const quotaNow = await readDailyExamQuota(page);
    if (quotaNow && quotaNow.created === 0) break;

    await page.waitForTimeout(500);
  }

  const quotaAfter = await readDailyExamQuota(page);
  const remainingCount = await examCards.count().catch(() => 0);

  console.log(
    `✓ Cleared ${deleted} exam(s); ${remainingCount} card(s) still rendered` +
      (quotaAfter ? `, quota now ${quotaAfter.created}/${quotaAfter.max}` : ''),
  );

  if (quotaAfter && quotaAfter.created > 0) {
    console.log(
      generatingCount > 0
        ? `  ℹ Quota still ${quotaAfter.created}/${quotaAfter.max}: ${generatingCount} generating exam(s) keep their slot`
        : '  ⚠ Quota not fully refunded — the backend may still refuse a new creation',
    );
  }

  // The deleted cards can stay in the DOM (the list is cached server-side). The
  // creation step counts cards *before* submitting and waits for that count to
  // grow — with a stale card still rendered, the new exam replaces it and the
  // count never grows, so the wait times out even though creation succeeded.
  // A reload here gives the create step a truthful baseline.
  if (deleted > 0) {
    console.log('  - Refreshing the list so the deleted cards are really gone...');
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await waitForHydration(page).catch(() => {});
    await waitForExamListSettled(page).catch(() => {});

    const afterRefresh = await examCards.count().catch(() => 0);
    console.log(`  ℹ ${afterRefresh} card(s) listed after refresh`);
  }

  // The quota widget / CTA revalidate after each delete; give the button a
  // moment to flip back to enabled so the creation flow does not read a stale
  // "disabled" state and mistake it for an exhausted quota.
  if (deleted > 0) {
    const newExamButton = page.locator('button:has-text("New Exam")').first();
    const deadline = Date.now() + 15_000;

    while (Date.now() < deadline) {
      if (await newExamButton.isEnabled().catch(() => false)) break;
      await page.waitForTimeout(500);
    }

    console.log(
      (await newExamButton.isEnabled().catch(() => false))
        ? '✓ "New Exam" button is enabled again'
        : '  ⚠ "New Exam" button still disabled — the quota may not have refreshed yet',
    );
  }

  tracker?.recordDuration('Clear existing exams to free daily quota', Date.now() - startedAt, {
    category: 'system',
    details: `Deleted ${deleted} of ${initialCount} exam(s)` +
      (quotaAfter ? `; quota ${quotaBefore?.created ?? '?'} -> ${quotaAfter.created}` : ''),
    startedAt,
  });

  return deleted;
}

/**
 * Delete the first exam in the list
 * Returns success status and any error message
 *
 * `skipGenerating` ignores cards whose questions are still being generated, so
 * the deletion targets the first *settled* card instead.
 */
export async function deleteFirstExam(
  page: Page,
  options: ExamTimingOptions & { skipGenerating?: boolean } = {},
): Promise<{ success: boolean; error?: string }> {
  const { tracker, skipGenerating = false } = options;
  const deleteStartedAt = Date.now();

  try {
    console.log(
      skipGenerating ? '  - Deleting first finished exam (skipping generating ones)...' : '  - Deleting first exam...',
    );

    const cards = page.locator('div[data-testid="exam-card"]');
    const targetCards = skipGenerating
      ? cards.filter({ hasNot: page.locator(GENERATING_CARD_BUTTON) })
      : cards;
    const deleteButton = targetCards
      .locator('button[data-testid="exam-card-delete-button"]')
      .first();
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
 * Exam ids currently rendered (`Exam #{first 8 chars}` in each card header).
 *
 * Counting cards is not enough: the list is cached server-side, so a deleted card
 * can linger and a newly created exam can replace it, leaving the count
 * unchanged. Comparing ids is immune to that.
 */
async function readExamCardIds(page: Page): Promise<string[]> {
  return page
    .locator('div[data-testid="exam-card"]')
    .evaluateAll((cards) =>
      cards
        .map((card) => (card.textContent || '').match(/Exam #([0-9a-f]{8})/i)?.[1] ?? '')
        .filter(Boolean),
    )
    .catch(() => []);
}

/**
 * Wait for a new exam to appear in the exam list
 * Polls for up to the specified timeout
 *
 * Reloads the page when the list has been stalled for `reloadIntervalMs`:
 * the create call can return 201 before the list endpoint reflects the new
 * exam, and SWR only keeps polling while a generating exam is in the payload —
 * so an early empty response leaves the client cache empty with no further
 * refetch. A reload forces a fresh fetch.
 */
export async function waitForNewExamToAppear(
  page: Page,
  options: {
    maxWaitTime?: number;
    pollInterval?: number;
    tracker?: FlowTimingTracker;
    /** Card count that must be reached. Guards against silently reusing pre-existing cards. */
    minCardCount?: number;
    /** Exam ids already on screen; a card with any other id counts as the new one. */
    excludeExamIds?: string[];
    /** Page reload cadence while the card count does not move. 0 disables reloads. */
    reloadIntervalMs?: number;
    /**
     * Hard cap on reloads. Each reload re-runs the app's auth transition, which
     * calls `/api/auth/login` — rate limited to 10 per 15 minutes per IP. Staying
     * well under that keeps a slow-list run from turning into a login 429.
     */
    maxReloads?: number;
  } = {},
): Promise<boolean> {
  const {
    maxWaitTime = 180000,
    pollInterval = 2000,
    tracker,
    minCardCount = 1,
    excludeExamIds = [],
    reloadIntervalMs = 20000,
    maxReloads = 3,
  } = options;

  console.log(
    `  - Waiting for new exam to appear in list (up to ${maxWaitTime / 1000}s, ` +
      (excludeExamIds.length > 0
        ? `ignoring ${excludeExamIds.length} exam(s) already on screen)...`
        : `need ${minCardCount} card(s))...`),
  );

  const startTime = Date.now();
  let lastReloadAt = startTime;
  let reloads = 0;

  while (Date.now() - startTime < maxWaitTime) {
    const examCards = page.locator('div[data-testid="exam-card"]');
    const cardCount = await examCards.count().catch(() => 0);

    const cardIds = excludeExamIds.length > 0 ? await readExamCardIds(page) : [];
    const newExamId = cardIds.find((id) => !excludeExamIds.includes(id));

    if (newExamId) {
      console.log(`✓ New exam ${newExamId} appeared in the list`);
      tracker?.recordDuration('Wait for exam card to appear after creation', Date.now() - startTime, {
        category: 'polling',
        details: `New exam ${newExamId} rendered (${cardCount} card(s) on screen)`,
        startedAt: startTime,
      });
      return true;
    }

    if (excludeExamIds.length === 0 && cardCount >= minCardCount) {
      console.log(`✓ Exam appeared in list! Found ${cardCount} exam card(s)`);
      tracker?.recordDuration('Wait for exam card to appear after creation', Date.now() - startTime, {
        category: 'polling',
        details: `Exam list returned ${cardCount} card(s)`,
        startedAt: startTime,
      });
      return true;
    }

    if (
      reloadIntervalMs > 0 &&
      reloads < maxReloads &&
      Date.now() - lastReloadAt >= reloadIntervalMs
    ) {
      reloads++;
      console.log(
        `  ⚠ Exam still not listed after ${Math.round((Date.now() - startTime) / 1000)}s, ` +
          `reloading the page (${reloads}/${maxReloads})...`,
      );
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await waitForHydration(page).catch(() => {});
      lastReloadAt = Date.now();
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
 * Clears the exams already on the page first: deleting them refunds the daily
 * creation quota, so a normal run never hits the cap. Recycling the test account
 * (delete → re-register → log in, once) remains the last resort if the cap is
 * still reported as exhausted — see `helpers/account-recovery.ts`.
 * Set `recoverFromDailyLimit: false` (or `E2E_DISABLE_ACCOUNT_RECOVERY=1`) to
 * keep the hard failure instead.
 */
export async function handleExamCreation(
  page: Page,
  options: ExamCreationOptions = {},
): Promise<void> {
  const { recoverFromDailyLimit = process.env.E2E_DISABLE_ACCOUNT_RECOVERY !== '1' } = options;

  console.log('\n  [Pre-step] Freeing the daily exam quota...');
  const clearedExams = await clearExistingExams(page, { tracker: options.tracker });

  try {
    await createExamOnce(page, { ...options, allowSlowList: clearedExams > 0 });
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

async function createExamOnce(page: Page, options: CreateExamOnceOptions = {}): Promise<void> {
  const { tracker, allowSlowList = false } = options;
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

    // Deleting an exam DOES refund the slot, so a full quota at this point means
    // `clearExistingExams` could not remove everything (or the list was stale).
    // Force-clicking the disabled button just opens a dialog the rest of the
    // flow can't drive, and the failure surfaces 3 minutes later as a bogus
    // "exam never became startable" timeout.
    if (quota && quota.created >= quota.max) {
      throw new DailyExamLimitError(
        `Daily exam limit reached (${quota.created}/${quota.max} exams created today) ` +
          'even after deleting the listed exams.',
      );
    }

    // No quota widget: fall back to deleting one exam to free a slot.
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
  // The ids are the real baseline (a stale card can swap out for the new one and
  // leave the count unchanged); the count is kept for the log line.
  const cardsBeforeSubmit = await page
    .locator('div[data-testid="exam-card"]')
    .count()
    .catch(() => 0);
  const knownExamIds = await readExamCardIds(page);

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
    maxWaitTime: allowSlowList ? 240000 : 180000,
    tracker,
    minCardCount: cardsBeforeSubmit + 1,
    excludeExamIds: knownExamIds,
    maxReloads: allowSlowList ? 4 : 3,
  });

  if (!examAppeared) {
    const quotaText = await page
      .locator('text=/daily exam limit|exams created today/i')
      .first()
      .textContent()
      .catch(() => null);

    throw new Error(
      `No NEW exam card appeared within ${allowSlowList ? 240 : 180} seconds. ` +
        `Exam ids before submit: ${knownExamIds.join(', ') || '(none)'}. ` +
        (quotaText
          ? `The account appears to have hit its creation limit (found: "${quotaText.trim()}"). `
          : 'The creation request was likely rejected (rate limit / server error). ') +
        'The account did not get a quota slot — recycle the account or wait for the 24h reset.',
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
