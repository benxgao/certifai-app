# Rollout Plan: Eval Phase — Spec-First Health Scorecard

## Background

Originated from Open Question Q2 in [`40-archive/26-05/260527-spec-first-doc-routing-rollout.md`](../40-archive/26-05/260527-spec-first-doc-routing-rollout.md):

> "Should we add a quarterly audit metric (sample size + pass threshold) for manual link-graph verification quality across recently completed rollout plans?"

The 260527 rollout established a spec-first docs routing contract across six phases. Phases 5 (Docs Sync) and 6 (AI-ready reflection) are the two mandatory closing phases in every rollout plan. After they complete, however, there is no standardized way to measure whether the rollout actually achieved its spec-first and docs-health goals. The phases complete but produce no score, no signal, and no baseline for comparison.

---

## Problem

After each rollout finishes phases 5 & 6:

- There is no lightweight scoring mechanism that answers "how well did this rollout do?"
- The Docs-First Retrieval Checklist is required but produces no quantitative health signal.
- Phases 5 and 6 address overlapping concerns (docs accuracy + reflection + handoff) but are structurally separate, creating potential for redundancy or split effort without a shared outcome.
- Without a score, the quarterly topology review mandated in `docs/operations/docs-maintenance.md` has no baseline to compare against.

---

## Proposal

### 1. Add a mandatory Eval Phase to the rollout plan template

Add a new **Phase N+2: Rollout Eval & Health Score** as the final mandatory phase, positioned after Phase N (Docs Sync) and Phase N+1 (AI-ready reflection).

The Eval Phase:

- Produces a **simple 0–100 score** across three dimensions using only existing artifacts.
- Requires no new tooling — scores are derived from checklist completion and verification gate results that already exist in every rollout.
- Records the score in the rollout plan itself so it is available for quarterly topology audits.

### 2. Simple Scoring Rubric (proposed)

| Dimension | Max Points | How scored |
| --- | --- | --- |
| **Docs-first adherence** | 40 | Docs-First Retrieval Checklist fully completed; sufficiency assessed; fallback decisions documented if used |
| **Docs health** | 40 | All Docs Sync gates passed: create, update, link integrity, index registration all verified |
| **Reflection quality** | 20 | AI-ready reflection names at least one confirmed improvement; every open question has a decision owner or revisit condition |
| **Total** | **100** | Suggested pass threshold: ≥ 70 |

**Scoring rules**:

- Each dimension is binary at sub-gate level: gate passed = full points, gate skipped without justification = 0 for that gate.
- A gate marked `[!]` (blocked/skipped) with a documented reason counts as half points for that sub-gate.
- The score is recorded in the rollout plan as a final session note immediately after the Eval Phase verification gate passes.

### 3. Phase 5 & 6 merge analysis

**Argument for merging into one phase**:

- Both phases work on documentation artifacts.
- Docs Sync (Phase 5) verifies docs are accurate after implementation; AI-ready reflection (Phase 6) verifies learning was captured. Together they form a single "close the loop" concern.
- Merging reduces the phase count and simplifies the plan template.

**Argument for keeping separate**:

- Phase 5 is checklist-driven and objective — it can eventually be partially automated.
- Phase 6 is reflection-driven and subjective — it requires human judgment about what improved and what is still open.
- When merged, the reflection step is the most likely to be compressed or skipped under delivery pressure.
- Historical evidence from 260527: Phase 5 (Docs Sync) and Phase 6 (AI-ready reflection) both required non-trivial effort and produced distinct artifacts.

**Recommendation**: Keep phases 5 and 6 structurally separate to protect the reflection step. Add a shared **Eval Gate** that fires after both complete and records the score. This produces a single measurable outcome without collapsing the phase structure.

If future rollouts consistently show Phase 5 completes in < 30 minutes with no issues, revisit the merge question at that time with actual execution data.

---

## Spec Health Evaluation — Actionable Suggestions

This section captures concrete improvements that emerged from designing the eval phase. Items are split by whether they require your input or can be applied directly.

### Applied directly in Phase 5 & 6 (no decision needed)

These are small, unambiguous additions that will be woven into the existing Phase 5 (Docs Sync) and Phase 6 (AI-ready reflection) sub-subphase checklists when the rollout executes. No owner decision is required.

