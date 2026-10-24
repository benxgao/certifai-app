import type { Page } from '@playwright/test';

/**
 * Read the "DAILY EXAM LIMIT  x/y  exams created today" indicator.
 * Returns null when the widget is absent or its text can't be parsed.
 *
 * Lives in its own module (instead of `exams.ts`) because both the exam-creation
 * helper and the account-recovery helper need it, and `exams.ts` imports the
 * recovery helper — keeping it here avoids an import cycle.
 */
export async function readDailyExamQuota(
  page: Page,
): Promise<{ created: number; max: number } | null> {
  const text = await page
    .locator('body')
    .innerText()
    .catch(() => '');

  const match = text.match(/(\d+)\s*\/\s*(\d+)\s+exams created today/i);
  if (!match) return null;

  return { created: Number(match[1]), max: Number(match[2]) };
}
