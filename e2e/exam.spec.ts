import { test, expect } from './fixtures/auth';
import { AUTH_STATE_PATH } from './fixtures/auth-state';
import type { Page, TestInfo } from '@playwright/test';
import { handleExamCreation } from './helpers/exams';
import { FlowTimingTracker } from './helpers/performance';
import {
  CERTIFICATION_CTA,
  CREATE_EXAM_CTA,
  EXAM_CARD_ACTION_SELECTOR,
  REGISTERED_CERT_ACTION,
  REGISTER_NOW_CTA,
  REGISTRATION_CONFIRM_CTA,
  firstMatching,
  requireMatching,
} from './helpers/selectors';

// Reuse the session captured once per run by e2e/global-auth-setup.ts.
// Scoped to this file on purpose: a globally authenticated context would make
// /signin redirect away and break the anonymous auth-flow specs.
test.use({ storageState: AUTH_STATE_PATH });

// Budget: fixture setup (auth/signup) + exam creation with 3min polling.
// The daily 3-exam cap triggers a full account recycle inside
// `handleExamCreation` (delete → re-register → log in → create again), which
// adds up to ~2 minutes, so the ceiling allows one recovery cycle.
// Set at describe level (not `testInfo.setTimeout` in `beforeEach`) because the
// `authenticatedPage` fixture's own auth/signup fallback runs *before* hooks and
// would otherwise be cut off by the 90s global timeout.
test.describe.configure({ timeout: 600000 });

type TestFixtures = {
  authenticatedPage: Page;
};

