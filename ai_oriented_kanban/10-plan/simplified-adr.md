# Rollout: Simplify ADR System — Month-Grouped, Date-Keyed, AI-Copilot-Friendly ADR Log

## Summary

The current ADR system stores one decision per file (`docs/adr/0001-docs-architecture-mvp.md`) with sequential numbering (`ADR-XXXX`). This scales poorly: file sprawl, renumbering conflicts on branches, no quick-scan surface, and a template too thin to enforce structure. AI copilot tools cannot reliably enumerate decisions or parse their metadata.

This rollout replaces the per-decision files with **month-grouped log files** named `docs/adr/YYYY-MM.md` (e.g. `2026-08.md`). Each decision becomes a **date-keyed entry** `## YYYY-MM-DD: <Short title>` inside its month's file, with a fixed, machine-parseable metadata block (enumerated `Status`, `Owner`, `Type`, `Supersedes`) and an `## Index` table at the top of every month file for instant scanning. The `_template.md` is rewritten as a single **record template** that AI copilot tools can load once and apply forever.

The same rollout wires this into the delivery process: `ai_oriented_kanban/templates/rollout-plan-template.md` gains (a) a mandatory **ADR Conflict Check** gate at plan-creation time — planned tasks/implementations must not run against existing ADRs unless the conflict is explicitly addressed in the plan, with AI surfacing unresolved conflicts as **Open Questions** for user confirmation — and (b) a mandatory sub-subphase in closing **Phase N+1 (Docs Sync)** that records any significant ADRs made during a rollout into `docs/adr/YYYY-MM.md`, so decisions never die in chat history or PR threads again.

## Current Evaluation

### What already exists

- `docs/adr/_template.md` (512 B) — minimal template: `# ADR-XXXX: <Short title>`, `Status`/`Date`/`Owner` blockquote, `Context` / `Decision` / `Consequences` / `Related Docs`.
- `docs/adr/0001-docs-architecture-mvp.md` — the only legacy ADR (dated 2026-05-24, Status Accepted).
- Two in-repo references to the legacy file:
  - `docs/README.md:35` — `docs/adr/` row links to `0001-docs-architecture-mvp.md`
  - `docs/ai/assistant-context-index.md:40` — "Why this docs structure was adopted" row links to `0001-docs-architecture-mvp.md`
- `ai_oriented_kanban/templates/rollout-plan-template.md` — closing phases N+1 (Docs Sync) currently has no ADR-recording step.
- `docs/ai/guide.md` — does **not** reference ADR file naming; no change required.

### What is not centralized / stable / complete yet

#### 1. One-file-per-decision ADR does not scale

- Every decision = a new numbered file → file sprawl and branch-merge conflicts on the next number.
- No index or overview surface; an AI must glob the whole folder to discover decisions.
- Representative files: `docs/adr/0001-docs-architecture-mvp.md`, `docs/adr/_template.md`

#### 2. Template is not AI-copilot friendly

- Metadata lives in a blockquote with no fixed keys an AI can parse reliably.
- No enumerated values (any string can be a "Status"), no `Supersedes` field, no deterministic heading anchors.
- No instructions telling an AI agent how to add/update entries, so each AI writes it differently.

#### 3. No process hook records decisions made during rollouts

- The kanban rollout-plan-template closing phases handle docs sync but never say "record significant ADRs".
- Architectural decisions made during implementation end up only in PR threads or the reflection notes — invisible to future agents.
- No planning-time ADR conflict check exists either: a plan can unknowingly propose work that contradicts an accepted ADR, with nothing forcing the AI to flag it or confirm with the user.

### Risks in the current state

- [ ] ADR history becomes sparse because recording a decision requires creating a new numbered file (friction).
- [ ] Two agents on two branches both pick "ADR-0002" → merge conflict and identity confusion.
- [ ] AI copilot tools cannot enumerate decisions or parse status → wrong decisions get re-made.

## Scope

- Estimated files to create: 3 (`docs/adr/README.md`, `docs/adr/2026-05.md`, `docs/adr/2026-08.md`)
- Estimated files to modify: 4 (`docs/adr/_template.md`, `docs/README.md`, `docs/ai/assistant-context-index.md`, `ai_oriented_kanban/templates/rollout-plan-template.md`)
- Estimated files to delete: 1 (`docs/adr/0001-docs-architecture-mvp.md`)
- Risk level: **Low** (docs-only; two link references; content is preserved in git history)

### In scope

- New naming/grouping convention: `docs/adr/YYYY-MM.md`, entries keyed `## YYYY-MM-DD: <title>`.
- Rewrite `docs/adr/_template.md` as the single record template (AI-copilot instructions included).
- New `docs/adr/README.md` documenting the convention and the AI-copilot contract.
- Migrate `ADR-0001` into `docs/adr/2026-05.md`; delete the legacy file; update its 2 references.
- Create `docs/adr/2026-08.md` and record this rollout's own decision in it (dogfooding).
- Add an ADR-recording sub-subphase to closing Phase N+1 in the rollout-plan-template (+ fix N+2/N+3 sub-subphase numbering).
- Add a mandatory ADR Conflict Check gate + open-question generation rule to the rollout-plan-template (applies to every future rollout plan at creation time).

