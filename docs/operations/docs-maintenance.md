# Docs Maintenance Protocol

> **Source of truth**: This file — governs all documentation under `docs/`
> **Last reviewed**: 2026-05-27
> **Owner**: Engineering team

## Purpose

Define how documentation under `docs/` stays accurate, discoverable, and aligned with the codebase as the product evolves.

---

## Ownership

| Section | Owner | Source of truth |
| --- | --- | --- |
| `docs/ai/` | Any contributor | Codebase structure (inspected, not generated) |
| `docs/architecture/` | Engineering (feature author) | `app/` directory and Next.js conventions |
| `docs/api/` | Engineering (API author) | `src/swr/`, `src/types/api.ts`, `src/lib/client-fetch.ts` |
| `docs/state/` | Engineering | `src/context/` |
| `docs/data/` | Engineering | `src/types/swr-data/` |
| `docs/style/` | Design / Frontend | `styleguide/`, `src/components/ui/` |
| `docs/security/` | Engineering (security owner) | `middleware.proxy.ts`, `src/lib/auth-*.ts` |
| `docs/performance/` | Engineering | `src/lib/rate-limiting.ts`, `src/hooks/useOptimized*.ts` |
| `docs/testing/` | Engineering | `__tests__/`, `e2e/` |
| `docs/product/` | Product / Engineering | Domain terms from code and user-facing content |
| `docs/adr/` | Engineering (decision author) | Each ADR is self-contained |
| `docs/operations/` | Engineering lead | This file |

---

## Layering Contract (Canonical vs Workflow)

Documentation must follow this layering model to reduce drift and keep assistant retrieval predictable:

- **Canonical parent docs** (for example: `docs/architecture/`, `docs/api/`, `docs/security/`) define stable invariants, policies, and shared rules.
- **Workflow docs** (business execution procedures) belong under `docs/workflow/` and describe process steps, handoffs, and operational sequences.

### Contract Rules

1. Parent docs own reusable rules and definitions; workflow docs reference those rules rather than restating them.
2. Workflow docs may include process-specific context, but must not redefine canonical terms or policies.
3. If both layers need similar content, keep the rule in the canonical parent doc and link to it from workflow docs.
4. New workflow documentation should use the `docs/workflow/` location standard.

### Non-Duplication Rule (Enforceable)

- Never maintain the same normative rule text in both a parent doc and a workflow doc.
- During review, duplicated rule blocks are a **docs review failure** unless one side is replaced with a link.

---

## Update Triggers

A doc must be updated in the **same PR** as the code change if:

| Code change | Required doc update |
| --- | --- |
| New or renamed `app/` route, layout, or loading file | `docs/architecture/nextjs-conventions.md` |
| New or changed `src/swr/` hook file | `docs/api/swr-patterns.md` |
| New or changed `src/lib/client-fetch.ts`, `fetch-config.ts`, `api-utils.ts` | `docs/api/api-connection.md` |
| New or changed `src/context/` provider | `docs/state/client-state.md` |
| New or changed `src/types/swr-data/` type file | `docs/data/data-models.md` |
| Style rule change in `styleguide/` or `src/components/ui/` | `docs/style/conventions.md` |
| Change to `middleware.proxy.ts` or `src/lib/auth-*.ts` | `docs/security/auth-patterns.md` |
| New or changed rate-limiting or optimized hook | `docs/performance/patterns.md` |
| Change to `__tests__/setup.ts`, new test file, or E2E fixture | `docs/testing/strategy.md` |
| New domain term introduced | `docs/product/glossary.md` |
| New architectural decision | New ADR in `docs/adr/` |

---

## Monthly Freshness Review

Run this checklist once per month (or after any major feature ship):

### 1. Check `Last reviewed` dates

```bash
grep -r "Last reviewed" docs/ | grep -v "_template"
```

Any doc not reviewed within 90 days should be opened and validated against its source of truth.

### 2. Verify source of truth files still exist

For each doc with a `Source of truth:` field, confirm the listed file paths still exist:

```bash
# Example spot check
ls src/swr/ | sort
ls src/types/swr-data/ | sort
ls src/context/
```

Compare against what each doc lists. If a file was renamed or removed, update the doc.

### 3. Detect new files that aren't documented

```bash
# New SWR hooks not yet in swr-patterns.md
ls src/swr/*.ts | xargs -I{} basename {}

# New type files not yet in data-models.md
ls src/types/swr-data/*.ts | xargs -I{} basename {}

# New context providers
ls src/context/
```

Cross-reference with `docs/api/swr-patterns.md`, `docs/data/data-models.md`, and `docs/state/client-state.md`.

### 4. Check for unresolved TODOs in docs

```bash
grep -r "TODO\|FIXME\|TBD" docs/ | grep -v "_template"
```

Resolve or turn into tracked kanban items.

### 5. Verify AI context docs are accurate

Manually scan `docs/ai/repo-map.md` and `docs/ai/assistant-context-index.md`:
- Do entry points (layout files, middleware) still exist at listed paths?
- Are critical invariants still accurate?
- Do dangerous area warnings still apply?

---

## Adding a New Documentation File

1. Copy the `_template.md` from the relevant section directory.
2. Fill in all required fields: `Source of truth`, `Last reviewed`, `Owner`.
3. Populate at least: `Purpose`, `Key Concepts`, `Conventions / Rules`.
4. Add an entry to [`docs/ai/assistant-context-index.md`](../ai/assistant-context-index.md) under the correct section.
5. If adding a new section directory, also add a row to the table in [`docs/ai/repo-map.md`](../ai/repo-map.md).

---

## New-Doc Registration Checklist (PR Gate)

