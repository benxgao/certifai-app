import { Page, Locator } from '@playwright/test';

/**
 * Find a button by text with multiple fallback strategies
 * Tries primary text, then fallback variations if primary fails
 */
export async function findButtonByText(
  page: Page,
  primaryText: string,
  fallbackTexts: string[] = [],
  options: { timeout?: number; logPrefix?: string } = {},
): Promise<Locator> {
  const { timeout = 5000, logPrefix = '' } = options;

  // Strategy 1: Try primary text
  const primaryLocator = page.locator(`button:has-text("${primaryText}")`).first();
  try {
    await primaryLocator.waitFor({ state: 'visible', timeout });
    if (logPrefix) console.log(`${logPrefix} ✓ Found button via primary text: "${primaryText}"`);
    return primaryLocator;
  } catch {
    if (logPrefix) console.log(`${logPrefix} ⚠ Primary text selector failed: "${primaryText}"`);
  }

  // Strategy 2+: Try fallbacks
  for (const fallbackText of fallbackTexts) {
    const fallbackLocator = page.locator(`button:has-text("${fallbackText}")`).first();
    try {
      await fallbackLocator.waitFor({ state: 'visible', timeout });
      if (logPrefix) console.log(`${logPrefix} ✓ Found button via fallback text: "${fallbackText}"`);
      return fallbackLocator;
    } catch {
      if (logPrefix) console.log(`${logPrefix} ⚠ Fallback text selector failed: "${fallbackText}"`);
    }
  }

  throw new Error(
    `${logPrefix} ✗ Could not find button with text: "${primaryText}" or fallbacks: ${fallbackTexts.join(', ')}`,
  );
}

/**
 * Find a button by data-testid with fallback to text search
 * More reliable than text-only search when testid might vary
 */
export async function findButtonByTestId(
  page: Page,
  testId: string,
  fallbackTexts: string[] = [],
  options: { timeout?: number; logPrefix?: string } = {},
): Promise<Locator> {
  const { timeout = 5000, logPrefix = '' } = options;

  // Strategy 1: Try testid
  const testIdLocator = page.locator(`button[data-testid="${testId}"]`).first();
  const testIdCount = await testIdLocator.count();

  if (testIdCount > 0) {
    try {
      await testIdLocator.waitFor({ state: 'visible', timeout });
      if (logPrefix) console.log(`${logPrefix} ✓ Found button via testid: "${testId}"`);
      return testIdLocator;
    } catch {
      if (logPrefix) console.log(`${logPrefix} ⚠ TestID selector found but not visible: "${testId}"`);
    }
  }

  // Strategy 2+: Fallback to text search
  if (fallbackTexts.length > 0) {
    if (logPrefix) console.log(`${logPrefix} → Trying text fallbacks...`);
    return findButtonByText(page, fallbackTexts[0], fallbackTexts.slice(1), options);
  }

  throw new Error(
    `${logPrefix} ✗ Could not find button with testid: "${testId}" or fallback texts`,
  );
}

/**
 * Find a modal by role or selector with multiple strategies
 */
export async function findModal(
  page: Page,
  selector: { role?: string; selector?: string; hasContent?: string },
  options: { timeout?: number; logPrefix?: string } = {},
): Promise<Locator> {
  const { timeout = 5000, logPrefix = '' } = options;

  // Strategy 1: Try specific selector if provided
  if (selector.selector) {
    const locator = page.locator(selector.selector);
    try {
      await locator.waitFor({ state: 'visible', timeout });
      if (logPrefix) console.log(`${logPrefix} ✓ Found modal via selector`);
      return locator;
    } catch {
      if (logPrefix) console.log(`${logPrefix} ⚠ Specific selector failed`);
    }
  }

  // Strategy 2: Try role-based selector
  const roleSelector = selector.role ? `[role="${selector.role}"]` : '[role="dialog"]';
  const roleLocator = page.locator(roleSelector);
  try {
    await roleLocator.waitFor({ state: 'visible', timeout });
    if (logPrefix) console.log(`${logPrefix} ✓ Found modal via role`);
    return roleLocator;
  } catch {
    if (logPrefix) console.log(`${logPrefix} ⚠ Role selector failed`);
  }

  // Strategy 3: Generic dialog selector
  const genericLocator = page.locator('div[role="dialog"]').last();
  try {
    await genericLocator.waitFor({ state: 'visible', timeout });
    if (logPrefix) console.log(`${logPrefix} ✓ Found modal via generic dialog selector`);
    return genericLocator;
  } catch {
    if (logPrefix) console.log(`${logPrefix} ⚠ Generic dialog selector failed`);
  }

  throw new Error(`${logPrefix} ✗ Could not find modal`);
}

/**
 * Wait for element to be visible with error message
 */
export async function waitForElement(
  locator: Locator,
  options: { timeout?: number; errorMessage?: string } = {},
): Promise<boolean> {
  const { timeout = 5000, errorMessage = 'Element not found' } = options;

  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    throw new Error(errorMessage);
  }
}

/**
 * Count visible elements matching a selector
 */
export async function countVisibleElements(page: Page, selector: string): Promise<number> {
  const locators = page.locator(selector);
  const count = await locators.count();
  let visibleCount = 0;

  for (let i = 0; i < count; i++) {
    try {
      const isVisible = await locators.nth(i).isVisible({ timeout: 500 });
      if (isVisible) visibleCount++;
    } catch {
      // Element not visible
    }
  }

  return visibleCount;
}
