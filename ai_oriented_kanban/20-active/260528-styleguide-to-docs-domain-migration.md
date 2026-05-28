# Rollout: Migrate `styleguide/` Content to `docs/` Domain Files and Remove `styleguide/`

## Summary

This rollout migrates all remaining guidance in `styleguide/app.md`, `styleguide/shared.md`, and `styleguide/marketing.md` into canonical `docs/` domain files, then removes the `styleguide/` directory once retrieval paths and cross-links are fully updated.

The goal is to centralize documentation under the docs-domain architecture so both humans and AI assistants rely on a single source-of-truth graph under `docs/`.

## Current Evaluation

### Current state

- `docs/style/conventions.md` already references styleguide inputs and central style conventions.
- AI retrieval index exists in `docs/ai/assistant-context-index.md` and routing rules exist in `docs/ai/guide.md`.
- Ops doc ownership map exists in `docs/operations/docs-maintenance.md`.

### What is not centralized / stable / complete yet

#### 1. Styling source remains split

- Key style guidance still lives in `styleguide/` instead of domain docs.
- `docs/style/conventions.md` still points to `styleguide/*.md` as source-of-truth.

Representative files:

- `styleguide/app.md`
- `styleguide/shared.md`
- `styleguide/marketing.md`
- `docs/style/conventions.md`

#### 2. Docs graph still depends on `styleguide/` paths

- `docs/operations/docs-maintenance.md` still maps style docs to `styleguide/` paths.
- Existing kanban intake/report documents mention `styleguide/` and should be treated as historical artifacts unless explicitly reclassified.

Representative files:

- `docs/operations/docs-maintenance.md`
- `docs/adr/0001-docs-architecture-mvp.md`

### Risks in the current state

- [ ] Duplicate or conflicting guidance between migrated docs and legacy styleguide pages.
- [ ] Broken links or stale source-of-truth references after migration.
- [ ] Premature folder removal before docs graph and retrieval index are verified.

## Scope

- Estimated files to create: 0-2 (only if splitting style content into additional domain docs is required)
- Estimated files to modify: 6-12
- Estimated files to delete: 3 (`styleguide/*.md`) + directory removal
- Risk level: Medium

### In scope

- Migrate all normative guidance from `styleguide/` into `docs/` domain files.
- Update `Source of truth` and cross-links in affected docs.
- Update retrieval/index docs so no active path references `styleguide/` for canonical guidance.
- Remove `styleguide/` directory after verification gates pass.

### Out of scope

- Runtime code refactors unrelated to documentation migration.
- Rewriting archived kanban records for historical consistency.
- Changing non-doc product behavior.

## Minimum Viable Hotfix

- Phase 1 (content inventory + mapping) and Phase 2 (domain-doc migration) are the minimum safe path.
- Deleting `styleguide/` is deferred until post-migration verification confirms no live dependency.

## Docs Impact

> Loaded `docs/ai/guide.md` and `docs/ai/assistant-context-index.md` during planning.

### Docs checked during planning

