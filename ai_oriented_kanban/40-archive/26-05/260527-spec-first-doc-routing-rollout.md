# Rollout: Spec-First Docs Routing for AI-Oriented Kanban

## Summary

This rollout enforces a spec-driven execution model where assistants must read documentation first, then scan code only when documentation cannot answer the task. The goal is to make retrieval behavior predictable, preserve architectural intent, and reduce drift between implementation and docs.

The rollout also strengthens graph linking and docs update enforcement so every doc change remains discoverable through the assistant context index and related-doc links.

## Current Evaluation

### What already exists

- Canonical docs routing guidance is defined in `docs/ai/guide.md`.
- The docs index exists in `docs/ai/assistant-context-index.md`.
- Docs governance includes registration and routing-update requirements in `docs/operations/docs-maintenance.md`.
- Copilot baseline references canonical docs in `.github/copilot-instructions.md`.

### What is not centralized / stable / complete yet

#### 1. Spec-first routing is not expressed as a strict execution gate

- Existing guidance recommends loading docs first, but does not clearly enforce a hard fallback rule.
- “Codebase-first” behavior can still happen when task pressure is high.

Representative files:

- `.github/copilot-instructions.md`
- `docs/ai/guide.md`

#### 2. Docs graph-linking is required but not enforced as a rollout gate

- Related-doc linking and index registration are documented, but not consistently tied to active-kanban phase completion.
- Kanban plans can complete without explicit graph integrity checks.

Representative files:

- `docs/operations/docs-maintenance.md`
- `docs/ai/assistant-context-index.md`
- `ai_oriented_kanban/templates/rollout-plan-template.md`

#### 3. Kanban rollout artifacts do not force docs-search/update/link checkpoints

- Current kanban artifacts can omit explicit retrieval validation and cross-link updates.
- No required phase-level checklist currently blocks rollout completion when docs topology checks are missing.

Representative files:

- `ai_oriented_kanban/ai-oriented-kanban.md`
- `ai_oriented_kanban/20-active/260526-populate-docs-domain-files.md`

### Risks in the current state

- [ ] Assistants may scan code before consuming canonical spec docs.
- [ ] New docs may be created without strong graph linkage, reducing retrieval quality.
- [ ] Kanban completion may be marked without docs routing or index validation.

## Scope

- Estimated files to create: 1
- Estimated files to modify: 4
- Risk level: Medium

### In scope

- Enforce “spec docs first, code scan second” contract in assistant guidance.
- Add explicit fallback rule for code scanning only when docs are insufficient.
- Add phase gates for docs index sync and `## Related Docs` linkage.
- Add kanban rollout requirements so active plans include docs search/update/link checks.

### Out of scope

- Rewriting all existing historical kanban artifacts.
- Introducing automated CI tooling beyond existing workflow conventions.

## Minimum Viable Hotfix

- Make routing contract explicit in `.github/copilot-instructions.md` and `docs/ai/guide.md`.
- Add minimal verification checks (`grep`-based) to confirm rule presence and fallback wording.

## Docs Impact

### Docs checked during planning

| Doc | Relevant finding |
| --- | --- |
| `docs/ai/guide.md` | Defines task-type routing and docs-first intent; needs strict fallback wording |
| `docs/ai/assistant-context-index.md` | Canonical retrieval hub for docs graph |
| `docs/operations/docs-maintenance.md` | Defines docs registration and routing-update requirements |
| `docs/workflow/README.md` | Documents workflow doc placement and linking expectations |

### Docs to create

| File | Reason |
| --- | --- |
| _None_ | Existing docs can be extended without adding a new canonical section |

### Docs to update

| File | What changes |
| --- | --- |
| `.github/copilot-instructions.md` | Add hard rule: read relevant spec docs first; scan code only when docs are insufficient |
| `docs/ai/guide.md` | Add mandatory fallback protocol and decision criteria for when code scan is allowed |
| `docs/operations/docs-maintenance.md` | Add rollout gate requiring docs graph-link integrity checks in active-kanban execution |
| `ai_oriented_kanban/ai-oriented-kanban.md` | Add lane transition criteria requiring docs search/update/link validation evidence |
| `docs/ai/assistant-context-index.md` | Update if any routing/governance doc paths or responsibilities change |

