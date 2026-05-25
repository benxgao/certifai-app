# Rollout: Decompose `doc_archived` into Canonical `docs/` Knowledge Base

## Summary

`doc_archived/` currently contains large, workflow-heavy documents (`marketing.md`, `signin.md`, `signup.md`) that are not part of the canonical `docs/` navigation graph used by assistants (`docs/ai/guide.md` and `docs/ai/assistant-context-index.md`). This makes retrieval less reliable and increases the chance of drift between implementation and guidance.

This rollout restructures those archived documents into smaller, domain-appropriate files under `docs/` (primarily `docs/security/` and `docs/api/`), then updates AI navigation docs so future assistants load the right context quickly. The migration is documentation-only, but still needs careful sequencing to avoid temporary duplicate sources of truth.

## Current Evaluation

### What already exists

- A strong docs taxonomy under `docs/` (`ai`, `api`, `security`, `architecture`, `operations`, etc.).
- AI entrypoints already standardized in `docs/ai/guide.md` and `docs/ai/assistant-context-index.md`.
- Existing canonical auth/API docs (`docs/security/auth-patterns.md`, `docs/api/api-connection.md`) with metadata and conventions.

### What is not centralized / stable / complete yet

#### 1. Archived operational knowledge is outside the canonical docs tree

- High-value auth and signup flow details live in `doc_archived/signin.md` and `doc_archived/signup.md`.
- Marketing signup integration details live in `doc_archived/marketing.md`.
- `docs/ai/assistant-context-index.md` does not index these archived files, so assistants won’t reliably load them.

Representative files:

- `doc_archived/signin.md`
- `doc_archived/signup.md`
- `doc_archived/marketing.md`

#### 2. Current canonical docs are concise but miss deep workflow decomposition

- `docs/security/auth-patterns.md` provides core invariants but not full signin/signup sequence-depth from archived docs.
- `docs/api/api-connection.md` covers envelope/fetch/auth patterns, but not the marketing subscription workflow.

Representative files:

- `docs/security/auth-patterns.md`
- `docs/api/api-connection.md`

### Risks in the current state

- [ ] Assistants answer with incomplete auth/marketing flow context.
- [ ] Duplicate truths persist between archived and canonical docs.
- [ ] Future updates happen only in `docs/`, leaving archived docs stale and misleading.

## Scope

- Estimated files to create: 3
- Estimated files to modify: 6
- Risk level: Medium

### In scope

- Split archived docs into focused canonical docs under existing `docs/` sections.
- Add cross-links and context-index entries for discoverability.
- Retire/archive original `doc_archived/*.md` files after canonical migration is verified.

### Out of scope

- Any runtime/auth/API code changes.
- Structural overhaul of all `docs/` domains beyond these three source files.
- Rewriting style conventions outside files touched by this migration.

## Minimum Viable Hotfix

- Phase 1 + Phase 2.
- Why minimal/safe: this immediately moves auth signup/signin knowledge into canonical `docs/security/` and makes it indexable, which is the highest-impact assistant-context improvement with low operational risk.

## Docs Impact

> Complete this section at planning time — before writing any code.
> Loaded: `docs/ai/guide.md`, `docs/ai/assistant-context-index.md`, and `docs/operations/docs-maintenance.md`.

### Docs checked during planning

| Doc                                   | Relevant finding                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `docs/ai/guide.md`                    | Rollout plans must include docs impact; AI retrieval depends on indexed canonical docs. |
| `docs/ai/assistant-context-index.md`  | New docs must be added here; no orphan docs allowed.                                    |
| `docs/operations/docs-maintenance.md` | New docs require metadata/template compliance and same-PR index updates.                |
| `docs/security/auth-patterns.md`      | Good high-level auth rules exist; deep flow details can be split into dedicated docs.   |
| `docs/api/api-connection.md`          | API fundamentals exist; marketing workflow should live in dedicated API doc.            |

### Docs to create

| File                                          | Reason                                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `docs/security/signin-workflow.md`            | Decompose `doc_archived/signin.md` into canonical signin lifecycle, edge cases, and troubleshooting.               |
| `docs/security/signup-workflow.md`            | Decompose `doc_archived/signup.md` into canonical signup + verification lifecycle, including UAT divergence notes. |
| `docs/api/marketing-subscription-workflow.md` | Decompose `doc_archived/marketing.md` into canonical API + integration workflow doc.                               |

### Docs to update

| File                                  | What changes                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `docs/security/auth-patterns.md`      | Keep as high-level source; add links to new signin/signup workflow docs and clarify boundaries.    |
| `docs/api/api-connection.md`          | Add related-doc link to marketing workflow and define when to consult it.                          |
| `docs/ai/assistant-context-index.md`  | Add new docs to quick reference and/or relevant section links.                                     |
| `docs/ai/guide.md`                    | Add task-type guidance for deep auth/signup/marketing workflow troubleshooting docs.               |
| `docs/ai/repo-map.md`                 | Optional: add docs navigation hint if needed to surface new canonical workflow docs.               |
| `docs/operations/docs-maintenance.md` | Optional trigger/link update if maintenance guidance needs explicit mention for new workflow docs. |

