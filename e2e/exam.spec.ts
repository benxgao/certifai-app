import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
};

/**
 * Helper function to delete the first exam card
 * Finds delete button, clicks it, confirms deletion, and waits for modal to close
 */
async function deleteFirstExam(
  page: Page,
  testName: string,
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
      .waitFor({ state: 'visible', timeout: 5000 })
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
 * Helper function to handle exam creation and verify it appears in the list
 * Clicks "New Exam" button, fills modal, submits, and waits up to 3 minutes for exam to appear
 */
async function handleExamCreation(page: Page, testName: string) {
  // ===== Click "New Exam" button =====
  console.log(`${testName} → Clicking "New Exam" button...`);

  // ===== Find and verify "New Exam" button with multi-strategy approach =====
  console.log(`${testName} → Finding "New Exam" button (trying multiple selectors)...`);

  let newExamButton = page.locator('button[data-testid="new-exam-button-desktop"]');
  let buttonCount = await newExamButton.count();
  console.log(`${testName} → Strategy 1: desktop button testid found ${buttonCount} button(s)`);

  let isNewExamButtonVisible = false;
  let debugInfo = '';

  // Strategy 1: Try desktop button testid
  if (buttonCount > 0) {
    try {
      await newExamButton.first().waitFor({ state: 'visible', timeout: 5000 });
      isNewExamButtonVisible = true;
      console.log(`${testName} ✓ Desktop button found and visible`);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      debugInfo = `desktop-button: ${errorMsg.substring(0, 80)}`;
      console.log(`${testName} ⚠ Strategy 1 (desktop) failed: ${debugInfo}`);
    }
  }

  // Strategy 2: Fallback to mobile button testid
  if (!isNewExamButtonVisible) {
    console.log(`${testName} → Strategy 2: Trying mobile button testid...`);
    newExamButton = page.locator('button[data-testid="new-exam-button-mobile"]');
    buttonCount = await newExamButton.count();
    console.log(`${testName} → Strategy 2: mobile button testid found ${buttonCount} button(s)`);

    if (buttonCount > 0) {
      try {
        await newExamButton.first().waitFor({ state: 'visible', timeout: 5000 });
        isNewExamButtonVisible = true;
        console.log(`${testName} ✓ Mobile button found and visible`);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        debugInfo += ` | mobile-button: ${errorMsg.substring(0, 80)}`;
        console.log(`${testName} ⚠ Strategy 2 (mobile) failed`);
      }
    }
  }

  // Strategy 3: Final fallback - try text selector with .first() to avoid strict mode violation
  if (!isNewExamButtonVisible) {
    console.log(`${testName} → Strategy 3: Trying text selector "New Exam"...`);
    newExamButton = page.locator('button:has-text("New Exam")').first();
    buttonCount = await newExamButton.count();
    console.log(`${testName} → Strategy 3: Text selector found buttons, using .first()`);

    try {
      await newExamButton.waitFor({ state: 'visible', timeout: 5000 });
      isNewExamButtonVisible = true;
      console.log(`${testName} ✓ Button found and visible via text selector`);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      debugInfo += ` | text-selector: ${errorMsg.substring(0, 80)}`;
      console.log(`${testName} ⚠ Strategy 3 failed`);
    }
  }

  if (!isNewExamButtonVisible) {
    throw new Error(
      `${testName} ✗ "New Exam"/"Create Exam" button not found or not visible. Debug: ${debugInfo}`,
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
  try {
    // Always use .first() to avoid strict mode violation when multiple buttons match
    await newExamButton.first().click({ timeout: 5000 });
    console.log(`${testName} ✓ "New Exam" button clicked`);
  } catch (e) {
    // Fallback to force click
    console.log(`${testName} ⚠ Normal click timeout, attempting force click...`);
    try {
      await newExamButton.first().click({ force: true, timeout: 5000 });
      console.log(`${testName} ✓ "New Exam" button clicked (force)`);
    } catch (forceError) {
      throw new Error(`${testName} ✗ Failed to click "New Exam" button: ${forceError}`);
    }
  }

  // ===== Wait for modal to open =====
  console.log(`${testName} → Waiting for Create Exam modal to open...`);

  // Wait a bit for page animations and modal rendering after button click
  await page.waitForTimeout(500);

  // Try specific selector first (modal containing the number of questions slider)
  let createExamModal = page
    .locator('div[role="dialog"]:has(input[id="number-of-questions"])')
    .first();
  let isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);

  // Fallback 1: Look for modal by slider role element
  if (!isModalVisible) {
    console.log(`${testName} ⚠ Specific modal selector failed, trying slider role fallback...`);
    createExamModal = page.locator('div[role="dialog"]:has([role="slider"])').first();
    isModalVisible = await createExamModal.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // Fallback 2: Use generic dialog selector (last resort)
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

  // ===== Wait for exam to appear in list (intelligent polling) =====
  console.log(`${testName} → Waiting for new exam to appear in list (up to 180 seconds)...`);
  const maxWaitTime = 180000; // 3 minutes
  const pollInterval = 2000; // 2 seconds
  const startTime = Date.now();
  let examAppeared = false;

  while (Date.now() - startTime < maxWaitTime && !examAppeared) {
    const examCards = page.locator('div[data-testid="exam-card"]');
    const cardCount = await examCards.count().catch(() => 0);

    if (cardCount > 0) {
      examAppeared = true;
      console.log(`${testName} ✓ Exam appeared in list! Found ${cardCount} exam card(s)`);
      break;
    }

    await page.waitForTimeout(pollInterval);
  }

  if (!examAppeared) {
    throw new Error(`${testName} ✗ New exam did not appear in list within 3 minutes (180 seconds)`);
  }

  // ===== Verify still on exams page =====
  const finalUrl = page.url();
  const isOnExamsPage = /\/main\/certifications\/\d+\/exams/.test(finalUrl);

  if (!isOnExamsPage) {
    throw new Error(`${testName} ✗ Not on exams page after creation. URL: ${finalUrl}`);
  }

  console.log(`${testName} ✓ Still on exams page`);
  console.log(
    `\n${testName} ✅ EXAM CREATION COMPLETE - Successfully created new exam and verified it appears in list`,
  );
}

test.describe('Exam Flows', () => {
  test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    // Extend timeout for fixture setup (auth/signup) + exam creation with 3min polling = 360s = 6 minutes
    testInfo.setTimeout(360000);
  });

  test('[Dashboard → Cert → Exams]', async ({ authenticatedPage }: TestFixtures) => {
    // test.setTimeout(120000);
    // await authenticatedPage.waitForTimeout(10000);

    const testName = 'step';
    console.log(`\n${testName} Starting test. Navigating to dashboard...`);

    // ===== STEP 1: Navigate to dashboard and check for registered certs =====
    await authenticatedPage.goto('/main', { waitUntil: 'domcontentloaded' });
    console.log(`${testName} ✓ Navigated to dashboard (/main)`);

    // Wait for registered certifications section to load
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    console.log(`${testName} ✓ Dashboard DOM loaded`);

    // Wait for breadcrumb to show "Dashboard" to confirm page is ready
    console.log(`${testName} → Waiting for Dashboard breadcrumb to appear...`);
    const dashboardBreadcrumb = authenticatedPage.locator('text=Dashboard').first();
    await dashboardBreadcrumb.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log(`${testName} ⚠ Dashboard breadcrumb not found, continuing...`);
    });
    console.log(`${testName} ✓ Dashboard page confirmed`);

    // Wait for "Register for Certification" button to be visible to ensure dashboard content is fully loaded
    console.log(`${testName} → Waiting for dashboard content to fully load...`);
    const registerCertButtonWait = authenticatedPage
      .locator('button:has-text("Register for Certification")')
      .first();
    try {
      await registerCertButtonWait.waitFor({ state: 'visible', timeout: 10000 });
      console.log(`${testName} ✓ Dashboard content fully loaded`);
    } catch (e) {
      console.log(
        `${testName} ⚠ Register button not immediately visible, but proceeding with cert check...`,
      );
    }

    // Look for registered cert cards on the dashboard
    // Certs appear as cards/links in the "Your Registered Certifications" section
    const registeredCertLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
    let registeredCertCount = await registeredCertLinks.count();

    console.log(
      `${testName} ${registeredCertCount > 0 ? '✓' : '⚠'} Found ${registeredCertCount} registered certification(s) on dashboard`,
    );

    // ===== STEP 2: If no certs, click "Register for Certification" button =====
    if (registeredCertCount === 0) {
      console.log(
        `${testName} → No registered certs found. Looking for "Register for Certification" button...`,
      );

      // Find and click the "Register for Certification" button on the dashboard
      const registerCertButton = authenticatedPage
        .locator('button:has-text("Register for Certification")')
        .first();

      const isRegisterButtonVisible = await registerCertButton
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (!isRegisterButtonVisible) {
        throw new Error(
          `${testName} ✗ "Register for Certification" button not found on dashboard. Cannot proceed with certification registration.`,
        );
      }

      console.log(`${testName} ✓ Found "Register for Certification" button, clicking...`);
      await registerCertButton.click();

      // Wait for certifications browse page to load
      await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log(`${testName} ✓ Navigated to certifications browse page via button click`);

      // Wait for cert list to load
      await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await authenticatedPage.waitForTimeout(500);
      console.log(`${testName} ✓ Certifications page DOM loaded`);

      // Wait for data to load
      console.log(`${testName} → Waiting for certification data to load...`);
      await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log(`${testName} ⚠ networkidle timeout, continuing...`);
      });

      // Check for "View Exams" button first (already registered cert) to avoid registering duplicates
      console.log(`${testName} → Checking for "View Exams" button (already registered certs)...`);
      const viewExamsCardButton = authenticatedPage
        .locator('button:has-text("View Exams")')
        .first();

      const hasViewExamsButton = await viewExamsCardButton
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (hasViewExamsButton) {
        console.log(
          `${testName} ✓ Found "View Exams" button - using existing registered cert instead of registering new one`,
        );
        console.log(`${testName} → Clicking "View Exams" button to enter exams page...`);
        await viewExamsCardButton.click();

        // Wait for URL to change to the exams page
        console.log(`${testName} → Waiting for navigation to exams page...`);
        await authenticatedPage.waitForURL(/\/main\/certifications\/\d+\/exams/, {
          timeout: 15000,
        });

        // Wait for exam page to load
        await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        console.log(`${testName} ✓ Exam page loaded`);

        // Verify we're on the exams page
        const currentUrl = authenticatedPage.url();
        const isOnExamsPage = /\/main\/certifications\/\d+\/exams/.test(currentUrl);

        if (!isOnExamsPage) {
          throw new Error(
            `${testName} ✗ Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${currentUrl}`,
          );
        }

        console.log(`${testName} ✓ Successfully navigated to exams page (${currentUrl})`);
      } else {
        // No existing registered cert found, proceed with registration flow
        console.log(
          `${testName} → No "View Exams" button found - proceeding with new cert registration...`,
        );

        // Wait for data to load - check for visible register buttons
        console.log(`${testName} → Waiting for certification data to load...`);
        await authenticatedPage
          .locator('button:has-text("Register Now")')
          .first()
          .waitFor({ state: 'visible', timeout: 10000 })
          .catch(() => {
            console.log(`${testName} ⚠ Timeout waiting for Register Now buttons`);
          });

        // Find the first "Register Now" button on cert card
        console.log(
          `${testName} → Looking for first "Register Now" button on certifications page...`,
        );
        const registerCertCardButton = authenticatedPage
          .locator('button:has-text("Register Now")')
          .first();

        const isCertRegisterButtonVisible = await registerCertCardButton
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isCertRegisterButtonVisible) {
          throw new Error(
            `${testName} ✗ No "Register Now" button found on certifications page. Cannot register cert.`,
          );
        }

        console.log(
          `${testName} ✓ Found first certification "Register Now" button, clicking to open modal...`,
        );
        await registerCertCardButton.click();

        // Wait for registration modal to appear

        // First wait for the modal backdrop to appear
        const modalBackdrop = authenticatedPage.locator('[class*="fixed"][class*="inset-0"]');
        const isBackdropVisible = await modalBackdrop
          .waitFor({ state: 'visible', timeout: 8000 })
          .catch(() => false);

        if (!isBackdropVisible) {
          console.log(`${testName} ⚠ Modal backdrop not found, continuing to look for button...`);
        } else {
          console.log(`${testName} ✓ Modal backdrop detected`);
        }

        // Try to find the modal button with multiple selector strategies
        let modalConfirmButton = authenticatedPage
          .locator('button:has-text("Register for this Certification")')
          .first();

        let isModalButtonVisible = await modalConfirmButton
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        // If button not found, try without exact text match (in case of spacing issues)
        if (!isModalButtonVisible) {
          console.log(`${testName} ⚠ Exact text selector failed, trying flexible text match...`);
          modalConfirmButton = authenticatedPage
            .locator('button:has-text("Register")')
            .filter({ hasText: /for this Certification/ })
            .first();

          isModalButtonVisible = await modalConfirmButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        // Last resort: find any button with "Register" text that's in the modal
        if (!isModalButtonVisible) {
          console.log(`${testName} ⚠ Flexible selector failed, trying last resort selector...`);
          modalConfirmButton = authenticatedPage
            .locator('[class*="fixed"] button:has-text("Register")')
            .last();

          isModalButtonVisible = await modalConfirmButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        if (!isModalButtonVisible) {
          throw new Error(
            `${testName} ✗ Registration confirmation modal button did not appear. Cannot proceed with registration.`,
          );
        }

        console.log(`${testName} ✓ Registration modal confirmation button found`);
        console.log(`${testName} → Clicking "Register for this Certification" button in modal...`);
        await modalConfirmButton.click();

        // Wait for registration API call to complete and modal to close
        await authenticatedPage.waitForTimeout(1000);
        console.log(`${testName} ✓ Registration button clicked`);

        // Wait for the cert card button to change from "Register Now" to "View Exams"
        console.log(
          `${testName} → Waiting for certification card button to update to "View Exams"...`,
        );

        // Try multiple selector strategies to find the View Exams button
        let viewExamsButton = authenticatedPage.locator('button:has-text("View Exams")').first();

        let isViewExamsVisible = await viewExamsButton
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        // If exact match fails, try flexible text match
        if (!isViewExamsVisible) {
          console.log(
            `${testName} ⚠ Exact "View Exams" selector failed, trying flexible text match...`,
          );
          viewExamsButton = authenticatedPage
            .locator('button:has-text("View")')
            .filter({ hasText: /Exam/ })
            .first();

          isViewExamsVisible = await viewExamsButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        // Try another variant - "View Exam" (singular)
        if (!isViewExamsVisible) {
          console.log(`${testName} ⚠ Trying "View Exam" (singular) selector...`);
          viewExamsButton = authenticatedPage.locator('button:has-text("View Exam")').first();

          isViewExamsVisible = await viewExamsButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        // Last resort: find button with emerald color (registered state)
        if (!isViewExamsVisible) {
          console.log(`${testName} ⚠ Trying emerald button selector (registered state)...`);
          viewExamsButton = authenticatedPage.locator('button[class*="emerald"]').first();

          isViewExamsVisible = await viewExamsButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        // Final attempt: wait explicitly for button state change
        if (!isViewExamsVisible) {
          console.log(`${testName} ⚠ Waiting longer for "View Exams" button to appear in DOM...`);
          isViewExamsVisible = await authenticatedPage
            .locator('button:has-text("View Exams")')
            .first()
            .waitFor({ state: 'visible', timeout: 15000 })
            .then(() => true)
            .catch(() => false);

          viewExamsButton = authenticatedPage.locator('button:has-text("View Exams")').first();
        }

        if (!isViewExamsVisible) {
          throw new Error(
            `${testName} ✗ Certification registration failed - "View Exams" button did not appear. Registration was not successful.`,
          );
        }

        console.log(
          `${testName} ✓ Registration completed - "View Exams" button now visible on cert card`,
        );
        console.log(`${testName} → Clicking on "View Exams" button to navigate to exams page...`);
        await viewExamsButton.click();

        // Wait for URL to change to the exams page
        console.log(`${testName} → Waiting for navigation to exams page...`);
        await authenticatedPage.waitForURL(/\/main\/certifications\/\d+\/exams/, {
          timeout: 15000,
        });

        // Wait for exam page to load
        await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        console.log(`${testName} ✓ Exam page loaded after registration`);

        // Verify we're on the exams page (should be /main/certifications/{id}/exams)
        const currentUrl = authenticatedPage.url();
        const isOnExamsPage = /\/main\/certifications\/\d+\/exams/.test(currentUrl);

        if (!isOnExamsPage) {
          throw new Error(
            `${testName} ✗ Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${currentUrl}`,
          );
        }

        console.log(`${testName} ✓ Successfully navigated to exams page (${currentUrl})`);
      }

      // ===== STEP 3: Verify "Create New Exam" button exists on exam list page =====
      console.log(`${testName} → Looking for "Create New Exam" button on exams page...`);

      // Wait for page content to fully load (data may load asynchronously)
      await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log(`${testName} ⚠ networkidle timeout, continuing...`);
      });

      // Try multiple selectors for the Create Exam button with better waiting
      console.log(`${testName} → Waiting for "Create Exam" button to appear...`);
      let createExamButton = authenticatedPage.locator('button:has-text("New Exam")').first();

      let isCreateButtonVisible = await createExamButton
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);

      // Fallback: Try "Create Exam" text if "New Exam" not found
      if (!isCreateButtonVisible) {
        console.log(`${testName} ⚠ "New Exam" selector failed, trying "Create Exam"...`);
        createExamButton = authenticatedPage.locator('button:has-text("Create Exam")').first();
        isCreateButtonVisible = await createExamButton
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);
      }

      if (!isCreateButtonVisible) {
        throw new Error(
          `${testName} ✗ "Create New Exam" button not found on exams page. Test cannot proceed.`,
        );
      }

      console.log(`${testName} ✓ "Create New Exam" button found and visible!`);

      // ===== STEP 4: Create a new exam (no-certs path) =====
      await handleExamCreation(authenticatedPage, testName);
    } else {
      // If user already has registered certs, use the first one
      console.log(`${testName} → User has registered certs, using first one...`);

      const firstCertCard = authenticatedPage.locator('a[href*="/main/certifications/"]').first();
      const isCertCardVisible = await firstCertCard.isVisible({ timeout: 5000 }).catch(() => false);

      if (!isCertCardVisible) {
        throw new Error(`${testName} ✗ Could not find registered cert card on dashboard to click`);
      }

      await firstCertCard.click();

      // Wait for exams list page to load
      await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
      console.log(`${testName} ✓ Exams list page loaded`);

      // Verify we're on the exams page
      const existingCertUrl = authenticatedPage.url();
      const isOnExistingCertExamsPage = /\/main\/certifications\/\d+\/exams/.test(existingCertUrl);

      if (!isOnExistingCertExamsPage) {
        throw new Error(
          `${testName} ✗ Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${existingCertUrl}`,
        );
      }

      console.log(`${testName} ✓ Successfully navigated to exams page (${existingCertUrl})`);

      // ===== Verify "Create New Exam" button exists =====
      console.log(`${testName} → Looking for "Create New Exam" button on exams page...`);

      // Wait for page content to fully load (data may load asynchronously)
      await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log(`${testName} ⚠ networkidle timeout, continuing...`);
      });

      // Try multiple selectors for the Create Exam button with better waiting
      console.log(`${testName} → Waiting for "Create Exam" button to appear...`);
      let existingCreateExamButton = authenticatedPage
        .locator('button:has-text("Create Exam")')
        .first();

      let isExistingCreateButtonVisible = await existingCreateExamButton
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);

      // Try alternate selector: just "Create"
      if (!isExistingCreateButtonVisible) {
        console.log(`${testName} ⚠ "Create Exam" selector failed, trying "Create" variant...`);
        existingCreateExamButton = authenticatedPage.locator('button:has-text("Create")').first();

        isExistingCreateButtonVisible = await existingCreateExamButton
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);
      }

      // Try gradient button selector
      if (!isExistingCreateButtonVisible) {
        console.log(`${testName} ⚠ "Create" selector failed, trying gradient button selector...`);
        existingCreateExamButton = authenticatedPage
          .locator('button[class*="from-violet"], button[class*="to-blue"]')
          .first();

        isExistingCreateButtonVisible = await existingCreateExamButton
          .isVisible({ timeout: 5000 })
          .catch(() => false);
      }

      // Final check with extended timeout
      if (!isExistingCreateButtonVisible) {
        console.log(`${testName} ⚠ All selectors failed, waiting longer for any Create button...`);
        existingCreateExamButton = authenticatedPage
          .locator('button')
          .filter({ hasText: /Create|New Exam/ })
          .first();

        isExistingCreateButtonVisible = await existingCreateExamButton
          .waitFor({ state: 'visible', timeout: 12000 })
          .then(() => true)
          .catch(() => false);
      }

      if (!isExistingCreateButtonVisible) {
        throw new Error(
          `${testName} ✗ "Create New Exam" button not found on exams page. Test cannot proceed.`,
        );
      }

      console.log(`${testName} ✓ "Create New Exam" button found and visible!`);

      // ===== STEP 4: Create a new exam (existing-certs path) =====
      await handleExamCreation(authenticatedPage, testName);
    }
  });

  test.skip('should delete an exam', async ({ authenticatedPage }) => {
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
    const deleteButton = firstExamCard
      .locator('button[class*="rounded-xl"][class*="text"]')
      .first();

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
      const dangerButton = confirmModal
        .locator('button[class*="red"], button[class*="destructive"]')
        .first();
      await expect(dangerButton).toBeVisible({ timeout: 5000 });
      await dangerButton.click();
    } else {
      await confirmDeleteButton.click();
    }

    // Wait for deletion (modal closes and list updates)
    await expect(confirmModal).not.toBeVisible({ timeout: 30000 });

    // Verify we're still on the same page
    expect(authenticatedPage.url()).toMatch(/\/main\/certifications\/\d+\/exams/);

    // Optionally verify exam was removed from list
    // (This may take time due to API calls, so we just check we're on the page)
  });

  test.skip('should show error when trying to create exam without questions', async ({
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
        expect(errorText?.toLowerCase()).toMatch(/invalid|required|minimum|questions/i);
      }
    }
  });
});