### Out of scope

- Migrating ADRs from other repos (`certifai-api` etc.) — cross-repo sync is a separate initiative.
- Building an ADR linter/CI check (noted in Open Questions as future work).
- Changing how decisions are made (approval workflow stays with the team).
- Editing historical decision content — only its format/location changes.

## Minimum Viable Hotfix

- **Phase 1 + Phase 3 combined**: rewrite `_template.md`, add `docs/adr/README.md`, and update the 2 link references so the new convention is live and nothing points at the deleted file. This is docs-only, zero runtime risk, and immediately stops new numbered files from being created. Phase 2 (migration + new month file) can follow in a separate commit.

## Docs Impact

### Docs checked during planning

| Doc                                                     | Relevant finding                                                                                           |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `docs/adr/_template.md`                                 | Current thin template; `ADR-XXXX` numbering drives per-file sprawl                                         |
| `docs/adr/0001-docs-architecture-mvp.md`                | Sole legacy ADR, dated 2026-05-24, content to migrate verbatim                                             |
| `docs/README.md`                                        | `docs/adr/` row at line 35 links to `0001-docs-architecture-mvp.md` — must be repointed                    |
| `docs/ai/assistant-context-index.md`                    | Row at line 40 links to `0001-docs-architecture-mvp.md` — must be repointed to `2026-05.md` / `2026-08.md` |
| `docs/ai/guide.md`                                      | No ADR naming rules; no change required                                                                    |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Closing Phase N+1 has no ADR-recording step; N+2/N+3 sub-subphase numbering is inconsistent                |
| `ai_oriented_kanban/10-plan/README.md`                  | Mandates rollout-plan-template as the starting point                                                       |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from [`docs/ai/guide.md`](../../docs/ai/guide.md).
- [x] Declared initial `Docs Needed` list before implementation planning.
- [x] Assessed sufficiency — docs were **sufficient** for this planning task.
  - If insufficient: docs that were missing, ambiguous, or outdated: n/a
  - If insufficient: fallback code scan was used for this specific decision: n/a
  - If insufficient: docs were updated in this rollout or explicitly blocked with owner + due date: n/a
- [x] For each major decision, recorded a `Planning Decision Evidence Log` row (below).
- [x] Post-task docs update required: `[x] Yes` — captured in Docs to create/update/delete below.

### Docs Needed (planning + implementation)

| Doc                                                     | Why needed                                           |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `docs/adr/_template.md`                                 | Current template to replace                          |
| `docs/adr/0001-docs-architecture-mvp.md`                | Content source for migration into `2026-05.md`       |
| `docs/README.md`                                        | Link row to repoint                                  |
| `docs/ai/assistant-context-index.md`                    | Link row to repoint; must stay the single entrypoint |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Process contract to extend with ADR recording step   |

### Planning Decision Evidence Log

| Decision                                                                  | Docs cited                                                                                        | Sufficiency verdict | Fallback code scan used? | Doc update action                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------- | ------------------------ | ----------------------------------------------------------------- |
| Month-grouped `YYYY-MM.md` files instead of per-decision files            | `docs/adr/_template.md`, `docs/README.md`                                                         | Sufficient          | No                       | `docs/adr/README.md` (new), `_template.md` (rewrite)              |
| Entries keyed `## YYYY-MM-DD:` with fixed metadata bullet fields          | `docs/adr/_template.md`                                                                           | Sufficient          | No                       | `_template.md` record skeleton                                    |
| Bullet-list metadata over YAML frontmatter (multiple blocks/file invalid) | `docs/adr/_template.md`                                                                           | Sufficient          | No                       | `docs/adr/README.md` AI-copilot contract                          |
| Migrate ADR-0001 into `2026-05.md` and delete legacy file                 | `docs/README.md`, `docs/ai/assistant-context-index.md`                                            | Sufficient          | No                       | `docs/README.md`, `assistant-context-index.md` (repoint)          |
| Record significant ADRs in closing Phase N+1 of rollout template          | `ai_oriented_kanban/templates/rollout-plan-template.md`                                           | Sufficient          | No                       | Template N+1 sub-subphase + gate                                  |
| Fix N+2/N+3 sub-subphase numbering in template                            | `ai_oriented_kanban/templates/rollout-plan-template.md`                                           | Sufficient          | No                       | Template numbering correction                                     |
| ADR Conflict Check gate + open-question rule in template                  | `ai_oriented_kanban/templates/rollout-plan-template.md`, `docs/adr/0001-docs-architecture-mvp.md` | Sufficient          | No                       | Template `### ADR Conflict Check` gate + `## Open Questions` rule |

### ADR Conflict Check _(dogfooding — this plan checks itself against existing ADRs)_

> **Mandatory gate**: planned actions must not contradict accepted ADRs unless explicitly addressed.