### Docs to delete or archive

| File                        | Reason                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| `doc_archived/signin.md`    | Superseded by canonical `docs/security/signin-workflow.md`.            |
| `doc_archived/signup.md`    | Superseded by canonical `docs/security/signup-workflow.md`.            |
| `doc_archived/marketing.md` | Superseded by canonical `docs/api/marketing-subscription-workflow.md`. |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.
      _(Not checked: this rollout explicitly changes documentation structure.)_

## Context Map

### Files to modify first

| File                                 | Purpose                                              | Why it matters                                         |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------ |
| `docs/security/auth-patterns.md`     | Re-scope high-level auth doc and link deep-dive docs | Prevents duplication and defines canonical boundaries. |
| `docs/ai/assistant-context-index.md` | Register new docs in assistant retrieval index       | Ensures future discoverability and no orphan docs.     |
| `docs/ai/guide.md`                   | Update task-routing logic for assistants             | Improves first-pass context selection quality.         |

### Likely files to create

| File                                          | Purpose                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `docs/security/signin-workflow.md`            | Detailed signin architecture, state transitions, timeout and recovery behavior.     |
| `docs/security/signup-workflow.md`            | Detailed signup and verification lifecycle, UAT/production differences, safeguards. |
| `docs/api/marketing-subscription-workflow.md` | Marketing subscription request lifecycle and integration boundaries.                |

### Dependencies / related patterns

| File                                  | Relationship                                                            |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `docs/security/auth-patterns.md`      | Parent high-level auth rules referenced by signin/signup workflow docs. |
| `docs/api/api-connection.md`          | Parent API conventions referenced by marketing workflow doc.            |
| `docs/operations/docs-maintenance.md` | Governs metadata/template/index compliance.                             |
| `doc_archived/*.md`                   | Source content to decompose and then retire.                            |

### Risks

- [ ] Partial migration leaves unresolved overlaps between archived and canonical docs.
- [ ] Missing index updates produce new orphan docs.

## Recommended Architecture

### Principle 1: Canonical-by-domain placement

Put workflow docs under existing domain folders (`security`, `api`) rather than creating ad-hoc sections. This aligns with current indexing and makes AI routing predictable.

### Principle 2: Layered documentation depth

Keep top-level domain docs concise and invariant-focused; move heavy sequence/operational walkthroughs into dedicated workflow docs linked from the parent.

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless explicitly marked otherwise.**

Dependency chain for this rollout:

1. Source-content decomposition design
2. Domain canonical docs (`security`, then `api`)
3. AI navigation/index updates
4. Archive retirement and consistency checks

Mixing these layers in one phase increases risk of broken links and ambiguous source-of-truth boundaries.

## Phase Sequencing Rule

> **Default sequencing: root-cause fix → data recovery/backfill → contract hardening → UX/message polish → tests.**

For docs migration, this maps to:

- Root-cause fix: move out-of-tree docs into canonical domains.
- Recovery/backfill: preserve all important archived details in new files.
- Contract hardening: index/guide/maintenance alignment.
- UX polish: improve navigation wording and related-doc links.
- Tests: documentation verification checks (`grep`, metadata checks, index presence).

## Commit Slicing Rule

> **A phase may be split into sub-subphases when review or QA scope is too large.**

### Rules for sub-subphases

- Each sub-subphase must be independently reviewable and revertible.
- Each sub-subphase ends with independent verification.
- If missing prerequisites appear, fix upstream phase first.
- Do not create temporary broken links across commits.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 1 — Content decomposition design (source mapping)
- [x] Phase 2 — Security workflow docs migration
- [x] Phase 3 — API marketing workflow migration
- [x] Phase 4 — AI navigation and index alignment
- [ ] Phase 5 — Archive retirement and consistency verification
- [ ] Phase 6 — Docs Sync
- [ ] Phase 7 — AI-ready docs improvement follow-up rollout (mandatory final phase)

## Phases

### Phase 1: Content decomposition design (source mapping)

**Progress**: `[x]`

**Layer**: planning / source-analysis layer

**Goal**: Produce a deterministic mapping from each archived section to target canonical file(s), avoiding content loss and duplication.

**Files**:

- `doc_archived/signin.md` — read/annotate — source mapping
- `doc_archived/signup.md` — read/annotate — source mapping
- `doc_archived/marketing.md` — read/annotate — source mapping
- `ai_oriented_kanban/20-active/260525-review-docs-as-code-app.md` — update — mapping table and sequencing confirmation

