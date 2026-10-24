import { Page, Locator } from '@playwright/test';

/**
 * Anything that can scope a selector: a `Page` or a `Locator` (e.g. a modal).
 * Keeps candidate sets reusable for page-level and card/modal-level lookups.
 */
export type LocatorRoot = Pick<Page, 'locator'>;

/**
 * A named way of locating one element. `timeout` lets a fallback keep the same
 * budget the old hand-written chains used (e.g. 3s for a guess, 15s for the
 * last-resort retry).
 */
export type LocatorCandidate = {
  label: string;
  build: (root: LocatorRoot) => Locator;
  timeout?: number;
};

/**
 * Try candidates in order and return the first one that becomes visible.
 *
 * Returns `null` instead of throwing, because most call sites need to branch on
 * the result ("registered already? then click View Exams"). Use
 * `requireMatching` when absence is fatal.
 */
export async function firstMatching(
  root: LocatorRoot,
  candidates: LocatorCandidate[],
  options: { logPrefix?: string; timeout?: number } = {},
): Promise<Locator | null> {
  const { logPrefix = '  ', timeout = 3000 } = options;

  for (const candidate of candidates) {
    const locator = candidate.build(root);
    try {
      await locator.waitFor({ state: 'visible', timeout: candidate.timeout ?? timeout });
      console.log(`${logPrefix}✓ matched: ${candidate.label}`);
      return locator;
    } catch {
      console.log(`${logPrefix}⚠ no match: ${candidate.label}`);
    }
  }

  return null;
}

/**
 * `firstMatching` + a descriptive failure listing every strategy that was tried,
 * so a broken selector chain reads as "these 5 things were not on the page"
 * instead of a bare timeout.
 */
export async function requireMatching(
  root: LocatorRoot,
  candidates: LocatorCandidate[],
  options: { logPrefix?: string; timeout?: number; errorMessage: string },
): Promise<Locator> {
  const { errorMessage, ...rest } = options;
  const locator = await firstMatching(root, candidates, rest);

  if (!locator) {
    throw new Error(`${errorMessage} (tried: ${candidates.map((c) => c.label).join(', ')})`);
  }

  return locator;
}

/* ------------------------------------------------------------------ *
 * Domain selectors
 *
 * Single source of truth for how the exam flow finds things. Specs and
 * helpers reference these instead of re-deriving text/CSS chains inline.
 * ------------------------------------------------------------------ */

/** Dashboard CTA that leads to the certification browse page. */
export const CERTIFICATION_CTA: LocatorCandidate[] = [
  {
    label: 'Register for Certification',
    build: (page) => page.locator('button:has-text("Register for Certification")').first(),
  },
];

/** "Register Now" on a certification card (not yet registered). */
export const REGISTER_NOW_CTA: LocatorCandidate[] = [
  { label: 'Register Now', build: (page) => page.locator('button:has-text("Register Now")').first() },
];

/** Confirmation button inside the "register for this certification" modal. */
export const REGISTRATION_CONFIRM_CTA: LocatorCandidate[] = [
  {
    label: '"Register for this Certification"',
    build: (page) => page.locator('button:has-text("Register for this Certification")').first(),
  },
  {
    label: '"Register" + /for this Certification/',
    build: (page) =>
      page
        .locator('button:has-text("Register")')
        .filter({ hasText: /for this Certification/ })
        .first(),
  },
  {
    label: 'any Register button inside a fixed overlay',
    build: (page) => page.locator('[class*="fixed"] button:has-text("Register")').last(),
  },
];

/**
 * Action button on an already-registered certification card. The visible label
 * depends on state, so several spellings are tried before falling back to the
 * emerald (registered) styling and finally a longer retry.
 */
export const REGISTERED_CERT_ACTION: LocatorCandidate[] = [
  {
    label: '"View Exams"',
    build: (page) => page.locator('button:has-text("View Exams")').first(),
  },
  {
    label: '"View ...Exam" (flexible)',
    build: (page) =>
      page
        .locator('button:has-text("View")')
        .filter({ hasText: /Exam/ })
        .first(),
  },
  {
    label: '"View Exam" (singular)',
    build: (page) => page.locator('button:has-text("View Exam")').first(),
  },
  {
    label: 'emerald registered button',
    build: (page) => page.locator('button[class*="emerald"]').first(),
  },
  {
    label: '"View Exams" (long retry)',
    build: (page) => page.locator('button:has-text("View Exams")').first(),
    timeout: 15_000,
  },
];

/**
 * CTA that opens the create-exam modal. Ordered from most specific to a last
 * resort regex sweep; every step keeps its own budget.
 */
export const CREATE_EXAM_CTA: LocatorCandidate[] = [
  {
    label: '"New Exam"',
    build: (page) => page.locator('button:has-text("New Exam")').first(),
    timeout: 8_000,
  },
  {
    label: '"Create Exam"',
    build: (page) => page.locator('button:has-text("Create Exam")').first(),
    timeout: 5_000,
  },
  {
    label: '"Create"',
    build: (page) => page.locator('button:has-text("Create")').first(),
    timeout: 5_000,
  },
  {
    label: 'gradient CTA',
    build: (page) => page.locator('button[class*="from-violet"], button[class*="to-blue"]').first(),
    timeout: 5_000,
  },
  {
    label: 'any button matching /Create|New Exam/',
    build: (page) =>
      page
        .locator('button')
        .filter({ hasText: /Create|New Exam/ })
        .first(),
    timeout: 12_000,
  },
];

/** Submit button on the create-exam modal. */
export const SUBMIT_CREATE_EXAM_CTA: LocatorCandidate[] = [
  {
    label: '"Create Exam" (modal)',
    build: (root) => root.locator('button:has-text("Create Exam")').first(),
  },
  {
    label: '"Create" (modal)',
    build: (root) => root.locator('button:has-text("Create")').first(),
  },
  {
    label: 'gradient button (modal)',
    build: (root) => root.locator('button[class*="from-violet"]').last(),
  },
  {
    label: 'any /Create|New/ (modal)',
    build: (root) =>
      root
        .locator('button')
        .filter({ hasText: /Create|New/ })
        .first(),
    timeout: 5_000,
  },
];

/** The create-exam dialog, from the most specific marker to any dialog at all. */
export const CREATE_EXAM_MODAL: LocatorCandidate[] = [
  {
    label: 'data-testid="create-exam-modal"',
    build: (root) => root.locator('div[data-testid="create-exam-modal"]'),
    timeout: 3_000,
  },
  {
    label: 'dialog containing the question-count input',
    build: (root) => root.locator('div[role="dialog"]:has(input[id="number-of-questions"])').first(),
    timeout: 2_000,
  },
  {
    label: 'dialog containing a Create Exam button',
    build: (root) => root.locator('div[role="dialog"]:has(button:has-text("Create Exam"))').first(),
    timeout: 2_000,
  },
  {
    label: 'last dialog on the page',
    build: (root) => root.locator('div[role="dialog"]').last(),
    timeout: 8_000,
  },
];

/**
 * Inner locator (scoped to a card) that marks an exam as startable or still
 * generating. Used to pick a card we can actually act on.
 */
export const EXAM_CARD_ACTION_SELECTOR =
  'button:has-text("Begin Exam"), button:has-text("Resume Exam"), button:has-text("Generating Questions")';

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
