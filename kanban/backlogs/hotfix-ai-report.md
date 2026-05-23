# Rollout: AI Report Hotfix (Exam Report 500 + Cert Summary Prerequisite Mismatch)

## Summary

Users are hitting a blocking failure after completing exams: the AI Exam Report endpoint returns 500, and the AI Learning Journey summary then incorrectly reports insufficient completed exam reports. Root cause is a one-line schema mismatch: `generateWithValidation` is called with `ExamReportSchema` which requires both `report` **and** `difficulty_adjustments` from the LLM, but `difficulty_adjustments` is computed locally from performance data and never included in LLM output. Genkit's schema validator rejects the response, generation fails, no Firestore document is written, and the cert summary count stays at zero.

This rollout fixes the bugs first with minimum code change, then backfills affected data, then progressively hardens error contracts and messaging. Retry-mechanism work is deferred and scoped only to what the existing infrastructure already supports.

## Current Evaluation

### What already exists

- Firestore-backed exam report storage and retrieval.
- Cert summary generation based on Firestore exam reports.
- Cloud Task-based background report generation.
- Frontend proxy routes and SWR hooks for both report/summary flows.

### What is not centralized / stable / complete yet

#### 1. LLM output schema requires a field the LLM never produces

- `ExamReportSchema` (used in both `ai.defineFlow` `outputSchema` and `generateWithValidation`) requires `report` **and** `difficulty_adjustments`.
- `difficulty_adjustments` is computed locally from `performanceData` before the LLM call; the LLM prompt only asks for the `report` narrative text.
- Genkit validates LLM output against the schema and rejects responses missing `difficulty_adjustments`, throwing `INVALID_ARGUMENT: Schema validation failed`.
- No Firestore document is ever written for the failing exam, so the cert summary count stays at zero.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts` — `ExamReportSchema` (lines 19–34), `generateWithValidation` call (line 182–185)

#### 2. Cert summary prerequisite errors are inaccurate when report generation silently fails

- `generateCertSummary` counts only Firestore report documents; no fallback to Prisma `COMPLETED` exams.
- With 3 completed exams but 0 Firestore reports (all failed silently), the count check `examReports.length < 2` always throws, regardless of how many exams the user has finished.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/certSummaryFirestore.ts` — prerequisite check (line ~106)

#### 3. Task failure semantics swallow errors

- Background Cloud Task handler returns HTTP 200 even when report generation throws. Cloud Tasks sees 200 and does not retry.
- Error path was added as a "don't retry forever" safety measure, but the real fix is correct LLM output validation (Phase 1), not permanent 200 swallowing.

Representative files:

- `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts` — inner catch block (line ~127)

#### 4. Frontend error contract is inconsistent across routes/hooks

- Exam report and cert summary proxy routes shape errors differently.
- SWR fetchers parse and display failures differently, causing duplicate/unclear messages (e.g. `Failed to fetch exam report: Failed to fetch exam report`).

Representative files:

- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/exams/[exam_id]/exam-report/route.ts`
- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/certifications/[cert_id]/cert-summary/route.ts`
- `/Users/benxgao/workspace/certifai-app/src/swr/examReport.ts`
- `/Users/benxgao/workspace/certifai-app/src/swr/certSummary.ts`

### Risks in the current state

- [ ] Completed exams can remain permanently missing reports if generation fails (no retry, no notification).
- [ ] Cert summary can continue failing despite enough completed exams because Firestore reports are never written.
- [ ] Users receive low-actionability errors, increasing support load.

## Scope

- Estimated files to create: 2
- Estimated files to modify: 11
- Risk level: High

### In scope

- Fix LLM output schema mismatch with minimum code change (Phase 1).
- Backfill completed exams that have no Firestore reports (Phase 2).
- Improve cert summary prerequisite diagnostics while preserving business rule (>=2 reports).
- Normalize frontend route/SWR error contracts and UI messages.
- Add backend/frontend regression tests.
- Assess and add retry mechanism only if existing infrastructure already supports it.

