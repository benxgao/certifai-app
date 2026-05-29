# Rollout: Spec-First Development + Graph-Link System (certifai-app)

## Summary

This rollout introduces the same spec-first development and graph-link governance model already proven in `certifai-api`, adapted to `certifai-app` workflows, templates, and docs routing.

The objective is to make `certifai-app` planning and execution explicitly docs-led and auditable: assistants and reviewers should be able to see which docs were required, whether docs were sufficient for each major decision, when fallback code scanning was necessary, and exactly how doc gaps were remediated in the same rollout.

This rollout also adds a docs-only simulation-readiness loop so future comparable work can be executed from specs and canonical docs first, with fallback scans constrained, measured, and continuously reduced.

## Requirement Scenario Alignment

Target operating behavior for every rollout in `certifai-app`:

1. Assistant starts by searching canonical docs/specs first (not code) and declares a `Docs Needed` list before implementation.
2. Assistant makes major decisions using those docs and records evidence for each decision (`Docs cited`, sufficiency, fallback use, remediation action).
3. If docs are insufficient, assistant must update docs in the same rollout (or record explicit owner/date block) so comparable future work gets easier.
4. Team can simulate a comparable project by providing docs/specs only, with measurable pass/fail criteria.

### Non-negotiable workflow contract

- No implementation starts until `Docs Needed` is declared and approved.
- No major decision is valid without a decision-evidence record.
- Any fallback code scan requires a same-rollout doc reconciliation action.
- Rollout closure requires at least one docs-only simulation run with evidence.

## Current Evaluation

### What already exists

- Docs-first routing guidance exists in `docs/ai/guide.md`.
- Canonical context map exists in `docs/ai/assistant-context-index.md`.
- Docs governance and graph-link registration checklist exists in `docs/operations/docs-maintenance.md`.
- Retrieval QA baseline exists in `docs/operations/ai-retrieval-smoke-tests.md`.
- Rollout template includes mandatory closing phases in `ai_oriented_kanban/templates/rollout-plan-template.md`.
- PR template has docs-impact prompts in `.github/pull_request_template.md`.

### What is not centralized / stable / complete yet

#### 1. Spec-first evidence is not a hard requirement in rollout artifacts

- Rollout template requires docs-impact assessment, but does not require a mandatory `Docs Needed` declaration per execution window.
- No non-optional per-decision evidence schema (`Decision`, `Docs cited`, `Sufficiency verdict`, `Fallback scan used`, `Doc update action`) is enforced in every rollout.

Representative files:

- `ai_oriented_kanban/templates/rollout-plan-template.md`
- `.github/pull_request_template.md`

#### 2. Kanban artifacts do not yet have an explicit graph-link gate contract

- Canonical docs require index registration and related docs, but kanban templates do not require backlinking governance docs and routing docs for each rollout.
- There is no standard “kanban item ↔ canonical docs graph” traceability checklist.

Representative files:

- `ai_oriented_kanban/templates/rollout-plan-template.md`
- `docs/operations/docs-maintenance.md`

#### 3. Simulation-readiness criteria are not defined as a first-class docs artifact

- `certifai-app` currently lacks a canonical `project-simulation-readiness` rubric.
- Smoke tests validate retrieval routing, but do not yet require a full docs-only execution drill output format.

Representative files:

- `docs/operations/ai-retrieval-smoke-tests.md`
- `docs/ai/assistant-context-index.md`

### Risks in the current state

- [ ] Review quality depends on reviewer memory, not mandatory evidence blocks.
- [ ] Assistants may still start from code scans too early when docs could have sufficed.
- [ ] Governance docs can regress in discoverability without explicit kanban graph-link gates.
- [ ] Decision reproducibility is weak when decision-to-doc sufficiency is not captured.
- [ ] “Docs-only executable” quality cannot be scored without a simulation rubric.

## Scope

- Estimated files to create: 2
- Estimated files to modify: 8–10
- Risk level: Medium

### In scope

- Add spec-first governance doc for `certifai-app` operations.
- Add docs-only simulation-readiness rubric and run-log template.
- Update rollout and executive templates to enforce docs-needed + decision evidence.
- Extend docs-maintenance + guide/index for graph-link and routing hardening.
- Expand retrieval smoke tests with spec-first/kanban and insufficiency-remediation prompts.
- Update Copilot and PR instructions to require docs-first decisions and explicit doc reconciliation.
- Add acceptance checks proving a comparable rollout can be generated from docs/specs only.

