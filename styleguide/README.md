# Styleguide Instruction Entry

> **Source of truth**: `styleguide/` directory standards and linked implementation files
> **Last reviewed**: 2026-05-28
> **Owner**: engineering / design

## Purpose

This is the canonical entry point for all styling instructions in `certifai-app`.

Use this file as the bridge between:

- **Rule docs** in `docs/` (assistant routing, conventions, maintenance protocol)
- **Implementation specs** in `styleguide/` (shared/app/marketing styling contracts)

If a styling rule changes, update this file and the required docs-domain files in the same PR so docs-first retrieval continues to route correctly.

---

## Styleguide Map

| File | Scope | Primary consumers |
| --- | --- | --- |
| `styleguide/shared.md` | Global visual principles, base tokens, anti-patterns | All surfaces |
| `styleguide/app.md` | Authenticated app surfaces (`/main/*`) | Dashboard, exam, profile, billing UI |
| `styleguide/marketing.md` | Marketing/public site styling | Landing, pricing, docs/public pages |

---

## Docs-System Bridge Contract

When style rules, token ownership, or styleguide file structure changes, update the following docs-domain files in the same PR:

1. `docs/style/conventions.md`
	- Keep `Source of truth` and convention text aligned with styleguide files.
2. `docs/ai/assistant-context-index.md`
	- Ensure assistants can discover the styleguide entry route during first-pass retrieval.
3. `docs/ai/guide.md`
	- Keep Task-Type routing for UI/styling work aligned with this entry point.
4. `docs/operations/docs-maintenance.md` (only when maintenance/update triggers change)
	- Keep docs governance rules synchronized.

If any of the above is skipped, docs routing is considered incomplete.

---

## Update Rules

- Do not add new style rules directly to `docs/style/conventions.md` without reflecting the canonical rule in `styleguide/` first.
- Keep styling guidance centralized: rules live in `styleguide/`, docs in `docs/` should summarize and route.
- When creating a new styleguide file, register it in this README and update docs routing files listed above.

---

## Related Docs

- [`docs/style/conventions.md`](../docs/style/conventions.md)
- [`docs/ai/assistant-context-index.md`](../docs/ai/assistant-context-index.md)
- [`docs/ai/guide.md`](../docs/ai/guide.md)
- [`docs/operations/docs-maintenance.md`](../docs/operations/docs-maintenance.md)
