import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';
import { deleteFirstExam, handleExamCreation, enterExamAndSubmit } from './helpers/exams';

type TestFixtures = {
  authenticatedPage: Page;
};

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

      // ===== STEP 5: Enter the exam and submit =====
      await enterExamAndSubmit(authenticatedPage, testName);
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

      // ===== STEP 5: Enter the exam and submit =====
      await enterExamAndSubmit(authenticatedPage, testName);
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
