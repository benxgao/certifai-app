# Rollout: AI Report Hotfix (Exam Report 500 + Cert Summary Prerequisite Mismatch)

## Summary

Users are hitting a blocking failure after completing exams: the AI Exam Report endpoint returns 500, and the AI Learning Journey summary then incorrectly reports insufficient completed exam reports. Investigation confirms a generation-path schema failure (`difficulty_adjustments` missing in AI output), compounded by retry semantics that allow failures to be dropped without recovery.

This rollout enforces strict correctness first: report generation must either persist valid data or fail in a retriable way. We then align backend/frontend error contracts so UI states are accurate, actionable, and resumable across long-running implementation and rollout windows.

## Current Evaluation

### What already exists

- Firestore-backed exam report storage and retrieval.
- Cert summary generation based on Firestore exam reports.
- Cloud Task-based background report generation.
- Frontend proxy routes and SWR hooks for both report/summary flows.

### What is not centralized / stable / complete yet

#### 1. Report generation contract is fragile

- AI output sometimes fails schema validation due to missing `difficulty_adjustments`.
- Failure path does not provide a stable error code contract for downstream handling.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts`
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts`

#### 2. Task failure semantics are not retry-friendly

- Background handler currently returns HTTP 200 even on generation failure.
- Retries are therefore skipped, creating missing Firestore reports for completed exams.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts`
- `/Users/benxgao/workspace/certifai-api/functions/src/services/cloudTasks/examReportTaskService.ts`

#### 3. Cert summary prerequisite errors are accurate but not diagnosable enough

- Summary requires >=2 exam reports from Firestore, but error output is not granular enough for UX/actions.
- Auto-generation path can mask upstream generation cause as generic failure.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/certSummaryFirestore.ts`
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/certifications/getCertSummary.ts`

#### 4. Frontend error contract is inconsistent across routes/hooks

- Exam report and cert summary proxy routes shape errors differently.
- SWR fetchers parse and display failures differently, causing duplicate/unclear messages.

Representative files:

- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/exams/[exam_id]/exam-report/route.ts`
- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/certifications/[cert_id]/cert-summary/route.ts`
- `/Users/benxgao/workspace/certifai-app/src/swr/examReport.ts`
- `/Users/benxgao/workspace/certifai-app/src/swr/certSummary.ts`

### Risks in the current state

- [ ] Completed exams can remain permanently missing reports if generation fails once.
- [ ] Cert summary can continue failing despite enough completed exams in Prisma.
- [ ] Users receive low-actionability errors, increasing support load.

## Scope

- Estimated files to create: 2
- Estimated files to modify: 11
- Risk level: High

### In scope

- Enforce retriable task failure semantics for report generation.
- Harden AI generation output handling and error classification.
- Improve cert summary prerequisite diagnostics while preserving business rule (>=2 reports).
- Normalize frontend route/SWR error contracts and UI messages.
- Add backend/frontend tests for regressions and resume-safe validation.

### Out of scope

- Changing business rule for minimum reports required.
- Reworking adaptive-learning scoring algorithms.
- Large UX redesign of exam/cert cards.

## Context Map

### Files to modify first

| File                                                                                          | Purpose                       | Why it matters                                          |
| --------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts`          | Task result semantics         | Controls retry/no-retry behavior for failed generations |
| `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts` | Core generation + persistence | Central choke point for valid report creation           |
| `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts`  | Genkit output contract        | Source of schema mismatch failures                      |

### Likely files to create

| File                                                                                   | Purpose                                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/Users/benxgao/workspace/certifai-api/functions/__tests__/exam-report-hotfix.test.ts` | Backend regression tests for schema failure + task retry semantics |
| `/Users/benxgao/workspace/certifai-app/__tests__/exam-cert-error-contract.test.ts`     | Frontend regression tests for route/SWR error normalization        |

### Dependencies / related patterns

| File                                                                                             | Relationship                                               |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/exams/getExamReport.ts` | User-facing exam report mapping on top of core generator   |
| `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/examReportFirestore.ts`   | Firestore report source used by cert summary prerequisites |
| `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/certSummaryFirestore.ts`  | Summary generation depends on report availability          |
| `/Users/benxgao/workspace/certifai-app/src/components/custom/ExamReport.tsx`                     | Displays exam-report errors directly                       |
| `/Users/benxgao/workspace/certifai-app/src/components/custom/CertSummary.tsx`                    | Displays cert-summary errors via parsed messaging          |

