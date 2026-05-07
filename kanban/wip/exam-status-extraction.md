# Exam Status Extraction & Cleanup Plan

**Goal**: Make `BackendExamStatus` the single source of truth for all exam status logic. Eliminate legacy `status: string` (computed `PASSED`/`FAILED`) fields, convert `ExamProgressBadgeStatus` from a string union to an enum, and ensure every consumer derives display state strictly from `BackendExamStatus` through typed helper functions in `src/types/exam-status.ts`.

---

## Why this exists

Exam status handling in `certifai-app` evolved over time and now has duplicated logic, mixed typing, and fallback paths (for example `exam_status || status`) across SWR hooks and UI components.

The target architecture is:

- `BackendExamStatus` is the **single source of truth** for all runtime branching.
- `src/types/exam-status.ts` is the **single source of shared status contracts/helpers**.
- UI-specific display states are derived in one place and consumed consistently.

---

## Scope

### Included

- Frontend status types, helpers, SWR consumers, and UI consumers in `certifai-app`.
- Documentation and tests required for safe phased rollout.

### Excluded

- Backend API behavior/schema changes in this rollout.
- Any database or migration work.

---

## Current State (baseline)

1. Central file exists: `src/types/exam-status.ts`
   - `BackendExamStatus`
   - `DerivedExamStatus`
   - `getDerivedExamStatus`
   - `getExamStatusInfo`

2. Gaps still present
   - Some SWR/API types still use loose typing (`exam_status: string`).
   - Multiple consumers still use fallback logic (`exam_status || status`).
   - Some components re-implement status mapping logic inline.

3. Risk to manage
   - Potential API consistency mismatch between `exam_status` and deprecated `status`.

---

## Source-of-Truth Model

### Canonical runtime status

- `BackendExamStatus` (from API) drives all branching.

### Derived display status

- `DerivedExamStatus` is a deterministic mapping from exam fields (`exam_status`, `started_at`, `submitted_at`, `score`, `pass_score`) and is used strictly for UI presentation.

### Compatibility rule

- Deprecated `status` field may remain in DTOs temporarily for compatibility/telemetry, but **must not** drive business/UI branching after Phase 3.

---

## Implementation Operating Mode (to reduce rollout pressure)

### Execution principles

1. **One concern per PR**: type-only changes, logic-only changes, and test-only changes should not be mixed when avoidable.
2. **Small blast radius**: prefer 2-4 files per PR in early phases.
3. **No hidden behavior changes**: any behavior-affecting change must include a smoke checklist result in PR notes.
4. **Stop-on-red**: if typecheck or smoke fails, pause phase and rollback only that phase commit group.

### Suggested PR slicing template

- **PR-A (Types only)** — DTO type tightening, no logic change.
- **PR-B (Hook logic)** — Polling/status branching updates in SWR/hooks.
- **PR-C (UI consumer cleanup)** — Component mapping/helper adoption.
- **PR-D (Tests/docs)** — Unit/integration/e2e updates + doc deltas.

### Branch/commit discipline

- Keep each phase in its own branch or stacked branch sequence.
- Commit message prefixes:
  - `exam-status(types): ...`
  - `exam-status(hooks): ...`
  - `exam-status(ui): ...`
  - `exam-status(tests): ...`

### Definition of "safe to continue"

Proceed to next PR/phase only when all are true:

- Typecheck passes for touched scope.
- Smoke checklist is green.
- No unresolved TODO comments added during the phase.
- Rollback procedure for that phase is documented in PR notes.

---

## Phase Plan (independently testable)

## Phase 0 — Baseline Lock (pre-implementation)

### Goal

Establish inventory, gates, and rollback before changing behavior.

### Tasks

- Confirm all status-related files and consumers.
- Confirm risk points (`exam_status` optionality and `status` fallback usage).
- Define per-phase acceptance criteria.

### Test Gate

- Typecheck baseline passes for current branch.
- No behavior changes in this phase.

### Rollback

- N/A (documentation and planning only).

### Detailed implementation checklist

- [ ] Capture current references of fallback logic (`exam_status || status`) for before/after diff.
- [ ] Confirm all known consumers that branch on exam status.
- [ ] Save baseline screenshots/video (exam list + exam detail) for visual parity checks.
- [ ] Record baseline command results (typecheck + existing exam-related tests).

### Deliverables

A short baseline summary in PR description:

- files in scope
- known risky spots
- baseline verification output

---

