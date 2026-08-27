# v1 — Version Manifest

> **Source of truth**: this `v1/` tree
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## What v1 Contains

| Path             | Role                                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v1/cli/init.md` | **Genesis rollout plan** — executing it as a rollout plan generates all folders and files inside `v1/spec/` (recursive self-generation).                                                                                                                                                   |
| `v1/flow/`       | The AI-oriented kanban methodology: lane READMEs (`00-intake` → `50-report`), lane transition gates, and the two mandatory templates (`rollout-plan-template.md`, `excutive-report-template.md`).                                                                                          |
| `v1/spec/`       | The spec-first docs system: AI routing (`ai/`), governance protocols (`operations/`), decision history (`adr/`), workflow conventions (`workflow/`), and per-domain scaffolds (`architecture/`, `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/`). |

## Version Model

- `v1/` is the complete current version of the package.
- The next version (`v2/`) is created by **copying all files under `v1/` to `v2/`** and applying changes on top.
- No cross-version links and no partial-version references are allowed: every reference inside `v1/` resolves inside `v1/`. This is what keeps migration a plain file copy.
- `intent-ops/README.md` and `intent-ops/instructions.md` point at the current version (`v1/`).

## v1 → v2 Migration Checklist

1. Copy all files under `v1/` to `v2/`:
   ```bash
   mkdir -p intent-ops/v2
   cp -r intent-ops/v1/* intent-ops/v2/
   ```
2. Apply the version changes inside `v2/` (additions, removals, edits).
3. Update package-root pointers: `intent-ops/README.md` and `intent-ops/instructions.md` should document that `v2/` is current (or keep both and label the active version).
4. Re-run the copy-readiness validation (link scan, version-scope scan, content scan, simulated copy) — see `intent-ops/instructions.md`.

## Related Docs

- [`../README.md`](../README.md) — package definition
- [`../instructions.md`](../instructions.md) — navigator (entry routing, first-copy checklist, validation gates)
- [`flow/README.md`](flow/README.md) — methodology
- [`spec/README.md`](spec/README.md) — spec-first docs system
- [`cli/init.md`](cli/init.md) — genesis rollout plan
