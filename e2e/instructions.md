# E2E Test Authoring Instructions

Unified rules for writing Playwright end-to-end tests in this project. All new tests must follow these conventions.

---

## 1. File & Folder Structure

```
e2e/
  *.spec.ts          # Test files — one feature domain per file
  fixtures/
    auth.ts          # Shared fixtures (authenticatedPage, performLogin, etc.)
  helpers/
    *.ts             # Domain-specific helper functions (e.g., exams.ts)
  instructions.md    # This file
```

- Place reusable multi-step actions in `helpers/`, not inline in spec files.
- Import fixtures from `./fixtures/auth` — never import directly from `@playwright/test` for auth-aware tests.

---

## 2. Test Structure

```ts
test.describe('Feature Name', () => {
  test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    testInfo.setTimeout(<ms>); // Always set explicit timeout
  });

  test('[Flow: A → B → C]', async ({ authenticatedPage }) => {
    // test body
  });
});
```

- Use descriptive flow-style test names: `'[Dashboard → Cert → Exams]'`.
- Set `testInfo.setTimeout(...)` in `beforeEach` — never inside the test body.
- Skip unstable or incomplete tests with `test.skip(...)`, never delete them.

---

## 3. Console Logging — Step Style

All tests **must** use this structured step-style logging. Do not log raw `testName` prefixes or ad-hoc strings.

### Test Header & Footer

```ts
console.log('\n================== EXAM FLOW TEST ==================');
// ... test body ...
console.log('\n================== TEST COMPLETE ==================');
console.log('✓ All steps completed successfully:');
console.log('  1. Step one summary');
console.log('  2. Step two summary');
console.log('====================================================');
```

### Step Headers

```ts
console.log('\n[STEP 1] Navigating to dashboard...');
console.log('\n[STEP 2] Registering a certification...');
```

### Sub-actions (indented with ` -`)

```ts
console.log('  - Waiting for breadcrumb to appear...');
console.log('  - Clicking "Register" button...');
```

### Outcomes

| Symbol | Meaning          | Example                                               |
| ------ | ---------------- | ----------------------------------------------------- |
| `✓`    | Success          | `console.log('✓ Dashboard DOM loaded');`              |
| `  ⚠`  | Warning/fallback | `console.log('  ⚠ Button not found, continuing...');` |
| `  ℹ`  | Informational    | `console.log('  ℹ Button state: enabled=true');`      |

Never use `✗` in log messages — throw an `Error` instead.

---

## 4. Error Handling

- **Always throw** a plain `Error` with a descriptive message when a required element is missing or a navigation fails. Do not log and continue.
- **Never** embed step/fixture names in error messages (no `testName ✗ ...` pattern).
- Use `.catch(() => false)` only for optional/resilient checks, not for required ones.

```ts
// ✓ Correct
if (!isVisible) {
  throw new Error('"Register Now" button not found on certifications page.');
}

// ✗ Wrong — swallows failures silently
await button.click().catch(() => {});
```

---

## 5. Element Selection Strategy

Use a fallback chain when selectors are fragile. Always log each fallback attempt.

```ts
// 1. Preferred: data-testid
let btn = page.locator('[data-testid="create-exam-modal"]');

// 2. Fallback: semantic text
if (!(await btn.isVisible({ timeout: 3000 }).catch(() => false))) {
  console.log('  ⚠ data-testid failed, trying text selector...');
  btn = page.locator('button:has-text("Create Exam")').first();
}

// 3. Last resort: structural/class selector
if (!(await btn.isVisible({ timeout: 2000 }).catch(() => false))) {
  console.log('  ⚠ Text selector failed, trying structural selector...');
  btn = page.locator('button[class*="from-violet"]').last();
}
```

Priority order: `data-testid` → semantic text → structural/class → generic role.

---

## 6. Waiting & Timeouts

- Prefer `waitFor({ state: 'visible', timeout: N })` over `waitForTimeout`.
- Use `waitForLoadState('domcontentloaded')` after navigation; avoid `'networkidle'` unless necessary (add a `.catch` warning if you do).
- Use `waitForURL(pattern, { timeout })` after clicks that trigger navigation.
- Do not use `waitForTimeout` except as a last resort for UI animation delays (max 1000ms).

```ts
// ✓ Preferred
await page.waitForURL(/\/main\/certifications\/\d+\/exams/, { timeout: 15000 });
await element.waitFor({ state: 'visible', timeout: 8000 });

// ✗ Avoid
await page.waitForTimeout(5000);
```

---

## 7. Helper Functions

Extract any multi-step reusable action into `helpers/`:

```ts
// helpers/exams.ts
export async function handleExamCreation(page: Page): Promise<void> { ... }
export async function deleteFirstExam(page: Page): Promise<{ success: boolean; error?: string }> { ... }
```

- Helper functions must use the same step-style logging as spec files.
- Do **not** accept a `testName` parameter for logging — use plain messages.
- Return structured results (`{ success, error }`) for fallible operations rather than throwing directly.

---

## 8. Authentication

- Use `authenticatedPage` fixture (from `./fixtures/auth`) for all tests requiring a logged-in user.
- Use bare `page` fixture only for auth flow tests (signup, login, logout).
- The `authenticatedPage` fixture handles auto-signup and caches auth state in `.auth/user.json`.

---

## 9. Skipped Tests

Keep skipped tests with `test.skip(...)` to preserve intent. Add a comment explaining why it is skipped.

```ts
test.skip('should delete an exam', async ({ authenticatedPage }) => {
  // Skipped: delete flow not yet implemented in UI
  ...
});
```