## Phase 1 — Centralize Contracts & Low-Risk Consumer Alignment

### Goal

Ensure all shared status contracts live in `src/types/exam-status.ts` and migrate low-risk consumers first.

### Tasks

1. Tighten API typing where safe:
   - `src/types/swr-data/examInfo.ts`: `exam_status: string` -> `exam_status: BackendExamStatus`.
2. Remove obvious low-risk fallback usage:
   - `src/swr/examInfo.ts`: replace `exam_status || status` with `exam_status` for polling decision.
3. Reduce duplicated mapping logic in UI:
   - Add shared helper(s) to `src/types/exam-status.ts` for component status badge decisions.
   - Migrate `src/components/custom/ExamStatusCard.tsx` to use helper(s).

### Detailed implementation sequence (recommended)

1. **Type-only first**
   - Update `src/types/swr-data/examInfo.ts`:
     - import `BackendExamStatus`
     - change `exam_status: string` -> `exam_status: BackendExamStatus`
   - Ensure no runtime logic changes in this commit.

2. **Single-hook logic cleanup**
   - Update `src/swr/examInfo.ts` polling condition:
     - remove `|| status` fallback in this file only
     - keep behavior unchanged for generating polling interval values

3. **Shared helper introduction**
   - Add helper in `src/types/exam-status.ts` for `ExamStatusCard` badge status selection.
   - Helper should encode existing branch priority without changing semantics.

4. **Consumer migration**
   - Replace inline branching in `src/components/custom/ExamStatusCard.tsx` with new helper call.
   - Keep the rendered `StatusBadge` values exactly aligned with current behavior.

### Suggested PR split

- **PR 1.1 (types)**: `examInfo.ts` type tightening only.
- **PR 1.2 (hook)**: `useExamInfo` fallback cleanup.
- **PR 1.3 (ui helper)**: helper add + `ExamStatusCard` migration.

### Out of scope for this phase

- Broad removal of all fallback logic in all hooks/components.
- Optionality/shape changes with wider downstream impact.

### Test Gate (must pass before merge)

- Typecheck passes for touched files.
- No new type errors in `ExamStatusCard` / `useExamInfo` flows.
- Manual UI smoke:
  - generating exam shows generating badge
  - failed generation shows failed badge
  - ready exam shows ready badge
  - completed/submitted exam shows completed/passed/failed badge as before

### Rollback

- Revert Phase 1 commit set only.
- Restore prior inline mapping in `ExamStatusCard` and fallback read in `useExamInfo` if regression appears.

### Failure signals (pause criteria)

- Any badge value changes for unchanged backend status inputs.
- Polling no longer triggers during `QUESTIONS_GENERATING`.
- Type mismatch appears in downstream `examInfo` consumers.

---

## Phase 2 — Consumer Migration & Type Alignment

### Goal

Migrate broader consumers to centralized status helpers and align DTO optionality with actual backend contract.

### Tasks

1. `src/types/swr-data/exams.ts`
   - Reconcile `exam_status` optionality for list/detail/delete DTOs with backend contract.
2. Hook alignment
   - Migrate hooks (`useExamPageLogic`, `useExamStatusNotifications`, `useExamListGenerationMonitor`) to shared helpers where appropriate.
3. Component alignment
   - Remove ad hoc string/enum branching where helper usage is feasible.

### Detailed implementation sequence (recommended)

1. **DTO normalization step**
   - Align `exam_status` optionality across list/detail/delete types using backend contract reality.
   - Keep deprecated `status` field in type shape until Phase 3, but annotate non-authoritative use.

2. **Hook-by-hook migration**
   - `useExamPageLogic` first (highest centrality).
   - `useExamListGenerationMonitor` second.
   - `useExamStatusNotifications` third (ensure transition logic parity).

3. **Component harmonization**
   - Migrate `ExamCard`, `ExamEmptyState`, related status displays to shared helpers where appropriate.

### Suggested PR split

- **PR 2.1**: DTO optionality + comments/docs.
- **PR 2.2**: hook migrations only.
- **PR 2.3**: component migrations only.

### Test Gate

- Typecheck passes for all touched hooks/components.
- Component/hook tests for polling and status transitions pass.
- Manual smoke on exam list + exam detail pages shows unchanged UX labels/colors.

### Rollback

- Revert Phase 2 commits; keep Phase 1 intact.

### Failure signals (pause criteria)