| ADR entry (`YYYY-MM-DD: title`)                               | Planned action that touches it                                                                                                    | Conflict?                                                                                         | Explicitly addressed in plan?                                                                                                | Open question raised? |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `2026-05-24: AI-Ready Documentation MVP Structure` (ADR-0001) | Reorganize `docs/adr/` from numbered files to month logs; migrate ADR-0001 into `2026-05.md`; delete legacy file; repoint 2 links | Partial — keeps the adr section, `_template.md`, and index contract; changes internal file scheme | Yes — Phase 2.1 migration entry notes format-only change; superseding dated entry scheduled in `docs/adr/2026-08.md` (N+1.6) | Yes — Open Question 5 |

No other ADRs exist at planning time; `2026-05-24` (ADR-0001) is the only accepted decision checked.

### Docs to create

| File                  | Reason                                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| `docs/adr/README.md`  | Convention rules (naming, entry keying, index upkeep) + AI-copilot contract      |
| `docs/adr/2026-05.md` | Migrated `ADR-0001` entry dated `2026-05-24`                                     |
| `docs/adr/2026-08.md` | Current-month log, first entry = this rollout's ADR format decision (2026-08-26) |

### Docs to update

| File                                                    | What changes                                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `docs/adr/_template.md`                                 | Rewrite: from `ADR-XXXX` file template to date-keyed record template + AI instructions                                          |
| `docs/README.md`                                        | Repoint `docs/adr/` row link from `0001-...md` to `README.md` / `2026-08.md`                                                    |
| `docs/ai/assistant-context-index.md`                    | Repoint ADR row; add a "where to record new decisions" row if helpful                                                           |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Add N+1 ADR-recording sub-subphase + verification gate; add ADR Conflict Check gate + open-question rule; fix N+2/N+3 numbering |

### Docs to delete or archive

| File                                     | Reason                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `docs/adr/0001-docs-architecture-mvp.md` | Superseded by dated entry in `docs/adr/2026-05.md`; content preserved in git history |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.
      _(Check this box only if all three conditions above are true.)_ — **not applicable: this rollout is a docs-pattern change by definition.**

## Context Map

### Files to modify first

| File                       | Purpose                  | Why it matters                                   |
| -------------------------- | ------------------------ | ------------------------------------------------ |
| `docs/adr/_template.md`    | Record template rewrite  | Defines the format every future entry follows    |
| `docs/adr/README.md` (new) | Convention + AI contract | Single source of truth for the new naming scheme |

### Likely files to create

| File                  | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `docs/adr/README.md`  | Convention rules and AI-copilot contract                 |
| `docs/adr/2026-05.md` | Month log with migrated `ADR-0001` entry                 |
| `docs/adr/2026-08.md` | Month log with this rollout's own ADR entry (dogfooding) |

### Dependencies / related patterns

| File                                                    | Relationship                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| `docs/README.md`                                        | `docs/adr/` row must keep a valid link after deletion         |
| `docs/ai/assistant-context-index.md`                    | ADR entry must stay discoverable from the single entrypoint   |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Closing phases must record significant ADRs into the new logs |
| `docs/ai/guide.md`                                      | No change; verified it does not reference ADR naming          |

### Risks

- [ ] Two links must be updated atomically with the legacy file deletion — do them in one commit.
- [ ] External bookmarks to `0001-docs-architecture-mvp.md` break (mitigation: content survives in `2026-05.md`; repo is the canonical copy).

## Recommended Architecture

### Principle 1: Month-grouped log files

One file per calendar month: `docs/adr/YYYY-MM.md` (`2026-08.md`). New decision in a month → append an entry to that month's file (create the file if it is a new month). Month boundaries give bounded file size, lexical ordering, and a natural history timeline.

### Principle 2: Date-keyed entries

Every decision is a heading `## YYYY-MM-DD: <Short title>` (zero-padded, lexical-sortable). GitHub auto-generates a stable anchor (`#2026-08-26-...`) so any entry can be linked from `Related Docs`, PRs, or the index. Multiple decisions on the same date are allowed — keep titles distinct.

### Principle 3: AI-copilot-friendly structure

- **`## Index` table at the top of every month file** — `| Date | Title | Status |` — one row per entry, so an agent can scan a month in seconds without opening entries.
- **Fixed metadata block** directly under each heading, as a bullet list of enumerated keys (not YAML frontmatter — multiple frontmatter blocks per file are invalid, and `grep` of headings would break):
  - `Status`: `Proposed | Accepted | Deprecated | Superseded`
  - `Owner`: free-form (default `engineering`)
  - `Type`: `Architecture | API | Process | Tooling | Docs | Security`
  - `Supersedes`: link to the prior entry when replacing one
  - `Deciders`: optional; human sign-off names when required
- **Fixed section order**: `Context` → `Decision` → `Consequences` → `Related Docs` (parsers can rely on heading sequence).
- **Enumerated status machine-checkable**: deprecated entries must carry `Supersedes` → a lint rule becomes possible later.
- **In-file instructions**: `_template.md` ends with an "AI copilot instructions" block and `docs/adr/README.md` states the append workflow, so an agent can load the rule file once and apply it consistently.

### Principle 4: One record template, one convention doc