### Risks

- [ ] Over-retrying truly permanent failures if error classification is too broad.
- [ ] Inconsistent status-code choices (400/409/500) can break existing UI behavior.

## Recommended Architecture

### Principle 1: Valid-or-retriable generation

Report generation must end in exactly one of two states: persisted valid report, or explicit retriable failure (5xx + retriable metadata). No silent success and no ambiguous partial persistence.

### Principle 2: Stable cross-layer error contract

All layers should exchange the same core shape (`success`, `error`, `error_code`, `retriable`, optional `details`) so route proxies, SWR hooks, and UI can render deterministic states.

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless explicitly noted as contract alignment.**

Dependency chain: Genkit generation → API generation/persistence layer → Task retry semantics → User-facing endpoints → Next.js proxy routes → SWR hooks/UI messaging → tests.

Mixed-layer edits in a single phase are risky because they hide root-cause regressions and complicate rollback. Each phase below keeps boundaries clear and uses a verification gate before downstream work proceeds.

## Commit Slicing Rule

> **A phase may be split into sub-subphases when review size or QA burden is too large for one safe commit.**

### Rules for sub-subphases

- Each sub-subphase is independently reviewable and revertible.
- Each sub-subphase ends with explicit independent verification.
- If a missing prerequisite appears, add an earlier-layer fix sub-subphase instead of patching downstream.
- Do not split in a way that introduces temporary broken imports/contracts.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [ ] Phase 1 — Error Contract Baseline
- [ ] Phase 2 — Task Retry Correctness
- [ ] Phase 3 — Report Generator Hardening
- [ ] Phase 4 — Cert Summary Prerequisite Diagnostics
- [ ] Phase 5 — Frontend Contract Normalization
- [ ] Phase 6 — Test Coverage and Regression Gates
- [ ] Phase 7 — Backfill + Rollout Monitoring

## Phases

### Phase 1: Error Contract Baseline

**Progress**: `[ ]`

**Layer**: `certifai-api core error contract`

**Goal**: Define and apply a stable error payload contract across generation-related backend paths.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts` — modify — normalize thrown error typing and mapping details.
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/exams/getExamReport.ts` — modify — map to stable response shape.

**Verification gate** (must pass before Phase 2 starts):

- `npx tsc --noEmit 2>&1 | grep "^(src|functions/src)/"` (from `certifai-api/functions`) has no new errors.
- Manual request of known failing exam returns structured error with `error_code` + `retriable`.

**Sub-subphase checklist**:

- [ ] **1.1 — Define canonical error map**: introduce central mapping table for generation path (`GENKIT_SCHEMA_INVALID`, `EXAM_NOT_FOUND`, `ACCESS_DENIED`, `REPORT_PERSISTENCE_FAILED`, `REPORT_GENERATION_TRANSIENT`).
  - **Independent verification**: unit-level assertion (or temporary debug log) confirms mapping outputs expected status + retriable flag.
- [ ] **1.2 — Apply map to exam report endpoint errors**: ensure GET/POST exam-report routes always emit canonical shape.
  - **Independent verification**: simulated failures return expected JSON shape; no duplicated nested JSON string in `error`.

---

### Phase 2: Task Retry Correctness

**Progress**: `[ ]`

**Layer**: `certifai-api task execution semantics`