- Any stale polling behavior (e.g., polling stuck after READY).
- Notification transition regressions (missing generating->ready or failure notice).
- UI labels/colors diverge from baseline without intended change.

---

## Phase 3 — Enforce `BackendExamStatus` as Single Source of Truth

### Goal

Eliminate distributed fallback branching on deprecated `status` and enforce enum-driven status logic everywhere.

### Tasks

1. Remove `exam_status || status` decision patterns across remaining SWR hooks.
2. Ensure all runtime decisions branch on `BackendExamStatus` only.
3. Add exhaustive handling where practical to catch future enum additions at compile time.

### Detailed implementation sequence (recommended)

1. Remove fallback reads from remaining SWR hooks one file at a time.
2. Add exhaustive checks/switch guards in shared helpers and transition utilities.
3. Keep compatibility fields in DTOs only if needed for transport/debugging, not branching.

### Suggested PR split

- **PR 3.1**: SWR fallback removals.
- **PR 3.2**: exhaustive handling and guard utilities.
- **PR 3.3**: compatibility cleanup + docs notes.

### Decision Gate (required)

- Confirm backend guarantees `exam_status` availability for relevant endpoints.

### Test Gate

- Global search confirms no active branching on deprecated `status`.
- Typecheck and lint pass.
- E2E lifecycle coverage passes for key transitions:
  - `QUESTIONS_GENERATING -> READY`
  - `READY -> IN_PROGRESS`
  - `IN_PROGRESS -> COMPLETED`
  - `QUESTION_GENERATION_FAILED` path

### Rollback

- Revert Phase 3 commits; retain Phase 1/2.

### Failure signals (pause criteria)

- Any endpoint returns missing/invalid `exam_status` and breaks rendering.
- Unhandled enum path discovered by exhaustive checks.
- E2E lifecycle transitions become flaky.

---

## Phase 4 — Hardening, Regression Safety, and Final Docs

### Goal

Finalize test coverage, transition documentation, and production rollout guidance.

### Tasks

- Add/update unit tests for derivation and status-info mappings.
- Add/update tests for notification/transition hooks.
- Finalize this doc with implementation notes and any contract clarifications discovered in rollout.

### Detailed implementation sequence (recommended)

1. Add deterministic unit coverage for:
   - `getDerivedExamStatus`
   - status info mapping helpers
   - any new transition helper
2. Add/expand hook tests for polling and notification transitions.
3. Add targeted e2e assertions for visible status progression.
4. Capture final "before vs after" behavior summary.

### Test Gate

- Targeted unit + integration tests pass.
- E2E exam flow tests pass.
- No status-regression bugs in smoke pass.

### Rollback

- Revert only hardening commits if needed; functional phases remain intact.

### Exit criteria

- New contributors can follow this doc and complete status changes without reverse-engineering existing logic.
- No reliance on tribal knowledge for status branching decisions.

---

## File Map (primary rollout files)

- `src/types/exam-status.ts`
- `src/types/swr-data/examInfo.ts`
- `src/types/swr-data/exams.ts`
- `src/swr/examInfo.ts`
- `src/swr/exams.ts`
- `src/swr/useExamLiveStatus.ts`
- `src/hooks/useExamPageLogic.ts`
- `src/hooks/useExamStatusNotifications.ts`
- `src/hooks/useExamListGenerationMonitor.ts`
- `src/components/custom/ExamStatusCard.tsx`
- `src/components/custom/ExamCard.tsx`
- `src/components/custom/ExamEmptyState.tsx`

---

## Acceptance Criteria for Final State

1. `BackendExamStatus` is the only source for runtime status branching.
2. Shared status contracts/helpers are centralized in `src/types/exam-status.ts`.
3. No duplicated status decision trees in components/hooks where shared helpers exist.
4. Deprecated `status` field, if kept, is non-authoritative.
5. Typecheck + tests + E2E all pass for status-related flows.

---

## Notes for rollout execution

- Keep each phase in separate PR(s) or commit groups for easy rollback.
- Prefer small patches and run checks after each group of changes.
- Do not combine Phase 3 enforcement with large unrelated refactors.

---

## Quick command checklist per phase

Use your normal project scripts, but keep this order:

1. Typecheck touched scope.
2. Run tests relevant to touched files.
3. Manual smoke on exam list + exam detail.
4. For Phase 3/4, run exam e2e lifecycle checks.

If any step fails, do not continue to next phase.

---

## Lightweight rollout log template (copy per phase)