### Out of scope

- Changing business rule for minimum reports required.
- Reworking adaptive-learning scoring algorithms.
- Large UX redesign of exam/cert cards.

## Context Map

### Files to modify first

| File                                                                                          | Purpose                       | Why it matters                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts`  | Genkit output contract        | **Root bug**: `ExamReportSchema` passed to `generateWithValidation` includes `difficulty_adjustments` which the LLM never outputs |
| `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts`          | Task result semantics         | Controls retry/no-retry behavior for failed generations                                                                           |
| `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts` | Core generation + persistence | Central choke point for valid report creation                                                                                     |

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

### Principle 1: Minimal surface area first

Fix the root cause with the smallest possible code change before touching any surrounding infrastructure. The schema narrowing in Phase 1 is a targeted, low-risk change that immediately unblocks report generation and, by extension, the cert summary count.

### Principle 2: Backfill before hardening

Backfill affected historical data (Phase 2) before refining error messaging or adding retry mechanisms. Users with completed exams see relief immediately after Phase 1+2; the remaining phases are safety nets and polish.

### Principle 3: Retry mechanism only if infrastructure supports it

Do not add retry logic that requires new infrastructure (queue policy changes, dead-letter topics, etc.) unless the existing Cloud Task queue configuration already enables it. Inspect before adding; skip Phase 4 if it does not apply.

### Principle 4: Stable cross-layer error contract

Once the root bug is fixed, align all layers to the same error envelope (`success`, `error`, `error_code`, `retriable`, optional `details`) so route proxies, SWR hooks, and UI render deterministic, non-duplicative states.

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

- [x] Phase 1 — Root Bug Fix (Schema Mismatch)
- [x] Phase 2 — Backfill Missing Reports
- [x] Phase 3 — Error Contract Baseline
- [x] Phase 4 — Task Retry Correctness _(skip if infrastructure not in place)_
- [x] Phase 5 — Cert Summary Prerequisite Diagnostics
- [ ] Phase 6 — Frontend Contract Normalization
- [ ] Phase 7 — Test Coverage and Regression Gates

## Phases

### Phase 1: Root Bug Fix (Schema Mismatch)

**Progress**: `[x]`

**Layer**: `certifai-api Genkit generation schema`

**Goal**: Fix the report with minimum code change. `ExamReportSchema` is currently passed to both `ai.defineFlow` `outputSchema` and `generateWithValidation`. This means Genkit validates the LLM response against a schema requiring `difficulty_adjustments`, a field that is computed locally from `performanceData` and never emitted by the LLM. Splitting the schema into two — one for LLM output, one for the full flow return — immediately fixes generation for all new exams, which in turn fixes the cert summary threshold.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/genkit/examReportGenerator.ts` — modify — introduce `LLMReportOutputSchema = z.object({ report: z.string() })` for `generateWithValidation`; keep `ExamReportSchema` (with `difficulty_adjustments`) only on `ai.defineFlow` `outputSchema` and the final return shape.

**Verification gate** (must pass before Phase 2 starts):

- `cd certifai-api/functions && npx tsc --noEmit 2>&1 | grep "^src/"` — no new errors.
- Manually trigger `GET /api/users/:uid/exams/:eid/exam-report` for a previously failing exam — expect `200` with a valid report instead of `500`.
- Confirm Firestore document appears under `users/{uid}/certs/{cid}/exam_reports/{eid}`.

**Sub-subphase checklist**:

- [x] **1.1 — Narrow LLM output schema**: define `LLMReportOutputSchema` with only `report: z.string()`. Pass this to `generateWithValidation` instead of `ExamReportSchema`.
  - **Independent verification**: `npx tsc --noEmit` passes; grep confirms `ExamReportSchema` is no longer used inside `generateWithValidation` call.
