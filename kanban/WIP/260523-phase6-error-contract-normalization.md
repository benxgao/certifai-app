# Rollout: Phase 6 Frontend Error Contract Normalization

## Summary

Normalize `exam-report` and `cert-summary` proxy route error envelopes, SWR fetcher parsing/retry behavior, and user-facing card copy so failures are actionable and non-duplicative.

## Scope

- Estimated files to create: 1
- Estimated files to modify: 7
- Risk level: Medium

## Phases

### Phase 1: Proxy Route Envelope Alignment

**Goal**: Ensure both proxy routes return canonical `{ success, error, error_code, retriable, details? }` on failures.

**Files**:

- `app/api/users/[api_user_id]/exams/[exam_id]/exam-report/route.ts` — modify — preserve canonical backend fields and avoid message concatenation
- `app/api/users/[api_user_id]/certifications/[cert_id]/cert-summary/route.ts` — modify — same envelope as exam-report route

**Verification**: Manual response inspection for 400/500 error branches in both routes.

### Phase 2: SWR Parser + Retry Alignment

**Goal**: Parse `error_code`/`retriable` consistently and apply retry policy (no retry on 4xx; retry up to 3x for retriable 5xx).

**Files**:

- `src/swr/examReport.ts` — modify — typed API error parsing + retry policy
- `src/swr/certSummary.ts` — modify — align parser and retry policy with exam-report

**Verification**: Unit tests and static type checks.

### Phase 3: UI Messaging Cleanup

**Goal**: Map key error codes to clear user copy without duplication.

**Files**:

- `src/components/custom/ExamReport.tsx` — modify — map retriable generation errors to waiting message
- `src/components/custom/CertSummary.tsx` — modify — show remaining exam reports needed for `INSUFFICIENT_EXAM_REPORTS`

**Verification**: Render-level tests and visual inspection.

### Phase 4: Regression Tests + Progress Update

**Goal**: Add/adjust tests for route/SWR contract behavior and update rollout tracking doc.

**Files**:

- `__tests__/exam-cert-error-contract.test.ts` — create — frontend contract test coverage
- `kanban/backlogs/hotfix-ai-report.md` — modify — Phase 6 progress + session note

**Verification**: targeted tests pass; TypeScript check passes.

## Rollback Plan

1. Revert SWR and component mapping changes first if messaging regressions occur.
2. Revert proxy route normalization if upstream payload assumptions differ.
3. Keep tests and rollout note for diagnosis context.

## Open Questions

1. Should cert-summary prerequisite failures remain HTTP 400 (current backend) or move to 409 in a future contract version?
2. Should UI display retry-attempt count for retriable report generation errors?