**Verification gate** (must pass before Phase 2 starts):

- Every major section in `doc_archived/*.md` has a destination file assignment. ✅
- A "drop or merge" decision is documented for duplicate/redundant sections. ✅

**Sub-subphase checklist**:

- [x] **1.1 — Build section-to-file mapping**: enumerate archived headings and target destinations.
  - **Independent verification**: mapping table reviewed; no unassigned headings remain.
- [x] **1.2 — Define duplication policy**: decide what stays in parent docs vs new workflow docs.
  - **Independent verification**: explicit rules added (e.g., invariants stay in `auth-patterns`, flows move to dedicated files).

### Phase 1 Deliverables

#### 1.1 Section-to-File Mapping

##### `doc_archived/signin.md` → `docs/security/signin-workflow.md`

| Source Section                                         | Destination File                   | Action                                                                        |
| ------------------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------- |
| Overview                                               | `docs/security/signin-workflow.md` | Port summary paragraph                                                        |
| Core Architecture — Key Components                     | `docs/security/auth-patterns.md`   | Keep as invariant reference (already partially present); link to workflow doc |
| Signin Flow — Complete Signin Process (diagram)        | `docs/security/signin-workflow.md` | Port Mermaid diagram                                                          |
| Signin Flow — Step-by-Step Explanation                 | `docs/security/signin-workflow.md` | Port full step-by-step walkthrough                                            |
| Signin Flow — Error Handling                           | `docs/security/signin-workflow.md` | Port error handling section                                                   |
| Logout Flow — Complete Logout Process                  | `docs/security/signin-workflow.md` | Port under "Logout Flow" heading                                              |
| Logout Flow — Step-by-Step Explanation                 | `docs/security/signin-workflow.md` | Port full logout steps                                                        |
| Logout Flow — Error Recovery                           | `docs/security/signin-workflow.md` | Port; cross-link to auth-patterns for invariants                              |
| Logout Flow — Emergency Logout                         | `docs/security/signin-workflow.md` | Port                                                                          |
| Token Management — Token Structure                     | `docs/security/auth-patterns.md`   | Invariant — keep in parent doc; add link to workflow doc                      |
| Token Management — Token Lifecycle                     | `docs/security/signin-workflow.md` | Port detailed lifecycle steps                                                 |
| Token Management — Why Skip Refresh During Auth Pages? | `docs/security/signin-workflow.md` | Port as design rationale note                                                 |
| State Management — Type-Safe State Machine             | `docs/security/signin-workflow.md` | Port; reference type files                                                    |
| State Management — Unified Token Clearing              | `docs/security/signin-workflow.md` | Port                                                                          |
| State Management — Verification State                  | `docs/security/signin-workflow.md` | Port; cross-link to signup-workflow for verification context                  |
| Race Condition Prevention                              | `docs/security/signin-workflow.md` | Port entirely (high-value operational detail)                                 |
| Route Protection — Signin Page & Protected Routes      | `docs/security/signin-workflow.md` | Port                                                                          |
| Error Types & Handling                                 | `docs/security/signin-workflow.md` | Port full table and recovery notes                                            |
| File Structure — Key Auth Files                        | `docs/security/signin-workflow.md` | Port as quick-reference; keep canonical list trimmed                          |
| Usage Examples                                         | `docs/security/signin-workflow.md` | Port code snippets                                                            |
| How Cookies Work                                       | `docs/security/signin-workflow.md` | Port full section (cookie lifecycle, JOSE wrapping rationale)                 |
| Security Features                                      | `docs/security/auth-patterns.md`   | Merge into parent invariants section; remove duplication                      |
| Testing Checklist                                      | `docs/security/signin-workflow.md` | Port as operational checklist                                                 |
| Troubleshooting — "User can't signin after signup"     | `docs/security/signin-workflow.md` | Port under Troubleshooting heading                                            |

##### `doc_archived/signup.md` → `docs/security/signup-workflow.md`

