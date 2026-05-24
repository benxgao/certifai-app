# Rollout: Upgrade Genkit default model to gemini-3.5-flash

## Summary

This rollout upgrades Certifai backend AI generation from `gemini-2.5-flash` to `gemini-3.5-flash` in a controlled, observable way. The current model is centrally defined in Genkit utilities but still appears in hardcoded telemetry labels and unit-test mocks, which creates drift risk during migration. The goal is to change runtime model selection safely first, then align observability and test contracts so production behavior, logs, and tests all reflect the same model version.

The rollout favors a minimum-viable hotfix path: update canonical model selection and verify end-to-end AI flows without changing business logic or schema. Progressive hardening then addresses telemetry consistency, test stability, and optional fallback controls.

## Current Evaluation

### What already exists

- A centralized default model constant in `functions/src/services/genkit/utils.ts` (`DEFAULT_GENAI_MODEL`).
- Shared Genkit initialization and generation wrappers (`createAiInstancePromise`, `generateWithValidation`) used by multiple AI flows.
- Existing unit tests around exam report and flow shape with mocked `DEFAULT_GENAI_MODEL`.
- Structured logging and AI-service markers in exam generation delegators.

### What is not centralized / stable / complete yet

#### 1. Runtime model and telemetry labels are partially decoupled

- Runtime model is centralized, but exam-generation logs still hardcode `'gemini-2.5-flash'` in `ai_service` fields.
- This can produce misleading operational telemetry after runtime model upgrade.

Representative files:

- `functions/src/services/genkit/utils.ts`
- `functions/src/delegators/tasks/buildExam/questionGeneration.ts`
- `functions/src/delegators/tasks/buildExam/index.ts`

#### 2. Tests pin old model string in mocks

- Regression tests mock `DEFAULT_GENAI_MODEL` with `gemini-2.5-flash`, which will drift from runtime once upgraded.
- Drift can hide config mismatches or produce brittle assertions.

Representative files:

- `functions/__tests__/exam-report-hotfix.test.ts`
- `functions/__tests__/exam-report-phase1-flow-shape.test.ts`

### Risks in the current state

- [ ] Runtime upgrade succeeds but logs still report old model, degrading incident triage quality.
- [ ] Test fixtures lag behind runtime config and fail for non-functional reasons.
- [ ] Prompt/response characteristics may shift (latency/format tendencies), causing hidden regressions in generation-dependent paths.

## Scope

- Estimated files to create: 0–1
- Estimated files to modify: 5–8
- Risk level: Medium

### In scope

- Update default Genkit model to `gemini-3.5-flash`.
- Align hardcoded `ai_service` telemetry strings with canonical model source.
- Update impacted tests/mocks to the new default model.
- Add verification gates for compile, targeted tests, and runtime smoke checks.

### Out of scope

- Prompt redesign or output schema changes.
- Business-rule changes to exam/report generation logic.
- Multi-model routing/AB experimentation (unless explicitly requested in a follow-up rollout).

## Minimum Viable Hotfix

- Phase 1 + Phase 2.
- Phase 1 updates canonical runtime model selection; Phase 2 eliminates telemetry drift so production behavior and logs agree. This is the smallest safe slice that unblocks rollout and operations visibility.

## Context Map

### Files to modify first

| File                                                             | Purpose                               | Why it matters                                             |
| ---------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `functions/src/services/genkit/utils.ts`                         | Canonical model constant + model docs | Primary runtime source of truth for Genkit model selection |
| `functions/src/delegators/tasks/buildExam/questionGeneration.ts` | AI request/response logging labels    | Prevents stale `ai_service` values after model change      |
| `functions/src/delegators/tasks/buildExam/index.ts`              | Batch failure telemetry labels        | Keeps failure telemetry consistent with runtime model      |
| `functions/__tests__/exam-report-hotfix.test.ts`                 | Regression mock alignment             | Ensures tests reflect current default config               |
| `functions/__tests__/exam-report-phase1-flow-shape.test.ts`      | Flow-shape mock alignment             | Prevents stale model constants in test harness             |

### Likely files to create

| File                                            | Purpose                                                        |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `functions/src/config/aiModels.ts` _(optional)_ | Canonical model identifiers used by runtime + telemetry labels |

### Dependencies / related patterns