### Docs to delete or archive

| File | Reason |
| --- | --- |
| _None_ | No deprecations required |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.

## Context Map

### Files to modify first

| File | Purpose | Why it matters |
| --- | --- | --- |
| `.github/copilot-instructions.md` | Enforce assistant behavior contract | Primary execution policy consumed at task start |
| `docs/ai/guide.md` | Define docs-first retrieval protocol | Primary navigation spec for task execution |

### Likely files to create

| File | Purpose |
| --- | --- |
| _None_ | N/A |

### Dependencies / related patterns

| File | Relationship |
| --- | --- |
| `docs/operations/docs-maintenance.md` | PR gate and docs-governance enforcement |
| `docs/ai/assistant-context-index.md` | Retrieval graph root index |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Plan structure for future rollout consistency |

### Risks

- [ ] Overly strict routing language may conflict with ad-hoc debugging tasks.
- [ ] Governance updates may be added without corresponding index/guide sync.

## Recommended Architecture

### Principle 1: Docs-as-primary-context

Assistants must treat docs as the first execution context. Code scanning is fallback behavior only when documented guidance is missing, ambiguous, or stale for the requested task.

### Principle 2: Graph-complete documentation

Every docs change must preserve navigability through both the assistant index and local related-doc edges to keep retrieval quality stable.

## Decision Updates (2026-05-27)

- **Resolved**: Docs-first fallback criteria will be standardized as a reusable checklist snippet in every rollout plan.
- **Resolved**: Link-graph verification will remain manual in rollout execution, enforced through the rollout template and Docs Sync verification gates so it is not skipped during normal kanban flow.

## Dependency Rule

Each phase must stay in one layer: instruction policy, AI docs routing, governance enforcement, then kanban process hardening.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 1 — Instruction Contract Hardening
- [x] Phase 2 — AI Guide Fallback Protocol
- [x] Phase 3 — Governance and Graph-Link Gates
- [x] Phase 4 — Kanban Process Remediation
- [x] Phase 5 — Docs Sync
- [x] Phase 6 — AI-ready docs reflection and next-plan handoff

## Phases

### Phase 1: Instruction Contract Hardening

**Progress**: `[x]`

**Goal**: Force spec-doc-first routing and explicit fallback-to-code conditions.

**Files**:

- `.github/copilot-instructions.md` — modify — make docs-first contract mandatory and explicit.

**Verification gate**:

- `grep -n "docs first\|scan codebase only" .github/copilot-instructions.md`
- Wording includes decision criteria for insufficient docs context.

**Sub-subphase checklist**:

- [x] **1.1 — Add strict routing clause**: require loading task-relevant docs before code reads.
  - **Independent verification**: explicit mandatory language exists.
- [x] **1.2 — Define fallback trigger**: allow code scan only for missing/unclear/outdated docs.
  - **Independent verification**: fallback conditions are listed in policy text.

---

### Phase 2: AI Guide Fallback Protocol

**Progress**: `[x]`

**Layer**: retrieval guidance layer

**Goal**: Align `docs/ai/guide.md` with strict routing behavior and fallback protocol.

**Files**:

- `docs/ai/guide.md` — modify — add retrieval decision flow and fallback checks.

**Verification gate**:

- `grep -n "docs-first\|fallback\|insufficient" docs/ai/guide.md`
- Updated section does not duplicate rules already canonicalized elsewhere.

**Sub-subphase checklist**:

- [x] **2.1 — Add retrieval decision flow**: define ordered decision path docs → fallback code scan.
  - **Independent verification**: flow is readable and task-agnostic.
- [x] **2.2 — Add post-task docs-update trigger**: require update when code findings invalidate docs.
  - **Independent verification**: trigger language ties implementation findings back to docs updates.

---

### Phase 3: Governance and Graph-Link Gates

**Progress**: `[x]`

**Layer**: documentation governance layer

**Goal**: Require graph-link and index updates as completion gates.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — add explicit graph integrity and routing compliance checks.
- `docs/ai/assistant-context-index.md` — modify — reflect any governance/routing entry changes.

**Verification gate**:

- `grep -n "graph\|Related Docs\|assistant-context-index\|routing" docs/operations/docs-maintenance.md`
- `grep -n "docs-maintenance\|guide" docs/ai/assistant-context-index.md`

**Sub-subphase checklist**:

- [x] **3.1 — Add graph-link gate**: require each touched doc to maintain valid `## Related Docs` links.
  - **Independent verification**: gate language exists in maintenance protocol.
- [x] **3.2 — Add index-sync gate**: fail docs review if touched/new docs are missing index coverage.
  - **Independent verification**: pass/fail criteria include index sync.

---

### Phase 4: Kanban Process Remediation

**Progress**: `[x]`

**Layer**: process governance layer

**Goal**: Ensure kanban rollout artifacts cannot bypass docs search/update/link expectations.

**Files**:

- `ai_oriented_kanban/ai-oriented-kanban.md` — modify — add explicit lane transition checks.
- `ai_oriented_kanban/templates/rollout-plan-template.md` — modify — add mandatory retrieval and graph-verification prompts where missing.

**Verification gate**:

- `grep -n "docs search\|docs update\|docs link\|transition criteria" ai_oriented_kanban/ai-oriented-kanban.md`
- `grep -n "Docs Impact\|Verification gate\|assistant-context-index" ai_oriented_kanban/templates/rollout-plan-template.md`

**Sub-subphase checklist**:

- [x] **4.1 — Add active-lane gate criteria**: require evidence of docs-first retrieval and update/link checks before review/archive move.
  - **Independent verification**: criteria appear under workflow/lane guidance.
- [x] **4.2 — Tighten rollout template prompts**: force planners to include docs search/update/link validation steps and the reusable docs-first fallback checklist snippet.
  - **Independent verification**: template text explicitly demands these checks.

---

### Phase 5: Docs Sync

**Progress**: `[x]`

**Layer**: documentation layer

**Goal**: Ensure all planned doc updates are applied and linked consistently.

**Files**:

- `.github/copilot-instructions.md`
- `docs/ai/guide.md`
- `docs/operations/docs-maintenance.md`
- `docs/ai/assistant-context-index.md`
- `ai_oriented_kanban/ai-oriented-kanban.md`
- `ai_oriented_kanban/templates/rollout-plan-template.md`

**Verification gate**:

- All touched docs include valid links and no broken relative references in changed sections.
- `grep -r "TODO\|FIXME\|TBD" docs/ | grep -v "_template"` has no new unresolved placeholders.
- Any new/changed governance doc is represented in `docs/ai/assistant-context-index.md`.

**Sub-subphase checklist**:

- [x] **5.1 — Sync metadata and links**: update `Last reviewed` fields and related-doc links where applicable.
  - **Independent verification**: `docs/ai/assistant-context-index.md` now has a `## Related Docs` section; stale `.github/templates/` and `kanban/backlogs/` paths in `.github/copilot-instructions.md` replaced with correct `ai_oriented_kanban/` paths.
- [x] **5.2 — Validate retrieval topology**: verify index + related-doc graph still resolves to updated guidance.
  - **Independent verification**: graph from `guide.md` → `assistant-context-index.md` → `docs-maintenance.md` all resolve; no new TODOs/FIXMEs in docs; all touched docs registered in index.

---

### Phase 6: AI-ready docs reflection and next-plan handoff