`docs/adr/_template.md` is the **record skeleton** (what one entry looks like). `docs/adr/README.md` is the **convention doc** (when/how to add, index upkeep, AI contract). Neither grows with history; history lives in the month files.

## Target ADR Format (concrete)

### Monthly log file — `docs/adr/2026-08.md`

```markdown
# ADR Log — 2026-08

> **Status**: Active log
> **Owner**: engineering
> **Last reviewed**: 2026-08-26

## Index

| Date       | Title                   | Status   |
| ---------- | ----------------------- | -------- |
| 2026-08-26 | Simplify ADR log format | Accepted |

## 2026-08-26: Simplify ADR log format

- **Status**: Accepted
- **Owner**: engineering
- **Type**: Docs
- **Supersedes**: none (replaces ADR-0001 format only, not its content)

### Context

...

### Decision

...

### Consequences

- ✅ ...
- ⚠️ ...
- ❌ ...

### Related Docs

- [...](...)
```

### Record template — `docs/adr/_template.md` (rewritten)

Same entry skeleton as above with `YYYY-MM-DD` / `<Short title>` placeholders, the enumerated values listed inline, plus a trailing "AI copilot instructions" block covering: append-only policy (never rewrite history — add a new dated entry and mark the old one `Superseded`), index-table upkeep, and heading-anchor conventions.

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless the user explicitly asks for a looser plan.**

This rollout is entirely documentation-layer. Within it, the dependency chain is: convention docs (`_template.md`, `README.md`) → migration artifacts (`2026-05.md`, `2026-08.md`) → cross-references (`docs/README.md`, index) → process template. A phase never touches a file that an earlier phase's verification still relies on.

## Phase Sequencing Rule

> **Default sequencing: root-cause fix → data recovery/backfill → contract hardening → UX/message polish → tests.**

Root cause first: define the convention (Phase 1) before migrating data (Phase 2) and repointing references (Phase 3); the process hook (Phase 4) comes last so it can reference the final convention.

## Commit Slicing Rule

> **A phase may be split into sub-subphases when the file count, review surface, or QA burden is too large for one safe commit.**

Phase 2 is the largest — it is split into 2.1 (migrate to `2026-05.md`) and 2.2 (create `2026-08.md` with the dogfood entry) so each commit is independently reviewable. Phases 1/3/4 are single commits.

## Progress Dashboard

- [ ] Phase 1 — Author ADR convention + record template
- [ ] Phase 2 — Migrate legacy ADR into monthly logs
- [ ] Phase 3 — Update cross-references
- [x] Phase 4 — Update kanban rollout-plan-template _(applied during planning)_
- [ ] Phase N — User-journey sync _(skipped: no user-facing change)_
- [ ] Phase N+1 — Docs Sync
- [ ] Phase N+2 — AI-ready docs reflection and next-plan handoff
- [ ] Phase N+3 — Docs-only Simulation Drill
- [ ] Phase N+4 — Rollout Eval & Health Score

## Phases

### Phase 1: Author ADR convention + record template

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Establish the new convention so no new numbered ADR files are created after this phase.

**Files**:

- `docs/adr/_template.md` — modify — rewrite as date-keyed record template (skeleton + AI copilot instructions)
- `docs/adr/README.md` — create — naming/grouping rules, append workflow, AI-copilot contract

**Verification gate** (must pass before Phase 2 starts):

- `grep -n "YYYY-MM-DD" docs/adr/_template.md` returns the heading pattern and date placeholder.
- `_template.md` contains the enumerated key list (`Status`, `Owner`, `Type`, `Supersedes`) and the `Context`/`Decision`/`Consequences`/`Related Docs` section order.
- `docs/adr/README.md` exists with `## Index` upkeep rule and append-only policy.
- `grep -rn "ADR-XXXX" docs/` returns **no** matches outside the rewritten template's historical note.

**Sub-subphase checklist**:

- [ ] **1.1 — Rewrite `_template.md`**: replace the `ADR-XXXX` file template with the date-keyed record skeleton and append the AI copilot instructions block.
  - **Independent verification**: template renders as a single entry skeleton; placeholders are `YYYY-MM-DD` and `<Short title>`; no `ADR-XXXX` file-level numbering remains.
- [ ] **1.2 — Author `docs/adr/README.md`**: document the month-file naming, entry keying, index upkeep, and append-only policy; state the AI-copilot contract (greppable headings, enumerated status, never rewrite history).
  - **Independent verification**: README covers naming, entry format, index rule, and append-only rule; links to `_template.md`.

---

### Phase 2: Migrate legacy ADR into monthly logs

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Move `ADR-0001` content into the new scheme and open the current month's log — including this rollout's own decision (dogfooding).

**Files**:

- `docs/adr/2026-05.md` — create — migrated `ADR-0001` entry dated `2026-05-24`
- `docs/adr/2026-08.md` — create — `## 2026-08-26: Simplify ADR log format` entry + Index
- `docs/adr/0001-docs-architecture-mvp.md` — delete — superseded by `2026-05.md` entry

**Verification gate**:

- `grep -n "## 2026-05-24:" docs/adr/2026-05.md` returns the migrated entry; its content matches the original `ADR-0001` (Context/Decision/Consequences/Related Docs).
- `docs/adr/2026-08.md` exists with an `## Index` table listing exactly its entries.
- `git status` shows the legacy file as deleted and nothing else unexpected.

**Sub-subphase checklist**:

- [ ] **2.1 — Migrate ADR-0001**: create `docs/adr/2026-05.md` with `## 2026-05-24: AI-Ready Documentation MVP Structure` (Status Accepted, Type Docs, note `Migrated from ADR-0001`), copying all original sections verbatim; then delete `docs/adr/0001-docs-architecture-mvp.md`.
  - **Independent verification**: content diff of the two versions shows only the metadata block + heading changes, no prose changes.
- [ ] **2.2 — Open current-month log**: create `docs/adr/2026-08.md` with an `## Index` and the entry `## 2026-08-26: Simplify ADR log format — month-grouped, date-keyed entries`, recording this rollout's own decision.
  - **Independent verification**: `grep -n "## 2026-08-26:" docs/adr/2026-08.md` returns the entry and the Index row matches.

---

### Phase 3: Update cross-references

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Repoint every reference to the deleted legacy file so the docs graph stays intact.

**Files**:

- `docs/README.md` — modify — repoint `docs/adr/` row link from `0001-docs-architecture-mvp.md` to `README.md` (or `2026-08.md`)
- `docs/ai/assistant-context-index.md` — modify — repoint ADR row to `docs/adr/2026-05.md` / `2026-08.md`; optionally add a "record a new decision" pointer to `docs/adr/README.md`

**Verification gate**:

- `grep -rn "0001-docs-architecture-mvp" --include="*.md" .` (excluding `node_modules`) returns **zero** matches.
- The repointed links resolve: both `docs/README.md` and `docs/ai/assistant-context-index.md` render valid relative links to existing files.
- `grep -n "adr" docs/ai/assistant-context-index.md` shows the ADR row pointing at a month log.

**Sub-subphase checklist**:

- [ ] **3.1 — Repoint `docs/README.md`**: update the `docs/adr/` row link and description to the month-log scheme.
  - **Independent verification**: row link resolves; no reference to the deleted file.
- [ ] **3.2 — Repoint `docs/ai/assistant-context-index.md`**: update the ADR row; keep the single-entrypoint contract intact.
  - **Independent verification**: Quick Reference table reflects the new ADR location; `grep` finds no legacy filename.

---

### Phase 4: Update kanban rollout-plan-template _(applied during planning)_

**Progress**: `[x]`

**Layer**: planning/documentation process layer

**Goal**: Make every future rollout (a) check its planned tasks/implementations against existing ADRs at plan-creation time — never executing against an accepted ADR unless the conflict is explicitly addressed, with AI raising **Open Questions** for unresolved conflicts — and (b) record its significant ADRs into `docs/adr/YYYY-MM.md` during the mandatory closing phases. The template changes were **applied as part of this planning task** (see the template diff): closing **Phase N+1 (Docs Sync)** now includes sub-subphase **N+1.6 — Record significant ADRs** (conditional: skipped with a note if no significant decisions were made); a mandatory **`### ADR Conflict Check`** gate (table + rules) plus the Open Questions AI-behavior rule and the no-execution-against-ADR constraint were added to the template; and the inconsistent sub-subphase numbering in Phases N+2 (labeled `N+1.x`) and N+3 (labeled `N+2.x`) was corrected to `N+2.x` / `N+3.x` in the same pass.

Remaining work for this phase: review the applied template changes against the verification gate below.

**Files**:

- `ai_oriented_kanban/templates/rollout-plan-template.md` — modify — add N+1.6 ADR-recording sub-subphase + gate + pre-condition; fix N+2/N+3 sub-subphase numbering

**Verification gate**:

- `grep -n "Record significant ADRs" ai_oriented_kanban/templates/rollout-plan-template.md` returns the sub-subphase (under Phase N+1) and its verification line.
- `grep -n "docs/adr/YYYY-MM.md" ai_oriented_kanban/templates/rollout-plan-template.md` returns at least one reference in the N+1 section.
- `grep -n "N+2\.[1-4] —" ai_oriented_kanban/templates/rollout-plan-template.md` and `grep -n "N+3\.[1-3] —" ...` confirm corrected numbering (no stray `N+1.x`/`N+2.x` labels inside Phases N+2/N+3).
- `grep -n "ADR Conflict Check" ai_oriented_kanban/templates/rollout-plan-template.md` returns the mandatory gate section (under Docs Impact).
- `grep -n "ADR-conflict open question" ai_oriented_kanban/templates/rollout-plan-template.md` returns the `## Open Questions` AI-behavior rule.

**Sub-subphase checklist**:

- [x] **4.1 — Add ADR-recording step to Phase N+1**: sub-subphase N+1.6 appends dated entries to `docs/adr/YYYY-MM.md` (creating the month file if missing) for every significant decision made during the rollout, following `docs/adr/_template.md`, and keeps the `## Index` table in sync; conditional wording allows a justified skip.
  - **Independent verification**: N+1.6 exists with conditional semantics and an independent verification line.
