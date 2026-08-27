# ADR System — Process and Month-Log Convention

> **Source of truth**: this `v1/spec/adr/` folder
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

Capture architectural and process decisions with their rationale so future contributors can answer "why" without re-litigating the past. ADRs are immutable history: once **Accepted**, an entry is not edited; it can only be **Superseded** by a newer entry.

## When to Write an ADR

Record a dated entry when a decision is **significant and durable**:

- Architecture choices (framework, layout, system boundary).
- API contracts and data-model conventions.
- Process conventions (delivery methodology, governance gates).
- Tooling decisions (test runners, deployment pipeline, documentation system).

Small reversible choices do not need an ADR — record them in the rollout plan's decision evidence log instead.

## Numbering

- ADRs are numbered sequentially per repo history: `ADR-0001`, `ADR-0002`, ...
- The sequence is global (not per month); the month log is an index, not the source of truth.

## Month-Log Convention (`YYYY-MM.md` + `## Index`)

Decisions are appended to a month log file named `YYYY-MM.md` (e.g. `2026-08.md`), one `## YYYY-MM-DD: <short title>` entry per decision, following `_template.md`.

Each month log starts with an `## Index` table:

```markdown
## Index

| Date | ADR | Title | Status |
| --- | --- | --- | --- |
| 2026-08-27 | ADR-0001 | <title> | Accepted |
```

Rules:

- The `## Index` must list every entry in the file and stay in sync when entries are added or superseded.
- A superseded entry keeps its section but its `Status` becomes `Superseded by ADR-XXXX` (update both the entry header and the Index row).
- The rollout template's Docs Sync phase (N+1.6) relies on this convention: it greps `## <YYYY-MM-DD>:` to confirm a dated entry exists and checks the Index table.

## Status Lifecycle

```text
Proposed → Accepted → Superseded by ADR-XXXX
                ↘ Deprecated
```

- **Proposed**: under discussion; may be revised or rejected.
- **Accepted**: decided; immutable from this point.
- **Superseded**: a newer ADR replaced this decision; keep the old entry as history.
- **Deprecated**: the decision no longer applies (feature removed); keep the old entry as history.

## Checklist

- [ ] Entry follows `_template.md` (Context / Decision / Consequences).
- [ ] `Date` and `Status` filled; numbered sequentially.
- [ ] Appended to the correct month log `YYYY-MM.md`; `## Index` updated.
- [ ] Significant decision referenced from the related rollout plan / docs.

## Dangerous Areas / Anti-patterns

- Editing an **Accepted** entry in place — decisions are history; supersede, don't rewrite.
- Creating one-off numbered files (`ADR-0005.md`) without the month log — the month-log convention is the canonical location.
- Forgetting to update `## Index` — the index is the retrieval surface.

## Related Docs

- [ADR Template](./_template.md)
- [Rollout Plan Template](../../flow/templates/rollout-plan-template.md) (Docs Sync phase N+1.6)
- [Docs Maintenance Protocol](../operations/docs-maintenance.md)
- [Assistant Context Index](../ai/assistant-context-index.md)