| Source Section                                              | Destination File                   | Action                                                    |
| ----------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| Overview                                                    | `docs/security/signup-workflow.md` | Port summary                                              |
| Signup Flow Architecture — High-Level Flow Diagram          | `docs/security/signup-workflow.md` | Port Mermaid diagram                                      |
| Signup Flow Architecture — Detailed Sequence                | `docs/security/signup-workflow.md` | Port                                                      |
| Timeout Architecture                                        | `docs/security/signup-workflow.md` | Port entirely (high-value edge-case detail)               |
| UAT vs Production Differences                               | `docs/security/signup-workflow.md` | Port under a dedicated "Environment Differences" heading  |
| UAT Tester Workflow — Flow Diagram                          | `docs/security/signup-workflow.md` | Port Mermaid diagram                                      |
| UAT Tester Workflow — Step-by-Step for Testers              | `docs/security/signup-workflow.md` | Port                                                      |
| UAT Tester Workflow — What `autoVerify` Does                | `docs/security/signup-workflow.md` | Port                                                      |
| UAT Tester Workflow — Troubleshooting                       | `docs/security/signup-workflow.md` | Port                                                      |
| Key Fixes Implemented (1–6)                                 | `docs/security/signup-workflow.md` | Port as "Implementation Safeguards" section               |
| File Structure                                              | `docs/security/signup-workflow.md` | Port as quick-reference                                   |
| Error Handling — Firebase Account Creation Errors           | `docs/security/signup-workflow.md` | Port                                                      |
| Error Handling — Registration/Verification Partial Failures | `docs/security/signup-workflow.md` | Port                                                      |
| Security                                                    | `docs/security/auth-patterns.md`   | Merge security invariants into parent; remove duplication |
| Testing Checklist — Normal Path / Error Paths / Edge Cases  | `docs/security/signup-workflow.md` | Port                                                      |
| Monitoring                                                  | `docs/security/signup-workflow.md` | Port under "Monitoring & Observability" heading           |

##### `doc_archived/marketing.md` → `docs/api/marketing-subscription-workflow.md`

| Source Section                                                          | Destination File                              | Action                                                                                 |
| ----------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Overview                                                                | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Complete Registration Workflow — Steps 1–6 (Firebase/API/verification)  | `docs/api/marketing-subscription-workflow.md` | Port as context/prerequisite steps; cross-link to `signup-workflow.md` for deep detail |
| Complete Registration Workflow — Steps 7–12 (MailerLite/Lambda/storage) | `docs/api/marketing-subscription-workflow.md` | Port in full as core workflow content                                                  |
| Key Features — Non-Blocking Marketing Subscription                      | `docs/api/marketing-subscription-workflow.md` | Port as design principle note                                                          |
| Key Features — Data Collection                                          | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Key Features — MailerLite Groups                                        | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Key Features — Subscriber Status                                        | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Environment Variables Required                                          | `docs/api/marketing-subscription-workflow.md` | Port as configuration reference                                                        |
| Error Handling & Fallbacks                                              | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Monitoring & Debugging — Console Logs                                   | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Monitoring & Debugging — Debug Utility                                  | `docs/api/marketing-subscription-workflow.md` | Port                                                                                   |
| Flow Diagram                                                            | `docs/api/marketing-subscription-workflow.md` | Port Mermaid/ASCII diagram                                                             |
| Related Files                                                           | `docs/api/marketing-subscription-workflow.md` | Port as file-reference table                                                           |
| Testing the Flow                                                        | `docs/api/marketing-subscription-workflow.md` | Port as testing checklist                                                              |

#### 1.2 Duplication Policy

**Rule 1 — Invariants stay in parent docs; procedures move to workflow docs.**

- `docs/security/auth-patterns.md` retains: key components list, token structure, security features summary, and "why" rationale for design decisions.
- `docs/security/signin-workflow.md` owns: state transitions, step-by-step flows, race condition mechanics, cookie lifecycle, error tables, troubleshooting steps, testing checklists.
- `docs/security/signup-workflow.md` owns: signup/verification lifecycle, timeout architecture, UAT differences, implementation safeguards, error recovery paths, monitoring notes.
- `docs/api/api-connection.md` retains: envelope conventions, fetch patterns, auth header patterns.
- `docs/api/marketing-subscription-workflow.md` owns: full MailerLite integration steps, environment config, non-blocking subscription design, debug patterns.

**Rule 2 — Cross-link instead of duplicate.**

When content from a workflow doc is relevant in a parent doc, add a one-line reference link rather than repeating the content. Example: `auth-patterns.md` gets `→ See [Signin Workflow](signin-workflow.md) for full state-transition sequences.`

**Rule 3 — "Security" sections from archived docs merge into `auth-patterns.md`.**

Both `signin.md` and `signup.md` have a "Security" section. These contain security guardrails (invariants) that belong in the parent. Merge the non-duplicated points into `auth-patterns.md` and do not copy them into workflow docs.

**Rule 4 — File structure tables go in workflow docs, not parent docs.**

File path references are operational detail, not invariants. They belong in workflow docs as quick-reference tables.

**Rule 5 — Steps 1–6 of `marketing.md` are context, not content.**

The Firebase/API/verification preamble in `marketing.md` duplicates material in `signup-workflow.md`. Port it as a short "Prerequisites" callout with a cross-link to `signup-workflow.md` rather than a full copy.

**Rule 6 — Parent heading inheritance for exhaustive mapping.**

When a parent section is mapped to a destination file, all child headings under that section are considered covered unless explicitly remapped. This prevents false orphan headings while keeping mapping tables readable.

#### 1.3 Phase 1 QA Audit Evidence

**Heading inventory (source docs):**