**Goal**: Ensure failed report generation is retried by Cloud Tasks instead of being swallowed as success.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts` — modify — return 5xx for retriable generation/storage failures.
- `/Users/benxgao/workspace/certifai-api/functions/src/services/cloudTasks/examReportTaskService.ts` — modify — verify/enforce retry settings and headers.
- `/Users/benxgao/workspace/certifai-api/functions/src/services/cloudTasks/cloudTaskQueueManager.ts` — modify (if needed) — bounded retry/backoff defaults.

**Verification gate** (must pass before Phase 3 starts):

- Failed generation attempt returns 5xx from task handler.
- Same payload retried by queue (local emulator logs or staging logs confirm retry count increments).

**Sub-subphase checklist**:

- [ ] **2.1 — Task failure classification**: split permanent 4xx vs retriable 5xx in task handler.
  - **Independent verification**: invalid payload returns 400; schema-generation error returns 500.
- [ ] **2.2 — Retry policy safety check**: confirm retry cap/backoff and idempotency assumptions.
  - **Independent verification**: repeated retries do not create duplicate report docs for same `exam_id`.

---

### Phase 3: Report Generator Hardening

**Progress**: `[ ]`

**Layer**: `certifai-api AI generation contract`

**Goal**: Guarantee report write only happens for schema-valid output; attach precise cause on failure.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts` — modify — explicit guards around required output keys.
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts` — modify — persist only after full validation.

**Verification gate** (must pass before Phase 4 starts):

- Forced missing `difficulty_adjustments` path returns canonical schema error (not generic 500 text).
- No Firestore report persisted on invalid output.

**Sub-subphase checklist**:

- [ ] **3.1 — Genkit output validator hardening**: assert required fields and throw typed schema error.
  - **Independent verification**: mocked/truncated model output fails with `GENKIT_SCHEMA_INVALID`.
- [ ] **3.2 — Persistence guardrails**: write report only from validated payload.
  - **Independent verification**: Firestore read for failed exam id returns null.

---

### Phase 4: Cert Summary Prerequisite Diagnostics

**Progress**: `[ ]`

**Layer**: `certifai-api summary domain logic`

**Goal**: Keep the >=2 reports rule while making failure reasons explicit and actionable.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/certSummaryFirestore.ts` — modify — include report count context in prerequisite failures.
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/certifications/getCertSummary.ts` — modify — deterministic status + `error_code` mapping for prerequisite/pending states.

**Verification gate** (must pass before Phase 5 starts):

- User with <2 reports gets domain error with available count and clear action.
- User with >=2 valid reports can auto-generate summary successfully.

**Sub-subphase checklist**:

- [ ] **4.1 — Structured prerequisite errors**: include `{ required_reports, available_reports, cert_id }` in details.
  - **Independent verification**: response payload includes details and stable `error_code`.
- [ ] **4.2 — Auto-generation error propagation cleanup**: stop masking upstream cause as generic not-found.
  - **Independent verification**: schema failure upstream appears as generation failure, not 404-not-found messaging.

---

### Phase 5: Frontend Contract Normalization

**Progress**: `[ ]`

**Layer**: `certifai-app proxy + SWR + UI messaging`

**Goal**: Ensure frontend parses one consistent contract and renders clear, non-duplicative error messaging.

**Files**:

- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/exams/[exam_id]/exam-report/route.ts` — modify — stable passthrough JSON error normalization.
- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/certifications/[cert_id]/cert-summary/route.ts` — modify — same contract as exam-report route.
- `/Users/benxgao/workspace/certifai-app/src/swr/examReport.ts` — modify — parse canonical contract + map `error_code`.
- `/Users/benxgao/workspace/certifai-app/src/swr/certSummary.ts` — modify — parse canonical contract + consistent retry policy.
- `/Users/benxgao/workspace/certifai-app/src/components/custom/ExamReport.tsx` — modify — message mapping for retriable vs terminal.
- `/Users/benxgao/workspace/certifai-app/src/components/custom/CertSummary.tsx` — modify — aligned message semantics.

**Verification gate** (must pass before Phase 6 starts):

- UI no longer shows duplicated message pattern like `Failed to fetch exam report: Failed to fetch exam report`.
- Retryable backend failures display “generation in progress / retrying” style guidance.

**Sub-subphase checklist**:

- [ ] **5.1 — Route normalization**: both proxy routes return canonical error envelope.
  - **Independent verification**: network panel shows identical key set for both endpoints on error.
- [ ] **5.2 — SWR fetcher alignment**: shared parser for `error_code` and `retriable` handling.
  - **Independent verification**: mocked responses produce expected typed errors in both hooks.
- [ ] **5.3 — UI state copy cleanup**: remove duplicate phrasing; render actionable status by error class.
  - **Independent verification**: visual QA on exam card/cert card error states.

---

### Phase 6: Test Coverage and Regression Gates

**Progress**: `[ ]`

**Layer**: `tests`

**Goal**: Lock in behavior so failures do not regress after rollout.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/__tests__/exam-report-hotfix.test.ts` — create — backend failure/retry/contract tests.
- `/Users/benxgao/workspace/certifai-app/__tests__/exam-cert-error-contract.test.ts` — create — frontend route/SWR contract tests.

