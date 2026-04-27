import { Page } from '@playwright/test';

/**
 * Navigate to a page and wait for it to load completely
 */
export async function navigateAndWait(
  page: Page,
  path: string,
  options: { timeout?: number; waitForLoad?: 'domcontentloaded' | 'load' | 'networkidle' } = {},
): Promise<void> {
  const { timeout = 10000, waitForLoad = 'domcontentloaded' } = options;

  const navigationUrl = path.startsWith('/') ? path : `/${path}`;
  await page.goto(navigationUrl, { waitUntil: waitForLoad, timeout });
}

/**
 * Click a button with retries if normal click fails
 */
export async function clickButtonWithRetry(
  locator: any,
  options: { maxRetries?: number; timeout?: number; force?: boolean; logPrefix?: string } = {},
): Promise<void> {
  const { maxRetries = 2, timeout = 5000, force = false, logPrefix = '' } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (logPrefix) console.log(`${logPrefix} → Clicking button (attempt ${attempt + 1})...`);
      await locator.click({ timeout, force: attempt > 0 ? true : force });
      if (logPrefix) console.log(`${logPrefix} ✓ Button clicked successfully`);
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`${logPrefix} ✗ Failed to click button after ${maxRetries + 1} attempts: ${error}`);
      }
      if (logPrefix) console.log(`${logPrefix} ⚠ Click attempt ${attempt + 1} failed, retrying...`);
    }
  }
}

/**
 * Verify page URL matches expected pattern
 */
export function verifyPageUrl(
  page: Page,
  urlPattern: string | RegExp,
  options: { errorMessage?: string } = {},
): boolean {
  const { errorMessage = `URL doesn't match expected pattern` } = options;
  const currentUrl = page.url();
  const pattern = typeof urlPattern === 'string' ? new RegExp(urlPattern) : urlPattern;

  if (!pattern.test(currentUrl)) {
    throw new Error(`${errorMessage}. Expected: ${pattern}, Got: ${currentUrl}`);
  }

  return true;
}

/**
 * Wait for URL to match expected pattern
 */
export async function waitForUrl(
  page: Page,
  urlPattern: string | RegExp,
  options: { timeout?: number; errorMessage?: string } = {},
): Promise<void> {
  const { timeout = 15000, errorMessage = 'URL timeout' } = options;
  const pattern = typeof urlPattern === 'string' ? new RegExp(urlPattern) : urlPattern;

  try {
    await page.waitForURL(pattern, { timeout });
  } catch {
    throw new Error(`${errorMessage}. Expected pattern: ${pattern}`);
  }
}

/**
 * Wait for page to reach a specific load state
 */
export async function waitForPageLoadState(
  page: Page,
  state: 'domcontentloaded' | 'load' | 'networkidle' = 'domcontentloaded',
  options: { timeout?: number; logPrefix?: string } = {},
): Promise<void> {
  const { timeout = 10000, logPrefix = '' } = options;

  try {
    await page.waitForLoadState(state, { timeout });
    if (logPrefix) console.log(`${logPrefix} ✓ Page reached ${state} state`);
  } catch {
    if (logPrefix) console.log(`${logPrefix} ⚠ Timeout waiting for ${state}, continuing...`);
  }
}

/**
 * Extract numeric ID from URL pattern
 * E.g., from /main/certifications/123/exams returns 123
 */
export function extractIdFromUrl(page: Page, pattern: string): number | null {
  const url = page.url();
  const match = url.match(new RegExp(pattern));
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Wait for element count to reach expected value
 */
export async function waitForElementCount(
  page: Page,
  selector: string,
  expectedCount: number,
  options: { timeout?: number; logPrefix?: string } = {},
): Promise<void> {
  const { timeout = 30000, logPrefix = '' } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const count = await page.locator(selector).count();
    if (count === expectedCount) {
      if (logPrefix) console.log(`${logPrefix} ✓ Found ${expectedCount} matching element(s)`);
      return;
    }
    await page.waitForTimeout(500);
  }

  throw new Error(
    `${logPrefix} ✗ Timeout waiting for ${expectedCount} element(s) matching "${selector}"`,
  );
}

/**
 * Get text content from element safely
 */
export async function getElementText(
  locator: any,
  options: { defaultValue?: string } = {},
): Promise<string> {
  const { defaultValue = '' } = options;

  try {
    const text = await locator.textContent();
    return text?.trim() || defaultValue;
  } catch {
    return defaultValue;
  }
}