**Progress**: `[x]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture lessons on docs-first enforcement and open a follow-up plan if gaps remain.

**Files**:

- `ai_oriented_kanban/20-active/260527-spec-first-doc-routing-rollout.md` — modify with handoff note and reflection

**Verification gate**:

- Confirm unresolved gaps are either fixed in this rollout or tracked in a concrete next rollout item.
- Current rollout includes a dated session note linking to next action.

**Sub-subphase checklist**:

- [x] **6.1 — Summarize unresolved friction**: document where docs-first behavior still failed.
  - **Independent verification**: open questions resolved below; stale paths in `copilot-instructions.md` that caused historic retrieval mismatches are now fixed.
- [x] **6.2 — Prepare next rollout (if needed)**: no new rollout file required; open questions converted to deferred backlog items below.
  - **Independent verification**: both open questions have a documented decision path and owner.

### Reflection Notes (2026-05-27)

#### What was confirmed working

- Phases 1–3 enforced a clear docs-first contract across three governance layers (instruction policy, AI routing guide, docs governance).
- Phase 4 lane-transition criteria give kanban actors objective gates to check before moving work between lanes.
- Phase 4 rollout template update ensures the docs-first fallback checklist is a required artifact in every new rollout plan.
- Phase 5 cleaned the only active docs debt: stale `.github/templates/` paths in `copilot-instructions.md` that would have sent assistants to a non-existent template location.

#### Remaining friction points

1. **No automated enforcement of docs-first checklist presence**: new rollout plans could still omit the checklist snippet without any automated signal. Mitigation: the template and lane-transition gate document the requirement; enforcement currently relies on reviewer discipline.

2. **Link-graph verification is manual**: there is no automated dead-link or orphan-doc check. Mitigation: the quarterly topology review in `docs-maintenance.md` includes these checks; a future CI gate can automate them.

### Open Questions — Decision Log

**Q1**: Should we add a lightweight pre-merge grep check that fails when a new rollout plan is missing the standardized docs-first fallback checklist snippet?

- **Decision**: Deferred — not blocking current delivery. Recommended for a future CI/tooling iteration.
- **Owner**: Engineering lead.
- **Revisit condition**: When a CI workflow is introduced for docs validation, include this as the first docs-gate rule.

**Q2**: Should we add a quarterly audit metric (sample size + pass threshold) for manual link-graph verification quality across recently completed rollout plans?

- **Decision**: Deferred — not blocking current delivery. The quarterly topology review checklist in `docs-maintenance.md` already covers the manual audit; a quantified metric can be added when audit history exists.
- **Owner**: Engineering lead.
- **Revisit condition**: After two quarterly audits have been completed, assess whether a sample-size metric adds value.

### Session Note — 2026-05-27

- **Completed**: all six phases of the spec-first doc routing rollout.
- **Verified by**: grep verification gates on all phases; manual retrieval topology check in Phase 5.
- **Next**: no follow-up rollout required at this time. Deferred items tracked in Open Questions above.
- **Blockers**: none.

### Retrospective Eval Score — 2026-05-28

| Dimension | Points | Evidence |
| --- | --- | --- |
| Docs-first adherence | 40/40 | Docs Impact checklist in this rollout was completed with sufficiency assessment and update path. |
| Docs health | 40/40 | Phase 5 verification gate passed with link integrity and index synchronization checks completed. |
| Reflection quality | 20/20 | Phase 6 reflection recorded confirmed improvements and both open questions include owner + revisit condition. |
| **Total** | **100/100** | **Pass (`>= 70`) — archive-ready.** |

Rubric quality check: no adjustment needed. A high score is expected because this rollout completed all docs and reflection gates with explicit evidence.

---

## Dependency Graph

```text
Copilot instruction policy
  ↓
AI routing guide
  ↓
Docs governance gates
  ↓
Kanban process gates
```

## Suggested Implementation Order

1. Phase 1 → Phase 2 (policy and retrieval alignment)
2. Phase 3 (governance enforcement)
3. Phase 4 (kanban remediation)
4. Phase 5 → Phase 6 (docs sync and handoff)

## Success Criteria

- Assistants consistently apply docs-first retrieval before code scanning.
- Code-scan fallback is explicit, justified, and documented.
- Docs updates remain graph-linked through index + related-doc references.
- Active kanban plans include enforceable docs search/update/link gates.
- Every new rollout plan includes the standardized docs-first fallback checklist snippet.

## Rollback Plan

1. Revert instruction wording changes if they block critical debugging workflows.
2. Revert governance/kanban gate changes in one commit if transition burden is too high.
3. Keep existing docs structure and restore prior guide wording while re-planning.

## Open Questions

1. Should we add a lightweight pre-merge grep check that fails when a new rollout plan is missing the standardized docs-first fallback checklist snippet?
2. Should we add a quarterly audit metric (sample size + pass threshold) for manual link-graph verification quality across recently completed rollout plans?

## Recommendation

Execute phases in order with Phase 1–2 as immediate hotfix. This produces fast behavior correction with low risk, then hardens governance and kanban process so docs search/update/link expectations remain enforceable across future tasks.
