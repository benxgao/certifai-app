# AI Assistant Guide

> **Source of truth**: `docs/` directory structure — this file navigates, not restates.
> **Last reviewed**: 2026-05-29
> **Owner**: Engineering team

## Purpose

This guide tells AI assistants _how_ to use the `docs/` knowledge base when working on a task. Instead of searching the codebase blind, load the relevant docs first — they describe invariants, dangerous areas, and conventions that are not obvious from code alone.

Do not load all docs. Load only what the current task requires. Use the task-type index below to pick the right docs.

---

## How to Use This Guide

1. Identify your task type from the index below.
2. Load the listed **primary docs** before reading or writing any code.
3. Check the **invariants** — these are hard constraints; violating them causes bugs or security issues.
4. Check the **anti-patterns** — these are common mistakes to avoid.
5. After implementation, confirm the **docs that need updating** as listed per task type.

Start with [`docs/ai/repo-map.md`](repo-map.md) if you are unfamiliar with the codebase or working on something that crosses multiple domains.

### Docs-First Retrieval Decision Flow

Follow this ordered decision path on every task before touching code:

1. **Identify** the task type in the [Task-Type Index](#task-type-index) below.
2. **Load** all listed primary docs for that task type.
3. **Assess sufficiency** — can the loaded docs answer the implementation decision fully?
   - **Yes → proceed** using docs as the primary context. Do not open source files unless the task explicitly requires reading implementation.
   - **No → fallback**: scan the codebase only when docs are **insufficient** because they are missing, ambiguous, contradictory, or known to be outdated for this specific decision.
4. **Record the gap**: if a code scan was needed, note which docs were insufficient and add them to the post-task update list.

This flow is docs-first by default. Codebase scanning is a fallback, not a starting point.

### Post-Task Docs-Update Trigger

After implementation, if code findings revealed that any spec doc was missing, incorrect, or incomplete:

1. Update the relevant doc before closing the task.
2. If the finding is structural (new file, renamed API, changed invariant), also update the applicable entry in [`docs/ai/assistant-context-index.md`](assistant-context-index.md).
3. Record what changed in the PR or rollout note so the update is traceable.

Skipping this step leaves the next assistant with the same insufficient docs context that required the fallback.

### Retrieval QA Requirement (When to Run Smoke Tests)

Run the manual retrieval protocol in [`docs/operations/ai-retrieval-smoke-tests.md`](../operations/ai-retrieval-smoke-tests.md) when:

1. You create, rename, or remove docs under `docs/`.
2. You modify task routing guidance in this file.
3. You add governance/workflow docs that assistants should discover during first-pass retrieval.

Record pass/fail results in the PR or rollout note, and fix routing/index docs before merge if any prompt fails.

---

## Task-Type Index

### 1. Adding or Modifying a Page or Route

**Primary docs to load**:

1. [`docs/architecture/nextjs-conventions.md`](../architecture/nextjs-conventions.md) — routing rules, layout hierarchy, `page.tsx`/`client.tsx` split, `loading.tsx` pattern
2. [`docs/ai/repo-map.md`](repo-map.md) — confirm whether route is public or protected (`/main/*`)

**Invariants**:

- Every route under `app/main/` is protected by `middleware.proxy.ts` — do not add auth checks inside the page itself.
- New pages must follow the `page.tsx` (server) + `client.tsx` (client component) split pattern.
- Every page with async data must have a `loading.tsx` sibling.

**Anti-patterns**:

- Calling API endpoints directly from a page component — use SWR hooks instead.
- Adding a layout file to `app/main/` that duplicates the existing `app/main/layout.tsx` structure.

**Docs to update after implementation**: `docs/architecture/nextjs-conventions.md` (if new pattern); `docs/ai/repo-map.md` (if new route domain).

---

### 2. Adding or Modifying a SWR Hook

**Primary docs to load**:

1. [`docs/api/swr-patterns.md`](../api/swr-patterns.md) — `useAuthSWR`, `useAuthMutation`, 4-generic-param rule for `useSWRMutation`
2. [`docs/api/api-connection.md`](../api/api-connection.md) — `ApiResponse<T>` shape, fetch config, error handling
3. [`docs/data/data-models.md`](../data/data-models.md) — type conventions, one type file per hook rule

**Invariants**:

- All `useSWRMutation` hooks that pass extra arguments must use 4 generic parameters: `useSWRMutation<Data, Error, Key, ExtraArg>`.
- Every hook must have a matching type file in `src/types/swr-data/`.
- No `any` types in hook return values or generic parameters.
- Do not call `fetch` directly from a hook — use `clientFetch` from `src/lib/client-fetch.ts`.

**Anti-patterns**:

- `data?.data` nesting when the response type already wraps in `ApiResponse<T>`.
- Missing generic type parameters on `useSWR` or `useAuthSWR`.

**Docs to update after implementation**: `docs/api/swr-patterns.md`; `docs/data/data-models.md`.

---

### 3. Adding or Modifying a Type or Data Model

**Primary docs to load**:

1. [`docs/data/data-models.md`](../data/data-models.md) — type file conventions, enum usage, `[key: string]: any` prohibition
2. [`docs/api/api-connection.md`](../api/api-connection.md) — `ApiResponse<T>` base type

**Invariants**:

- One type file per SWR hook file, located in `src/types/swr-data/`.
- Enums for all fixed value sets — no raw string literals.
- Fields optional (`field?: T`) only when the API genuinely omits them; check the actual API response shape.

**Anti-patterns**:

- Adding `[key: string]: any` to an interface — always add explicit fields instead.
- Duplicating a type that already exists in `src/types/swr-data/`.

**Docs to update after implementation**: `docs/data/data-models.md`.

---

### 4. Changing Auth Flow, JWT Handling, or Middleware

**Primary docs to load**:

1. [`docs/security/auth-patterns.md`](../security/auth-patterns.md) — `middleware.proxy.ts`, auth state machine, cookie lifecycle, Firebase Admin usage
2. [`docs/state/client-state.md`](../state/client-state.md) — `FirebaseAuthContext`, auth state transitions
3. [`docs/workflow/signin-workflow.md`](../workflow/signin-workflow.md) — signin/logout sequence details, cookie lifecycle troubleshooting
4. [`docs/workflow/signup-workflow.md`](../workflow/signup-workflow.md) — signup verification sequence, timeout behavior, UAT differences

**Invariants**:

- `src/firebase/firebaseAdminConfig.ts` is **server-only** — never import it in client components or `src/swr/`.
- JWT verification for `/main/*` routes must go through `middleware.proxy.ts`, not inside individual pages.
- Auth cookie lifecycle is managed exclusively by `app/api/auth-cookie/` routes.
- Use `src/lib/auth-state-manager.ts` for state transitions — do not add ad-hoc auth logic elsewhere.

**Anti-patterns**:

- Calling `verifyTokenByAdmin` from a client component.
- Bypassing `middleware.proxy.ts` by adding `getServerSideProps` or route-level auth.
- Storing tokens in `localStorage` — cookies only.

**Docs to update after implementation**: `docs/security/auth-patterns.md`; `docs/state/client-state.md` if context providers change.

---

### 4A. Adding or Modifying Billing / Stripe Behavior

**Primary docs to load**:

1. [`docs/billing/stripe-billing.md`](../billing/stripe-billing.md) — account context, checkout flow, callback route, billing page invariants
2. [`docs/state/client-state.md`](../state/client-state.md) — `AccountContext` role in shared client state
3. [`docs/architecture/feature-flags.md`](../architecture/feature-flags.md) — `STRIPE_INTEGRATION` gate behavior

**Invariants**:

- Do not call Stripe-related API endpoints directly from presentational components.
- Prefer `AccountContext` for shared billing reads across dashboard and billing surfaces.
- Checkout completion does not imply immediate subscription activation — the callback flow must refresh/poll account status.
- Billing UI must respect the `STRIPE_INTEGRATION` feature flag.

**Anti-patterns**:

- Reading billing state from ad hoc `fetch()` calls instead of `AccountContext` or Stripe hooks.
- Redirecting users into new Checkout when they already have an active subscription.

**Docs to update after implementation**: `docs/billing/stripe-billing.md`; `docs/state/client-state.md` if context fields change; `docs/architecture/feature-flags.md` if gating changes.

---

### 4B. Changing Exam Lifecycle, Polling, or Report Flow

**Primary docs to load**:

1. [`docs/workflow/exam-lifecycle-workflow.md`](../workflow/exam-lifecycle-workflow.md) — lifecycle sequence and polling boundaries
2. [`docs/api/swr-patterns.md`](../api/swr-patterns.md) — hook conventions and generic rules
3. [`docs/data/data-models.md`](../data/data-models.md) — exam response/type shapes

**Invariants**:

- Exam creation and exam readiness are different phases.
- Generation polling must stop once the exam leaves generating status.
- Submission must revalidate the current exam state and list views.
- Report fetching/generation is only valid after completion.

**Anti-patterns**:

- Polling indefinitely after an exam reaches `READY`, `COMPLETED`, or failure.
- Treating deprecated generation hooks as the preferred new implementation path.

**Docs to update after implementation**: `docs/workflow/exam-lifecycle-workflow.md`; `docs/api/swr-patterns.md`; `docs/data/data-models.md` if response shapes change.

---

### 11. Debugging Signup Verification or Marketing Subscription Flow

**Primary docs to load**:

1. [`docs/workflow/signup-workflow.md`](../workflow/signup-workflow.md) — signup + verification operational flow
2. [`docs/workflow/signin-workflow.md`](../workflow/signin-workflow.md) — post-verification signin transition behavior
3. [`docs/api/marketing-subscription-workflow.md`](../api/marketing-subscription-workflow.md) — Step 7–12 marketing pipeline (route → Lambda → MailerLite)
4. [`docs/api/api-connection.md`](../api/api-connection.md) — API envelope and request/response conventions

**Invariants**:

- Marketing subscription failure must remain non-blocking to signup completion.
- Verification-triggered marketing calls should be routed through `app/api/marketing/subscribe` and server integration helpers.

**Anti-patterns**:

- Treating marketing failures as auth-blocking failures.
- Duplicating signup lifecycle details in API docs instead of linking to security workflow docs.

**Docs to update after implementation**: `docs/workflow/signup-workflow.md`, `docs/api/marketing-subscription-workflow.md`, and `docs/api/api-connection.md` when contracts change.

---

### 11A. Changing SEO, Sitemap, or Structured Data

**Primary docs to load**:

1. [`docs/architecture/seo-patterns.md`](../architecture/seo-patterns.md) — metadata factories, structured data helpers, sitemap and robots rules
2. [`docs/architecture/server-actions.md`](../architecture/server-actions.md) — server-only public data fetching for sitemap/dynamic public pages
3. [`docs/architecture/nextjs-conventions.md`](../architecture/nextjs-conventions.md) — route/component placement conventions

**Invariants**:

- Public metadata should be generated through `generateMetadata()` or its specialized wrappers.
- Protected routes must not leak into sitemap/robots allow-lists.
- Shared SEO constants belong in `src/config/seo.ts`, not scattered across routes.

**Anti-patterns**:

- Hardcoding canonical URLs or social metadata repeatedly in page files.
- Pulling authenticated dashboard data into sitemap generation.

**Docs to update after implementation**: `docs/architecture/seo-patterns.md`; `docs/ai/repo-map.md` if public route structure changes.

---

### 11B. Changing Error Contracts or Error UX

**Primary docs to load**:

1. [`docs/architecture/error-handling.md`](../architecture/error-handling.md) — envelope errors, SWR transport errors, custom feature errors, error boundaries
2. [`docs/api/api-connection.md`](../api/api-connection.md) — API envelope conventions
3. [`docs/api/swr-patterns.md`](../api/swr-patterns.md) — SWR hook error-handling expectations

**Invariants**:

- Use structured error envelopes when the UI needs retry/classification metadata.
- Keep render-boundary handling (`ErrorBoundary`) separate from request-state handling.
- Preserve contextual custom errors when downstream UI needs item-specific failure context.

**Anti-patterns**:

- Throwing plain strings for errors that need status or response-body context.
- Using `ErrorBoundary` as the only error strategy for fetch-driven UI.

**Docs to update after implementation**: `docs/architecture/error-handling.md`; `docs/api/api-connection.md`; `docs/api/swr-patterns.md` if transport conventions change.

---

### 5. Adding or Modifying a UI Component

**Primary docs to load**:

1. [`styleguide/README.md`](../../styleguide/README.md) — styleguide entry point and docs bridge contract
2. [`docs/style/conventions.md`](../style/conventions.md) — Tailwind, shadcn/ui, `cn()`, dark mode requirement, component location rules
3. [`docs/ai/repo-map.md`](repo-map.md) — confirm correct `src/components/` subdirectory

**Invariants**:

- Always use `cn()` from `src/lib/utils.ts` for conditional class merging — never string concatenation.
- Dark mode variants are required on every new component.
- Use existing shadcn/ui primitives from `src/components/ui/` before creating new ones.
- Domain-specific components belong in `src/components/custom/`; auth in `src/components/auth/`; billing in `src/components/billing/`.

**Anti-patterns**:

- Inline `style={{}}` for things achievable with Tailwind.
- Adding new shadcn/ui components without checking if they already exist in `src/components/ui/`.

**Docs to update after implementation**: `styleguide/README.md` (if styleguide structure or routing contract changes); `docs/style/conventions.md` (if new pattern introduced); `docs/ai/assistant-context-index.md` (if styleguide routing entry changes).

---

### 6. Adding or Modifying a Context Provider

**Primary docs to load**:

1. [`docs/state/client-state.md`](../state/client-state.md) — provider responsibilities, Context vs SWR decision boundary, provider hierarchy

**Invariants**:

- Context is for auth state and user identity — not for domain data (certifications, exams, etc.).
- Domain data always lives in SWR hooks (`src/swr/`), not in Context.
- New providers must be added to the `app/layout.tsx` or `app/main/layout.tsx` provider stack in the correct order.

**Anti-patterns**:

- Using Context to cache API responses — use SWR for that.
- Creating a new Context that duplicates what `UserProfileContext` or `UserCertificationsContext` already provides.

**Docs to update after implementation**: `docs/state/client-state.md`.

---

### 7. Adding or Modifying Rate Limiting or Performance Utilities

**Primary docs to load**:

1. [`docs/performance/patterns.md`](../performance/patterns.md) — SWR caching config, `useOptimizedForm`, `useOptimizedRateLimit`, `useOptimizedScroll`, `rate-limiting.ts`

**Invariants**:

- Rate-limiting logic belongs in `src/lib/rate-limiting.ts` — do not duplicate in individual hooks or components.
- SWR `dedupingInterval` and `revalidateOnFocus` options must be configured intentionally per hook, not globally overridden.

**Anti-patterns**:

- Adding debounce logic directly inside a component that already has a `useOptimizedForm` hook.

**Docs to update after implementation**: `docs/performance/patterns.md`.

---

### 8. Adding or Modifying Tests

**Primary docs to load**:

1. [`docs/testing/strategy.md`](../testing/strategy.md) — unit test patterns (`__tests__/`), E2E authoring guide (`e2e/`), fixture conventions, setup file

**Invariants**:

- All authenticated E2E tests must use the `authenticatedPage` fixture from `e2e/fixtures/auth`.
- Unit tests live in `__tests__/`; E2E tests live in `e2e/`.
- Test environment config is in `__tests__/setup.ts` — do not duplicate setup in individual test files.

**Anti-patterns**:

- Adding E2E test logic that re-implements auth manually instead of using the fixture.
- Swallowing errors silently in E2E helpers — always throw `Error` on failure.

**Docs to update after implementation**: `docs/testing/strategy.md` (if new fixture or pattern introduced).

---

### 9. Writing or Updating a Rollout Plan

**Primary docs to load**:

1. [`docs/ai/assistant-context-index.md`](assistant-context-index.md) — confirm which docs exist before listing docs to create/update
2. [`docs/operations/docs-maintenance.md`](../operations/docs-maintenance.md) — update trigger table to identify which docs are affected
3. Template: `ai_oriented_kanban/templates/rollout-plan-template.md`
4. [`docs/operations/spec-first-kanban-integration.md`](../operations/spec-first-kanban-integration.md) — spec-first policy contract and reviewer gates

**Invariants**:

- Every rollout plan must include a `## Docs Impact` section listing docs checked, docs to create/update/delete.
- Every rollout plan must declare `Docs Needed` before implementation planning starts.
- Every rollout plan must include a `Planning Decision Evidence Log` for major decisions (`Decision`, `Docs cited`, `Sufficiency verdict`, `Fallback code scan used?`, `Doc update action`).
- Every rollout plan must include mandatory closing phases in order: `## Docs Sync` (Phase N), `## AI-ready docs reflection and next-plan handoff` (Phase N+1), `## Docs-only Simulation Drill` (Phase N+2), and `## Rollout Eval & Health Score` (Phase N+3).
- Every rollout plan must include a `## Docs-only Simulation Drill` phase before final eval so comparable work can be replayed from docs/specs.
- Check `docs/ai/assistant-context-index.md` before listing a doc as "to create" — it may already exist.

**Anti-patterns**:

- Omitting the docs-sync phase because the plan "doesn't touch docs" — every code change has potential doc impact.
- Duplicating documentation content across multiple docs instead of linking.
- Using fallback code scan without recording which docs were insufficient and what docs were updated.

---

### 12. Running Docs-Only Simulation Readiness

**Primary docs to load**:

1. [`docs/ai/project-simulation-readiness.md`](project-simulation-readiness.md) — rubric, scoring, and run-log format
2. [`docs/operations/spec-first-kanban-integration.md`](../operations/spec-first-kanban-integration.md) — policy and evidence requirements
3. [`docs/operations/ai-retrieval-smoke-tests.md`](../operations/ai-retrieval-smoke-tests.md) — simulation-related prompts and pass criteria

**Invariants**:

- Simulation output must include `Docs Needed` and a complete decision-evidence table.
- Fallback code scans are allowed only when justified and must trigger same-rollout docs remediation.
- A simulation run is not passable if major decisions cannot be traced to cited docs.

**Anti-patterns**:

- Running simulation as a narrative note without measurable score/verdict.
- Treating ambiguous docs as acceptable without creating update actions.

**Docs to update after implementation**: `docs/ai/project-simulation-readiness.md`; `docs/operations/ai-retrieval-smoke-tests.md` when prompt quality or criteria change.

---

### 10. Cross-Domain or Unknown Task

If your task does not fit a single category above, load in this order:

1. [`docs/ai/repo-map.md`](repo-map.md) — establish system boundary and identify which domains are involved
2. [`docs/ai/assistant-context-index.md`](assistant-context-index.md) — navigate to domain-specific docs
3. Load each relevant domain doc before writing code

---

## Quick Danger Check

Before writing any code, confirm none of these apply:

| Risk                                      | Check                                                         |
| ----------------------------------------- | ------------------------------------------------------------- |
| Importing Firebase Admin in a client file | `src/firebase/firebaseAdminConfig.ts` is server-only          |
| Calling API fetch outside SWR             | All data must flow through `src/swr/` hooks                   |
| Using `any` type                          | Prohibited — use explicit interfaces in `src/types/swr-data/` |
| Missing dark mode styles                  | Required on every component                                   |
| Auth logic outside middleware             | JWT guard lives in `middleware.proxy.ts` only                 |
| Storing tokens in localStorage            | Cookies only, managed by `app/api/auth-cookie/`               |

---

## Related Docs

- [`docs/ai/repo-map.md`](repo-map.md)
- [`docs/ai/assistant-context-index.md`](assistant-context-index.md)
- [`docs/operations/docs-maintenance.md`](../operations/docs-maintenance.md)
- [`docs/operations/spec-first-kanban-integration.md`](../operations/spec-first-kanban-integration.md)
- [`docs/ai/project-simulation-readiness.md`](project-simulation-readiness.md)