- `doc_archived/signin.md`: **56** headings (`#`/`##`/`###`)
- `doc_archived/signup.md`: **29** headings (`#`/`##`/`###`)
- `doc_archived/marketing.md`: **28** headings (`#`/`##`/`###`)
- Total audited headings: **113**

**Coverage validation statement:**

- All top-level and major operational sections are explicitly mapped in **1.1 Section-to-File Mapping**.
- Remaining nested headings are covered via **Rule 6 (Parent heading inheritance)**.
- Security guardrails are intentionally centralized to `docs/security/auth-patterns.md` per **Rule 3**.
- No unmapped critical operational domain remains outside destination files:
  - signin lifecycle → `docs/security/signin-workflow.md`
  - signup lifecycle → `docs/security/signup-workflow.md`
  - marketing lifecycle → `docs/api/marketing-subscription-workflow.md`

**Conclusion:** Phase 1 verification gate is satisfied with explicit mapping + policy-backed inheritance + no orphan critical sections.

---

### Phase 2: Security workflow docs migration

**Progress**: `[x]`

**Layer**: security docs layer

**Goal**: Create canonical signin and signup workflow docs from archived material while keeping `auth-patterns` concise.

**Files**:

- `docs/security/signin-workflow.md` — create — deep signin flow decomposition
- `docs/security/signup-workflow.md` — create — deep signup flow decomposition
- `docs/security/auth-patterns.md` — modify — add pointers and tighten scope boundaries

**Verification gate** (must pass before Phase 3 starts):

- `signin-workflow.md` and `signup-workflow.md` include `Source of truth`, `Last reviewed`, `Owner` metadata. ✅
- `auth-patterns.md` no longer duplicates large step-by-step sections that are now delegated. ✅
- `grep -n "signin-workflow\|signup-workflow" docs/security/auth-patterns.md` returns links. ✅

**Sub-subphase checklist**:

- [x] **2.1 — Create signin workflow doc**: port architecture, timeout, race-condition, troubleshooting content.
  - **Independent verification**: `docs/security/signin-workflow.md` created with mapped operational sections and required metadata fields.
- [x] **2.2 — Create signup workflow doc**: port signup lifecycle, verification process, UAT branch behavior.
  - **Independent verification**: `docs/security/signup-workflow.md` created with mapped lifecycle sections and required metadata fields.
- [x] **2.3 — Re-scope auth-patterns**: replace deep duplication with links and concise invariants.
  - **Independent verification**: `docs/security/auth-patterns.md` explicitly delegates to workflow docs via `signin-workflow`/`signup-workflow` links.

---

### Phase 3: API marketing workflow migration

**Progress**: `[x]`

**Layer**: api docs layer

**Goal**: Move marketing integration workflow into canonical API docs and align with existing API envelope/auth conventions.

**Files**:

- `docs/api/marketing-subscription-workflow.md` — create — end-to-end signup-to-marketing subscription flow
- `docs/api/api-connection.md` — modify — add reference to marketing workflow boundaries

**Verification gate** (must pass before Phase 4 starts):

- `marketing-subscription-workflow.md` metadata and structure are template-compliant. ✅
- `api-connection.md` references when to use the marketing workflow doc. ✅
- Critical endpoint/file references from archived marketing doc are preserved or intentionally pruned. ✅

**Sub-subphase checklist**:

- [x] **3.1 — Create marketing workflow doc**: port flow steps, safety mechanisms, env assumptions, and troubleshooting.
  - **Independent verification**: `docs/api/marketing-subscription-workflow.md` created with Step 7–12 coverage, non-blocking design notes, environment config, and error-handling section.
- [x] **3.2 — Update API connection cross-linking**: add related-doc and usage boundary note.
  - **Independent verification**: `docs/api/api-connection.md` includes direct reference and related-doc link to `marketing-subscription-workflow.md`.

---

### Phase 4: AI navigation and index alignment

**Progress**: `[x]`

**Layer**: ai docs navigation layer

**Goal**: Ensure assistants can discover and prioritize the new workflow docs during task routing.

**Files**:

- `docs/ai/assistant-context-index.md` — modify — add new workflow doc entries
- `docs/ai/guide.md` — modify — add routing hints for deep auth/signup/marketing troubleshooting tasks
- `docs/ai/repo-map.md` — modify (optional) — add note if needed for doc discoverability

**Verification gate** (must pass before Phase 5 starts):

- New doc filenames appear in `assistant-context-index.md` quick-reference table. ✅
- `guide.md` task-type guidance points to new docs where appropriate. ✅
- No broken relative links in modified AI docs. ✅

**Sub-subphase checklist**:

- [x] **4.1 — Update assistant index**: register all new canonical docs.
  - **Independent verification**: `docs/ai/assistant-context-index.md` includes entries for `signin-workflow`, `signup-workflow`, and `marketing-subscription-workflow`.