- [x] **4.2 — Fix N+2/N+3 sub-subphase numbering**: renumber Phase N+2 items to `N+2.1–N+2.4` and Phase N+3 items to `N+3.1–N+3.3`.
  - **Independent verification**: no heading inside Phase N+2/N+3 uses the wrong prefix.
- [x] **4.3 — Add ADR Conflict Check gate + open-question rule**: insert `### ADR Conflict Check` (mandatory gate: table + rules) into the template's Docs Impact section; extend the Docs-First Retrieval Checklist with the ADR review item; add the AI open-question rule to `## Open Questions`; add the no-execution-against-ADR line to `## Essential Implementation Details` and the style-goals bullet.
  - **Independent verification**: grep confirms the gate section, the checklist item, the Open Questions rule, the Essential Implementation Details bullet, and the style-goal bullet.

---

## Post-task phases

### Phase N: User-journey sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Pre-condition check**: docs-only rollout — no user-facing feature, route, or journey change.

- If confirmed, mark this phase `[!]` with note "skipped: no user-journey updates needed".

**Sub-subphase checklist**:

- [ ] **N.0 — Confirm skip**: verify the rollout shipped no user-facing behavior.
  - **Independent verification**: file set touched only `docs/` and `ai_oriented_kanban/templates/`.

---

### Phase N+1: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Land the new ADR convention as the repo's live state and record any significant decisions the rollout itself produced.

**Files** _(from Docs Impact section above)_:

- `docs/adr/README.md` — create — convention rules (done in Phase 1)
- `docs/adr/_template.md` — modify — record template (done in Phase 1)
- `docs/adr/2026-05.md` — create — migrated entry (done in Phase 2)
- `docs/adr/2026-08.md` — create — current-month log with dogfood entry (done in Phase 2)
- `docs/README.md` — modify — repointed ADR row (done in Phase 3)
- `docs/ai/assistant-context-index.md` — modify — repointed ADR row (done in Phase 3)
- `docs/adr/0001-docs-architecture-mvp.md` — delete — superseded (done in Phase 2)

**Verification gate**:

- Every file above exists / is updated with a fresh `Last reviewed:` date where applicable.
- `grep -r "0001-docs-architecture-mvp" docs/` returns no live links.
- `grep -r "TODO\|FIXME\|TBD" docs/adr/ | grep -v "_template"` returns no unresolved placeholders.
- `docs/ai/assistant-context-index.md` Quick Reference lists the ADR log at its new location.
- Each month file's `## Index` table matches its dated entries.
- All touched docs have a valid `## Related Docs` section with working relative links.

**Sub-subphase checklist**:

- [ ] **N+1.0 — Confirm docs-first retrieval checklist**: verify the checklist in `## Docs Impact` is completed.
  - **Independent verification**: checklist is not blank; post-task update field is marked Yes.
- [ ] **N+1.1 — Create new docs**: `docs/adr/README.md`, `docs/adr/2026-05.md`, `docs/adr/2026-08.md`.
  - **Independent verification**: all exist; `README.md` and month files have `Owner:` / `Last reviewed:` fields.
- [ ] **N+1.2 — Update existing docs**: `docs/adr/_template.md`, `docs/README.md`, `docs/ai/assistant-context-index.md`, `ai_oriented_kanban/templates/rollout-plan-template.md`.
  - **Independent verification**: `Last reviewed:` dates updated; no conflicting guidance with other docs.
- [ ] **N+1.3 — Delete stale doc**: `docs/adr/0001-docs-architecture-mvp.md`.
  - **Independent verification**: `grep -r "0001-docs-architecture-mvp" docs/` returns no live links.
- [ ] **N+1.4 — Update assistant-context-index.md**: ADR row repointed; entrypoint contract intact.
  - **Independent verification**: Quick Reference table reflects current ADR location.
- [ ] **N+1.5 — Verify docs link integrity**: spot-check every touched doc for valid relative links and `## Related Docs`.
  - **Independent verification**: no broken relative paths in `docs/README.md`, `assistant-context-index.md`, `docs/adr/*`.
- [ ] **N+1.6 — Record significant ADRs**: this rollout's own decision (`Simplify ADR log format`) is already recorded in `docs/adr/2026-08.md`; verify it follows `_template.md` and the Index matches.
  - **Independent verification**: `grep "## 2026-08-26:" docs/adr/2026-08.md` returns the entry; Index row present.

---

### Phase N+2: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture lessons from executing this rollout (e.g. friction in migrating legacy ADRs, whether the AI-copilot contract reads well to a fresh agent) and hand off any confirmed follow-up to a next rollout.

**Files**:

- `<next-rollout-path>.md` — create — phased plan for confirmed follow-ups (e.g. ADR linter/CI check, cross-repo ADR sync)
- `<current-rollout-path>.md` — modify — add a short handoff note linking to the next rollout

**Verification gate**:

- The next rollout file exists (or a clear "no follow-up" decision is recorded).
- Confirmed improvements are explicitly listed in the next rollout scope.
- Unresolved questions (see Open Questions) carry owners or decision criteria.

