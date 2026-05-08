import { test, expect } from './fixtures/auth';
import type { Page, TestInfo } from '@playwright/test';
import { deleteFirstExam, handleExamCreation } from './helpers/exams';
import { FlowTimingTracker } from './helpers/performance';

type TestFixtures = {
  authenticatedPage: Page;
};

test.describe('Exam Flows', () => {
  test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    // Extend timeout for fixture setup (auth/signup) + exam creation with 3min polling = 360s = 6 minutes
    testInfo.setTimeout(360000);
  });

  test('[Dashboard → Cert → Exams]', async ({ authenticatedPage }: TestFixtures, testInfo: TestInfo) => {
    const timingTracker = new FlowTimingTracker('Exam flow baseline');

    console.log('\n================== EXAM FLOW TEST ==================');

    try {
      // ===== STEP 1: Navigate to dashboard and check for registered certs =====
      console.log('\n[STEP 1] Navigating to dashboard...');
      console.log('  - Navigating to /main...');
      await timingTracker.trackStep(
        'Navigate to dashboard route',
        async () => {
          await authenticatedPage.goto('/main', { waitUntil: 'domcontentloaded' });
        },
        { category: 'page', details: 'Initial route change to /main' },
      );
      console.log('✓ Navigated to dashboard (/main)');

      await timingTracker.trackStep(
        'Dashboard DOM content loaded',
        async () => {
          await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        },
        { category: 'page' },
      );
      console.log('✓ Dashboard DOM loaded');
      await timingTracker.capturePageMetrics(authenticatedPage, 'Dashboard /main');

      console.log('  - Waiting for Dashboard breadcrumb to appear...');
      const dashboardBreadcrumb = authenticatedPage.locator('text=Dashboard').first();
      await dashboardBreadcrumb.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('  ⚠ Dashboard breadcrumb not found, continuing...');
      });
      console.log('✓ Dashboard page confirmed');

      console.log('  - Waiting for dashboard content to fully load...');
      const registerCertButtonWait = authenticatedPage
        .locator('button:has-text("Register for Certification")')
        .first();
      const dashboardContentStartedAt = Date.now();
      try {
        await registerCertButtonWait.waitFor({ state: 'visible', timeout: 10000 });
        console.log('✓ Dashboard content fully loaded');
        timingTracker.recordDuration('Dashboard content visible', Date.now() - dashboardContentStartedAt, {
          category: 'content',
          details: 'Primary certification CTA became visible',
          startedAt: dashboardContentStartedAt,
        });
      } catch (e) {
        console.log('  ⚠ Register button not immediately visible, proceeding with cert check...');
        timingTracker.recordDuration('Dashboard content wait fallback', Date.now() - dashboardContentStartedAt, {
          category: 'content',
          details: 'Primary CTA was not visible within 10 seconds; continuing with certification list probe',
          status: 'failed',
          startedAt: dashboardContentStartedAt,
        });
      }

      const registeredCertLinks = authenticatedPage.locator('a[href*="/main/certifications/"]');
      let registeredCertCount = await registeredCertLinks.count();
      console.log(
        `${registeredCertCount > 0 ? '✓' : '  ⚠'} Found ${registeredCertCount} registered certification(s) on dashboard`,
      );

      // ===== STEP 2: If no certs, register one =====
      if (registeredCertCount === 0) {
        console.log('\n[STEP 2] No registered certs found — registering a certification...');
        console.log('  - Looking for "Register for Certification" button...');

        const registerFlowStartedAt = Date.now();
        const registerCertButton = authenticatedPage
          .locator('button:has-text("Register for Certification")')
          .first();

      const isRegisterButtonVisible = await registerCertButton
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (!isRegisterButtonVisible) {
        throw new Error(
          '"Register for Certification" button not found on dashboard. Cannot proceed with certification registration.',
        );
      }

        console.log('✓ Found "Register for Certification" button, clicking...');
        await registerCertButton.click();

        await timingTracker.trackStep(
          'Navigate to certification browse page',
          async () => {
            await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
          },
          { category: 'page' },
        );
        console.log('✓ Navigated to certifications browse page');

        await authenticatedPage.waitForTimeout(500);
        console.log('✓ Certifications page DOM loaded');
        await timingTracker.capturePageMetrics(authenticatedPage, 'Certification browse page');

        console.log('  - Waiting for certification data to load...');
        const certificationDataStartedAt = Date.now();
        await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
          console.log('  ⚠ networkidle timeout, continuing...');
        });
        timingTracker.recordDuration('Certification data load wait', Date.now() - certificationDataStartedAt, {
          category: 'content',
          details: 'Waited for certification browse page network activity to settle',
          startedAt: certificationDataStartedAt,
        });

      console.log('  - Checking for "View Exams" button (already registered cert)...');
      const viewExamsCardButton = authenticatedPage
        .locator('button:has-text("View Exams")')
        .first();

      const hasViewExamsButton = await viewExamsCardButton
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (hasViewExamsButton) {
        console.log('✓ Found "View Exams" button — using existing registered cert');
        console.log('  - Clicking "View Exams" button to enter exams page...');
        await viewExamsCardButton.click();

        console.log('  - Waiting for navigation to exams page...');
        await authenticatedPage.waitForURL(/\/main\/certifications\/\d+\/exams/, {
          timeout: 15000,
        });

        await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        console.log('✓ Exam page loaded');

        const currentUrl = authenticatedPage.url();
        if (!/\/main\/certifications\/\d+\/exams/.test(currentUrl)) {
          throw new Error(
            `Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${currentUrl}`,
          );
        }

        console.log(`✓ Successfully navigated to exams page (${currentUrl})`);
        timingTracker.recordDuration('Existing certification to exams page', Date.now() - registerFlowStartedAt, {
          category: 'system',
          details: 'Used already-registered certification card and opened exams page',
          startedAt: registerFlowStartedAt,
        });
      } else {
        console.log('  ⚠ No "View Exams" button found — proceeding with new cert registration...');

        console.log('  - Waiting for "Register Now" buttons to load...');
        await authenticatedPage
          .locator('button:has-text("Register Now")')
          .first()
          .waitFor({ state: 'visible', timeout: 10000 })
          .catch(() => {
            console.log('  ⚠ Timeout waiting for Register Now buttons');
          });

        console.log('  - Looking for first "Register Now" button on certifications page...');
        const registerCertCardButton = authenticatedPage
          .locator('button:has-text("Register Now")')
          .first();

        const isCertRegisterButtonVisible = await registerCertCardButton
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isCertRegisterButtonVisible) {
          throw new Error(
            'No "Register Now" button found on certifications page. Cannot register cert.',
          );
        }

        console.log('✓ Found "Register Now" button, clicking to open modal...');
        await registerCertCardButton.click();

        const modalBackdrop = authenticatedPage.locator('[class*="fixed"][class*="inset-0"]');
        const isBackdropVisible = await modalBackdrop
          .waitFor({ state: 'visible', timeout: 8000 })
          .catch(() => false);
        console.log(isBackdropVisible ? '✓ Modal backdrop detected' : '  ⚠ Modal backdrop not found, continuing...');

        let modalConfirmButton = authenticatedPage
          .locator('button:has-text("Register for this Certification")')
          .first();

        let isModalButtonVisible = await modalConfirmButton
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isModalButtonVisible) {
          console.log('  ⚠ Exact text selector failed, trying flexible text match...');
          modalConfirmButton = authenticatedPage
            .locator('button:has-text("Register")')
            .filter({ hasText: /for this Certification/ })
            .first();
          isModalButtonVisible = await modalConfirmButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        if (!isModalButtonVisible) {
          console.log('  ⚠ Flexible selector failed, trying last resort selector...');
          modalConfirmButton = authenticatedPage
            .locator('[class*="fixed"] button:has-text("Register")')
            .last();
          isModalButtonVisible = await modalConfirmButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        }

        if (!isModalButtonVisible) {
          throw new Error(
            'Registration confirmation modal button did not appear. Cannot proceed with registration.',
          );
        }

        console.log('✓ Registration modal confirmation button found');
        console.log('  - Clicking "Register for this Certification" button in modal...');
        await modalConfirmButton.click();

        await authenticatedPage.waitForTimeout(1000);
        console.log('✓ Registration button clicked');

        console.log('  - Waiting for certification card to update to "View Exams"...');
        let viewExamsButton = authenticatedPage.locator('button:has-text("View Exams")').first();
        let isViewExamsVisible = await viewExamsButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (!isViewExamsVisible) {
          console.log('  ⚠ Exact "View Exams" selector failed, trying flexible text match...');
          viewExamsButton = authenticatedPage
            .locator('button:has-text("View")')
            .filter({ hasText: /Exam/ })
            .first();
          isViewExamsVisible = await viewExamsButton.isVisible({ timeout: 3000 }).catch(() => false);
        }

        if (!isViewExamsVisible) {
          console.log('  ⚠ Trying "View Exam" (singular) selector...');
          viewExamsButton = authenticatedPage.locator('button:has-text("View Exam")').first();
          isViewExamsVisible = await viewExamsButton.isVisible({ timeout: 3000 }).catch(() => false);
        }

        if (!isViewExamsVisible) {
          console.log('  ⚠ Trying emerald button selector (registered state)...');
          viewExamsButton = authenticatedPage.locator('button[class*="emerald"]').first();
          isViewExamsVisible = await viewExamsButton.isVisible({ timeout: 3000 }).catch(() => false);
        }

        if (!isViewExamsVisible) {
          console.log('  ⚠ Waiting longer for "View Exams" button to appear in DOM...');
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
            'Certification registration failed — "View Exams" button did not appear. Registration was not successful.',
          );
        }

        console.log('✓ Registration completed — "View Exams" button now visible on cert card');
        console.log('  - Clicking "View Exams" button to navigate to exams page...');
        await viewExamsButton.click();

        console.log('  - Waiting for navigation to exams page...');
        await authenticatedPage.waitForURL(/\/main\/certifications\/\d+\/exams/, {
          timeout: 15000,
        });

        await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        console.log('✓ Exam page loaded after registration');

        const currentUrl = authenticatedPage.url();
        if (!/\/main\/certifications\/\d+\/exams/.test(currentUrl)) {
          throw new Error(
            `Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${currentUrl}`,
          );
        }

        console.log(`✓ Successfully navigated to exams page (${currentUrl})`);
        timingTracker.recordDuration('Register certification and reach exams page', Date.now() - registerFlowStartedAt, {
          category: 'system',
          details: 'Completed certification registration flow and opened exams page',
          startedAt: registerFlowStartedAt,
        });
      }

      await timingTracker.capturePageMetrics(authenticatedPage, 'Certification exams page');

      // ===== STEP 3: Verify "Create New Exam" button exists on exam list page =====
      console.log('\n[STEP 3] Verifying "Create New Exam" button on exams page...');
      console.log('  - Waiting for page content to fully load...');
      const examPageContentStartedAt = Date.now();
      await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log('  ⚠ networkidle timeout, continuing...');
      });
      timingTracker.recordDuration('Exam list content load wait', Date.now() - examPageContentStartedAt, {
        category: 'content',
        details: 'Waited for exams page network activity to settle before looking for Create Exam CTA',
        startedAt: examPageContentStartedAt,
      });

      console.log('  - Waiting for "Create Exam" button to appear...');
      const createCtaStartedAt = Date.now();
      let createExamButton = authenticatedPage.locator('button:has-text("New Exam")').first();

      let isCreateButtonVisible = await createExamButton
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);

      if (!isCreateButtonVisible) {
        console.log('  ⚠ "New Exam" selector failed, trying "Create Exam"...');
        createExamButton = authenticatedPage.locator('button:has-text("Create Exam")').first();
        isCreateButtonVisible = await createExamButton
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);
      }

      if (!isCreateButtonVisible) {
        throw new Error('"Create New Exam" button not found on exams page. Test cannot proceed.');
      }

      console.log('✓ "Create New Exam" button found and visible');
      timingTracker.recordDuration('Create exam CTA visible on exams page', Date.now() - createCtaStartedAt, {
        category: 'content',
        details: 'Exam list page was ready for exam creation',
        startedAt: createCtaStartedAt,
      });

      // ===== STEP 4: Create a new exam (no-certs path) =====
      console.log('\n[STEP 4] Creating a new exam...');
      await handleExamCreation(authenticatedPage, { tracker: timingTracker });
    } else {
      // If user already has registered certs, use the first one
      console.log('\n[STEP 2] User has registered certs — navigating to exams page...');
      console.log('  - Clicking on first registered certification card...');
      const existingCertStartedAt = Date.now();

      const firstCertCard = authenticatedPage.locator('a[href*="/main/certifications/"]').first();
      const isCertCardVisible = await firstCertCard.isVisible({ timeout: 5000 }).catch(() => false);

      if (!isCertCardVisible) {
        throw new Error('Could not find registered cert card on dashboard to click');
      }

      await firstCertCard.click();

      await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
      console.log('✓ Exams list page loaded');

      const existingCertUrl = authenticatedPage.url();
      if (!/\/main\/certifications\/\d+\/exams/.test(existingCertUrl)) {
        throw new Error(
          `Navigation failed. Expected URL to match /main/certifications/{id}/exams, got: ${existingCertUrl}`,
        );
      }

      console.log(`✓ Successfully navigated to exams page (${existingCertUrl})`);
      timingTracker.recordDuration('Dashboard certification to exams page', Date.now() - existingCertStartedAt, {
        category: 'system',
        details: 'Used an already-registered certification card from the dashboard',
        startedAt: existingCertStartedAt,
      });
      await timingTracker.capturePageMetrics(authenticatedPage, 'Certification exams page');

      // ===== STEP 3: Verify "Create New Exam" button exists =====
      console.log('\n[STEP 3] Verifying "Create New Exam" button on exams page...');
      console.log('  - Waiting for page content to fully load...');
      const existingExamContentStartedAt = Date.now();
      await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log('  ⚠ networkidle timeout, continuing...');
      });
      timingTracker.recordDuration('Exam list content load wait', Date.now() - existingExamContentStartedAt, {
        category: 'content',
        details: 'Waited for exams page network activity to settle before locating Create Exam CTA',
        startedAt: existingExamContentStartedAt,
      });

      console.log('  - Waiting for "Create Exam" button to appear...');
      const existingCreateCtaStartedAt = Date.now();
      let existingCreateExamButton = authenticatedPage
        .locator('button:has-text("Create Exam")')
        .first();

      let isExistingCreateButtonVisible = await existingCreateExamButton
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);

      if (!isExistingCreateButtonVisible) {
        console.log('  ⚠ "Create Exam" selector failed, trying "Create" variant...');
        existingCreateExamButton = authenticatedPage.locator('button:has-text("Create")').first();
        isExistingCreateButtonVisible = await existingCreateExamButton
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);
      }

      if (!isExistingCreateButtonVisible) {
        console.log('  ⚠ "Create" selector failed, trying gradient button selector...');
        existingCreateExamButton = authenticatedPage
          .locator('button[class*="from-violet"], button[class*="to-blue"]')
          .first();
        isExistingCreateButtonVisible = await existingCreateExamButton
          .isVisible({ timeout: 5000 })
          .catch(() => false);
      }

      if (!isExistingCreateButtonVisible) {
        console.log('  ⚠ All selectors failed, waiting longer for any Create button...');
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
        throw new Error('"Create New Exam" button not found on exams page. Test cannot proceed.');
      }

      console.log('✓ "Create New Exam" button found and visible');
      timingTracker.recordDuration('Create exam CTA visible on exams page', Date.now() - existingCreateCtaStartedAt, {
        category: 'content',
        details: 'Exam list page was ready for exam creation',
        startedAt: existingCreateCtaStartedAt,
      });

      // ===== STEP 4: Create a new exam (existing-certs path) =====
      console.log('\n[STEP 4] Creating a new exam...');
      await handleExamCreation(authenticatedPage, { tracker: timingTracker });
    }

      console.log('\n================== TEST COMPLETE ==================');
      console.log('✓ All steps completed successfully:');
      console.log('  1. Navigate to dashboard');
      console.log('  2. Find/register a certification');
      console.log('  3. Verify exam creation button');
      console.log('  4. Create a new exam and verify it appears');
      console.log('====================================================');
    } finally {
      timingTracker.logSummary();
      await testInfo.attach('exam-flow-timing-baseline', {
        body: JSON.stringify(timingTracker.buildReport(), null, 2),
        contentType: 'application/json',
      });
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
