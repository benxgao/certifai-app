# Rollout Plan: Frontend Exam Availability UX for Early `READY`

## Summary

This document evaluates the **current frontend exam status behavior** and defines a phased plan to align with backend rollout `260508-exam-status-redefinition.md`.

Core frontend target:

- Treat `exam_status` as **availability state** (can user start?)
- Treat `is_generating_completed` + progress counters as **generation completion state** (are all questions ready?)
- Allow users to begin as soon as status is `READY`, while background generation continues

No frontend implementation is included here yet; this is planning + architecture alignment only.

---

## Current Frontend Evaluation (As-Is)

### 1) Polling logic is still generation-status-centric

Current behavior in key hooks:

- `src/swr/useExamLiveStatus.ts`
  - Polling is externally controlled by `pollingEnabled` and does not itself enforce `is_generating_completed`-based stopping.
- `src/swr/exams.ts` (`useAllUserExams`, `useExamsForCertification`, `useExamState`)
  - List/detail refresh intervals are enabled when `exam_status === QUESTIONS_GENERATING`.
- `src/swr/examInfo.ts`
  - Polls only when `exam_status === QUESTIONS_GENERATING`.
- `src/hooks/useExamListGenerationMonitor.ts`
  - Manual polling loop runs only for `QUESTIONS_GENERATING` items.

**Impact after API change**: once early `READY` is set (while generation is still incomplete), these flows may stop refreshing too early.

### 2) UI derivation currently conflates readiness and completion in places

- `src/components/custom/ExamCard.tsx`
  - Polling currently enabled only for generating exams (`isExamGeneratingStatus(exam.exam_status)`).
  - Has fallback override: if live status says `is_generating_completed=true` and `progress=100`, force UI to `ready`.
  - This workaround assumes eventual transition from generating -> ready and may need refinement once ready can happen early.
- `src/hooks/useExamPageLogic.ts`
  - Detail page live-status polling enabled only while `examState.exam_status` is generating.
  - Progress object rendered only under generating status check.
- `src/components/custom/ExamEmptyState.tsx`
  - “Questions are being generated” empty state only shown for generating status.
  - No dedicated “Ready, more questions loading” state.

**Impact after API change**: user may see a ready exam with stale progress/no continued updates if polling is halted based on status only.

### 3) Notifications and status transitions assume `READY` ≈ generation done

- `src/hooks/useExamStatusNotifications.ts`
  - Completion transition currently modeled as `QUESTIONS_GENERATING -> READY`.
- `src/lib/toast.ts`
  - Copy such as “Your exam questions have been generated and are ready to start.” implies 100% generation.

**Impact after API change**: completion notifications and copy become semantically incorrect.

### 4) Type contracts partially align, but not yet complete for new counters

- `src/types/swr-data/useExamLiveStatus.ts` already includes `is_generating_completed` and progress fields.
- Missing explicit fields from new backend contract in live-status typing/planning scope:
  - `generated_questions_count`
  - `associated_questions_count`
  - `target_questions`

**Impact after API change**: frontend cannot fully represent progressive generation details without type additions.

---

## Must-Consider Feature/Code Changes (Guaranteed Scope)

The following items are considered mandatory once backend phases 3–5 are live.

### A) Data contract + typing updates

Files:

- `src/types/swr-data/useExamLiveStatus.ts`
- `src/types/swr-data/exams.ts` (if shared progress representation is extended)

Changes to plan:

- Add/consume new live-status fields:
  - `generated_questions_count`
  - `associated_questions_count`
  - `target_questions`
- Keep backward compatibility handling during rollout window (feature-flag period) where some envs may still return old payload shape.

### B) Polling trigger changes (status -> completion driven)

Files:

- `src/hooks/useExamPageLogic.ts`
- `src/components/custom/ExamCard.tsx`
- `src/swr/exams.ts`
- `src/swr/examInfo.ts`
- `src/hooks/useExamListGenerationMonitor.ts`

Changes to plan:

- Continue polling when exam is playable but generation incomplete (`is_generating_completed=false`), not only while `QUESTIONS_GENERATING`.
- Stop or reduce polling cadence only once `is_generating_completed=true`.
- Avoid duplicate polling loops between SWR `refreshInterval` and manual `setInterval` monitor.

### C) UI status model adjustments

Files:

- `src/types/exam-status.ts`
- `src/components/custom/ExamCard.tsx`
- `src/components/custom/ExamEmptyState.tsx`
- `src/components/custom/ExamStatusCard.tsx`

Changes to plan:

- Preserve backend enum values as source of truth for availability.
- Introduce/derive a presentation label for early-ready state, e.g.:
  - `READY` + `is_generating_completed=false` => “Ready (more questions loading)”
  - `READY` + `is_generating_completed=true` => “Ready”
- Ensure CTA remains enabled for `READY` regardless of generation completeness.

### D) Notification copy and transition logic

Files:

- `src/hooks/useExamStatusNotifications.ts`
- `src/lib/toast.ts`

Changes to plan:

- Separate notifications:
  - “Exam is ready to start” (early-ready)
  - “Question generation complete” (full completion)
- Avoid using `QUESTIONS_GENERATING -> READY` as sole completion indicator.

### E) Test coverage updates

Files:

- `__tests__/exam-status.test.ts`
- New/updated tests under hooks/components where polling behavior is asserted

Changes to plan:

- Add tests for matrix:
  - `READY + is_generating_completed=false` => start enabled + polling continues
  - `READY + is_generating_completed=true` => start enabled + polling stops/reduces
  - first answer before complete should not force frontend into misleading “in progress due to completion” assumptions

---

## Solution Architect Concerns After API Change

### 1) Contract synchronization risk

- Frontend must not ship assumptions about new fields before backend environments expose them consistently.
- Recommendation: additive parsing + graceful fallback when counters are absent.

### 2) Polling amplification risk

- Early-ready can increase number of exams considered “active” from frontend perspective.
- Recommendation: define clear polling budgets per page type:
  - List views: conservative interval (e.g., 5–10s)
  - Detail/live view: faster interval (e.g., 2s)
  - Stop/reduce immediately on `is_generating_completed=true`

### 3) Mixed-cache race conditions

- `useExamState` and `useExamLiveStatus` can diverge temporarily (Redis cache vs live endpoint freshness).
- Recommendation: documented precedence rules for UI decisions:
  1.  Availability CTA from authoritative `exam_status` (latest available snapshot)
  2.  Generation progress/completion from live-status endpoint

### 4) UX semantics and copy risk

- Existing “ready” copy implies full generation complete.
- Recommendation: introduce explicit progressive wording to reduce confusion and support burden.

### 5) Transition-notification correctness

- Existing transition helper (`generating -> ready`) no longer means generation complete.
- Recommendation: tie completion to `is_generating_completed=true` (or generation counters reaching target), not status change alone.

### 6) Observability and rollout safety

- Need frontend telemetry to validate behavior under new backend semantics.
- Recommendation metrics:
  - time-to-first-ready (frontend observed)
  - time-ready-to-complete
  - start-click-through rate during incomplete generation window
  - polling request volume deltas pre/post change

---

## Frontend Phased Rollout Draft

### Phase F0 — API Contract Readiness Gate (Planning + Flags)

Goal:

- Confirm backend live-status payload version and availability across environments.

Actions:

- Finalize JSON response contract and optionality rules with API owners.
- Define frontend compatibility mode for payloads without new counters.
- Confirm analytics events for early-ready lifecycle.

Exit criteria:

- Contract freeze approved by API + frontend owners.

### Phase F1 — Types and Adapter Layer

Goal:

- Frontend can parse both legacy and updated live-status payloads safely.

Actions:

- Extend status data types.
- Add adapter/normalizer helpers if required to avoid optional-field sprawl in UI.

Exit criteria:

- Type checks and unit tests pass; no `any` regressions.

### Phase F2 — Polling Behavior Migration

Goal:

- Polling continues while incomplete generation remains, independent of `READY` status.

Actions:

- Update polling conditions in list/detail hooks and monitors.
- Deduplicate overlapping polling loops.
- Set post-complete throttle/stop behavior.

Exit criteria:

- Verified polling-stop condition tied to completion, not status alone.

### Phase F3 — UX + CTA Semantics

Goal:

- UI clearly communicates “playable now, still loading more questions.”

Actions:

- Update status labels/badges and progress text in exam card/detail/empty-state.
- Keep Begin/Resume enabled for early-ready window.

Exit criteria:

- Manual UX validation for early-ready and full-complete states.

### Phase F4 — Notifications and Messaging

Goal:

- Distinguish “ready to start” from “fully generated”.

Actions:

- Update toast messages and transition detection logic.
- Ensure completion notifications trigger on completion signals, not READY status.

Exit criteria:

- Notification tests + QA checklist passed.

### Phase F5 — Test Hardening + Canary

Goal:

- Validate production safety before full rollout.

Actions:

- Expand test scenarios for early-ready matrix.
- Canary release with telemetry monitoring.

Exit criteria:

- No significant increase in polling load/errors.
- Expected start flow and completion flow both stable.

---

## Acceptance Matrix (Frontend View)

| Backend state                               | Frontend CTA                | Polling       | Badge/Copy expectation           |
| ------------------------------------------- | --------------------------- | ------------- | -------------------------------- |
| `QUESTIONS_GENERATING`, `is_generating_completed=false` | Disabled                    | On            | "Generating questions"           |
| `READY`, `is_generating_completed=false`                | Enabled (Begin/Resume)      | On            | "Ready (more questions loading)" |
| `READY`, `is_generating_completed=true`                 | Enabled                     | Off / reduced | "Ready"                          |
| `IN_PROGRESS`, `is_generating_completed=true`           | Enabled (Resume)            | Off / reduced | "In Progress"                    |
| `COMPLETED`                                 | Results actions             | Off           | "Completed / Passed / Review"    |
| `QUESTION_GENERATION_FAILED`                | Disabled / retry affordance | Off           | "Generation failed"              |