**Sub-subphase checklist**:

- [ ] **N+2.1 — Summarize confirmed improvements**: extract approved actions from reflection notes.
  - **Independent verification**: every approved action appears in next rollout plan scope.
- [ ] **N+2.2 — Convert unresolved questions to decisions**: add owner/criteria/timeline for each pending question.
  - **Independent verification**: no open question is left without a decision path.
- [ ] **N+2.3 — Author next rollout plan**: write a complete phased plan in the designated next-plan file.
  - **Independent verification**: next plan includes phases, verification gates, and rollback plan.
- [ ] **N+2.4 — Record handoff in current plan**: add session note linking to the next rollout path.
  - **Independent verification**: link/path is present and readable.

---

### Phase N+3: Docs-only Simulation Drill _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: validation/reproducibility layer

**Goal**: Prove a fresh AI agent can add a new ADR entry to `docs/adr/2026-08.md` using only `docs/adr/README.md` + `_template.md` — with no code scan fallback.

**Pre-condition check**: Phase N+1 doc updates are complete.

**Files**:

- `docs/operations/ai-retrieval-smoke-tests.md` — modify — add the drill prompt + pass criteria
- `docs/ai/project-simulation-readiness.md` — modify — capture run log, scorecard, verdict
- `<current-rollout-path>.md` — modify — record drill verdict

**Verification gate**:

- Drill output includes the Docs Needed list and the decision evidence log (as required by the smoke-test protocol).
- The fresh agent appended a correctly formatted entry (heading + metadata block + Index row) with **no** unjustified code scan.
- Any fallback scan (if any) has a same-rollout doc-update action.

**Sub-subphase checklist**:

- [ ] **N+3.1 — Define simulation scenario**: prompt a fresh agent to "record a new Accepted decision of type API in `docs/adr/`" with the entry skeleton as expected output.
  - **Independent verification**: scenario references `docs/adr/README.md` + `_template.md` and explicit pass/fail criteria.
- [ ] **N+3.2 — Execute and record drill run**: run the drill, store evidence.
  - **Independent verification**: run log contains docs-needed list, decision evidence, fallback rationale.
- [ ] **N+3.3 — Apply corrective doc updates**: fix any convention gaps the drill exposed.
  - **Independent verification**: insufficiency list is empty or each item has owner + due date.

---

### Phase N+4: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: rollout quality/evaluation layer

**Goal**: Produce the health score after Docs Sync, reflection, and simulation drill complete, then record the score with evidence in a session note.

**Pre-condition check**: Phases N–N+3 are `[x]` or have documented `[!]` justifications.

**Scoring rubric**:

| Dimension            | Max Points | How scored                                                                                 |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| Docs-first adherence | 40         | Docs-First Retrieval Checklist completed; sufficiency explicitly assessed                  |
| Docs health          | 40         | All Docs Sync gates passed (create/update/archive/link-index checks complete)              |
| Reflection quality   | 20         | Reflection records at least one confirmed improvement; open questions have owners/criteria |
| Simulation readiness | 20         | Drill evidence exists; no unjustified fallback code scan                                   |
| **Total**            | **120**    | Suggested pass threshold: `>= 85`                                                          |

**Sub-subphase checklist**:

- [ ] **N+4.1 — Evaluate docs-first adherence**: review checklist completion and sufficiency verdict.
  - **Independent verification**: checklist complete; sufficiency explicitly marked.
- [ ] **N+4.2 — Evaluate docs health**: review Docs Sync gate results.
  - **Independent verification**: every docs gate is pass, justified block, or justified skip.
- [ ] **N+4.3 — Evaluate reflection + simulation quality**: review handoff outputs and drill evidence.
  - **Independent verification**: confirmed improvement exists; drill evidence stored.
- [ ] **N+4.4 — Record final score session note**: write session note with score breakdown and archive decision (`>= 85` pass / `< 85` hold).
  - **Independent verification**: session note includes total score and archive gate decision.

---

## Dependency Graph

```text
docs/adr/_template.md + docs/adr/README.md     (Phase 1 — convention)
  ↓
docs/adr/2026-05.md + docs/adr/2026-08.md      (Phase 2 — migration + dogfood entry)
  ↓
docs/README.md + docs/ai/assistant-context-index.md   (Phase 3 — references)
  ↓
ai_oriented_kanban/templates/rollout-plan-template.md (Phase 4 — process hook, applied)
```

Each arrow means "depends on". No phase modifies a file that a lower layer already relies on for its verification.

## Suggested Implementation Order

1. Phase 1.1 → 1.2 (convention first — no new numbered files after this)
2. Phase 2.1 → 2.2 (migrate, then open current month)
3. Phase 3.1 → 3.2 (repoint links in the same commit as the deletion, per risk mitigation)
4. Phase 4 review gate (change already applied — verify it)
5. Post-task phases N → N+4 in order