### Out of scope

- Frontend feature behavior changes.
- API contract changes.
- Refactoring route/component implementations.

## Minimum Viable Hotfix

- Introduce mandatory `Docs Needed` + `Decision Evidence Log` sections in the rollout template.
- Add `docs/operations/spec-first-kanban-integration.md` and route it through index + guide.
- Update `.github/copilot-instructions.md` and `.github/pull_request_template.md` to make docs-first + doc-update fallback non-optional.

This delivers immediate governance gains with low implementation risk and no product-surface impact.

## Docs Impact

> Completed during planning before implementation.

### Docs checked during planning

| Doc                                                     | Relevant finding                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `docs/ai/guide.md`                                      | Docs-first flow is present; needs stronger rollout-evidence requirements and simulation routing entry. |
| `docs/ai/assistant-context-index.md`                    | Canonical index exists; new governance docs can be registered cleanly.                                 |
| `docs/operations/docs-maintenance.md`                   | Graph-link + registration gates exist; kanban-level enforcement can be made explicit.                  |
| `docs/operations/ai-retrieval-smoke-tests.md`           | Baseline prompts exist; no explicit spec-first governance or simulation-drill prompt yet.              |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Strong structure exists; needs mandatory `Docs Needed` and decision-evidence schema.                   |
| `.github/copilot-instructions.md`                       | Docs-first protocol exists; can be tightened with explicit pre-implementation evidence gate.           |
| `.github/pull_request_template.md`                      | Docs impact checklist exists; needs required `Docs Needed` + decision evidence block.                  |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md`.
- [x] Declared initial `Docs Needed` list before rollout authoring.
- [x] Assessed sufficiency — docs were **sufficient** / ~~**insufficient**~~.
  - If insufficient: docs that were missing, ambiguous, or outdated: _N/A for planning phase._
  - If insufficient: fallback code scan was used for this specific decision: _N/A._
- [x] For each major planning decision, captured evidence in the decision log below.
- [x] Post-task docs update required: `[x] Yes` — captured in Docs to update below | `[ ] No`.

### Docs Needed (planning + implementation)

| Doc                                                     | Why needed                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `docs/ai/guide.md`                                      | Define docs-first routing behavior and update retrieval rules.                  |
| `docs/ai/assistant-context-index.md`                    | Register any new governance docs for discoverability.                           |
| `docs/operations/docs-maintenance.md`                   | Align graph-link and docs-governance enforcement language.                      |
| `docs/operations/ai-retrieval-smoke-tests.md`           | Expand retrieval QA for spec-first and simulation-drill scenarios.              |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Enforce non-optional spec-first evidence in rollout artifacts.                  |
| `.github/copilot-instructions.md`                       | Enforce assistant behavior: docs-first, fallback criteria, docs reconciliation. |
| `.github/pull_request_template.md`                      | Enforce PR-level evidence capture and reviewer gate.                            |

### Planning Decision Evidence Log

| Decision                                                          | Docs cited                                                                  | Sufficiency verdict | Fallback code scan used? | Doc update action                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------- | ------------------------ | --------------------------------------------------------------------------- |
| Use template-first rollout enforcement (not ad-hoc project notes) | `ai_oriented_kanban/templates/rollout-plan-template.md`, `docs/ai/guide.md` | Sufficient          | No                       | Update rollout template with required `Docs Needed` + evidence schema.      |
| Treat graph-link integrity as kanban review gate                  | `docs/operations/docs-maintenance.md`, `docs/ai/assistant-context-index.md` | Sufficient          | No                       | Add explicit kanban graph-link checks to governance docs/templates.         |
| Add docs-only simulation-readiness rubric                         | `docs/operations/ai-retrieval-smoke-tests.md`, `docs/ai/guide.md`           | Sufficient          | No                       | Create `docs/ai/project-simulation-readiness.md` and route via index/guide. |

### Docs to create

| File                                               | Reason                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `docs/operations/spec-first-kanban-integration.md` | Canonical policy mapping spec-first delivery to kanban artifacts and reviewer gates.          |
| `docs/ai/project-simulation-readiness.md`          | Defines docs-only execution scorecard, fallback-scan ratio targets, and run-log requirements. |

### Docs to update

| File                                                       | What changes                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `ai_oriented_kanban/templates/rollout-plan-template.md`    | Add mandatory `Docs Needed`, `Decision Evidence Log`, and docs insufficiency remediation workflow. |
| `ai_oriented_kanban/templates/excutive-report-template.md` | Add spec-first + graph-link governance summary and retrieval evidence section.                     |
| `docs/operations/docs-maintenance.md`                      | Add explicit kanban-artifact graph-link enforcement and review gate language.                      |
| `docs/operations/ai-retrieval-smoke-tests.md`              | Add spec-first, graph-link, and docs-insufficiency simulation prompts.                             |
| `docs/ai/guide.md`                                         | Add routing entry for spec-first/kanban governance + docs-only simulation tasks.                   |
| `docs/ai/assistant-context-index.md`                       | Register newly added governance and simulation-readiness docs.                                     |
| `.github/copilot-instructions.md`                          | Add explicit pre-implementation evidence gate and docs-update mandate on fallback scan.            |
| `.github/pull_request_template.md`                         | Require `Docs Needed` and `Decision Evidence Log` sections in PR description.                      |

### Docs to delete or archive

| File   | Reason                                |
| ------ | ------------------------------------- |
| _None_ | No deletions planned in this rollout. |

## Context Map

### Files to modify first

| File                                                    | Purpose                              | Why it matters                                      |
| ------------------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Enforce spec-first evidence contract | Controls every future rollout artifact.             |
| `docs/operations/spec-first-kanban-integration.md`      | Canonical policy definition          | Central governance anchor for reviewers/assistants. |
| `.github/copilot-instructions.md`                       | Assistant runtime behavior contract  | Prevents docs-first regressions during execution.   |
| `.github/pull_request_template.md`                      | Reviewer evidence gate               | Ensures policy is enforced at merge time.           |

### Likely files to create

| File                                               | Purpose                                   |
| -------------------------------------------------- | ----------------------------------------- |
| `docs/operations/spec-first-kanban-integration.md` | Governance policy + checklist + examples. |
| `docs/ai/project-simulation-readiness.md`          | Simulation rubric and evidence template.  |

### Dependencies / related patterns

| File                                                       | Relationship                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `docs/ai/guide.md`                                         | Task-routing source for docs-first retrieval behavior.           |
| `docs/ai/assistant-context-index.md`                       | Discoverability source for new governance docs.                  |
| `docs/operations/docs-maintenance.md`                      | PR/docs review enforcement baseline.                             |
| `docs/operations/ai-retrieval-smoke-tests.md`              | QA layer that validates routing and discoverability.             |
| `ai_oriented_kanban/templates/excutive-report-template.md` | Closing artifact for governance evidence in stakeholder summary. |

### Risks

- [ ] Over-constraining templates may reduce adoption if not explained clearly.
- [ ] Partial rollout (template updates without guide/index updates) could create false compliance.

## Recommended Architecture

### Principle 1: Spec-first is a rollout invariant

No implementation begins without explicit docs-needed declaration, decision-evidence schema, and acceptance criteria.

### Principle 2: Graph-link governance is a discoverability contract

Any governance addition must be reachable from routing guide + assistant index + related-doc backlinks.

### Principle 3: Decision traceability must be auditable

Each major decision must include docs cited, sufficiency verdict, fallback usage, and doc remediation action.

### Principle 4: Simulation readiness is measurable

Docs quality is accepted only when comparable tasks can be executed docs-first with bounded fallback-scan ratio.

### Principle 5: Docs insufficiency triggers same-rollout remediation

When a doc/spec gap blocks or weakens a decision, remediation is mandatory in the same rollout (or blocked with owner and due date).

## Dependency Rule

Each phase should focus on one dependency layer in order: policy contract → template enforcement → documentation graph routing → retrieval QA → reflection/simulation/eval.

Cross-layer updates are limited to explicit contract-alignment sub-subphases.

## Phase Sequencing Rule

Default sequence: contract definition → artifact enforcement → discoverability hardening → QA verification → docs sync → simulation reflection/evaluation.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 0 — Scenario-hardening integration (completed)
- [ ] Phase 1 — Spec-first governance contract
- [ ] Phase 2 — Kanban template + PR gate enforcement
- [ ] Phase 3 — Graph-link routing hardening
- [ ] Phase 4 — Retrieval QA expansion
- [ ] Phase 5 — Docs Sync
- [ ] Phase 6 — AI-ready docs reflection and next-plan handoff
- [ ] Phase 7 — Docs-only Simulation Drill
- [ ] Phase 8 — Rollout Eval & Health Score

## Phases

### Phase 0: Scenario-hardening integration _(completed)_

**Progress**: `[x]`

**Layer**: contract-alignment baseline

**Goal**: Land the initial scenario-hardening changes so docs-first decisioning, evidence capture, remediation rules, and simulation-readiness routing are enforceable across templates and canonical docs.

**Files**:

- `.github/copilot-instructions.md` — modified — enforce pre-implementation `Docs Needed` + decision-evidence gate and fallback-remediation mandate.
- `.github/pull_request_template.md` — modified — require `Docs Needed` and `Decision Evidence Log` blocks in PR artifacts.
- `ai_oriented_kanban/templates/rollout-plan-template.md` — modified — enforce mandatory docs-needed/evidence sections and docs-only simulation closing phase.
- `ai_oriented_kanban/templates/excutive-report-template.md` — modified — add governance evidence summary for closure reporting.
- `docs/operations/docs-maintenance.md` — modified — add kanban graph-link and insufficiency-remediation pass/fail criteria.
- `docs/operations/ai-retrieval-smoke-tests.md` — modified — add spec-first, graph-link, insufficiency-remediation, and simulation prompts.
- `docs/ai/guide.md` — modified — add routing for spec-first rollout governance and docs-only simulation readiness.
- `docs/ai/assistant-context-index.md` — modified — register new governance and simulation docs.
- `docs/operations/spec-first-kanban-integration.md` — created — canonical governance policy and reviewer gate contract.
- `docs/ai/project-simulation-readiness.md` — created — simulation rubric, fallback-ratio rule, and run-log template.

**Verification gate**:

- All Phase 0 files were updated/created as planned.
- Markdown diagnostics returned no errors for touched files.
- New docs are discoverable from routing/index docs and included in related-doc backlinks.
- Docs marker hygiene check (`TODO`/`FIXME`/`TBD`) passed for touched docs.

**Sub-subphase checklist**:

- [x] **0.1 — Enforce assistant + PR evidence gates**: updated Copilot and PR instructions for docs-needed and decision evidence.
  - **Independent verification**: required sections are present in `.github/copilot-instructions.md` and `.github/pull_request_template.md`.
- [x] **0.2 — Enforce template-level governance artifacts**: updated rollout and executive templates with spec-first evidence expectations.
  - **Independent verification**: `rollout-plan-template.md` and `excutive-report-template.md` include governance evidence requirements.
- [x] **0.3 — Publish + route new canonical docs**: created governance and simulation-readiness docs; linked through guide/index/operations docs.
  - **Independent verification**: `assistant-context-index.md` and `guide.md` include links to both new docs.
- [x] **0.4 — Validate baseline integrity**: executed diagnostics and docs hygiene/link discoverability checks.
  - **Independent verification**: no diagnostics errors and link-discoverability checks passed.

---

### Phase 1: Spec-first governance contract

**Progress**: `[ ]`

**Layer**: governance policy

**Goal**: Define canonical spec-first + decision-evidence requirements for `certifai-app` rollout execution.

**Files**:

- `docs/operations/spec-first-kanban-integration.md` — create — canonical policy and checklist.
- `.github/copilot-instructions.md` — modify — enforce docs-first decision gate and fallback remediation rule.

**Verification gate**:

- New governance doc includes spec format, acceptance schema, and reviewer gate.
- `copilot-instructions` includes explicit requirement to list `Docs Needed` before implementation and update docs when fallback scan is used.
- New policy doc has valid metadata and `## Related Docs` links.
- Governance text explicitly states that decisions must be sourced from docs/specs first, with code scan as controlled fallback only.