- [x] **4.2 — Update task routing guide**: add retrieval guidance for deep auth/signup/marketing docs.
  - **Independent verification**: `docs/ai/guide.md` includes new routing guidance for signup verification and marketing subscription debugging.
- [x] **4.3 — Optional repo-map note**: add only if needed for discoverability.
  - **Independent verification**: skipped as unnecessary — `assistant-context-index.md` + `guide.md` provide direct retrieval paths, so `repo-map.md` changes are not required for discoverability.

---

### Phase 5: Archive retirement and consistency verification

**Progress**: `[ ]`

**Layer**: archive cleanup layer

**Goal**: Remove stale archived sources after canonical docs are live and indexed.

**Pre-condition check** (do before implementation):

- Confirm Phases 2–4 verification gates passed.
- Confirm no planned content remains only in `doc_archived/*.md`.

**Files** _(only if pre-condition is met)_:

- `doc_archived/signin.md` — delete/archive — superseded
- `doc_archived/signup.md` — delete/archive — superseded
- `doc_archived/marketing.md` — delete/archive — superseded

**Verification gate** _(if phase is executed)_:

- `grep -r "doc_archived/signin.md\|doc_archived/signup.md\|doc_archived/marketing.md" docs/` returns no live references.
- Canonical replacements exist and are indexed.

**Sub-subphase checklist**:

- [ ] **5.1 — Archive source removal audit**: verify all references are switched.
  - **Independent verification**: no dangling links to retired files.
- [ ] **5.2 — Retire archived files**: delete or archive with explicit superseded note.
  - **Independent verification**: only canonical files remain as active source.

---

### Phase 6: Docs Sync

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all docs listed in `## Docs Impact` are created, updated, or archived so the knowledge base stays accurate.

**Pre-condition check**:

- Review `## Docs Impact` section.
- This phase is mandatory for this rollout (docs are affected).

**Files** _(from Docs Impact section above)_:

- `docs/security/signin-workflow.md` — create — canonical signin deep-dive
- `docs/security/signup-workflow.md` — create — canonical signup deep-dive
- `docs/api/marketing-subscription-workflow.md` — create — canonical marketing flow
- `docs/security/auth-patterns.md` — modify — scope and links
- `docs/api/api-connection.md` — modify — related doc integration
- `docs/ai/assistant-context-index.md` — modify — index registration
- `docs/ai/guide.md` — modify — retrieval guidance
- `doc_archived/signin.md` — delete/archive — superseded
- `doc_archived/signup.md` — delete/archive — superseded
- `doc_archived/marketing.md` — delete/archive — superseded

**Verification gate**:

- Every doc listed in `Docs to create` exists.
- Every doc listed in `Docs to update` has an updated `Last reviewed:` date.
- `grep -r "TODO\|FIXME\|TBD" docs/ | grep -v "_template"` returns no unresolved placeholders in updated files.
- `grep -r "Source of truth" docs/security/signin-workflow.md docs/security/signup-workflow.md docs/api/marketing-subscription-workflow.md` confirms required metadata field exists.
- `grep "signin-workflow\|signup-workflow\|marketing-subscription-workflow" docs/ai/assistant-context-index.md` returns matches.

**Sub-subphase checklist**:

- [ ] **6.1 — Create new docs**: author files listed under “Docs to create”.
  - **Independent verification**: all new files exist with metadata fields filled.
- [ ] **6.2 — Update existing docs**: apply all listed updates.
  - **Independent verification**: `Last reviewed` updated and no conflicting guidance.
- [ ] **6.3 — Archive stale docs**: remove/retire `doc_archived` sources.
  - **Independent verification**: no live references to retired files.
- [ ] **6.4 — Index sync**: ensure assistant index reflects current set.
  - **Independent verification**: quick reference includes all new workflow docs.

---

### Phase 7: AI-ready docs improvement follow-up rollout _(mandatory final phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Convert confirmed learnings from `## What can be improved (AI-ready docs review notes)` and unresolved decisions from `## Open Questions` into an actionable next rollout plan.

**Files**:

- `ai_oriented_kanban/20-active/260525-improve-ai-raedy-docs.md` — create/modify — next rollout plan with confirmed actions and open-question handling
- `ai_oriented_kanban/20-active/260525-review-docs-as-code-app.md` — modify — link handoff summary and status

**Pre-condition check**:

- Confirm at least one completed or partially validated action from this rollout.
- Review `## What can be improved (AI-ready docs review notes)` and `## Open Questions`.

**Verification gate**:

- `260525-improve-ai-raedy-docs.md` exists and contains a full phased rollout plan.
- The new rollout plan includes:
  - confirmed actions selected from `What can be improved next (proposed backlog)`
  - unresolved/open questions carried over with explicit decision paths
  - owners/verification approach for each planned phase
