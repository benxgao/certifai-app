# Rollout: First Real Usage of the `intent-ops` Package (Follow-Up)

> **Handoff from**: `sculp-intent-ops.md` (establish intent-ops v1 foundational components) — Phase 7 handoff.

## Summary

The `intent-ops` package now exists as a self-contained, copy-ready v1: navigator, genesis rollout plan, spec-first scaffold, and generalized kanban flow, all validated by link/version/content scans and a simulated copy. The natural next step is to exercise the package in a real project — either this repo (promote `v1/spec/` to `docs/` usage patterns) or a target project — to prove the copy promise end-to-end and to prepare v2.

## Scope

### In scope

1. **First real usage**: copy the package into a target project (or a scratch repo), execute `v1/cli/init.md` as a rollout plan, populate one domain scaffold with real content, and run one docs-first planning task through the flow (`10-plan` → `20-active` → `30-review`).
2. **v2 preparation (optional)**: when the methodology changes accumulate, execute the v1 → v2 migration checklist in `v1/README.md`.
3. **Backport decision**: decide whether improvements authored in `intent-ops` should be backported to the origin folders (one-way extraction is the default; backport is deliberate).

### Out of scope

- Changing the v1 package while a target project depends on it (freeze v1 during the trial).
- Business content from any project inside the package.

## Phases

### Phase 1: Copy + genesis regeneration

**Goal**: Prove `v1/cli/init.md` regenerates the `v1/spec/` scaffold in a fresh repo.

**Verification gate**: generated `v1/spec/` tree matches the genesis plan's output contract; link + content scans pass on the copy.

### Phase 2: First docs-first planning task

**Goal**: Run one representative task through the flow: intake → rollout plan (with `Docs Needed` + decision evidence) → first 2 phases → review.

**Verification gate**: plan file in `10-plan/` conforms to the template; decision evidence log complete; docs-only simulation drill passes with fallback ratio `<= 0.20`.

### Phase 3: v2 prep or backport decision

**Goal**: Decide the next version action.

**Verification gate**: decision recorded as an ADR entry; migration checklist updated if v2 is created.

## Rollback Plan

- The package is a copy, not a runtime dependency — delete it from the trial repo with no impact.
- v2 is created by copying v1; keep v1 untouched until v2 is proven.

## Open Questions

1. Trial target: this repo (promote `v1/spec/` ↔ `docs/`), a scratch repo, or a real third project? (Owner: user.)