**Verification gate** (must pass before Phase 7 starts):

- Targeted backend test file passes.
- Targeted frontend test file passes.
- TypeScript checks pass in both repos.

**Sub-subphase checklist**:

- [ ] **6.1 — Backend contract tests**: validate status + error_code + retriable semantics.
  - **Independent verification**: failing model-output fixture yields expected retriable response path.
- [ ] **6.2 — Frontend contract tests**: validate parser/message behavior for both endpoints.
  - **Independent verification**: fixtures cover 400/403/404/500 and retriable flags.

---

### Phase 7: Backfill + Rollout Monitoring

**Progress**: `[ ]`

**Layer**: `operations`

**Goal**: Recover affected historical data and safely monitor rollout quality.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/scripts/testAutomaticExamReports.ts` — modify (or derive ops script) — re-enqueue missing reports for completed exams.
- `/Users/benxgao/workspace/certifai-api/functions/docs/operations/` (new or existing markdown) — create/modify — rollout runbook and metrics checklist.

**Verification gate**:

- Backfill identifies completed exams without reports and re-queues successfully.
- Monitoring confirms report-generation failures trend down and cert-summary success trend up.

**Sub-subphase checklist**:

- [ ] **7.1 — Missing report discovery query/script**: list completed exams lacking Firestore report docs.
  - **Independent verification**: dry-run output matches sampled manual records.
- [ ] **7.2 — Controlled backfill execution**: re-enqueue in batches with retry monitoring.
  - **Independent verification**: sample users regain report + summary functionality.

## Dependency Graph

```text
Genkit output contract
	↓
Exam report generation/persistence
	↓
Task retry semantics
	↓
User-facing API endpoints
	↓
Next.js proxy routes
	↓
SWR fetchers + UI messaging
	↓
Regression tests + rollout ops
```

Each arrow means "depends on". Do not finalize downstream layers before upstream verification gate passes.

## Suggested Implementation Order

1. Phase 1.1 → 1.2
2. Phase 2.1 → 2.2
3. Phase 3.1 → 3.2
4. Phase 4.1 → 4.2
5. Phase 5.1 → 5.2 → 5.3
6. Phase 6.1 → 6.2
7. Phase 7.1 → 7.2

If a downstream gap appears, add/fix an isolated earlier-layer sub-subphase and resume.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and the active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short "Session Note" at bottom:
   - Date/time
   - Last completed sub-subphase
   - Current blocker (if any)
   - Exact next command/test to run first on resume
4. If blocked, mark current item `[!]` and note unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>
```

## Essential Implementation Details

- Use one canonical backend error envelope for both exam-report and cert-summary APIs:
  - `success: false`
  - `error: string`
  - `error_code: string`
  - `retriable: boolean`
  - `details?: object`
- Reserve retriable behavior for transient or external-service failures; keep invalid input/auth as non-retriable.
- Keep Firestore write idempotent by `exam_id`-keyed doc behavior.
- Do not change minimum-2-reports business rule; only improve diagnosis and recovery.
- Ensure frontend displays user-friendly mapping by `error_code`, not raw concatenated message strings.

## Success Criteria

- Exam report generation failure no longer gets swallowed as 200 success in task handler.
- Cert summary does not incorrectly block users once report retries succeed and Firestore has >=2 reports.
- Frontend shows clear, non-duplicated error messages with proper retry guidance.
- Added tests reliably catch regression in schema/contract/retry behavior.

## Rollback Plan

1. Revert Phase 5 (frontend contract/UI) first if messaging regressions appear.
2. Revert Phase 4 then 3 if summary/generation logic introduces instability.
3. Revert Phase 2 only if queue behavior becomes unsafe; keep Phase 1 error contract intact for diagnostics.
4. Suspend Phase 7 backfill execution if elevated failure rate is detected.

## Open Questions

1. Final status code for prerequisite-not-met with pending retries: `400` or `409`?
2. Do we expose retry-attempt count in API `details` for UI transparency?
3. Do we gate frontend messaging changes behind a feature flag for staged rollout?

## Recommendation

Execute Phases 1→7 in order, with strict gate checks between phases. This gives the safest path: first make failures diagnosable, then make them recoverable, then align frontend semantics, then lock with tests and controlled backfill.