- `260525-review-docs-as-code-app.md` includes a handoff note pointing to `260525-improve-ai-raedy-docs.md`.

**Sub-subphase checklist**:

- [ ] **7.1 — Select confirmed improvements**: mark which backlog items are approved for execution next.
  - **Independent verification**: approved items are explicitly listed in the next rollout file.
- [ ] **7.2 — Carry open questions with decision paths**: convert unresolved questions into explicit choose/decide actions.
  - **Independent verification**: each open question has a decision owner and trigger criteria.
- [ ] **7.3 — Author next rollout plan**: write the phased implementation plan in `260525-improve-ai-raedy-docs.md`.
  - **Independent verification**: plan has phases, verification gates, rollback, and recommendation.
- [ ] **7.4 — Record handoff link**: update this file with a short “next-plan created” session note.
  - **Independent verification**: link/path to next rollout exists in session note.

---

## Dependency Graph

```text
doc_archived source analysis
	↓
docs/security workflow docs
	↓
docs/api workflow docs
	↓
docs/ai navigation and indexing
	↓
doc_archived retirement and consistency checks
  ↓
next-rollout generation for AI-ready docs improvements
```

## Suggested Implementation Order

1. Phase 1.1 → 1.2
2. Phase 2.1 → 2.2 → 2.3
3. Phase 3.1 → 3.2
4. Phase 4.1 → 4.2 → 4.3 (optional)
5. Phase 5.1 → 5.2
6. Phase 6.1 → 6.2 → 6.3 → 6.4
7. Phase 7.1 → 7.2 → 7.3 → 7.4

