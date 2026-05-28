# Executive Report: Early `READY` Exam Status Rollout

## Executive summary

This initiative changes exam availability so learners can begin an exam as soon as the first usable batch of questions is available, rather than waiting for all question generation to finish. The change improves time-to-start, reduces idle waiting, and keeps generation running in the background until completion.

The rollout introduces a feature flag, new generation counters, progressive status handling, and updated API semantics so the product can distinguish “playable now” from “fully generated.” It is a high-risk change because it affects state transitions, async task orchestration, and downstream UX expectations.

## Business outcome

- Faster learner access to exams, especially for larger question sets.
- Better alignment between availability and generation progress.
- More transparent status reporting for support, operations, and product teams.
- Lower risk of user confusion caused by waiting for full completion before starting.

## What changes

### User-facing behavior

- Exams become playable after the first linked batch of questions is available.
- `READY` now means “can start now,” not “generation is fully complete.”
- `IN_PROGRESS` becomes stricter: it is used only after generation is complete and the learner has answered at least one question.
- Questions must be served in deterministic order by earliest creation time.

### Platform behavior

- Batch size reduces from `10` to `5`.
- New counters track generation progress independently of availability:
  - `generated_questions_count`
  - `associated_questions_count`
  - `generation_completed_at`
- A feature flag, `EXAM_EARLY_READY_ENABLED`, allows controlled rollout and rollback without redeploying the product.

### Reporting behavior

- Live status responses will expose both availability and generation progress.
- `exam_status` will no longer be treated as a proxy for completion percentage.
- Progress and completion must be visible independently so product and support teams can interpret exam state correctly.

## Delivery approach

### Phase 0: Safe rollout controls

Establish the feature flag and logging needed to observe transitions before changing business semantics.

### Phase 1: Data foundations

Add the schema fields needed to track generated, associated, and completed state safely for existing and new rows.

### Phase 2: Progressive generation

Move generation to 5-question batches and persist counters as each batch completes.

### Phase 3: Early readiness

Flip exams to `READY` as soon as the first usable batch is linked, while generation continues in the background.

### Phase 4: Status contract update

Expose completion, progress, and counts separately in the live status API.

### Phase 5: Strict `IN_PROGRESS` rules

Only transition to `IN_PROGRESS` after generation completion and learner interaction.

### Phase 6: Frontend alignment

Update the app so users can start immediately once an exam is ready, while progress continues to display.

### Phase 7: Operational hardening

Add dashboards, alerts, and rollback safeguards for production confidence.

## Key risks

- State-machine regressions that could strand exams in the wrong status.
- Duplicate or inconsistent counts during retryable background jobs.
- UX mismatch if the frontend interprets `READY` as “fully generated.”
- Support burden if status reporting is not clearly documented.

## Mitigations

- Feature-flagged rollout with rollback available immediately.
- Incremental schema changes with non-breaking defaults.
- Structured logging for each critical transition.
- Validation checkpoints after each phase before expanding scope.

## Decision points

The following open questions should be resolved before full rollout:

1. Whether partially generated exams may be submitted before generation completes.
2. How to handle partial completion when generation ends early due to hard failures.
3. Whether the UI should show a distinct badge for `READY` while generation is still in progress.

## Approval and release note

This report is intended as the executive summary for the rollout described in the underlying plan. Implementation should not begin until API and frontend owners approve the change set and rollout sequencing.

## Rollback posture

If issues arise, disable `EXAM_EARLY_READY_ENABLED` to restore legacy final-ready behavior while keeping the schema additions in place. This allows the team to revert the user experience without a code redeploy.
