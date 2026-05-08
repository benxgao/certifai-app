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

  test('[Dashboard → Cert → Exams]', async ({
    authenticatedPage,
  }: TestFixtures, testInfo: TestInfo) => {
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
        timingTracker.recordDuration(
          'Dashboard content visible',
          Date.now() - dashboardContentStartedAt,
          {
            category: 'content',
            details: 'Primary certification CTA became visible',
            startedAt: dashboardContentStartedAt,
          },
        );
      } catch (e) {
        console.log('  ⚠ Register button not immediately visible, proceeding with cert check...');
        timingTracker.recordDuration(
          'Dashboard content wait fallback',
          Date.now() - dashboardContentStartedAt,
          {
            category: 'content',
            details:
              'Primary CTA was not visible within 10 seconds; continuing with certification list probe',
            status: 'failed',
            startedAt: dashboardContentStartedAt,
          },
        );
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
        timingTracker.recordDuration(
          'Certification data load wait',
          Date.now() - certificationDataStartedAt,
          {
            category: 'content',
            details: 'Waited for certification browse page network activity to settle',
            startedAt: certificationDataStartedAt,
          },
        );

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
          timingTracker.recordDuration(
            'Existing certification to exams page',
            Date.now() - registerFlowStartedAt,
            {
              category: 'system',
              details: 'Used already-registered certification card and opened exams page',
              startedAt: registerFlowStartedAt,
            },
          );
        } else {
          console.log(
            '  ⚠ No "View Exams" button found — proceeding with new cert registration...',
          );

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
          console.log(
            isBackdropVisible
              ? '✓ Modal backdrop detected'
              : '  ⚠ Modal backdrop not found, continuing...',
          );

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
          let isViewExamsVisible = await viewExamsButton
            .isVisible({ timeout: 3000 })
            .catch(() => false);

          if (!isViewExamsVisible) {
            console.log('  ⚠ Exact "View Exams" selector failed, trying flexible text match...');
            viewExamsButton = authenticatedPage
              .locator('button:has-text("View")')
              .filter({ hasText: /Exam/ })
              .first();
            isViewExamsVisible = await viewExamsButton
              .isVisible({ timeout: 3000 })
              .catch(() => false);
          }

          if (!isViewExamsVisible) {
            console.log('  ⚠ Trying "View Exam" (singular) selector...');
            viewExamsButton = authenticatedPage.locator('button:has-text("View Exam")').first();
            isViewExamsVisible = await viewExamsButton
              .isVisible({ timeout: 3000 })
              .catch(() => false);
          }

          if (!isViewExamsVisible) {
            console.log('  ⚠ Trying emerald button selector (registered state)...');
            viewExamsButton = authenticatedPage.locator('button[class*="emerald"]').first();
            isViewExamsVisible = await viewExamsButton
              .isVisible({ timeout: 3000 })
              .catch(() => false);
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
          timingTracker.recordDuration(
            'Register certification and reach exams page',
            Date.now() - registerFlowStartedAt,
            {
              category: 'system',
              details: 'Completed certification registration flow and opened exams page',
              startedAt: registerFlowStartedAt,
            },
          );
        }

        await timingTracker.capturePageMetrics(authenticatedPage, 'Certification exams page');

        // ===== STEP 3: Verify "Create New Exam" button exists on exam list page =====
        console.log('\n[STEP 3] Verifying "Create New Exam" button on exams page...');
        console.log('  - Waiting for page content to fully load...');
        const examPageContentStartedAt = Date.now();
        await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
          console.log('  ⚠ networkidle timeout, continuing...');
        });
        timingTracker.recordDuration(
          'Exam list content load wait',
          Date.now() - examPageContentStartedAt,
          {
            category: 'content',
            details:
              'Waited for exams page network activity to settle before looking for Create Exam CTA',
            startedAt: examPageContentStartedAt,
          },
        );

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
        timingTracker.recordDuration(
          'Create exam CTA visible on exams page',
          Date.now() - createCtaStartedAt,
          {
            category: 'content',
            details: 'Exam list page was ready for exam creation',
            startedAt: createCtaStartedAt,
          },
        );

        // ===== STEP 4: Create a new exam (no-certs path) =====
        console.log('\n[STEP 4] Creating a new exam...');
        await handleExamCreation(authenticatedPage, { tracker: timingTracker });
      } else {
        // If user already has registered certs, use the first one
        console.log('\n[STEP 2] User has registered certs — navigating to exams page...');
        console.log('  - Clicking on first registered certification card...');
        const existingCertStartedAt = Date.now();

        const firstCertCard = authenticatedPage.locator('a[href*="/main/certifications/"]').first();
        const isCertCardVisible = await firstCertCard
          .isVisible({ timeout: 5000 })
          .catch(() => false);

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
        timingTracker.recordDuration(
          'Dashboard certification to exams page',
          Date.now() - existingCertStartedAt,
          {
            category: 'system',
            details: 'Used an already-registered certification card from the dashboard',
            startedAt: existingCertStartedAt,
          },
        );
        await timingTracker.capturePageMetrics(authenticatedPage, 'Certification exams page');

        // ===== STEP 3: Verify "Create New Exam" button exists =====
        console.log('\n[STEP 3] Verifying "Create New Exam" button on exams page...');
        console.log('  - Waiting for page content to fully load...');
        const existingExamContentStartedAt = Date.now();
        await authenticatedPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
          console.log('  ⚠ networkidle timeout, continuing...');
        });
        timingTracker.recordDuration(
          'Exam list content load wait',
          Date.now() - existingExamContentStartedAt,
          {
            category: 'content',
            details:
              'Waited for exams page network activity to settle before locating Create Exam CTA',
            startedAt: existingExamContentStartedAt,
          },
        );

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
        timingTracker.recordDuration(
          'Create exam CTA visible on exams page',
          Date.now() - existingCreateCtaStartedAt,
          {
            category: 'content',
            details: 'Exam list page was ready for exam creation',
            startedAt: existingCreateCtaStartedAt,
          },
        );

        // ===== STEP 4: Create a new exam (existing-certs path) =====
        console.log('\n[STEP 4] Creating a new exam...');
        await handleExamCreation(authenticatedPage, { tracker: timingTracker });
      }

      // ===== STEP 5: Wait for exam card action to transition to ready (max 60s) =====
      console.log('\n[STEP 5] Waiting for exam to finish generating and become startable...');
      const readyWaitStartedAt = Date.now();
      const newestExamCard = authenticatedPage.locator('div[data-testid="exam-card"]').first();
      await newestExamCard.waitFor({ state: 'visible', timeout: 10000 });

      let sawGeneratingState = false;
      let readyButton = newestExamCard.locator('button:has-text("Begin Exam")').first();

      while (Date.now() - readyWaitStartedAt < 60000) {
        const generatingButton = newestExamCard
          .locator(
            'button:has-text("Generating Questions"), button:has-text("Generating Questions...")',
          )
          .first();

        const isGeneratingVisible = await generatingButton.isVisible().catch(() => false);
        const isGeneratingDisabled = isGeneratingVisible
          ? await generatingButton.isDisabled().catch(() => false)
          : false;

        if (isGeneratingVisible && isGeneratingDisabled && !sawGeneratingState) {
          sawGeneratingState = true;
          console.log('✓ Detected disabled "Generating Questions" state');
        }

        let isReadyVisible = await readyButton.isVisible().catch(() => false);
        let isReadyEnabled = isReadyVisible
          ? await readyButton.isEnabled().catch(() => false)
          : false;

        if (!isReadyVisible || !isReadyEnabled) {
          const resumeButton = newestExamCard.locator('button:has-text("Resume Exam")').first();
          const isResumeVisible = await resumeButton.isVisible().catch(() => false);
          const isResumeEnabled = isResumeVisible
            ? await resumeButton.isEnabled().catch(() => false)
            : false;

          if (isResumeVisible && isResumeEnabled) {
            readyButton = resumeButton;
            isReadyVisible = true;
            isReadyEnabled = true;
          }
        }

        if (isReadyVisible && isReadyEnabled) {
          if (!sawGeneratingState) {
            console.log(
              '  ⚠ Ready state appeared before generating state was observed; continuing...',
            );
          }
          console.log('✓ Exam action button is enabled and ready to start');
          break;
        }

        await authenticatedPage.waitForTimeout(1000);
      }

      const isFinalReadyEnabled = await readyButton.isEnabled().catch(() => false);
      if (!isFinalReadyEnabled) {
        throw new Error(
          'Exam did not transition from disabled "Generating Questions" to enabled "Begin Exam/Resume Exam" within 60 seconds.',
        );
      }

      timingTracker.recordDuration(
        'Wait for exam card to become startable',
        Date.now() - readyWaitStartedAt,
        {
          category: 'polling',
          details: sawGeneratingState
            ? 'Observed generating -> ready transition on exam card action button'
            : 'Exam became ready directly before generating state was observed',
          startedAt: readyWaitStartedAt,
        },
      );

      // ===== STEP 6: Enter exam from ready card =====
      console.log('\n[STEP 6] Entering exam from enabled action button...');
      const enterExamStartedAt = Date.now();
      await readyButton.click({ timeout: 8000 });
      await authenticatedPage.waitForURL(/\/main\/certifications\/\d+\/exams\/[^/]+/, {
        timeout: 15000,
      });
      await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await expect(authenticatedPage.locator('h2:has-text("Exam Progress")').first()).toBeVisible({
        timeout: 10000,
      });
      console.log('✓ Entered exam details page');

      timingTracker.recordDuration('Enter exam details page', Date.now() - enterExamStartedAt, {
        category: 'page',
        details: 'Clicked Begin/Resume Exam and landed on exam details route',
        startedAt: enterExamStartedAt,
      });

      // ===== STEP 7: Select option A for first/single question (max 10s) =====
      console.log('\n[STEP 7] Selecting option A for the first question...');
      const answerStartedAt = Date.now();
      const optionACheckbox = authenticatedPage.locator('[role="checkbox"][id*="-"]').first();
      await expect(optionACheckbox).toBeVisible({ timeout: 10000 });
      await optionACheckbox.click({ timeout: 5000 });

      let isChecked = false;
      try {
        await expect(optionACheckbox).toHaveAttribute('data-state', 'checked', { timeout: 10000 });
        isChecked = true;
      } catch {
        const ariaChecked = await optionACheckbox.getAttribute('aria-checked');
        isChecked = ariaChecked === 'true';
      }

      if (!isChecked) {
        throw new Error('Option A selection was not persisted within 10 seconds.');
      }
      console.log('✓ Option A selected and persisted');

      timingTracker.recordDuration('Select first answer option', Date.now() - answerStartedAt, {
        category: 'action',
        details: 'Selected first option (A) for first question and verified checked state',
        startedAt: answerStartedAt,
      });

      // ===== STEP 8: Submit exam and confirm in modal =====
      console.log('\n[STEP 8] Submitting exam and confirming in modal...');
      const submitStartedAt = Date.now();
      const submitExamButton = authenticatedPage.locator('button:has-text("Submit Exam")').first();
      await expect(submitExamButton).toBeVisible({ timeout: 10000 });
      await submitExamButton.click({ timeout: 8000 });

      const submitConfirmModal = authenticatedPage
        .locator('div[role="dialog"]')
        .filter({ hasText: /Confirm Submission/i })
        .first();
      await expect(submitConfirmModal).toBeVisible({ timeout: 10000 });

      const confirmSubmitButton = submitConfirmModal
        .locator('button:has-text("Submit Exam")')
        .first();
      await expect(confirmSubmitButton).toBeVisible({ timeout: 10000 });
      await confirmSubmitButton.click({ timeout: 8000 });
      await expect(submitConfirmModal).toBeHidden({ timeout: 15000 });
      console.log('✓ Exam submitted via confirmation modal');

      timingTracker.recordDuration(
        'Submit exam with confirmation modal',
        Date.now() - submitStartedAt,
        {
          category: 'action',
          details: 'Clicked Submit Exam and confirmed submission in modal dialog',
          startedAt: submitStartedAt,
        },
      );

      // ===== STEP 9: Verify submitted value appears in Exam Progress (max 15s) =====
      console.log('\n[STEP 9] Verifying SUBMITTED has a value in Exam Progress...');
      const submittedVerifyStartedAt = Date.now();
      const examProgressHeading = authenticatedPage.locator('h2:has-text("Exam Progress")').first();
      await expect(examProgressHeading).toBeVisible({ timeout: 10000 });

      const submittedLabel = authenticatedPage
        .locator('p')
        .filter({ hasText: /^Submitted$/i })
        .first();
      await expect(submittedLabel).toBeVisible({ timeout: 15000 });

      const submittedValue = submittedLabel.locator(
        'xpath=ancestor::div[contains(@class,"space-y-3")][1]/p[last()]',
      );
      await expect(submittedValue).toBeVisible({ timeout: 15000 });

      const submittedValueText = (await submittedValue.textContent())?.trim() || '';
      if (!submittedValueText || /not\s+submitted/i.test(submittedValueText)) {
        throw new Error(
          `Expected Submitted value in Exam Progress within 15 seconds, but got: "${submittedValueText || '(empty)'}"`,
        );
      }
      console.log(`✓ Exam Progress shows Submitted value: ${submittedValueText}`);

      timingTracker.recordDuration(
        'Verify submitted value in Exam Progress',
        Date.now() - submittedVerifyStartedAt,
        {
          category: 'content',
          details:
            'Confirmed Submitted label has a populated timestamp/value in Exam Progress section',
          startedAt: submittedVerifyStartedAt,
        },
      );

      console.log('\n================== TEST COMPLETE ==================');
      console.log('✓ All steps completed successfully:');
      console.log('  1. Navigate to dashboard');
      console.log('  2. Find/register a certification');
      console.log('  3. Verify exam creation button');
      console.log('  4. Create a new exam and verify it appears');
      console.log('  5. Wait for generating to transition to ready');
      console.log('  6. Enter exam, answer option A, submit, and verify submitted value');
      console.log('====================================================');
    } finally {
      timingTracker.logSummary();
      await testInfo.attach('exam-flow-timing-baseline', {
        body: JSON.stringify(timingTracker.buildReport(), null, 2),
        contentType: 'application/json',
      });
    }
  });
});
