import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env.local file
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

/**
 * Detect if running in apphosting environment
 * In apphosting, either PLAYWRIGHT_TEST_BASEURL is set or NODE_ENV is production/uat
 */
const isApphostingEnvironment = () => {
  return !!(
    process.env.PLAYWRIGHT_TEST_BASEURL ||
    (process.env.CI && process.env.K_SERVICE) || // K_SERVICE is set by Cloud Run
    process.env.APPHOSTING_ENVIRONMENT
  );
};

const baseURL = process.env.PLAYWRIGHT_TEST_BASEURL || 'http://localhost:3000';
const isLiveEnvironment = isApphostingEnvironment();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests sequentially to avoid hanging issues */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - more retries for live environment due to potential flakiness */
  retries: process.env.CI ? (isLiveEnvironment ? 3 : 2) : 0,
  /* Single worker to prevent resource conflicts */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Increase timeout for live environment due to network latency */
    navigationTimeout: isLiveEnvironment ? 30_000 : 15_000,
    actionTimeout: isLiveEnvironment ? 10_000 : 5_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests (only for local/pre-flight) */
  ...(isLiveEnvironment
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),

  /* Global timeout for tests - increased for live environment */
  timeout: isLiveEnvironment ? 90_000 : 60_000,
});