If a gap is found during a downstream phase, add an isolated earlier-layer fix instead of patching the gap inline.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and the active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after its independent verification passes.
3. Add a short session note with timestamp, last completed step, next step, and blockers.
4. If blocked, mark item `[!]` and record the unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>
```

### Session Note — 2026-08-26 21:35 local

- Completed: planning task — authored this rollout plan; applied Phase 4 (template update) with the N+1 ADR-recording step and N+2/N+3 numbering fix.
- Verified by: grep over `docs/` for `0001-docs-architecture-mvp` (2 references confirmed) and template section review.
- Next: user approval of this plan, then Phase 1.
- Blockers: none.

### Session Note — 2026-08-26 21:48 local

- Completed: extended Phase 4 — applied template changes for the ADR Conflict Check gate (planning-time rule: planned tasks must not run against existing ADRs unless explicitly addressed; AI surfaces unresolved conflicts as Open Questions), plus matching plan updates including this plan's own conflict check (ADR-0001, verdict: format-only) and Open Question 5.
- Verified by: grep for `ADR Conflict Check` / open-question rule in template; plan sections updated in place.
- Next: user approval (incl. Open Question 5), then Phase 1.
- Blockers: none.

## Essential Implementation Details

- **Date format**: strictly `YYYY-MM-DD` zero-padded (lexical order = chronological order).
- **Append-only**: never rewrite a past entry's decision — add a new dated entry and mark the old one `Superseded`.
- **Index upkeep**: `## Index` in each month file is part of the format contract, not decoration.
- **No YAML frontmatter inside month files**: multiple blocks per file are invalid; the bullet metadata block is the chosen parseable form.
- **Same-day decisions**: distinct titles are the disambiguator — no `-2` suffix scheme needed.
- **Link integrity**: deletion of `0001-*.md` and repointing must land in one commit.
- **ADR conflict check (planning-time)**: before executing any phase, verify planned actions against `docs/adr/YYYY-MM.md`; never execute against an accepted ADR unless the plan explicitly addresses it and the open question is confirmed.

## Success Criteria

- [ ] `docs/adr/` contains only `_template.md`, `README.md`, and `YYYY-MM.md` files; `0001-*.md` is gone.
- [ ] Every decision is a `## YYYY-MM-DD:` entry inside a month file, parseable via the fixed metadata keys.
- [ ] Every month file's `## Index` table matches its entries.
- [ ] `grep -rn "0001-docs-architecture-mvp" --include="*.md" docs/ ai_oriented_kanban/` returns no matches.
- [ ] `ai_oriented_kanban/templates/rollout-plan-template.md` Phase N+1 includes the ADR-recording sub-subphase; Docs Impact includes the mandatory ADR Conflict Check gate; `## Open Questions` carries the AI open-question rule; N+2/N+3 numbering is correct.
- [ ] Every future rollout plan (per the template) checks planned actions against existing ADRs and surfaces unresolved conflicts as open questions before execution.
- [ ] An AI copilot can locate any decision from `docs/README.md` or `assistant-context-index.md` in at most one hop.
- [ ] Docs-only Simulation Drill passes with no unjustified code-scan fallback.

## Rollback Plan

1. `git checkout -- docs/adr/_template.md docs/adr/0001-docs-architecture-mvp.md docs/README.md docs/ai/assistant-context-index.md` restores the legacy format and links.
2. Delete `docs/adr/README.md`, `docs/adr/2026-05.md`, `docs/adr/2026-08.md` — content remains recoverable from git history.
3. `git checkout -- ai_oriented_kanban/templates/rollout-plan-template.md` reverts the template change (or keep it — it is independent of the ADR file scheme).
4. Re-run the link-integrity grep to confirm no dangling references.

## Open Questions

> **AI behavior at plan-creation time**: per the new template rule, every ADR conflict that is not explicitly resolved in this plan MUST be confirmed with the user here before execution.

1. **Archive policy for old months** — keep all `YYYY-MM.md` files indefinitely (default; low volume) vs move >12-month-old files to an archive folder. Default chosen: keep in place.
2. **`Deciders` field** — required or optional? Default: optional; use when human sign-off is material to the decision.
3. **ADR linting** — should a future rollout add a CI check that month files' Index matches their entries and Status values are enumerated? (Handed to Phase N+2 as a candidate next-rollout item.)
4. **Cross-repo ADR sync** — `certifai-api` uses a separate ADR scheme; unify under the same month-log convention later? (Noted for a future initiative.)
5. **ADR-0001 conflict confirmation (dogfooding)** — this plan reorganizes `docs/adr/` (numbered files → month logs) while ADR-0001 ("AI-Ready Documentation MVP Structure") mandates twelve domain sections each with a `_template.md`. Verdict: **format-only change** — the adr section, `_template.md`, and index contract all survive; the migration entry (Phase 2.1) and a superseding dated entry in `docs/adr/2026-08.md` (N+1.6) document the deviation. **Confirm approval** before Phase 2 executes.

## Recommendation

Execute **Phase 1 → 2 → 3** as three small commits in that order (convention → migration → references), then run the Phase 4 review gate (already applied) and the closing phases N+1 → N+4. This order keeps every commit independently reviewable and revertible, and the docs graph intact at every step. The change is docs-only with two known link references — risk is Low, and the migration preserves all existing decision content verbatim.
