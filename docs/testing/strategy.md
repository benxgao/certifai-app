# Testing Strategy

> **Source of truth**: `__tests__/` (6 unit files), `e2e/` (Playwright), `__tests__/setup.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the two-layer testing strategy (unit + E2E), the test file inventory, fixture patterns, environment setup, and coverage targets for `certifai-app`.

## Test Layers

| Layer | Location | Runner | When to use |
| ----- | -------- | ------ | ----------- |
| Unit | `__tests__/` | Jest + jsdom | Logic, hook contracts, error-contract shapes, pure functions |
| E2E | `e2e/` | Playwright | Full user flows, auth, navigation, rendering |

## Unit Test Inventory (`__tests__/`)

| File | What it covers |
| ---- | -------------- |
| `exam-status.test.ts` | `ExamStatus` enum values and status transition logic |
| `exam-cert-error-contract.test.tsx` | Error response contract shape for exam/cert API calls |
| `exam-report-phase1-flow-shape.test.ts` | Phase 1 exam report data shape validation |
| `exam-report-task-idempotency.test.ts` | Idempotency of exam report task generation |
| `demo-credentials-provider.test.ts` | `DemoCredentialsProvider` hook and display logic |
| `use-demo-credentials-reveal.test.tsx` | `useDemoCredentialsReveal` hook behaviour |
| `example.test.ts` | Sanity-check template — can be removed |

## Environment Setup (`__tests__/setup.ts`)

Applied before every unit test. Provides:

- `globalThis.IS_REACT_ACT_ENVIRONMENT = true` — required for React 19 `act()` in jsdom.
- `next/navigation` mocked: `useRouter`, `usePathname`, `useSearchParams`.
- `firebase/app` mocked: `initializeApp`.
- `firebase/auth` mocked: `getAuth`, `signInWithEmailAndPassword`, `signOut`.

Never add network calls or real Firebase initialization in unit tests — all Firebase calls must be mocked.

## E2E Tests (`e2e/`)

Playwright tests cover full user flows. Run with:

```bash
npx playwright test
```

Configuration: `playwright.config.ts` at the root.

E2E tests use an `authenticatedPage` fixture for flows that require sign-in. Never hardcode credentials in test files — use environment variables via `.env.test`.

## Test Conventions

- **Step logging**: use `[STEP N]`, `✓ success`, `⚠ warning` console output in E2E helpers for readable CI logs.
- **Error contracts**: shape/contract tests belong in `__tests__/` even if the component is in `src/` — they test the API boundary, not the UI.
- **Idempotency tests**: any mutation hook that triggers background jobs must have an idempotency test.
- **No real network calls in unit tests** — all `fetch` and Firebase calls must be mocked.
- **TypeScript in tests** — test files must be `.ts` or `.tsx`, never `.js`.

## Running Tests

```bash
# Unit tests
npx jest

# Unit tests with coverage
npx jest --coverage

# E2E tests (requires running dev server or separate target URL)
npx playwright test

# E2E tests with UI
npx playwright test --ui
```

## Coverage Targets

| Layer | Target |
| ----- | ------ |
| Unit — hook contracts | 100% of `src/swr/` error paths |
| Unit — type/enum | 100% of `src/types/exam-status.ts` |
| E2E — critical flows | sign-in, exam creation, exam submission, sign-out |

## Dangerous Areas / Anti-patterns

- **Never** leave `example.test.ts` in a file that runs in CI — replace with a real test or delete it.
- **Never** use `any` in test assertions — defeats the purpose of contract tests.
- **Never** `console.error` suppress in test `setup.ts` — hidden errors mask real failures.
- **Never** share mutable state between test cases — use `beforeEach` to reset all mocks.

## Related Docs

- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [Data Models](../data/data-models.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