---

## Dependencies and Coordination

- Depends on backend phases 3–5 of `260508-exam-status-redefinition.md`.
- Requires final backend response examples for:
  - early-ready (5/50 style)
  - fully complete
  - failure and partial-generation edge case
- API + frontend owners must align on copy for early-ready badge/message.

---

## Open Questions for API + Frontend Owners

1. Should frontend allow exam submission when `is_generating_completed=false` but user has answered available questions?
2. If backend completes generation with fewer than target questions, what user-facing copy should be shown?
3. Should early-ready be represented only via copy, or via a dedicated badge variant/token?
4. Which endpoint is canonical for completion counters if list/detail payloads diverge temporarily?

---

## Go/No-Go Readiness Checklist (Backend Phases 3/4/5)

Use this gate before each frontend implementation phase to prevent contract drift, invalid assumptions, or premature rollout.

### Gate G1 — Backend Phase 3 Complete (Early `READY` Transition Live)

Frontend work unlocked:

- F2 Polling Behavior Migration (partial)
- F3 UX + CTA Semantics (early-ready variant)

Required backend evidence (must-have):

- Live DB/API proof for early-ready window:
  - `exam_status=READY`
  - `is_generating_completed=false`
  - `progress_percentage < 100`
- Question fetch works during early-ready window (playable exam before completion).
- Feature flag behavior confirmed across envs (`EXAM_EARLY_READY_ENABLED` on/off).

Verification artifacts to collect:

- 2-3 JSON snapshots from real endpoint responses in sequence (pre-ready, early-ready, later-progress).
- One QA/video capture showing Start CTA can be valid before 100% generation.

Go decision:

- **GO** if all above are proven in target environment.
- **NO-GO** if READY cannot be observed with `is_generating_completed=false` yet.

### Gate G2 — Backend Phase 4 Complete (Live-Status Contract Finalized)

Frontend work unlocked:

- F1 Types and Adapter Layer (full)
- F2 Polling Behavior Migration (full)
- F5 contract-level test hardening

Required backend evidence (must-have):

- Live-status payload includes and stabilizes:
  - `exam_status`
  - `is_generating_completed`
  - `progress_percentage`
  - `generated_questions_count`
  - `associated_questions_count`
  - `target_questions`
- “Ready-not-complete” and “fully complete” examples available from same environment class as frontend deployment target.
- Contract optionality confirmed (which fields can be absent during rollout window).

Verification artifacts to collect:

- API contract sample set (success + edge/failure payloads) signed off by API owner.
- One compatibility matrix: env -> payload shape version.

Go decision:

- **GO** if schema is frozen and response examples are validated.
- **NO-GO** if counters are inconsistent/unstable across target environments.

### Gate G3 — Backend Phase 5 Complete (`IN_PROGRESS` Semantics Enforced)

Frontend work unlocked:

- F3/F4 final UX and notification semantics
- F5 canary validation on status transitions

Required backend evidence (must-have):

- Demonstrated behavior matrix:
  - first answer while `is_generating_completed=false` remains `READY`
  - after generation complete + first answer (not submitted) => `IN_PROGRESS`
  - small exam edge case (`<5`) follows expected sequence
- `getUserExam` + `getUserExams` responses no longer infer/override conflicting status logic.

Verification artifacts to collect:

- Transition trace logs or API snapshots with timestamps for each scenario.
- QA checklist run for all matrix rows in this document.

Go decision:

- **GO** if transition contract is stable and reproducible.
- **NO-GO** if any endpoint still returns divergent status semantics.

### Gate G4 — Pre-Canary Frontend Safety Check

This gate is required before enabling frontend canary even if G1/G2/G3 are green.

Checklist:

- Polling budget approved (list/detail interval targets + stop/reduce rules).
- Telemetry dashboards ready:
  - time-to-first-ready
  - time-ready-to-complete
  - start during incomplete-generation CTR
  - polling request volume
- Feature toggles/rollback path documented for frontend behavior switches.
- Support copy approved for early-ready wording.

Go decision:

- **GO** when operational guardrails are in place.
- **NO-GO** when canary cannot be observed or rolled back safely.

### Gate Summary Table

| Gate | Backend prerequisite | Unlocks                                | Required owner sign-off           |
| ---- | -------------------- | -------------------------------------- | --------------------------------- |
| G1   | Phase 3              | Early-ready UX/polling partial changes | API + Frontend                    |
| G2   | Phase 4              | Type contract + full polling migration | API + Frontend                    |
| G3   | Phase 5              | Final status semantics + notifications | API + Frontend + QA               |
| G4   | Ops readiness        | Canary rollout                         | Frontend + SRE/Platform + Support |

---

## Recommended Next Operational Step

Create a lightweight release checklist artifact (single-page) that references this document and tracks per-environment gate status (`dev`, `uat`, `prod-canary`) with date, owner, and evidence link.

---

## Final Note

Per rollout policy, **frontend implementation is deferred** until backend API changes are completed and verified. This document is the approved planning baseline for that implementation.