| Doc | Relevant finding |
| --- | --- |
| `docs/style/conventions.md` | Still cites `styleguide/*.md` as source-of-truth inputs |
| `docs/operations/docs-maintenance.md` | Style ownership map still references `styleguide/` |
| `docs/ai/assistant-context-index.md` | Must continue to route style-related retrieval to canonical docs paths |
| `docs/ai/guide.md` | Must stay aligned with style-doc retrieval paths |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md`.
- [x] Assessed sufficiency — docs were **insufficient** for complete migration mapping.
  - Missing or ambiguous docs: explicit one-to-one coverage mapping from each `styleguide/*.md` section to domain-doc sections.
  - Fallback code scan used: scanned repository references to `styleguide/` to identify impacted docs.
- [x] Post-task docs update required: Yes — captured in Docs to update below.

### Docs to create

| File | Reason |
| --- | --- |
| `docs/style/marketing-style.md` _(optional)_ | If marketing style content is too large for `docs/style/conventions.md` and needs dedicated domain segmentation |

### Docs to update

| File | What changes |
| --- | --- |
| `docs/style/conventions.md` | Replace legacy source pointers with canonical docs-domain references; merge content from styleguide files |
| `docs/operations/docs-maintenance.md` | Replace style ownership source paths from `styleguide/` to `docs/style/` + runtime files |
| `docs/ai/assistant-context-index.md` | Ensure style retrieval entries point only to current docs-domain files |
| `docs/ai/guide.md` | Align task routing instructions with post-migration style doc locations |
| `docs/adr/0001-docs-architecture-mvp.md` _(optional note)_ | Add note that styleguide migration is complete if ADR status tracking needs a factual update |

### Docs to delete or archive

| File | Reason |
| --- | --- |
| `styleguide/app.md` | Superseded by docs-domain style guidance |
| `styleguide/shared.md` | Superseded by docs-domain style guidance |
| `styleguide/marketing.md` | Superseded by docs-domain style guidance |

## Context Map

### Files to modify first

| File | Purpose | Why it matters |
| --- | --- | --- |
| `docs/style/conventions.md` | Canonical style destination | Primary migration target before removal |
| `docs/operations/docs-maintenance.md` | Ownership/source map | Prevents stale maintenance instructions |
| `docs/ai/assistant-context-index.md` | Retrieval index | Keeps AI routing stable after migration |

### Dependencies / related patterns

| File | Relationship |
| --- | --- |
| `docs/ai/guide.md` | Retrieval routing policy for assistants |
| `src/components/ui/` | Ongoing implementation source for style conventions |
| `src/config/marketing-theme.ts` | Marketing style token source |

## Progress Dashboard

- [ ] Phase 1 — Inventory and section mapping
- [ ] Phase 2 — Migrate styleguide content into docs-domain files
- [ ] Phase 3 — Update references and retrieval/index routes
- [ ] Phase 4 — Remove `styleguide/` folder
- [ ] Phase 5 — Docs Sync
- [ ] Phase 6 — AI-ready docs reflection and next-plan handoff
- [ ] Phase 7 — Rollout Eval & Health Score

## Phases

### Phase 1: Inventory and section mapping

**Progress**: `[ ]`

**Layer**: planning/documentation mapping

**Goal**: Build exact mapping from each `styleguide/` section to target docs-domain location before any deletion.

**Files**:

- `styleguide/app.md` — read/map — capture section ownership
- `styleguide/shared.md` — read/map — capture section ownership
- `styleguide/marketing.md` — read/map — capture section ownership
- `docs/style/conventions.md` — update — add missing mapped sections

**Verification gate**:

- Every section in each styleguide file has a target destination path.
- No section is marked "drop" without explicit rationale.

### Phase 2: Migrate styleguide content into docs-domain files

**Progress**: `[ ]`

**Layer**: `docs/style/` domain content

**Goal**: Move all active guidance into canonical docs-domain files and remove duplicate language.

**Files**:

- `docs/style/conventions.md` — modify — absorb remaining guidance
- `docs/style/*.md` _(if needed)_ — create/modify — split out large specialized style subdomains

**Verification gate**:

- All migrated guidance is present under `docs/`.
- No conflicting directives across touched style docs.

### Phase 3: Update references and retrieval/index routes

**Progress**: `[ ]`

**Layer**: docs index/routing and maintenance metadata

**Goal**: Ensure all live canonical references point to docs-domain files only.

**Files**:

- `docs/operations/docs-maintenance.md` — modify — remove `styleguide/` references
- `docs/ai/assistant-context-index.md` — modify — ensure canonical style entry points
- `docs/ai/guide.md` — modify — keep routing guidance aligned

**Verification gate**:

- `rg -n "Source of truth.*styleguide\/|styleguide\/.*[Ss]ource of truth" docs/` (or `grep -rEn "Source of truth.*styleguide/|styleguide/.*[Ss]ource of truth" docs/`) returns no matches.
- Updated docs include valid `## Related Docs` links.

### Phase 4: Remove `styleguide/` folder

**Progress**: `[ ]`

**Layer**: docs cleanup/archive

**Goal**: Remove legacy styleguide files after migration and routing verification.

**Files**:

- `styleguide/app.md` — delete — superseded
- `styleguide/shared.md` — delete — superseded
- `styleguide/marketing.md` — delete — superseded
- `styleguide/` — remove empty directory

**Verification gate**:

- No active canonical doc depends on styleguide files.
- `rg -n "styleguide/" docs/` (recursive by default; or `grep -rn "styleguide/" docs/`) returns only historical/non-canonical mentions after folder removal (for example archived ADR/kanban references).

### Phase 5: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all docs listed in Docs Impact are updated/deleted consistently.

**Verification gate**:

- All docs in "Docs to update" are completed with current `Last reviewed:` date.
- All docs in "Docs to delete" are removed or clearly archived.
- `rg -n "TODO|FIXME|TBD" docs/` shows no unresolved placeholders across `docs/` in scope of this rollout.
- Docs-first retrieval checklist remains complete and accurate.

### Phase 6: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Record what worked, what was risky, and what follow-up improvements are required.

**Verification gate**:

- Reflection captures at least one confirmed improvement.
- Any unresolved question includes decision owner or revisit criteria.
- Reflection converts feedback into explicit follow-up actions for the next rollout cycle.
- Current rollout has a handoff note to follow-up plan if needed.

### Phase 7: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: rollout quality/evaluation layer

**Goal**: Record a 0-100 health score after Phase 5 and 6 complete.

**Scoring rubric**:

| Dimension | Max Points | How scored |
| --- | --- | --- |
| Docs-first adherence | 40 | Checklist complete with explicit sufficiency verdict and fallback rationale |
| Docs health | 40 | All docs sync gates pass (create/update/delete/link/index checks) |
| Reflection quality | 20 | Reflection includes confirmed improvements and decision path for open questions |
| **Total** | **100** | Suggested pass threshold: `>= 70` |

**Verification gate**:

- Score table is populated with evidence for all dimensions.
- Final score and archive readiness are recorded in a session note.

## Dependency Graph

```text
styleguide inventory
  ↓
docs/style migration
  ↓
docs index/routing updates
  ↓
styleguide deletion
  ↓
docs sync + reflection + eval
```

## Success Criteria

- All active style guidance is centralized under `docs/` domain files.
- `styleguide/` directory is removed with no active dependency.
- AI retrieval/index/maintenance docs are aligned to the post-migration structure.

## Rollback Plan

1. Restore deleted `styleguide/*.md` files from previous commit if migration quality gate fails.
2. Revert docs-domain updates that introduced conflicting or incomplete guidance.
3. Re-run docs link and retrieval checks before reattempting removal.

## Spec-First Validation Review (Current Session)

### Self-reflection on this styleguide-migration planning process

#### What worked well

- Docs-first retrieval was followed before proposing implementation steps, keeping the rollout aligned with repository guidance.
- The plan enforces dependency-safe sequencing (inventory → migration → routing updates → deletion), which reduces accidental breakage.
- Verification gates were made command-oriented, improving reproducibility during execution.

#### What was weak or incomplete

- Spec coverage is still not fully explicit at section granularity (styleguide section → destination heading mapping table is not yet embedded).
- Historical-reference handling is underspecified; archived mentions are allowed but not yet governed by a concise acceptance rule.
- Reflection and evaluation are currently concentrated at the end of the rollout; there is limited mid-phase learning capture before Phase 6.

### Feedback suggestions to improve spec-first development

1. Add a mandatory section-mapping table in Phase 1 (`styleguide source section`, `target docs section`, `migration status`) to prevent silent omissions.
2. Add a single acceptance rule for historical references: allow only archival/ADR context, never canonical guidance, with a verification command in Phase 4.
3. Add a mid-rollout checkpoint note after Phase 2 to capture spec gaps early instead of waiting until Phase 6.
4. Add an explicit owner field for each follow-up action generated during reflection to improve accountability.
5. Add a lightweight "spec drift check" in Phase 3 to ensure docs updates did not diverge from the original phase goals.

### Plan adjustments from this reflection

- Phase 1 should produce a section-level migration matrix as a required artifact.
- Phase 3 should include a spec-drift check against Phase 1 mapping output.
- Phase 6 should require converting reflection findings into assigned follow-up actions.

### Session Note — 2026-05-28 07:28 UTC

- Completed: spec-first validation review and self-reflection update for rollout plan
- Verified by: doc review against `docs/ai/guide.md`, `docs/ai/assistant-context-index.md`, and this rollout's phase gates
- Next: execute Phase 1 with section-level migration matrix
- Blockers: none

## Open Questions

1. Should marketing style guidance remain in `docs/style/conventions.md` or be split into a dedicated doc?
2. Should historical references to `styleguide/` in archived kanban docs be left unchanged or normalized with a migration note?

## Recommendation

Execute in strict order: inventory mapping → migrate content → update retrieval/index references → remove `styleguide/` only after verification gates pass. This minimizes risk of link breakage and prevents canonical guidance gaps during the transition.