- [x] **1.2 — Verify full flow return shape unchanged**: ensure the flow still returns `{ report, difficulty_adjustments }` using locally computed `difficultyAdjustments` as before, satisfying the existing `ExamReportSchema` on `outputSchema`.
  - **Independent verification**: call generation function in isolation with a test exam; confirm returned object includes both `report` and `difficulty_adjustments` with correct array keys.

---

### Phase 2: Backfill Missing Reports

**Progress**: `[x]`

**Layer**: `certifai-api operations — data recovery`

**Goal**: Re-trigger report generation for all `COMPLETED` exams in Prisma that lack a Firestore report document. Once Phase 1 is deployed, these runs will succeed and populate Firestore, which unblocks cert summary generation for affected users.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/scripts/testAutomaticExamReports.ts` — modify or derive — add a dry-run / execute mode that lists completed exams missing Firestore reports and re-enqueues them via the `examReportTaskService`.

**Verification gate** (must pass before Phase 3 starts):

- Dry-run output lists correct number of affected exams (cross-check against Prisma `COMPLETED` count vs Firestore report count).
- After execute run, sample users' Firestore report collections are populated.
- Cert summary for a previously blocked user now generates successfully on the next request.

**Sub-subphase checklist**:

- [x] **2.1 — Missing-report discovery**: write a query that returns `exam_id` + `user_id` + `cert_id` for all `COMPLETED` exams where no matching Firestore document exists.
  - **Independent verification**: dry-run log count matches manual sampling.
- [x] **2.2 — Controlled re-enqueue**: batch-re-enqueue found exams, with a small delay between batches to avoid queue saturation.
  - **Independent verification**: Cloud Task queue shows new tasks; Firestore report docs appear for sample exams within expected generation time.

---

### Phase 3: Error Contract Baseline

**Progress**: `[x]`

**Layer**: `certifai-api core error contract`

**Goal**: Establish a consistent error payload shape across generation-related backend paths so that downstream layers (task handler, proxy routes, SWR hooks) can classify errors without string-parsing.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/ai/examReportGenerator.ts` — modify — normalize thrown errors; attach stable classification (`error_code`, `retriable`).
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/exams/getExamReport.ts` — modify — map all error paths to canonical response shape.

**Verification gate** (must pass before Phase 4 starts):

- `npx tsc --noEmit` passes in `certifai-api/functions`.
- Known error paths (not-found, access-denied, generation failure) each produce a distinct `error_code` in the response JSON; no plain-text or HTML error bodies.

**Sub-subphase checklist**:

- [x] **3.1 — Define canonical error map**: centralize mapping of known throw conditions to `{ status, error_code, retriable }` (e.g. `GENKIT_SCHEMA_INVALID`, `EXAM_NOT_FOUND`, `ACCESS_DENIED`, `REPORT_PERSISTENCE_FAILED`, `REPORT_GENERATION_TRANSIENT`).
  - **Independent verification**: grep confirms all throw sites use the map; no inline string literals for status codes.
- [x] **3.2 — Apply map to exam report endpoints**: GET and POST exam-report routes output canonical shape for all error branches.
  - **Independent verification**: curl against each known error path returns JSON with `error_code` and no double-wrapped message string.

---

### Phase 4: Task Retry Correctness _(skip if infrastructure not in place)_

**Progress**: `[x]`

**Layer**: `certifai-api task execution semantics`

**Goal**: Verify whether the existing Cloud Task queue is configured for retries. If yes, change the task handler to return 5xx on retriable failures so Cloud Tasks automatically re-attempts. If no retry infrastructure exists, document the gap for a future sprint and skip this phase.

**Pre-condition check** (do this before writing any code):

- Read `/Users/benxgao/workspace/certifai-api/functions/src/services/cloudTasks/examReportTaskService.ts` and `/Users/benxgao/workspace/certifai-api/queue.yaml` to confirm whether `maxAttempts`, `minBackoff`, or equivalent retry settings are present.
- If retry config is absent → mark this phase `[!]`, add a note, and move to Phase 5.

**Files** _(only if retry infrastructure is confirmed)_:

- `/Users/benxgao/workspace/certifai-api/functions/src/delegators/tasks/examReport.ts` — modify — return 5xx for retriable generation/storage failures; keep 4xx for permanent input/auth errors.
- `/Users/benxgao/workspace/certifai-api/functions/src/services/cloudTasks/examReportTaskService.ts` — modify (if needed) — enforce bounded retry/backoff defaults.

**Verification gate** _(if phase is executed)_:

- Simulated generation failure returns 5xx from task handler.
- Replaying same payload does not create duplicate Firestore report for same `exam_id`.

**Sub-subphase checklist**:

- [x] **4.0 — Infrastructure audit**: confirm retry config exists in queue settings.
  - **Independent verification**: `src/services/gcp/cloudTasks/index.ts` queue creation uses retryConfig (`maxRetryDuration`, `minBackoff`, `maxBackoff`, `maxDoublings`) for `exam-reports-queue`; queue creation logs confirm queue exists.
- [x] **4.1 — Task failure classification**: permanent 4xx vs retriable 5xx in task handler.
  - **Independent verification**: `src/delegators/tasks/examReport.ts` now maps generation failures to `400` for permanent errors (`exam not found`, `completed exams`, etc.) and `500` for retriable errors, with `retriable` flag in response.
- [x] **4.2 — Idempotency safety check**: repeated task delivery does not create duplicate reports.
  - **Independent verification**: targeted test `__tests__/exam-report-task-idempotency.test.ts` passes; repeated handler delivery returns `200` with `already_existed: true` payload shape.

---

### Phase 5: Cert Summary Prerequisite Diagnostics

**Progress**: `[x]`

**Layer**: `certifai-api summary domain logic`

**Goal**: Keep the >=2 reports rule. Add structured failure detail so the API response tells clients exactly how many reports are available, making the error actionable rather than opaque.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/src/services/firebase/certSummaryFirestore.ts` — modify — include `{ required_reports: 2, available_reports: n, cert_id }` in prerequisite error details.
- `/Users/benxgao/workspace/certifai-api/functions/src/endpoints/api/users/certifications/getCertSummary.ts` — modify — map prerequisite failure to deterministic `error_code: INSUFFICIENT_EXAM_REPORTS` with stable HTTP status (400); stop masking upstream generation failures as generic not-found.