| Where | What gets added |
| --- | --- |
| Phase 5, sub-subphase 5.1 | Add a one-line **Docs change summary**: count of docs created / updated / archived in this rollout — makes the topology audit faster |
| Phase 5, verification gate | Add explicit check: Docs-First Retrieval Checklist sufficiency field is not left blank — "assessed" must include the actual verdict (sufficient / insufficient), not just a checkbox |
| Phase 5, verification gate | Add check: every new doc created in this rollout has an `Owner:` field filled — prevents orphan docs |
| Phase 6, sub-subphase 6.1 | Add a required **Docs quality delta line**: one sentence on whether docs got better, stayed the same, or degraded during this rollout — feeds the quarterly audit baseline |
| Phase 6, sub-subphase 6.2 | Add a required **Skipped phase log**: explicitly record any phase that was skipped or marked `[!]` with its justification — prevents silent gaps in the eval score |

These additions are small enough to live as bullet additions inside the existing sub-subphase checklist items in the rollout plan template. They do not change the phase structure.

### Decisions requiring your input

These cannot be applied without an explicit owner choice. Please review and respond with your preference for each item before Phase 1 execution begins.

**D1 — Eval score threshold for archiving**

Proposed: plans must score ≥ 70 / 100 to move from Review → Archive.

Options:
- A. Accept ≥ 70 as the pass threshold.
- B. Use a different threshold (e.g., ≥ 60 for early rollouts while rubric is being calibrated, then raise to ≥ 70 after three rollouts).
- C. No numeric threshold — require score to be recorded but not gated. Gate only on checklist completion.

_Why it matters_: Option A enforces the rubric immediately but risks blocking plans if the rubric is miscalibrated. Option C gives data without gate risk during the calibration period.

---

**D2 — Score visibility in kanban**

Proposed: score is recorded in the plan body (session note) only.

Options:
- A. Plan body only — no change to kanban item title or label.
- B. Append score to the archive filename, e.g., `260528-rollout-eval-phase-82.md`, so score is visible in directory listing.
- C. Add a score badge in the kanban item's front matter / heading line.

_Why it matters_: Option B/C makes trend-spotting faster in future audits but adds a naming convention to enforce.

---

**D3 — Rubric weight distribution**

Proposed: Docs-first adherence 40 / Docs health 40 / Reflection quality 20.

Options:
- A. Accept 40 / 40 / 20 as-is.
- B. Shift weight toward reflection: 30 / 30 / 40 — values the learning signal over checklist compliance.
- C. Equal thirds: 33 / 33 / 34 — simplest to remember.

_Why it matters_: The current 40/40/20 weighting treats docs mechanics as the primary signal. If the goal is to improve learning quality over time, reflection deserves more weight.

---

**D4 — Phase 5 & 6 merge decision**

Current recommendation: keep them structurally separate.

Options:
- A. Keep separate (recommended) — Phase 5 stays checklist-driven, Phase 6 stays reflection-driven. The Eval Phase (N+2) acts as the shared closing gate.
- B. Merge into one combined "Docs Sync & Reflection" phase — reduces phase count, acceptable if reflection discipline is already strong.

_Why it matters_: Merging is the simpler template, but historical evidence (260527) shows reflection gets compressed when it shares a phase with a checklist-heavy docs sync step.

---

**D5 — Rubric recalibration cadence**

Proposed: after three completed rollout scores are collected, review the rubric weights and thresholds.

Options:
- A. Accept three-rollout review cadence.
- B. Review after every rollout until scores stabilize, then move to quarterly.
- C. No scheduled recalibration — adjust only if a score produces a visibly wrong signal.

_Who reviews_: Engineering lead (same owner as Q1 and Q2 in the 260527 plan).

---

## Rollout Plan

### Summary

Update the rollout plan template to enforce a mandatory Eval Phase after Docs Sync and AI-ready reflection, introduce a simple 0–100 scoring rubric, and validate the rubric against the completed 260527 rollout.

### Scope

- Estimated files to create: 0
- Estimated files to modify: 3 (`rollout-plan-template.md`, `ai-oriented-kanban.md`, `docs/ai/guide.md`)
- Risk level: Low

### In scope

- Add Phase N+2 (Eval & Health Score) to `ai_oriented_kanban/templates/rollout-plan-template.md`.
- Update lane-transition criteria in `ai_oriented_kanban/ai-oriented-kanban.md` to require an eval score before archiving.
- Update `docs/ai/guide.md` to reference the eval phase expectation.
- Retroactively apply the scorecard to the 260527 rollout to validate the rubric is reasonable.

### Out of scope

- Automated scoring tooling or CI integration.
- Back-filling scores for rollouts completed before this proposal.
- Changing the phase numbering convention in existing archived rollout plans.

---

### Phase 1: Template Update — Add Eval Phase

**Goal**: Add the Eval Phase structure and scoring rubric to the rollout plan template.

**Files**:

- `ai_oriented_kanban/templates/rollout-plan-template.md` — modify — add Phase N+2 after Phase N+1 with scoring rubric and verification gate.

**Verification gate**:

