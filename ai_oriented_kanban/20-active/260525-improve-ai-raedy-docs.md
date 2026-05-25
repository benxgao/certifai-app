# Rollout: Improve AI-Ready Docs Retrieval and Governance (Follow-up)

## Summary

This rollout operationalizes follow-up improvements discovered during the `260525-review-docs-as-code-app.md` migration. It turns the approved backlog into enforceable documentation governance: a layering contract, a new-doc registration checklist, AI retrieval smoke tests, a consistent archive retirement policy, and a quarterly docs topology review. The goal is to reduce future doc drift, prevent orphan docs, and improve first-pass assistant retrieval quality.

## Scope

- Estimated files to create: 2
- Estimated files to modify: 4
- Risk level: Medium

### In scope

- Add explicit docs layering contract to maintenance guidance.
- Add new-doc registration checklist requirements.
- Define a repeatable AI retrieval smoke-test protocol.
- Finalize archive retirement policy and workflow docs placement decision path.
- Add recurring docs topology review cadence.

### Out of scope

- Runtime/auth/API behavior changes.
- Broad taxonomy rewrite outside targeted docs.
- Retroactive rewrite of all existing domain docs.

## Confirmed Improvements Selected from Backlog

Approved for execution in this rollout:

- [x] Add docs layering contract.
- [x] Add new-doc registration checklist.
- [x] Introduce AI retrieval smoke tests (manual protocol).
- [x] Define archive retirement policy.
- [x] Add quarterly docs topology review.

## Open Questions Carried Over with Decision Paths

### Q1. Archive treatment: remove vs historical snapshot

- Current direction from prior rollout: **Totally remove `doc_archived/`**.
- Decision owner: Engineering docs owner.
- Decision path:
  1. Verify no references to `doc_archived/` remain in canonical docs.
  2. If references exist, migrate/replace and re-run checks.
  3. Keep policy as "no new content in archive; canonical docs only".
- Trigger criteria: any PR that introduces archive references fails docs review.

### Q2. Workflow doc naming/location standard

- Current direction from prior rollout: **centralize business workflows under `docs/workflow/`**.
- Decision owner: Engineering docs owner + feature domain maintainers.
- Decision path:
  1. Define naming convention and migration rules in `docs/operations/docs-maintenance.md`.
  2. Add compatibility guidance (linking from old domain locations where needed).
  3. Apply incrementally on net-new workflow docs first; migrate existing workflow docs by priority.
- Trigger criteria: creation of any new workflow doc must follow the standard.

## Docs Impact

### Docs to create

- `docs/operations/ai-retrieval-smoke-tests.md` — manual prompt-based retrieval QA protocol.
- `docs/workflow/README.md` — naming/location convention entrypoint for business workflow docs.

### Docs to update

- `docs/operations/docs-maintenance.md` — layering contract, checklist, archive policy, quarterly review cadence.
- `docs/ai/guide.md` — add retrieval smoke-test reference and when to run it.
- `docs/ai/assistant-context-index.md` — add links to new governance/testing docs.
- `ai_oriented_kanban/20-active/260525-review-docs-as-code-app.md` — handoff link + status confirmation.

## Dependency Graph

```text
Governance contract + policy definitions
  ↓
Retrieval QA protocol
  ↓
AI guide/index integration
  ↓
Workflow location standardization bootstrap
  ↓
Cadence + audit enforcement
```

## Phases

### Phase 1: Governance contract and policy hardening

**Goal**: Codify invariant-vs-workflow layering and archive policy.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — add layering contract and non-duplication rule.
- `docs/operations/docs-maintenance.md` — modify — add archive retirement policy and enforcement checks.

**Owner**: Engineering docs owner

**Verification gate**:

- Layering contract section exists and explicitly distinguishes parent docs vs workflow docs.
- Archive policy states canonical-only rule and rejection criteria for new archive references.

---

### Phase 2: New-doc registration checklist enforcement

**Goal**: Make index/guide registration mandatory for discoverability.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — add PR checklist requirements:
  - update `docs/ai/assistant-context-index.md`
  - update `docs/ai/guide.md` when task routing changes
  - require `Source of truth`, `Last reviewed`, `Owner`

**Owner**: Engineering docs owner + code reviewers

**Verification gate**:

- Checklist appears in docs-maintenance with explicit pass/fail criteria.
- At least one example checklist block is provided for PR usage.

---

### Phase 3: AI retrieval smoke-test protocol

**Goal**: Add practical QA that validates assistant routing quality.

**Files**:

- `docs/operations/ai-retrieval-smoke-tests.md` — create — prompts, expected target docs, pass/fail recording format.
- `docs/ai/guide.md` — modify — add instruction for when to execute smoke tests.

**Owner**: Engineering docs owner + feature implementer in each docs-heavy PR

**Verification gate**:

- Smoke-test doc includes at least 3 prompts, expected routing docs, and pass/fail capture template.
- AI guide links to smoke-test protocol.

---

### Phase 4: Workflow docs location bootstrap

**Goal**: Start enforcing workflow docs naming/location standard.

**Files**:

- `docs/workflow/README.md` — create — `*-workflow.md` naming and placement guidance.
- `docs/ai/assistant-context-index.md` — modify — register `docs/workflow/README.md` as reference.

**Owner**: Engineering docs owner + feature domain maintainers

**Verification gate**:

- `docs/workflow/README.md` exists and defines location and naming rules.
- Assistant index includes reference to workflow convention doc.

---

### Phase 5: Quarterly topology review protocol

**Goal**: Add a recurring maintenance cadence for drift detection.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — add quarterly review checklist and drift indicators.

**Owner**: Engineering docs owner

**Verification gate**:

- Quarterly cadence is explicit.
- Drift indicators include duplicate headings, stale `Last reviewed`, and orphan docs.

---

### Phase 6: Docs Sync (mandatory)

**Goal**: Ensure all impacted docs are updated and indexed together.

**Files**:

- All files listed in `## Docs Impact`

**Owner**: Implementation author + reviewer

**Verification gate**:

- All docs listed under create/update exist and pass metadata conventions.
- `assistant-context-index.md` includes newly created docs.
- No unresolved placeholders in touched docs.

## Suggested Implementation Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6

## Rollback Plan

1. Revert newly created governance/testing docs if they conflict with existing process.
2. Revert `docs-maintenance` changes in one commit if checklist/policy language is rejected.
3. Revert index/guide links that point to incomplete docs.
4. Keep only verified, reviewer-approved policy sections.

## Recommendation

Execute Phases 1–3 first for immediate retrieval quality improvement and reviewability gains. Then complete Phases 4–5 to lock in long-term structure and cadence, finishing with mandatory Docs Sync.

## Session Notes

### Session Note — 2026-05-25 02:15 UTC

- Completed: Drafted AI-ready docs follow-up rollout plan
- Verified by: Plan includes approved backlog items, carried-open questions with decision paths, explicit owners, phased gates, rollback, and recommendation
- Next: Execute rollout phases in implementation PR(s)
- Blockers: none