**Verification gate** (must pass before Phase 6 starts):

- User with 1 Firestore report gets `400` with `error_code: INSUFFICIENT_EXAM_REPORTS` and `details.available_reports: 1`.
- User with >=2 valid Firestore reports reaches summary generation step without error.

**Sub-subphase checklist**:

- [x] **5.1 — Structured prerequisite errors**: throw with `details` payload from `certSummaryFirestore.generateCertSummary`.
  - **Independent verification**: response JSON includes `details.required_reports` and `details.available_reports`.
- [x] **5.2 — Auto-generation error propagation**: `getCertSummary` GET handler preserves original error cause instead of re-wrapping as not-found.
  - **Independent verification**: a generation failure surfaces `error_code: REPORT_GENERATION_TRANSIENT`, not a 404.

---

### Phase 6: Frontend Contract Normalization

**Progress**: `[ ]`

**Layer**: `certifai-app proxy + SWR + UI messaging`

**Goal**: Align Next.js proxy routes, SWR fetchers, and UI components to one consistent error contract so messages are clear, non-duplicative, and actionable by error class.

**Files**:

- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/exams/[exam_id]/exam-report/route.ts` — modify — pass through canonical error envelope; do not concat nested error strings.
- `/Users/benxgao/workspace/certifai-app/app/api/users/[api_user_id]/certifications/[cert_id]/cert-summary/route.ts` — modify — same normalisation as exam-report route.
- `/Users/benxgao/workspace/certifai-app/src/swr/examReport.ts` — modify — parse `error_code` from response; map to user message instead of using raw string.
- `/Users/benxgao/workspace/certifai-app/src/swr/certSummary.ts` — modify — parse `error_code`; align retry policy with exam-report hook.
- `/Users/benxgao/workspace/certifai-app/src/components/custom/ExamReport.tsx` — modify — render message by error class (retriable vs terminal).
- `/Users/benxgao/workspace/certifai-app/src/components/custom/CertSummary.tsx` — modify — show actionable state from `details.available_reports` when `INSUFFICIENT_EXAM_REPORTS`.

**Verification gate** (must pass before Phase 7 starts):

- `cd certifai-app && npx tsc --noEmit 2>&1 | grep "^(src|app)/"` — no new errors.
- UI no longer shows duplicated message like `Failed to fetch exam report: Failed to fetch exam report`.
- Cert card shows remaining report count needed when prerequisite is unmet.

**Sub-subphase checklist**:

- [ ] **6.1 — Route normalization**: both proxy routes return canonical envelope `{ success, error, error_code, retriable, details? }`.
  - **Independent verification**: network panel shows same key structure for both endpoints on error responses.
- [ ] **6.2 — SWR fetcher alignment**: both fetchers parse `error_code`; retry policy: no retry on 4xx, retry up to 3× on 5xx retriable.
  - **Independent verification**: mocked 500 retriable response retries; mocked 400 does not retry.
- [ ] **6.3 — UI state copy cleanup**: exam report card maps `REPORT_GENERATION_TRANSIENT` → "Report is being generated, please check back shortly". Cert summary card maps `INSUFFICIENT_EXAM_REPORTS` → "Complete {n} more exam(s) to unlock your AI Learning Journey".
  - **Independent verification**: visual QA on both card error states.

---

### Phase 7: Test Coverage and Regression Gates

**Progress**: `[ ]`

**Layer**: `tests`

**Goal**: Lock in corrected behavior so the schema mismatch, silent task failure, and duplicated error messages cannot regress silently.

**Files**:

- `/Users/benxgao/workspace/certifai-api/functions/__tests__/exam-report-hotfix.test.ts` — create — backend regression tests.
- `/Users/benxgao/workspace/certifai-app/__tests__/exam-cert-error-contract.test.ts` — create — frontend route/SWR contract tests.

**Verification gate**:

- Both test files pass: `npm test` in each repo.
- TypeScript checks pass in both repos.

**Sub-subphase checklist**:

- [ ] **7.1 — Backend contract tests**:
  - Fixture: LLM output missing `difficulty_adjustments` → generation succeeds (schema narrowed in Phase 1).
  - Fixture: LLM output missing `report` → generation fails with typed error.
  - Fixture: task handler with generation error → correct HTTP status (4xx or 5xx per Phase 4 outcome).
  - **Independent verification**: `npm test -- --testPathPattern=exam-report-hotfix` passes.
- [ ] **7.2 — Frontend contract tests**:
  - Mock 400 `INSUFFICIENT_EXAM_REPORTS` → cert summary fetcher does not retry; renders correct message.
  - Mock 500 retriable exam report error → fetcher retries up to 3×.
  - Mock successful response → data extracted without double-unwrapping.
  - **Independent verification**: `npm test -- --testPathPattern=exam-cert-error-contract` passes.

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
4. Phase 4.0 → (4.1 → 4.2 if infrastructure confirmed; else mark `[!]` and skip)
5. Phase 5.1 → 5.2
6. Phase 6.1 → 6.2 → 6.3
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

1. Revert Phase 6 (frontend contract/UI) first if messaging regressions appear.
2. Revert Phases 5 then 3 if summary/generation logic introduces instability.
3. Revert Phase 4 (task retry) if unexpected duplicate-report or queue-overflow behavior is detected.
4. **Do not revert Phase 1** (schema fix) — it is strictly additive and safe to keep.
5. Suspend Phase 2 backfill execution if elevated failure rates are detected during the batch run.

## Open Questions

1. Final status code for prerequisite-not-met with pending retries: `400` or `409`?

- 400 is technically correct for "bad request" but 409 could signal "conflict with current state, retry later" which may be more actionable for frontend. Need to check existing contract and frontend handling to avoid breaking changes.

2. Do we expose retry-attempt count in API `details` for UI transparency?

- Keep it simple for now.

3. Do we gate frontend messaging changes behind a feature flag for staged rollout?

- Not necessary if we maintain the same error contract shape; UI can just render new messages based on `error_code` without risk of breaking existing paths.

## Recommendation

Execute Phases 1→7 in order, with strict gate checks between phases. **Phases 1+2 are the minimum-viable hotfix**: once deployed, exam report generation works and the cert summary count unblocks. Phases 3–7 are progressive hardening that can be shipped independently without risk of disrupting the already-fixed behavior.

### Session Note — 2026-05-23 local

- Completed: 1.1
- Verified by: `npx tsc --noEmit 2>&1 | grep "^src/"` (no matching errors), and grep confirmation that `generateWithValidation` now uses `LLMReportOutputSchema`
- Next: 1.2
- Blockers: none

### Session Note — 2026-05-23 local

- Completed: 1.2
- Verified by: `npm test -- --runTestsByPath __tests__/exam-report-phase1-flow-shape.test.ts` (pass)
- Next: 2.1
- Blockers: none

### Session Note — 2026-05-23 local

- Completed: 2.1 and 2.2 implementation + 2.2 execute run
- Verified by: `GOOGLE_APPLICATION_CREDENTIALS=./gcp_credentials.json npx ts-node src/scripts/testAutomaticExamReports.ts --dry-run --limit=10` (9 missing, 0 lookup failures) and `... --execute --limit=10 --batch-size=3 --batch-delay=3` (9/9 tasks enqueued, 0 failures)
- Next: inspect task-handler execution path / deployment state before further re-enqueue attempts
- Blockers: repeated dry-run after enqueue still reports `missing_report_count: 9`, so Firestore materialization is not yet observed

### Session Note — 2026-05-23 local

- Completed: 4.0, 4.1 (local code)
- Verified by: code audit of retry config in `src/services/gcp/cloudTasks/index.ts`; local compile check `npx tsc --noEmit 2>&1 | grep "^src/"`; updated `src/delegators/tasks/examReport.ts` to return 5xx for retriable generation failures
- Next: 4.2 + re-verify Phase 2 materialization after deployment/runtime stabilization
- Blockers: cloud logs show `delegators`/Genkit initialization timeouts with container exits (`Process exited with code 16`), and current deployed runtime appears not yet reflecting local task-handler fix

### Session Note — 2026-05-23 local

- Completed: Phase 2 materialization verification + Phase 3.1/3.2 implementation
- Verified by: UAT confirmation that both hotfix errors are resolved; backend endpoints now use shared canonical map in `src/endpoints/api/examReportErrorMap.ts` and consume it from `src/endpoints/api/ai/examReportGenerator.ts` + `src/endpoints/api/users/exams/getExamReport.ts`; `npx tsc --noEmit` passes
- Next: 4.2 idempotency safety check, then Phase 5.1
- Blockers: none

### Session Note — 2026-05-23 local

- Completed: 4.2
- Verified by: `npm test -- --runTestsByPath __tests__/exam-report-task-idempotency.test.ts` (pass)
- Next: 5.1
- Blockers: none

### Session Note — 2026-05-23 local

- Completed: 5.1, 5.2
- Verified by: `npm test -- --runTestsByPath __tests__/exam-report-task-idempotency.test.ts __tests__/cert-summary-phase5-error-contract.test.ts` (pass); added regression coverage for `INSUFFICIENT_EXAM_REPORTS` details payload and `REPORT_GENERATION_TRANSIENT` 500 propagation; `npx tsc --noEmit` completed with no displayed errors in verification run
- Next: Phase 6.1
- Blockers: none