- **Phase:**
- **PR(s):**
- **Files changed:**
- **Behavior changes intended:**
- **Typecheck result:**
- **Tests run + result:**
- **Manual smoke result:**
- **Rollback needed?** yes/no
- **Notes/edge cases discovered:**

---

## Rollout Progress (live)

### Phase 0 — Baseline Lock

- **Status:** ✅ completed
- **Commit:** 8cc2fdd (Init exam status extraction)
- **Notes:** Baseline established; existing exam status infrastructure documented before changes.

### Phase 1 — Centralize Contracts & Low-Risk Consumer Alignment

- **Status:** ✅ completed
- **Commit:** a927cbf (Extract exam statuses - phase 1)
- **Completed work:**
  1. **Type tightening:**
     - `src/types/swr-data/examInfo.ts`: `exam_status: string` → `exam_status: BackendExamStatus` ✅
  2. **Fallback removal:**
     - `src/swr/examInfo.ts`: removed `|| status` fallback in polling condition ✅
  3. **Shared helpers added to `src/types/exam-status.ts`:**
     - `isExamGeneratingStatus()` ✅
     - `isExamReadyStatus()` ✅
     - `isExamGenerationFailedStatus()` ✅
     - `isExamPendingQuestionsStatus()` ✅
     - `isGenerationCompletedTransition()` ✅
     - `isGenerationFailedTransition()` ✅
     - `getExamProgressBadgeStatus()` ✅
  4. **Component migration:**
     - `src/components/custom/ExamStatusCard.tsx`: migrated to use `getExamProgressBadgeStatus()` helper ✅
- **Validation summary:**
  - Typecheck: ✅ clean (only pre-existing unrelated errors in `stripe/client/swr.ts`)
  - Files changed: 11 files, +134 insertions, -63 deletions
- **Rollback status:** not required

### Phase 2 — Consumer Migration & Type Alignment

- **Status:** ✅ completed
- **Commit:** a927cbf (Extract exam statuses - phase 1) — note: both Phase 1 and 2 completed together
- **Completed work:**
  1. **DTO normalization in `src/types/swr-data/exams.ts`:**
     - `ExamListItemData.exam_status` changed from optional to required (`exam_status: BackendExamStatus`) ✅
     - `ExamDeleteData.exam_status` typed to `BackendExamStatus` ✅
     - `status` field marked `@deprecated non-authoritative for branching` in ExamListItemData and ExamDetailData ✅
  2. **Hook migrations (all use type guards/helpers):**
     - `src/hooks/useExamPageLogic.ts`: uses `isExamGeneratingStatus()` ✅
     - `src/hooks/useExamStatusNotifications.ts`: uses transition helpers (`isGenerationCompletedTransition`, `isGenerationFailedTransition`) ✅
     - `src/hooks/useExamListGenerationMonitor.ts`: uses `isExamGeneratingStatus()` ✅
     - `src/swr/useExamLiveStatus.ts`: uses type guards for convenience methods ✅
  3. **Component harmonization:**
     - `src/components/custom/ExamCard.tsx`: uses `DerivedExamStatus` enum values and `isExamGeneratingStatus()` ✅
     - `src/components/custom/ExamEmptyState.tsx`: uses type guards (`isExamGeneratingStatus`, `isExamGenerationFailedStatus`, `isExamPendingQuestionsStatus`) ✅
- **Validation summary:**
  - Typecheck: ✅ clean (only pre-existing unrelated errors)
  - No behavior drift observed in generating/ready/failed/pending UI states
  - All status branching now uses centralized helpers
- **Rollback status:** not required

### Phase 3 — Enforce BackendExamStatus as Single Source of Truth

- **Status:** 🔜 ready to begin
- **Remaining work:**
  1. Remove deprecated `status: string` field from:
     - `ExamListItemData` interface
     - `ExamDetailData` interface
     - `ExamInfoData` interface
  2. Remove `status` parameter from `getExamProgressBadgeStatus()` signature
  3. Update `ExamStatusCard.tsx` to pass `score` and `pass_score` instead of `status`
  4. Search for any remaining fallback reads (`exam_status || status`)
  5. Add exhaustive switch checks in `getDerivedExamStatus()`

### Phase 4 — Hardening, Regression Safety, and Final Docs

- **Status:** 🔜 not started
- **Planned work:**
  - Add unit tests for status derivation functions
  - Add E2E tests for exam lifecycle transitions
  - Final string literal audit
  - Update file header comments