- `grep -n "Eval\|Health Score\|scorecard" ai_oriented_kanban/templates/rollout-plan-template.md` returns the new phase.
- The scoring rubric table is present with all three dimensions and a total.
- The verification gate for the Eval Phase requires the score to be recorded in a session note.

**Sub-subphase checklist**:

- [x] **1.1 — Draft Eval Phase block**: add Phase N+2 with goal, scoring rubric table, verification gate, and sub-subphase checklist to the template's `## Required structure` section.
  - **Independent verification**: template compiles cleanly; phase heading is consistent with Phase N and N+1 style.
- [x] **1.2 — Add score field to Progress Dashboard**: extend the Progress Dashboard block in the template to include Phase N+2.
  - **Independent verification**: `grep -n "Phase N+2" rollout-plan-template.md` returns a match in both the Progress Dashboard and the Phases sections.

### Session Note — 2026-05-28 06:13 UTC

- Completed: 1.1, 1.2
- Verified by: `grep -n "Eval\\|Health Score\\|scorecard\\|Phase N+2" ai_oriented_kanban/templates/rollout-plan-template.md`
- Next: 2.1
- Blockers: none (executed with D1=A `>= 70` threshold and D4=A keep Phase 5/6 separate)

---

### Phase 2: Kanban Lane Gate Update

**Goal**: Require a passing eval score as an explicit archive gate in the kanban workflow.

**Files**:

- `ai_oriented_kanban/ai-oriented-kanban.md` — modify — add "eval score ≥ 70" as a lane-transition criterion for moving plans from Review to Archive.

**Verification gate**:

- `grep -n "eval\|score\|70" ai_oriented_kanban/ai-oriented-kanban.md` returns the new gate.
- Gate is placed in the Review → Archive transition criteria section.

**Sub-subphase checklist**:

- [ ] **2.1 — Add eval score gate to archive criteria**: add a bullet requiring Phase N+2 to be marked `[x]` with score ≥ 70 before archiving.
  - **Independent verification**: gate text references the score threshold and the eval phase.

---

### Phase 3: Docs Guide Update

**Goal**: Add a brief reference to the eval phase expectation in `docs/ai/guide.md` so it is surfaced during doc-first retrieval.

**Files**:

- `docs/ai/guide.md` — modify — add a note that rollout plans must include an Eval Phase producing a score after Docs Sync and AI-ready reflection.

**Verification gate**:

- `grep -n "eval\|score\|Eval Phase" docs/ai/guide.md` returns the new entry.

**Sub-subphase checklist**:

- [ ] **3.1 — Add eval phase note to guide**: one to two sentences referencing the Eval Phase requirement and linking to the template.
  - **Independent verification**: no duplicated guidance; note links to `rollout-plan-template.md`.

---

### Phase 4: Retrospective Validation

**Goal**: Apply the scoring rubric to the completed 260527 rollout to verify the rubric produces a meaningful result.

**Files**:

- `ai_oriented_kanban/40-archive/26-05/260527-spec-first-doc-routing-rollout.md` — modify — add a retrospective Eval Score session note.

**Verification gate**:

- The 260527 plan includes a scored eval note with all three dimensions populated.
- Score is ≥ 70 (otherwise rubric or the 260527 plan needs revisiting).

**Sub-subphase checklist**:

- [ ] **4.1 — Score the 260527 rollout**: fill in the scoring rubric based on the actual Phase 5 and Phase 6 artifacts already in that plan.
  - **Independent verification**: score is justified dimension by dimension; no dimension is left blank.
- [ ] **4.2 — Assess rubric quality**: if the score produces a surprising result (very high or very low), record the reason and adjust the rubric or threshold in Phase 1 artifacts.
  - **Independent verification**: rubric adjustment (if any) is reflected back in the template and documented.

---

### Phase 5: Docs Sync

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all changed docs are linked and up to date.

**Files**:

- `ai_oriented_kanban/templates/rollout-plan-template.md`
- `ai_oriented_kanban/ai-oriented-kanban.md`
- `docs/ai/guide.md`

**Verification gate**:

- All touched docs have valid `## Related Docs` sections.
- `grep -r "TODO\|FIXME\|TBD" docs/ | grep -v "_template"` returns no new unresolved placeholders.
- `grep "rollout-plan-template" docs/ai/assistant-context-index.md` returns a match (template is indexed).

**Sub-subphase checklist**:

- [ ] **5.1 — Sync metadata and links**: update `Last reviewed:` fields and related-doc links.
  - **Independent verification**: all three modified docs have updated metadata.
- [ ] **5.2 — Validate retrieval topology**: confirm index + related-doc graph resolves correctly after changes.
  - **Independent verification**: no broken relative paths in changed sections.