| File                                                        | Relationship                                             |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| `functions/src/services/genkit/examPlanner.ts`              | Uses `DEFAULT_GENAI_MODEL` through `googleAI.model(...)` |
| `functions/src/services/genkit/quizGenerator.ts`            | Uses shared model constant in generation path            |
| `functions/src/services/genkit/examReportGenerator.ts`      | Uses shared model constant for report generation         |
| `functions/src/services/genkit/certSummaryGenerator.ts`     | Uses shared model constant for cert summary generation   |
| `functions/src/services/genkit/knowledgePoolingGnerator.ts` | Uses shared model constant for pooling generation        |

### Risks

- [ ] Model-name typos or unavailable SKU in target environment cause runtime generation failures.
- [ ] Partial migration leaves mixed model identifiers across logs/tests.

## Recommended Architecture

### Principle 1: Single source of truth for model identifiers

All runtime model selection and telemetry labels should resolve from one canonical constant (or tiny config module), not repeated string literals.

### Principle 2: Upgrade behavior, not business contracts

The rollout should only change model selection and metadata. Response schema expectations, error envelopes, and business outcomes remain unchanged unless separately approved.

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless the user explicitly asks for a looser plan.**

Planned chain:

1. **AI config layer** (`services/genkit/utils.ts`)
2. **Observability layer** (`delegators/tasks/buildExam/*`)
3. **Test layer** (`functions/__tests__/*`)
4. **Optional resilience layer** (feature-flag/fallback config)

Keeping phases layer-isolated minimizes rollback blast radius and avoids mixing runtime, telemetry, and test changes in one commit.

## Phase Sequencing Rule

> **Default sequencing: root-cause fix → data recovery/backfill → contract hardening → UX/message polish → tests.**

Applied here:

- Root-cause fix: model default update.
- No data recovery needed (no persisted data mutation).
- Contract hardening: telemetry/model identifier centralization.
- Tests: update mocks and run targeted regression suite.

## Commit Slicing Rule

> **A phase may be split into sub-subphases when the file count, review surface, or QA burden is too large for one safe commit.**

### Rules for sub-subphases

- Each sub-subphase should be independently reviewable and revertible.
- Each sub-subphase should end with a local verification step.
- If a missing prerequisite appears, add or revise an earlier-layer sub-subphase instead of patching around it downstream.
- Do not split a phase in a way that creates temporary broken imports between commits.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [ ] Phase 1 — Canonical model switch
- [ ] Phase 2 — Telemetry alignment
- [ ] Phase 3 — Test contract alignment
- [ ] Phase 4 — Conditional fallback hardening

## Phases

### Phase 1: Canonical model switch

**Progress**: `[ ]`

**Layer**: `services/genkit` configuration layer

**Goal**: Change default runtime model from `gemini-2.5-flash` to `gemini-3.5-flash` at the canonical source.

**Files**:

- `functions/src/services/genkit/utils.ts` — modify — update `DEFAULT_GENAI_MODEL` and model-reference comments.

**Verification gate** (must pass before Phase 2 starts):

- `cd functions && npx tsc --noEmit`
- `grep -R "gemini-2\.5-flash" src/services/genkit/utils.ts`

**Sub-subphase checklist**:

- [ ] **1.1 — Update canonical default constant**: set `DEFAULT_GENAI_MODEL = 'gemini-3.5-flash'`.
  - **Independent verification**: TypeScript compile passes.
- [ ] **1.2 — Refresh local docs/comments**: update inline examples/comments that reference old model.
  - **Independent verification**: grep confirms no stale `2.5` references in `utils.ts` comments.

---

### Phase 2: Telemetry alignment

**Progress**: `[ ]`

**Layer**: `delegators/tasks/buildExam` observability layer

**Goal**: Ensure `ai_service` log fields reflect current canonical model and remove hardcoded old version strings.

**Files**:

- `functions/src/delegators/tasks/buildExam/questionGeneration.ts` — modify — replace hardcoded telemetry string.
- `functions/src/delegators/tasks/buildExam/index.ts` — modify — replace hardcoded telemetry string in failure path.
- `functions/src/config/aiModels.ts` — create _(optional)_ — centralize telemetry-safe model label exports.

**Verification gate** (must pass before Phase 3 starts):

- `grep -R "gemini-2\.5-flash" functions/src/delegators/tasks/buildExam`
- Run one local exam-generation path and confirm logs emit `ai_service: gemini-3.5-flash`.

**Sub-subphase checklist**:

- [ ] **2.1 — Replace hardcoded model labels**: remove `gemini-2.5-flash` literals from delegator logging.
  - **Independent verification**: grep returns no stale literals in buildExam delegator files.