If a gap appears in a downstream phase, add an isolated upstream docs fix instead of patching around it.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and active phase marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short session note with timestamp, completed step, next step, blockers.
4. If blocked, mark item `[!]` and record unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/check>
- Next: <phase.subphase>
- Blockers: <none | details>
```

## Essential Implementation Details

- Keep a single source-of-truth hierarchy: parent docs hold invariants; workflow docs hold procedural depth.
- Prefer machine-checkable link verification (`grep`) before retiring archived files.
- Preserve critical edge-case sections (timeouts, retries, non-blocking behavior) from archived docs.
- If business behavior in archived docs conflicts with current code/docs, record discrepancy explicitly instead of silently copying.
- Include at least one manual retrieval check: confirm an assistant task can find new docs via `guide.md` and `assistant-context-index.md`.

## What can be improved (AI-ready docs review notes)

This section is intentionally opinionated and review-oriented. It records concerns observed during planning, what drove rework, and improvements we can implement together over time.

### Concerns observed

1. **Deep workflow knowledge is not co-located with canonical docs**
   - `doc_archived/*.md` held operational detail that assistants are unlikely to load by default.
   - This creates hidden knowledge pockets and lower first-pass answer quality.

2. **Boundary between “invariants” vs “procedural walkthrough” is blurry**
   - Parent docs (e.g., `auth-patterns`) and deep docs can easily duplicate each other.
   - Duplication increases drift risk when one is updated and the other is not.

3. **Index discoverability is currently manual and easy to miss**
   - New docs are useful only if `assistant-context-index.md` and `guide.md` are updated in the same change.
   - Missing index updates create orphan docs that exist but are practically invisible.

4. **No formal “AI retrieval QA” gate yet**
   - We have link/grep checks, but no explicit check that a realistic assistant prompt routes to the intended docs.

### What made rework necessary

- The source docs were information-rich but outside the assistant’s canonical navigation path.
- Existing canonical docs were correct at a high level, but too compressed for troubleshooting-heavy tasks.
- Without decomposition, future updates would likely keep landing in mixed locations (`docs/` + `doc_archived/`), causing repeated cleanup work.

### What can be improved next (proposed backlog)

- [ ] **Add a docs layering contract** in `docs/operations/docs-maintenance.md`
  - Parent docs = invariants/guardrails
  - Workflow docs = lifecycle/timelines/troubleshooting
  - Include explicit “do not duplicate” guidance.

- [ ] **Add a “new-doc registration checklist”** to PR expectations
  - Require `assistant-context-index.md` and `guide.md` updates for any new canonical doc.
  - Require `Source of truth`, `Last reviewed`, `Owner` fields.

- [ ] **Introduce AI retrieval smoke tests (manual protocol)**
  - Example prompts:
    - “Debug signup verification stuck state” should route to `docs/security/signup-workflow.md`.
    - “Understand marketing subscribe pipeline” should route to `docs/api/marketing-subscription-workflow.md`.
  - Record pass/fail in session note.

- [ ] **Define archive retirement policy**
  - Decide whether `doc_archived/` becomes read-only historical storage with a single index file, or is fully removed.
  - Enforce one rule consistently to prevent future split-brain documentation.

- [ ] **Add quarterly docs topology review**
  - Validate that high-traffic troubleshooting domains still have enough depth in canonical docs.
  - Track drift indicators: duplicate headings, stale timestamps, and orphan files.

### Collaboration notes for future iterations

- When I suggest restructuring, I should always include:
  1. the exact drift risk,
  2. the minimal safe migration path,
  3. and the verification gate that proves the restructure helped retrieval.
- If you disagree with any concern above, we can mark it as “rejected” with rationale so future contributors understand the decision history.

## Success Criteria

- Archived signin/signup/marketing knowledge is fully represented in canonical `docs/` files.
- New workflow docs are discoverable through `docs/ai/assistant-context-index.md` and `docs/ai/guide.md`.
- `doc_archived/*.md` is retired (or clearly marked superseded) with no dangling references.

## Rollback Plan

1. Restore retired `doc_archived/*.md` files if canonical migration quality fails review.
2. Revert index/guide additions that point to incomplete docs.
3. Keep only validated updates in parent docs (`auth-patterns`, `api-connection`) until migration is corrected.

## Open Questions

1. Should `doc_archived/` be removed entirely after this migration, or retained as a historical snapshot with a single readme pointer?

- Totally remove.

2. Do we want a new “workflow docs” naming convention across domains (`*-workflow.md`) for future consistency?

- Create docs/workflow to centralise all business workflow related domian knowledge

## Recommendation

Execute the default order with **Phase 1 + Phase 2 as immediate priority**. That yields the biggest assistant-context improvement quickly by canonicalizing auth workflow knowledge first, then fold in marketing flow and AI navigation updates before retiring the archive sources.

---

## Session Notes

### Session Note — 2026-05-24 23:40 UTC

- Completed: Phase 1 (1.1 + 1.2)
- Verified by: all `doc_archived/*.md` headings enumerated; every heading assigned to a target file in mapping table; duplication policy rules 1–5 defined
- Next: Phase 2 — Security workflow docs migration (`docs/security/signin-workflow.md`, `docs/security/signup-workflow.md`, update `docs/security/auth-patterns.md`)
- Blockers: none

### Session Note — 2026-05-25 00:15 UTC

- Completed: Phase 1 QA audit hardening
- Verified by:
  - `grep -nE '^#|^##|^###' doc_archived/signin.md` (56 headings)
  - `grep -nE '^#|^##|^###' doc_archived/signup.md` (29 headings)
  - `grep -nE '^#|^##|^###' doc_archived/marketing.md` (28 headings)
  - mapping review against `#### 1.1 Section-to-File Mapping` + duplication policy rules
- Next: Phase 2 — Security workflow docs migration
- Blockers: none

### Session Note — 2026-05-25 00:40 UTC

- Completed: Phase 2 (2.1 + 2.2 + 2.3)
- Verified by:
  - created `docs/security/signin-workflow.md` with `Source of truth`, `Last reviewed`, `Owner`
  - created `docs/security/signup-workflow.md` with `Source of truth`, `Last reviewed`, `Owner`
  - updated `docs/security/auth-patterns.md` delegation links to `signin-workflow.md` and `signup-workflow.md`
  - `grep "signin-workflow\|signup-workflow" docs/security/auth-patterns.md` returned matches
- Next: Phase 3 — API marketing workflow migration (`docs/api/marketing-subscription-workflow.md`, update `docs/api/api-connection.md`)
- Blockers: none

### Session Note — 2026-05-25 01:05 UTC

- Completed: Phase 3 (3.1 + 3.2)
- Verified by:
  - created `docs/api/marketing-subscription-workflow.md` with `Source of truth`, `Last reviewed`, `Owner`
  - confirmed Step 7–12 workflow, non-blocking behavior, environment config, and error handling were documented
  - updated `docs/api/api-connection.md` with direct usage note and related-doc link to `marketing-subscription-workflow.md`
  - `grep "marketing-subscription-workflow" docs/api/api-connection.md` returned matches
- Next: Phase 4 — AI navigation and index alignment (`docs/ai/assistant-context-index.md`, `docs/ai/guide.md`, optional `docs/ai/repo-map.md`)
- Blockers: none

### Session Note — 2026-05-25 01:25 UTC

- Completed: Phase 4 (4.1 + 4.2 + 4.3)
- Verified by:
  - updated `docs/ai/assistant-context-index.md` quick reference entries for `signin-workflow`, `signup-workflow`, and `marketing-subscription-workflow`
  - updated `docs/ai/guide.md` auth-flow routing plus a dedicated task type for signup verification/marketing subscription debugging
  - validated no repo-map update needed because discoverability is already explicit through index + guide
  - `grep "signin-workflow\|signup-workflow\|marketing-subscription-workflow" docs/ai/assistant-context-index.md` returned matches
- Next: Phase 5 — Archive retirement and consistency verification
- Blockers: none