---

### Phase 6: AI-Ready Docs Reflection and Next-Plan Handoff

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture lessons from implementing the eval phase, and determine whether the phase 5/6 merge question should be revisited.

**Files**:

- This plan — modify — add session note and final reflection.

**Verification gate**:

- Reflection addresses whether the phase 5/6 merge recommendation held up during execution.
- Open questions have decision owners.

**Sub-subphase checklist**:

- [ ] **6.1 — Summarize confirmed improvements**: confirm the eval phase adds measurable signal without adding execution overhead.
  - **Independent verification**: Phase 4 retrospective score exists as evidence.
- [ ] **6.2 — Revisit phase 5/6 merge recommendation**: record whether execution evidence changed the recommendation.
  - **Independent verification**: decision is recorded with at least one data point from Phase 4.

---

### Phase 7: Rollout Eval & Health Score _(new mandatory final phase — this plan validates the phase it introduces)_

**Progress**: `[ ]`

**Goal**: Produce the first-ever eval score for this rollout using the rubric introduced in Phase 1.

**Scoring**:

| Dimension | Points | Evidence |
| --- | --- | --- |
| Docs-first adherence | /40 | Docs-First Retrieval Checklist completion |
| Docs health | /40 | Phase 5 verification gate results |
| Reflection quality | /20 | Phase 6 open questions and decision owners |
| **Total** | **/100** | Record score in session note below |

**Verification gate**:

- Score is recorded in a session note with dimension-by-dimension justification.
- Score ≥ 70 before archiving this plan.

**Sub-subphase checklist**:

- [ ] **7.1 — Evaluate docs-first adherence**: review Docs-First Retrieval Checklist in this plan.
  - **Independent verification**: checklist is fully completed; sufficiency was assessed.
- [ ] **7.2 — Evaluate docs health**: review Phase 5 verification gate results.
  - **Independent verification**: all Docs Sync sub-gates passed (or blocked gates are documented).
- [ ] **7.3 — Evaluate reflection quality**: review Phase 6 open questions and decisions.
  - **Independent verification**: each open question has a decision owner or revisit condition.
- [ ] **7.4 — Record final score**: add session note with score and summary.
  - **Independent verification**: session note is present and score ≥ 70.

---

## Docs Impact

### Docs checked during planning

| Doc | Relevant finding |
| --- | --- |
| `docs/ai/guide.md` | Defines task-type routing; no eval phase reference yet |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Phases N and N+1 are mandatory closing phases; no eval phase exists |
| `ai_oriented_kanban/ai-oriented-kanban.md` | Lane-transition criteria do not reference a score gate |
| `docs/operations/docs-maintenance.md` | Quarterly topology review exists but has no score baseline to compare against |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md` and `ai_oriented_kanban/templates/rollout-plan-template.md`.
- [x] Assessed sufficiency — docs were **sufficient** for scoping this proposal; the rollout template and archived 260527 plan provided enough context to design the eval phase.
- [x] Post-task docs update required: `[x] Yes` — captured in Docs to update below.

### Docs to create

| File | Reason |
| --- | --- |
| _None_ | Existing template and guide docs can absorb the new eval phase without a new canonical file |

### Docs to update

| File | What changes |
| --- | --- |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Add Phase N+2 (Eval & Health Score) with scoring rubric and verification gate |
| `ai_oriented_kanban/ai-oriented-kanban.md` | Add eval score ≥ 70 as archive lane-transition criterion |
| `docs/ai/guide.md` | Add brief reference to eval phase expectation |

### Docs to delete or archive

| File | Reason |
| --- | --- |
| _None_ | No deprecations required |

---

## Success Criteria

- Every new rollout plan includes Phase N+2 (Eval & Health Score).
- The 260527 rollout has a retrospective eval score recorded.
- The archive lane-transition gate in `ai-oriented-kanban.md` requires a passing score.
- The rubric produces a score ≥ 70 for a well-executed rollout and < 70 for one that skipped docs gates.

## Rollback Plan

1. If the scoring rubric proves too complex or subjective in practice, simplify to a binary pass/fail per dimension.
2. If the eval phase adds friction that outweighs its value after two rollouts, remove the numeric scoring but retain the phase structure as a reflection checkpoint.
3. Revert template changes in one commit if the eval gate blocks delivery without providing useful signal.

## Open Questions

See **Decisions D1–D5** in the [Spec Health Evaluation — Actionable Suggestions](#spec-health-evaluation--actionable-suggestions) section above. D1 and D4 were applied as A-options for Phase 1 execution (`>= 70` threshold; keep Phase 5/6 separate). D2, D3, and D5 can be decided any time before Phase 2 begins.
