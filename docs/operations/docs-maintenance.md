# Docs Maintenance Protocol

> **Source of truth**: This file — governs all documentation under `docs/`
> **Last reviewed**: 2026-05-25
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

## Conventions

- **Single source of truth**: never duplicate a rule across docs. State it once in the canonical doc and link from others.
- **`Last reviewed` date**: update whenever you make a substantive content change, not for formatting fixes.
- **Template compliance**: all domain docs must follow the section `_template.md` heading structure.
- **No orphan docs**: every file under `docs/` (except `_template.md` files) must appear in `docs/ai/assistant-context-index.md`.

---

## Related Docs

- [`docs/ai/repo-map.md`](../ai/repo-map.md)
- [`docs/ai/assistant-context-index.md`](../ai/assistant-context-index.md)
- [`docs/adr/0001-docs-architecture-mvp.md`](../adr/0001-docs-architecture-mvp.md)