**Sub-subphase checklist**:

- [ ] **1.1 — Define spec format contract**: include scope, assumptions, constraints, risks, acceptance criteria, and decision evidence schema.
  - **Independent verification**: policy doc contains all required fields and one minimal example.
- [ ] **1.2 — Define reviewer gate**: specify pass/fail criteria for docs-needed and evidence completeness.
  - **Independent verification**: checklist includes mandatory fields and explicit fail conditions.
- [ ] **1.3 — Update assistant behavior contract**: add docs-first + fallback remediation mandate.
  - **Independent verification**: `.github/copilot-instructions.md` contains pre-implementation evidence gate text.

---

### Phase 2: Kanban template + PR gate enforcement

**Progress**: `[ ]`

**Layer**: workflow artifact layer

**Goal**: Make spec-first evidence capture non-optional in rollout and PR artifacts.

**Files**:

- `ai_oriented_kanban/templates/rollout-plan-template.md` — modify — enforce `Docs Needed`, `Decision Evidence Log`, and insufficiency remediation workflow.
- `ai_oriented_kanban/templates/excutive-report-template.md` — modify — add governance summary and retrieval-evidence section.
- `.github/pull_request_template.md` — modify — add required `Docs Needed` + `Decision Evidence Log` block.

**Verification gate**:

- Rollout template cannot be considered complete without decision-evidence table.
- PR template includes explicit reviewer checkboxes for docs-needed/evidence completion.
- Executive template includes closure summary for docs sufficiency and remediation outcomes.
- Template language requires decisions be derived from retrieved docs/specs before implementation work begins.

**Sub-subphase checklist**:

- [ ] **2.1 — Add mandatory docs-needed block**: require upfront docs declaration and reason per doc.
  - **Independent verification**: template has non-optional section text and pass/fail language.
- [ ] **2.2 — Add decision-evidence schema**: require all 5 columns for major decisions.
  - **Independent verification**: template includes structured table with required headers.
- [ ] **2.3 — Add insufficiency remediation flow**: define what must happen when docs are insufficient.
  - **Independent verification**: template includes explicit “update docs or block with owner/date” rule.
- [ ] **2.4 — Extend PR gate**: align review checklist with rollout evidence requirements.
  - **Independent verification**: PR template includes mandatory evidence confirmations.

---

### Phase 3: Graph-link routing hardening

**Progress**: `[ ]`

**Layer**: docs topology layer

**Goal**: Ensure new governance docs are discoverable and routed from canonical AI context entrypoints.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — add explicit kanban graph-link governance language.
- `docs/ai/assistant-context-index.md` — modify — register new governance docs.
- `docs/ai/guide.md` — modify — add task routing for spec-first governance and simulation readiness.
- `docs/ai/project-simulation-readiness.md` — create — define rubric, score thresholds, and run log.