For every PR that creates or significantly changes documentation, this checklist is required.

### Mandatory Requirements

1. **Assistant index updated**: `docs/ai/assistant-context-index.md` includes new/renamed docs.
2. **AI guide updated when routing changes**: if the change affects where assistants should look first, update `docs/ai/guide.md`.
3. **Required metadata present**: each touched doc includes `Source of truth`, `Last reviewed`, and `Owner`.
4. **Graph-link integrity**: every touched doc maintains a valid `## Related Docs` section with working relative links. A doc with no related docs must include `## Related Docs` with at least the assistant-context-index entry.
5. **Index-sync coverage**: if a new or renamed doc is not yet listed in `docs/ai/assistant-context-index.md`, it is treated as undiscoverable and the PR is a docs review failure.

### Pass/Fail Criteria

- **PASS**: all applicable items above are completed in the same PR.
- **FAIL** if any applicable item is missing, including:
	- doc added but not indexed in `assistant-context-index.md`
	- routing-impacting doc change without corresponding `guide.md` update
	- missing required metadata fields in touched docs
	- touched doc is missing or has broken links in its `## Related Docs` section
	- new or renamed doc is absent from `docs/ai/assistant-context-index.md`

### Example PR Checklist Block

Use this in PR descriptions when docs are created/updated:

```markdown
## Docs Registration Checklist

- [ ] Updated `docs/ai/assistant-context-index.md` for all new/renamed docs
- [ ] Updated `docs/ai/guide.md` (required only when assistant task-routing guidance changed)
- [ ] Verified each touched doc includes metadata:
	- [ ] `Source of truth`
	- [ ] `Last reviewed`
	- [ ] `Owner`
- [ ] Graph-link check: each touched doc has a valid `## Related Docs` section with working relative links
- [ ] Index-sync check: no new/renamed doc is missing from `docs/ai/assistant-context-index.md`
```

---

## Conventions

- **Single source of truth**: never duplicate a rule across docs. State it once in the canonical doc and link from others.
- **`Last reviewed` date**: update whenever you make a substantive content change, not for formatting fixes.
- **Template compliance**: all domain docs must follow the section `_template.md` heading structure.
- **No orphan docs**: every file under `docs/` (except `_template.md` files) must appear in `docs/ai/assistant-context-index.md`.

---

## Archive Retirement Policy

`doc_archived/` is retired as a documentation source. Canonical project documentation must live under `docs/` only.

### Policy

1. **Canonical-only rule**: new or updated authoritative content must be created in `docs/`, not in `doc_archived/`.
2. **No new archive references**: PRs must not add links or references to `doc_archived/` from canonical docs.
3. **Migration-first**: if historical archive content is needed, migrate it into the appropriate `docs/` location and update references.

### Enforcement Checks

Use these checks during review:

```bash
# Fail if canonical docs (excluding this policy file) reference retired archive paths
grep -R "doc_archived/" docs/ --exclude="docs-maintenance.md"

# Optional repo-wide audit for new archive references
grep -R "doc_archived/" . --exclude="docs-maintenance.md"
```

Any PR introducing new `doc_archived/` references in canonical docs is a **docs review failure**.

---

## Quarterly Topology Review

Run this checklist once per quarter (or after any major docs restructure) to detect drift before it accumulates.

### Cadence

- **Frequency**: once per quarter, or immediately after a docs restructure affecting 3+ files.
- **Owner**: Engineering lead.
- **Output**: a kanban item or PR that resolves every identified issue.

### Checklist

- [ ] Run the full Monthly Freshness Review checklist (above).
- [ ] Scan for docs that exist on disk but are not listed in `docs/ai/assistant-context-index.md` (orphan docs).
- [ ] Scan for duplicate headings or duplicate rule text across sibling docs in the same domain folder.
- [ ] Check all workflow docs in `docs/workflow/` have `Source of truth`, `Last reviewed`, and `Owner` metadata.
- [ ] Verify `docs/workflow/README.md` naming convention is being followed for any new workflow files.
- [ ] Confirm no `doc_archived/` references exist in canonical docs.
- [ ] Re-run the AI retrieval smoke-test protocol in [`docs/operations/ai-retrieval-smoke-tests.md`](./ai-retrieval-smoke-tests.md) — at minimum the 3 baseline prompts.

### Drift Indicators (fail criteria)

| Indicator | Detection method |
| --- | --- |
| Stale `Last reviewed` (> 90 days) | `grep -r "Last reviewed" docs/` — compare dates |
| Orphan docs (not in index) | `find docs/ -name "*.md" ! -name "_template.md"` — diff against index |
| Duplicate rule text in sibling docs | Manual scan of sibling sections; grep for distinctive phrases |
| Duplicate headings across domain | `grep -r "^## " docs/<domain>/` — look for identical heading strings |
| `doc_archived/` references | `grep -R "doc_archived/" docs/ --exclude="docs-maintenance.md"` |
| Workflow docs outside `docs/workflow/` that should migrate | Review docs with `-workflow.md` suffix outside `docs/workflow/` |

Any item above that does not resolve in the current review must become a tracked kanban item before the review is closed.

---

## Related Docs

- [`docs/ai/repo-map.md`](../ai/repo-map.md)
- [`docs/ai/assistant-context-index.md`](../ai/assistant-context-index.md)
- [`docs/operations/ai-retrieval-smoke-tests.md`](./ai-retrieval-smoke-tests.md)
- [`docs/workflow/README.md`](../workflow/README.md)
- [`docs/adr/0001-docs-architecture-mvp.md`](../adr/0001-docs-architecture-mvp.md)