- [ ] **2.2 — Optional shared label module**: if repeated labels remain, extract to `src/config/aiModels.ts`.
  - **Independent verification**: imports compile and no duplicate string literals remain.

---

### Phase 3: Test contract alignment

**Progress**: `[ ]`

**Layer**: test layer (`functions/__tests__`)

**Goal**: Align mock defaults and regression coverage with upgraded model constant while preserving behavior assertions.

**Files**:

- `functions/__tests__/exam-report-hotfix.test.ts` — modify — update mocked `DEFAULT_GENAI_MODEL`.
- `functions/__tests__/exam-report-phase1-flow-shape.test.ts` — modify — update mocked `DEFAULT_GENAI_MODEL`.

**Verification gate** (must pass before Phase 4 starts):

- `cd functions && npm test -- exam-report-hotfix.test.ts`
- `cd functions && npm test -- exam-report-phase1-flow-shape.test.ts`

**Sub-subphase checklist**:

- [ ] **3.1 — Update model mock constants**: switch mocked model strings to `gemini-3.5-flash`.
  - **Independent verification**: targeted tests pass.
- [ ] **3.2 — Confirm no stale model literal in tests**: repository grep check.
  - **Independent verification**: `grep -R "gemini-2\.5-flash" functions/__tests__` returns expected/intentional results only.

---

### Phase 4: Conditional fallback hardening _(optional conditional phase)_

**Progress**: `[ ]`

**Layer**: runtime resilience/configuration layer

**Goal**: Add guarded rollback lever (feature flag or env override) to quickly revert model without code redeploy if production instability appears.

**Pre-condition check** (do before implementation):

- Inspect whether environment-based model override already exists in `functions/src/services/genkit/utils.ts`.
- Decision rule: if no override exists, execute this phase; otherwise skip and mark `[!]` with rationale `existing override present`.

**Files** _(only if pre-condition is met)_:

- `functions/src/services/genkit/utils.ts` — modify — add env-backed model override with safe default.
- `functions/README.md` or `docs/operations/*.md` — modify — document override/runbook.

**Verification gate** _(if phase is executed)_:

- Local run with override set logs selected model correctly.
- Existing targeted AI flow tests continue passing.

**Sub-subphase checklist**:

- [ ] **4.0 — Infrastructure/contract audit**: verify if override is absent and implement only when needed.
  - **Independent verification**: documented evidence of decision (execute vs skip).

## Dependency Graph

```text
Genkit config constant (services/genkit/utils.ts)
	↓
Delegator telemetry labels (buildExam/*)
	↓
Regression tests (__tests__/*)
	↓
Optional env fallback control
```

## Suggested Implementation Order

1. Phase 1.1 → 1.2
2. Phase 2.1 (and 2.2 only if duplication remains)
3. Phase 3.1 → 3.2
4. Phase 4.0 conditional audit (execute only if needed)

If a gap is found during downstream phases (for example, stale label constants), add a tiny earlier-layer fix rather than patching around it in tests.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short session note with timestamp, last completed step, next step, and blockers.
4. If blocked, mark item `[!]` and record unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>
```

## Essential Implementation Details

- Keep API contracts and error envelopes unchanged; this is a model-version migration, not a response-schema redesign.
- Prefer canonical exported constants over inline model literals in logs and tests.
- Preserve idempotency behavior in exam generation/retry paths; do not alter queue/task semantics.
- Add one manual end-to-end verification: trigger an exam generation task in UAT and verify question generation + report generation both complete with expected status transitions.

## Success Criteria

- `DEFAULT_GENAI_MODEL` is upgraded to `gemini-3.5-flash` and used in all Genkit flows.
- No stale `gemini-2.5-flash` literals remain in active runtime telemetry paths.
- Targeted regression tests pass with updated model constants and unchanged business behavior.

## Rollback Plan

1. Revert Phase 1 commit to restore `DEFAULT_GENAI_MODEL = 'gemini-2.5-flash'`.
2. Revert Phase 2 telemetry alignment commit if log pipeline or dashboards depend on legacy label.
3. Revert/disable Phase 4 override mechanism (if added) and pin explicitly to known-good model.

## Open Questions

1. Is `gemini-3.5-flash` already approved and quota-enabled in all deployment environments (dev/uat/prod)?
2. Should telemetry store exact model IDs or a stable family label plus version field for future upgrades?

## Recommendation

Execute Phases 1–3 in separate commits and release together in one deploy window. This sequence gives the smallest production-risk migration path while preserving high observability quality and test trust. Run Phase 4 only if rapid runtime rollback is a hard operational requirement.