test.describe('Exam Flows', () => {
  test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    // Keep the budget visible in the per-test report too.
    testInfo.setTimeout(600000);
  });

  test('[Dashboard → Cert → Exams] @smoke', async ({
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
      const dashboardContentStartedAt = Date.now();
      const registerCertButtonWait = await firstMatching(authenticatedPage, CERTIFICATION_CTA, {
        timeout: 10_000,
      });

      if (registerCertButtonWait) {
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
      } else {
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
        const registerCertButton = await requireMatching(authenticatedPage, CERTIFICATION_CTA, {
          timeout: 5_000,
          errorMessage:
            '"Register for Certification" button not found on dashboard. Cannot proceed with certification registration.',
        });

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

        console.log('✓ Certifications page DOM loaded');
        await timingTracker.capturePageMetrics(authenticatedPage, 'Certification browse page');

        console.log('  - Waiting for certification cards to render...');
        const certificationDataStartedAt = Date.now();
        // Wait for a real signal (a card action button) instead of 'networkidle':
        // SWR keeps polling in the background, so networkidle never settles and
        // always burned the full timeout.
        await authenticatedPage
          .locator('button:has-text("Register Now"), button:has-text("View Exams")')
          .first()
          .waitFor({ state: 'visible', timeout: 15000 })
          .catch(() => {
            console.log('  ⚠ Certification cards not detected within 15s, continuing...');
          });
        timingTracker.recordDuration(
          'Certification data load wait',
          Date.now() - certificationDataStartedAt,
          {
            category: 'content',
            details: 'Waited for the first certification card action button to render',
            startedAt: certificationDataStartedAt,
          },
        );

        console.log('  - Checking for "View Exams" button (already registered cert)...');
        const viewExamsCardButton = await firstMatching(
          authenticatedPage,
          REGISTERED_CERT_ACTION.slice(0, 2),
          { timeout: 3_000 },
        );

        if (viewExamsCardButton) {
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
          const registerCertCardButton = await requireMatching(
            authenticatedPage,
            REGISTER_NOW_CTA,
            {
              timeout: 10_000,
              errorMessage:
                'No "Register Now" button found on certifications page. Cannot register cert.',
            },
          );

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

          const modalConfirmButton = await requireMatching(
            authenticatedPage,
            REGISTRATION_CONFIRM_CTA,
            {
              timeout: 3_000,
              errorMessage:
                'Registration confirmation modal button did not appear. Cannot proceed with registration.',
            },
          );

          console.log('✓ Registration modal confirmation button found');
          console.log('  - Clicking "Register for this Certification" button in modal...');
          await modalConfirmButton.click();

          console.log('✓ Registration button clicked');

          console.log('  - Waiting for certification card to update to "View Exams"...');
          const viewExamsButton = await firstMatching(authenticatedPage, REGISTERED_CERT_ACTION);

          if (!viewExamsButton) {
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
        // 'networkidle' never settles here (SWR polling), so wait for the exam
        // list surface itself — cards or the create CTA.
        await authenticatedPage
          .locator(
            'div[data-testid="exam-card"], button:has-text("New Exam"), button:has-text("Create Exam")',
          )
          .first()
          .waitFor({ state: 'visible', timeout: 15000 })
          .catch(() => {
            console.log('  ⚠ Exam list surface not detected within 15s, continuing...');
          });
        timingTracker.recordDuration(
          'Exam list content load wait',
          Date.now() - examPageContentStartedAt,
          {
            category: 'content',
            details: 'Waited for an exam card or the Create Exam CTA to render',
            startedAt: examPageContentStartedAt,
          },
        );

        console.log('  - Waiting for "Create Exam" button to appear...');
        const createCtaStartedAt = Date.now();
        await requireMatching(authenticatedPage, CREATE_EXAM_CTA, {
          errorMessage: '"Create New Exam" button not found on exams page. Test cannot proceed.',
        });

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
        // See the no-certs path above: wait for a real surface, not 'networkidle'.
        await authenticatedPage
          .locator(
            'div[data-testid="exam-card"], button:has-text("New Exam"), button:has-text("Create Exam")',
          )
          .first()
          .waitFor({ state: 'visible', timeout: 15000 })
          .catch(() => {
            console.log('  ⚠ Exam list surface not detected within 15s, continuing...');
          });
        timingTracker.recordDuration(
          'Exam list content load wait',
          Date.now() - existingExamContentStartedAt,
          {
            category: 'content',
            details: 'Waited for an exam card or the Create Exam CTA to render',
            startedAt: existingExamContentStartedAt,
          },
        );

        console.log('  - Waiting for "Create Exam" button to appear...');
        const existingCreateCtaStartedAt = Date.now();
        await requireMatching(authenticatedPage, CREATE_EXAM_CTA, {
          errorMessage: '"Create New Exam" button not found on exams page. Test cannot proceed.',
        });

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
      const examCards = authenticatedPage.locator('div[data-testid="exam-card"]');
      await examCards.first().waitFor({ state: 'visible', timeout: 10000 });

      // The list can also contain completed exams whose only action is
      // "View Results & Certificate", and its order is server-defined. Target a
      // card we can actually start instead of blindly taking the first one —
      // otherwise a stale/completed card makes this step spin for 60s.
      const newestExamCard = examCards
        .filter({ has: authenticatedPage.locator(EXAM_CARD_ACTION_SELECTOR) })
        .first();

      // Right after creation the list can briefly still render only the
      // previously-submitted card (the new one is not listed yet), so a
      // one-shot count check would fail on a card that appears moments later.
      await expect
        .poll(async () => newestExamCard.count(), {
          message:
            'No startable exam card found — every card is a completed exam. ' +
            'Exam creation did not produce a new exam (check the daily exam limit).',
          timeout: 60000,
        })
        .toBeGreaterThan(0);

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

        // Poll interval, not a synchronisation hack: the card flips from
        // "Generating Questions" to "Begin Exam" on a server-side job.
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

      // The detail route renders a loading state while questions are fetched, so
      // the heading can legitimately take longer than the navigation itself.
      // Report the URL on failure instead of leaving a bare "element not visible".
      const examDetailHeading = authenticatedPage.locator('h2:has-text("Exam Progress")').first();
      await expect
        .poll(async () => examDetailHeading.isVisible().catch(() => false), {
          message: `Exam detail page did not render "Exam Progress" (url: ${authenticatedPage.url()})`,
          timeout: 25000,
        })
        .toBe(true);
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
      // The button stays disabled until the answer PUT settles, which can take
      // seconds on this backend. Waiting for "enabled" beats clicking a disabled
      // button and reading a misleading "click timeout".
      await expect(submitExamButton).toBeEnabled({ timeout: 30000 });
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
      // The submit endpoint returns before the backend finalizes the attempt, and
      // the client revalidates the exam state only once. Observed lag between
      // "confirm submission" and the Submitted timestamp rendering is 5-10s, so
      // 15s left no margin and produced flaky failures on slower runs.
      await expect(submittedLabel).toBeVisible({ timeout: 45000 });

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