**Verification gate**:

- Both new docs are indexed and linked from `guide.md` and `assistant-context-index.md`.
- `docs-maintenance` includes enforceable kanban-artifact graph-link gate.
- `project-simulation-readiness` includes measurable pass threshold and fallback-scan ratio rule.
- Routing docs include a clear entry for “build rollout plan from specs/docs only.”

**Sub-subphase checklist**:

- [ ] **3.1 — Harden docs-maintenance policy**: add kanban artifact checks to existing registration gate.
  - **Independent verification**: explicit kanban references appear under pass/fail criteria.
- [ ] **3.2 — Register new docs in routing surfaces**: update index + guide entries.
  - **Independent verification**: all links resolve and are in correct sections.
- [ ] **3.3 — Publish simulation rubric**: define scorecard, fallback ratio, and run-log template.
  - **Independent verification**: doc includes threshold and pass/fail decision logic.

---

### Phase 4: Retrieval QA expansion

**Progress**: `[ ]`

**Layer**: QA protocol

**Goal**: Validate that assistants retrieve and apply spec-first + graph-link governance docs on first pass.

**Files**:

- `docs/operations/ai-retrieval-smoke-tests.md` — modify — add prompts for spec-first planning, graph-link validation, and docs insufficiency remediation.

**Verification gate**:

- Added prompts explicitly expect `Docs Needed` output and decision-evidence capture.
- Pass criteria include graph-link validation (guide + index + related docs).
- At least one prompt verifies insufficiency handling with concrete doc-update targets.
- At least one prompt tests “docs-only rollout planning” with no pre-emptive code scanning.

**Sub-subphase checklist**:

- [ ] **4.1 — Add spec-first planning prompt**: verify docs-needed declaration before implementation.
  - **Independent verification**: expected docs list references canonical paths.
- [ ] **4.2 — Add graph-link integrity prompt**: verify index/guide/related-doc discoverability behavior.
  - **Independent verification**: pass criteria require all three link checks.
- [ ] **4.3 — Add insufficiency remediation prompt**: require exact doc update actions when docs are ambiguous/outdated.
  - **Independent verification**: expected response format includes doc path + section to update.

---

### Phase 5: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all docs listed in `## Docs Impact` are created/updated and discoverable before closure.

**Pre-condition check**:

- Review `## Docs Impact` for create/update scope.

**Files** _(from Docs Impact section above)_:

- `docs/operations/spec-first-kanban-integration.md` — create — policy contract.
- `docs/ai/project-simulation-readiness.md` — create — simulation rubric.
- All docs listed under `Docs to update` — modify.

**Verification gate**:

- Every doc listed under `Docs to create` exists with metadata fields.
- Every doc listed under `Docs to update` has current `Last reviewed:` date.
- `grep -r "TODO\|FIXME\|TBD" docs/ | grep -v "_template"` has no unresolved markers in touched docs.
- `assistant-context-index.md` contains entries for new docs.
- Touched docs include valid `## Related Docs` links.

**Sub-subphase checklist**:

- [ ] **5.0 — Confirm docs-first checklist completion**: ensure sufficiency and post-task update status are explicit.
  - **Independent verification**: checklist is fully populated with no blank required fields.
- [ ] **5.1 — Create new docs**: author both planned new docs.
  - **Independent verification**: each has `Source of truth`, `Last reviewed`, `Owner`.
- [ ] **5.2 — Update existing docs**: apply all listed updates with consistent language.
  - **Independent verification**: no contradictory guidance across guide/maintenance/template docs.
- [ ] **5.3 — Verify graph links + index sync**: confirm discoverability across guide/index/related-doc links.
  - **Independent verification**: all new doc filenames are grep-discoverable from assistant index.

---

### Phase 6: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement

**Goal**: Capture lessons and produce follow-up plan for any unresolved policy or readiness gaps.

**Files**:

- `ai_oriented_kanban/10-plan/<next-rollout>.md` — create/modify — follow-up operationalization plan (if needed).
- `ai_oriented_kanban/10-plan/260529-specs-first-kanban-integration.md` — modify — add handoff note.

**Verification gate**:

- Confirmed improvements are carried into next rollout scope if unresolved.
- Open questions include owner + decision criteria.
- Current rollout has a handoff note with linked next plan path.

**Sub-subphase checklist**:

- [ ] **6.1 — Summarize confirmed improvements**: capture what should become default practice.
  - **Independent verification**: improvement items appear in a concrete follow-up scope.
- [ ] **6.2 — Resolve/carry open questions with ownership**: assign owner and timeline for each unresolved item.
  - **Independent verification**: no open question lacks owner or decision gate.
- [ ] **6.3 — Record handoff note**: add next-plan linkage and closure statement.
  - **Independent verification**: handoff path is present and valid.

---

### Phase 7: Docs-only Simulation Drill _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: validation/reproducibility

**Goal**: Prove a comparable planning task can be executed docs-first with bounded fallback scans.

**Files**:

- `docs/operations/ai-retrieval-smoke-tests.md` — modify — include a simulation drill prompt.
- `docs/ai/project-simulation-readiness.md` — modify — capture run log and scorecard.
- `ai_oriented_kanban/10-plan/260529-specs-first-kanban-integration.md` — modify — record drill verdict.

**Verification gate**:

- Drill output includes `Docs Needed`, decision evidence, and fallback justification (if any).
- At least one run passes with no unjustified fallback scan.
- Any fallback scan has corresponding doc-update action.
- Run package demonstrates that a comparable rollout plan can be produced from docs/specs only.

**Sub-subphase checklist**:

- [ ] **7.1 — Define drill scenario**: write representative task prompt and expected output schema.
  - **Independent verification**: scenario references canonical docs and pass criteria.
- [ ] **7.2 — Execute and record evidence**: complete one run and store scorecard.
  - **Independent verification**: run log includes all required evidence columns.
- [ ] **7.3 — Apply corrective updates**: fix any discovered doc insufficiencies.
  - **Independent verification**: insufficiency list is empty or tracked with owners/due dates.

---

### Phase 8: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: rollout quality/evaluation

**Goal**: Produce final health score and closure recommendation after docs sync, reflection, and simulation drill.

**Scoring rubric**:

| Dimension            | Max Points | How scored                                                              |
| -------------------- | ---------- | ----------------------------------------------------------------------- |
| Docs-first adherence | 40         | Checklist complete, sufficiency explicit, fallback documented when used |
| Docs health          | 40         | Docs Sync gates pass (create/update/index/link integrity)               |
| Reflection quality   | 20         | At least one confirmed improvement + owned open questions               |
| Simulation readiness | 20         | Drill run evidence exists; fallback ratio meets threshold               |
| **Total**            | **120**    | Pass threshold: $\ge 85$                                                |

**Verification gate**:

- Score table populated with evidence links for each dimension.
- Session note includes total score, recommendation, and archive readiness.

**Sub-subphase checklist**:

- [ ] **8.1 — Score docs-first adherence**: evaluate checklist and sufficiency records.
  - **Independent verification**: all required evidence fields are present.
- [ ] **8.2 — Score docs health**: evaluate Docs Sync gate outcomes.
  - **Independent verification**: each docs gate marked pass/blocked with justification.
- [ ] **8.3 — Score reflection + simulation readiness**: evaluate handoff quality and drill results.
  - **Independent verification**: run log + decision ownership evidence exists.
- [ ] **8.4 — Record final score + recommendation**: publish score table and closeout note.
  - **Independent verification**: total and pass/fail verdict are explicit.

## Dependency Graph

```text
Spec-first governance policy
	↓
Kanban templates + PR evidence gates
	↓
Doc graph routing (guide/index/related links)
	↓
Retrieval QA protocol
	↓
Simulation drill + rollout evaluation
```

## Suggested Implementation Order

0. Phase 0 — Scenario-hardening integration (**completed**)
1. Phase 1 — Spec-first governance contract
2. Phase 2 — Template + PR evidence enforcement
3. Phase 3 — Graph-link routing hardening
4. Phase 4 — Retrieval QA expansion
5. Phase 5 — Docs Sync
6. Phase 6 — Reflection and next-plan handoff
7. Phase 7 — Docs-only simulation drill
8. Phase 8 — Rollout eval and health score

## Success Criteria

- All new rollout plans in `certifai-app` require `Docs Needed` and `Decision Evidence Log` sections.
- New governance docs are indexed in `assistant-context-index` and routed in `guide`.
- Retrieval smoke tests include spec-first + graph-link + insufficiency-remediation prompts.
- Copilot + PR instructions enforce docs-first decision path and same-rollout docs reconciliation.
- At least one simulation drill run demonstrates docs-first reproducible execution with bounded fallback scans.
- Given canonical docs/specs only, an assistant can generate a comparable rollout plan with explicit `Docs Needed` and decision evidence, without relying on ad-hoc code discovery.

## Rollback Plan

1. Revert template/PR gate changes if workflow adoption friction is too high.
2. Revert governance/routing doc additions if they conflict with existing docs architecture.
3. Revert QA prompt additions if they produce ambiguous or low-signal evaluation outcomes.

## Open Questions

1. Should simulation drills be required for every major rollout or only on a fixed cadence?
2. What fallback code-scan ratio threshold should trigger a “docs quality hold” status in release review?

## Recommendation

Phase 0 scenario-hardening integration is complete and establishes the baseline contract/routing needed for docs-first execution. Proceed with Phases 1–4 as the next governance hardening set, then complete mandatory closing Phases 5–8 to prove durability and readiness. This sequence keeps risk low while making spec-first behavior enforceable and auditable across future `certifai-app` rollouts, and directly satisfies the target scenario of docs-led decisioning plus docs-only project simulation.
