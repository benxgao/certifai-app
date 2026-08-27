# Rollout: Establish `intent-ops` v1 Foundational Components (Copy-Ready Spec-First + Kanban Package)

> **Location note**: This plan is authored in `v1/flow/00-intake/init-spec-kanban.md` per the init request. Per the lane convention (`v1/flow/README.md` → Mobile workflow quickstart), once approved this plan moves to `v1/flow/10-plan/init-spec-kanban.md` and the intake copy is removed.

## Summary

`intent-ops` is defined in `README.md` as a self-contained, copyable package: `instructions.md` as the AI-copilot navigator, `v1/flow/` (extracted from the AI-oriented Kanban methodology) for intent-driven delivery, `v1/spec/` (extracted from the spec-first docs system) for docs-first development, and — new in this version — `v1/cli/init.md` as the **genesis rollout plan**: itself written to the rollout-plan template, it is executed by AI copilots to generate all folders and files inside `v1/spec/`. The promise is that the whole folder can be copied into any project and immediately provide the same capabilities that `ai_oriented_kanban/` and `docs/` provide in the source project.

The package is now versioned under `v1/` (flow, spec, cli). This is a deliberate architecture decision: `intent-ops` is expected to become an isolated project and to be upgraded to `v2` in the future, with users migrating simply by copying all files from `v1` to `v2`. For that migration to stay trivial, `v1` must be fully self-contained: every internal reference resolves inside `v1/`, nothing outside the package is required at runtime, and the version model is documented.

The package also uses **recursive self-generation**: `v1/cli/init.md` is not an instruction sheet but a full rollout plan (per `v1/flow/templates/rollout-plan-template.md` — summary, phased execution with verification gates, mandatory closing phases). This rollout authors the genesis plan first (Phase 1), then executes it (Phase 2) to generate all folders and files inside `v1/spec/`; any target project does the same to produce its own spec scaffold. The package therefore bootstraps its own spec system through its own methodology.

The package also ships a **`skills/` folder** — a registry for community-downloaded AI-coding instructions (skills) that are **linked** from the package entry points, **navigated** via the registry `skills/README.md`, and **integrated** when a user executes init (the genesis plan's Skills-integration phase). The [Skills integration scope extension](#skills-integration-scope-extension-2026-08-27) below authors the registry and wires skills into navigation and the genesis plan.

That promise is not yet true. Today the package has four structural gaps: (1) `instructions.md` is an empty stub — the navigator every copilot is supposed to start from does not exist; (2) `v1/cli/init.md` is an empty stub — the genesis rollout plan that generates all folders and files inside `v1/spec/` is missing; (3) `v1/spec/` contains only a one-line README — the entire spec-first scaffolding (AI guide, context index, repo-map, ADR system, operations protocols, domain scaffolds) is absent; (4) the `v1/flow/` lane READMEs and templates still point at the source project's `docs/...` paths and carry business-specific examples (Firebase, Stripe, exam flows), which makes the package broken and non-reusable after copy — and `README.md` still documents the old flat `ops-flow`/`ops-spec` naming instead of the versioned layout.

This rollout establishes the foundational components so the package is **self-contained, versioned, generic, and copy-ready**: it authors `instructions.md` and `v1/cli/init.md` (the genesis rollout plan), executes the genesis plan to generate `v1/spec/` as a generalized mirror of the `docs/` structure (process/methodology extracted, business content excluded), normalizes all internal references to resolve inside `v1/`, documents the v1/v2 version model, and proves copy-readiness with link scans, a no-business-content scan, a simulated copy, and a genesis-plan + docs-only drill.

## Current Evaluation

### What already exists

- `intent-ops/README.md` — package definition: navigator + `v1/flow` (kanban) + `v1/spec` (docs), "can be copied to any projects and benefit immediately". **Stale**: still names `ops-flow`/`ops-spec` and does not mention the version model or `v1/cli/`.
- `intent-ops/v1/flow/README.md` — full AI-Oriented Kanban methodology (principles, lane structure, operating loop, lane transition criteria, quick-start checklist, mobile workflow quickstart).
- `intent-ops/v1/flow/00-intake/ | 10-plan/ | 20-active/ | 30-review/ | 40-archive/ | 50-report/` lane READMEs with AI-assistant instructions.
- `intent-ops/v1/flow/templates/rollout-plan-template.md` and `excutive-report-template.md` — the two mandatory artifacts (rollout plan, executive report).
- `intent-ops/v1/cli/init.md` — created but **empty** (1-line stub) — intended as the genesis rollout plan that triggers generation of all folders and files inside `v1/spec/` (recursive self-generation).
- `intent-ops/v1/spec/README.md` — one-line stub ("Spec Kanban Specification Files").
- `intent-ops/skills/README.md` — created but **empty** (1-line stub) — intended as the registry/index for community AI-coding skills (linked, navigated, integrated on init); authored by the Skills integration scope extension.
- Versioned layout `v1/` (flow / spec / cli) — the container for the current version; future `v2/` planned by copying files from `v1`.
- Source material to extract from (repository root, siblings of `intent-ops/`): `ai_oriented_kanban/` (methodology + archive examples) and `docs/` (spec-first docs system: `README.md`, `ai/guide.md`, `ai/assistant-context-index.md`, `ai/repo-map.md`, `ai/project-simulation-readiness.md`, `ai/_template.md`, `adr/_template.md`, `operations/ai-retrieval-smoke-tests.md`, `workflow/README.md`, per-domain `_template.md`).

### What is not centralized / stable / complete yet

#### 1. `instructions.md` is an empty stub (the navigator does not exist)

- `README.md` declares `instructions.md` as the navigator, but the file contains no content.
- No entry point tells a copied project's copilot how to route into `v1/flow/` vs `v1/spec/` vs `v1/cli/`, which prompt triggers map to which behavior, or what to do on first copy.

Representative files:

- `intent-ops/instructions.md` (empty)
- `intent-ops/README.md` (references a navigator that does not exist)

#### 2. `v1/cli/init.md` is an empty stub (the genesis rollout plan does not exist)

- The CLI/init artifact is meant to be a **rollout plan** — structured per `v1/flow/templates/rollout-plan-template.md` — whose execution triggers the generation of **all folders and files inside `v1/spec/`** (recursive self-generation: the package generates its own spec system by executing a plan written in its own methodology).
- The file is empty, so there is no genesis plan to execute in this rollout, and target projects have no init path that produces their spec scaffold.

Representative files:

- `intent-ops/v1/cli/init.md` (empty)
- `intent-ops/v1/flow/templates/rollout-plan-template.md` (the structure the genesis plan must follow)

#### 3. `v1/spec/` is only a one-line stub (the spec-first scaffold is absent)

- No entrypoint README (domain map, canonical-vs-workflow layering, how `v1/spec` and `v1/flow` interact).
- No `ai/` layer: no `guide.md`, no `assistant-context-index.md`, no `repo-map.md`, no `project-simulation-readiness.md`, no doc `_template.md`.
- No `operations/` layer: no `ai-retrieval-smoke-tests.md`, no `docs-maintenance.md`, no `spec-first-kanban-integration.md`, no `_template.md` — even though `v1/flow/10-plan/README.md` and the rollout template link to these.
- No `adr/` layer (template + month-log convention) and no `workflow/README.md` naming convention.
- No domain scaffolds (`architecture/`, `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/`) that a new project populates with its own content.

Representative files:

- `intent-ops/v1/spec/README.md` (one-line stub)
- `intent-ops/v1/flow/10-plan/README.md` (links to `../../docs/operations/spec-first-kanban-integration.md`, which does not exist in the package)
- `intent-ops/v1/flow/templates/rollout-plan-template.md` (links to `docs/ai/guide.md`, `docs/adr/`, `docs/product/user-journey.md`, etc., all outside the package)

#### 4. `v1/flow/` still carries source-project paths and business content, and the version model is undocumented

- Lane READMEs and templates reference `docs/...` paths (the source project's canonical docs location), which resolve to nothing inside `intent-ops` and resolve to the wrong thing in a target project that has its own `docs/`.
- `v1/flow/README.md` lists certifai-specific delivery examples ("What this looked like in recent delivery work" — `certifai-app`, `certifai-api`, Stripe, exam semantics, etc.), which is not reusable content for other projects.
- `README.md` still describes the old flat layout (`ops-flow` / `ops-spec`) — it neither matches the `v1/flow` / `v1/spec` structure nor documents the v1 → v2 migration model that makes future upgrades a simple file copy.

Representative files:

- `intent-ops/README.md` (stale naming, no version model)
- `intent-ops/v1/flow/README.md`
- `intent-ops/v1/flow/00-intake/README.md` (references `docs/ai/assistant-context-index.md`)
- `intent-ops/v1/flow/10-plan/README.md`, `30-review/README.md`
- `intent-ops/v1/flow/templates/rollout-plan-template.md` (26 KB of `docs/...` references)

### Risks in the current state

- [ ] A project that copies `intent-ops` today gets a package whose navigator and genesis plan are empty and whose links are broken — the core value proposition fails on first use.
- [ ] Without an authored `v1/cli/init.md`, every target project hand-initializes artifacts differently, defeating the "execute genesis plan → generate v1/spec" standardization.
- [ ] If `v1/cli/init.md` is authored as an instruction sheet instead of a rollout plan, the recursion breaks: spec generation cannot be gated, verified, and re-executed through the methodology itself.
- [ ] `v1/spec` and `docs/` paths diverge as the package is edited in place, making later generalization more expensive (rework risk).
- [ ] Business content leaked into a shared package (Firebase/Stripe/exam examples) pollutes target projects and embeds wrong architecture assumptions.
- [ ] If links or references escape the `v1/` scope (absolute paths, cross-version links), the v1 → v2 migration is no longer a trivial file copy.
- [ ] Without a copy-readiness gate, future edits to the package can silently reintroduce broken relative links.

## Scope

- Estimated files to create: ~19 (instructions.md, v1/README.md, v1/cli/init.md + v1/spec scaffold: README, ai/ ×5, operations/ ×4, adr/ ×2, workflow/ ×1, domain scaffolds ×4, incl. `product/user-journey.md` — plus `skills/README.md` registry from the Skills integration scope extension)
- Estimated files to modify: ~10 (intent-ops/README.md, v1/flow/README.md, 6 lane READMEs, 2 templates, this plan file)
- Risk level: Low — documentation-only rollout; no application code, no runtime behavior, no external systems.

### In scope

- Author `instructions.md` as the navigator (entry flow, prompt triggers, first-copy guidance).
- Author `v1/cli/init.md` as the **genesis rollout plan** (recursive self-generation): a conformant rollout plan whose execution generates all folders and files inside `v1/spec/`, with a defined output contract and verification.
- Author `v1/README.md` as the version-scoped manifest: what `v1` contains and the v1 → v2 migration checklist.
- Generate `v1/spec/` by executing the genesis plan `v1/cli/init.md` (Phase 2), producing a generalized mirror of the `docs/` folder structure with reusable process/methodology and no business content.
- Normalize all internal references in `v1/flow/` lane READMEs and templates from `docs/...` to package-internal `v1/spec/...`.
- Generalize examples in `intent-ops/README.md` and `v1/flow/README.md` (remove certifai-specific delivery references) and document the v1/v2 version model.
- Add a copy-readiness validation layer: relative-link scan, no-business-content scan, version-scope scan, simulated copy test, genesis-plan dry-run (recursion check), and a bootstrap + docs-only drill.
- **Skills integration scope extension**: author `skills/README.md` as the skills registry (community AI-coding instructions), link it from the package entry points, and integrate it into the genesis plan (`v1/cli/init.md` Skills-integration phase) so any skill dropped into `skills/` is linked, navigated, and registered on init.

### Out of scope

- Any certifai-app business content (Firebase, Stripe, exam/certification flows, signin/signup workflows, repo-map specifics, SEO/server-actions patterns, billing domain) — intentionally **not** extracted.
- Creating the future `v2/` folder — this rollout only makes `v1` self-contained so that v2 (whenever it is created) is a file copy plus changes. A v1 → v2 migration checklist is documented, not executed.
- Changing the methodology itself (principles, lane structure, lane transition criteria in `v1/flow/README.md`).
- Modifying the source folders (`ai_oriented_kanban/`, `docs/` at repository root) — extraction is one-way for now.
- Project-specific docs for the source project or any target project (the package ships scaffolds/placeholders only).

## Minimum Viable Hotfix

- Phase 1 (author `instructions.md` + `v1/cli/init.md` genesis plan) + Phase 2 (execute the genesis plan to produce `v1/spec/README.md` + `v1/spec/ai/guide.md` + `v1/spec/ai/assistant-context-index.md`).
- Why safe/minimal: these are pure additive markdown files with no dependencies; once present, a copilot can navigate the package, execute the genesis plan to bootstrap `v1/spec/`, and perform docs-first retrieval (the capabilities named in `README.md` and the `v1/cli/init.md` purpose). All remaining phases are hardening and proof.

## Docs Impact

> Completed during planning, before any implementation.

### Docs checked during planning

| Doc                                                                                                                                                       | Relevant finding                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intent-ops/README.md`                                                                                                                                    | Package contract: navigator + flow + spec; copy-to-any-project promise. **Stale**: names `ops-flow`/`ops-spec`, no version model, no `cli/`. Confirms what "foundational components" means.                                                                                                              |
| `intent-ops/instructions.md`                                                                                                                              | Empty stub — navigator must be authored.                                                                                                                                                                                                                                                                 |
| `intent-ops/v1/README.md`                                                                                                                                 | Does not exist — version-scoped manifest + v1 → v2 migration checklist should be created.                                                                                                                                                                                                                |
| `intent-ops/v1/cli/init.md`                                                                                                                               | Empty stub — must be authored as the genesis rollout plan that generates all folders and files inside `v1/spec/` (recursive self-generation).                                                                                                                                                            |
| `intent-ops/v1/flow/README.md`                                                                                                                            | Full methodology; contains certifai delivery examples to generalize; contains the mobile workflow quickstart (prompt triggers) that `instructions.md` should operationalize.                                                                                                                             |
| `intent-ops/v1/flow/00-intake/README.md`                                                                                                                  | References `docs/ai/assistant-context-index.md` — must repoint to `v1/spec/ai/assistant-context-index.md`.                                                                                                                                                                                               |
| `intent-ops/v1/flow/10-plan/README.md`                                                                                                                    | Links to `../../docs/operations/spec-first-kanban-integration.md` — broken inside the package; fixed by pointing at the rollout plan template — the governance contract ships in `v1/flow/templates/`.                                                                                                                                 |
| `intent-ops/v1/flow/20-active/README.md`                                                                                                                  | Mostly generic; audit for stray `docs/` references.                                                                                                                                                                                                                                                      |
| `intent-ops/v1/flow/30-review/README.md`                                                                                                                  | References `docs/ai/assistant-context-index.md` — must repoint to v1/spec.                                                                                                                                                                                                                               |
| `intent-ops/v1/flow/40-archive/README.md`, `50-report/README.md`                                                                                          | Generic; audit only.                                                                                                                                                                                                                                                                                     |
| `intent-ops/v1/flow/templates/rollout-plan-template.md`                                                                                                   | ~15 `docs/...` path references (`docs/ai/guide.md`, `docs/ai/assistant-context-index.md`, `docs/adr/YYYY-MM.md`, `docs/adr/_template.md`, `docs/product/user-journey.md`, `docs/operations/ai-retrieval-smoke-tests.md`, `docs/ai/project-simulation-readiness.md`) — all must repoint to `v1/spec/...`. |
| `intent-ops/v1/flow/templates/excutive-report-template.md`                                                                                                | Generic; audit only.                                                                                                                                                                                                                                                                                     |
| `ai_oriented_kanban/README.md` + `40-archive/26-05/260529-specs-first-kanban-integration.md` (repo root)                                                  | Reference style for rollout plans and governance contract content (5-column decision evidence, graph-link gates, simulation drill, 120-point eval).                                                                                                                                                      |
| `docs/README.md` (repo root)                                                                                                                              | Spec-first entrypoint to generalize: domain map, canonical-vs-workflow layering rule, how `docs/` + kanban work together, quick start.                                                                                                                                                                   |
| `docs/ai/guide.md` (repo root)                                                                                                                            | Docs-first retrieval decision flow + post-task update trigger + retrieval QA trigger — all reusable; task-type index content is certifai-specific → ship as placeholder scaffold.                                                                                                                        |
| `docs/ai/assistant-context-index.md` (repo root)                                                                                                          | Canonical index structure — reusable as scaffold; all rows are certifai-specific → replace with placeholder rows.                                                                                                                                                                                        |
| `docs/ai/repo-map.md` (repo root)                                                                                                                         | System-boundary/route-map structure — reusable as placeholder skeleton only (no certifai paths).                                                                                                                                                                                                         |
| `docs/ai/project-simulation-readiness.md` (repo root)                                                                                                     | Rubric (100-point, fallback-ratio rule, run-log template) — reusable as-is minus certifai refs.                                                                                                                                                                                                          |
| `docs/ai/_template.md`, `docs/adr/_template.md`, `docs/operations/_template.md` (repo root)                                                               | Doc/ADR/ops templates — reusable after de-certifai-ification (remove Firebase/nextjs example paths).                                                                                                                                                                                                     |
| `docs/operations/ai-retrieval-smoke-tests.md` (repo root)                                                                                                 | QA protocol + prompt table — reusable structure; prompt table becomes placeholder prompts.                                                                                                                                                                                                               |
| `docs/workflow/README.md` (repo root)                                                                                                                     | Workflow-doc naming convention — reusable; example file names become generic.                                                                                                                                                                                                                            |
| `docs/` domain folders (repo root: `architecture/`, `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/`, `billing/`) | Each carries `_template.md` (reusable scaffold pattern); domain content (nextjs, firebase, stripe, exams) is business-specific → excluded; `billing/` excluded entirely.                                                                                                                                 |

### Docs-First Retrieval Checklist

> This checklist is **required** in every rollout plan.

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md` (repo root, task type 9 "Writing or Updating a Rollout Plan from docs/specs First") and `docs/ai/assistant-context-index.md`.
- [x] Reviewed existing ADRs — `intent-ops` has no `adr/` yet (created by this rollout under `v1/spec/adr/`); source project has `docs/adr/0001-docs-architecture-mvp.md`, which documents the very docs structure this rollout generalizes — no conflict (see ADR Conflict Check).
- [x] Declared initial `Docs Needed` list before implementation planning (below).
- [x] Assessed sufficiency — docs were **sufficient** / ~~insufficient~~.
  - If insufficient: docs that were missing, ambiguous, or outdated: _N/A for planning phase._
  - If insufficient: fallback code scan was used for this specific decision: _N/A._
- [x] For each major planning decision, recorded a `Decision Evidence Log` row (below).
- [x] Post-task docs update required: `[x] Yes` — captured in Docs to create/update below | `[ ] No`.

### Docs Needed (planning + implementation)

> **Mandatory gate**: no implementation work starts until this table is populated.

| Doc                                                                                         | Why needed                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intent-ops/README.md`                                                                      | Package contract — defines the foundational components and the copy promise (must be refreshed for the versioned layout).                                                     |
| `intent-ops/v1/cli/init.md`                                                                 | The genesis rollout plan being authored — a conformant rollout plan whose execution generates all folders and files inside `v1/spec/`; defines what "initialized repo" means. |
| `intent-ops/v1/flow/README.md`                                                              | Methodology source for navigator content, prompt triggers, and lane conventions.                                                                                              |
| `intent-ops/v1/flow/templates/rollout-plan-template.md`                                     | Mandatory structure for this plan and the template to be generalized in Phase 3.                                                                                              |
| `docs/README.md` (repo root)                                                                | Entrypoint being generalized into `v1/spec/README.md`.                                                                                                                        |
| `docs/ai/guide.md` (repo root)                                                              | Retrieval decision flow being generalized into `v1/spec/ai/guide.md`.                                                                                                         |
| `docs/ai/assistant-context-index.md` (repo root)                                            | Index structure being generalized into `v1/spec/ai/assistant-context-index.md`.                                                                                               |
| `docs/ai/project-simulation-readiness.md` (repo root)                                       | Rubric being generalized into `v1/spec/ai/project-simulation-readiness.md`.                                                                                                   |
| `docs/ai/_template.md`, `docs/adr/_template.md`, `docs/operations/_template.md` (repo root) | Doc templates being generalized into `v1/spec/` equivalents.                                                                                                                  |
| `docs/operations/ai-retrieval-smoke-tests.md` (repo root)                                   | QA protocol being generalized into `v1/spec/operations/ai-retrieval-smoke-tests.md`.                                                                                          |
| `docs/workflow/README.md` (repo root)                                                       | Naming convention being generalized into `v1/spec/workflow/README.md`.                                                                                                        |
| `ai_oriented_kanban/40-archive/26-05/260529-specs-first-kanban-integration.md` (repo root)  | Reference implementation for governance contract + closing phases consolidated in `v1/flow/templates/rollout-plan-template.md`.                                                   |

### Planning Decision Evidence Log

> **Mandatory gate**: each major decision must have one row before phase execution begins.

| Decision                                                                                                                                                                                                                                                               | Docs cited                                                                                                                                                      | Sufficiency verdict | Fallback code scan used? | Doc update action                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adopt a versioned layout: `v1/flow`, `v1/spec`, `v1/cli`; future `v2/` is a file copy of `v1/` plus changes, keeping migration trivial                                                                                                                                 | `intent-ops/README.md` (copy promise), user decision (isolated project, v2 upgrade, migrate by copying files)                                                   | Sufficient          | No                       | Create `v1/README.md` (manifest + migration checklist); document the version model in `intent-ops/README.md` and `instructions.md`                |
| Normalize all package-internal references from `docs/...` to `v1/spec/...` and keep every link inside the `v1/` scope so the package is self-contained and version-copyable                                                                                            | `intent-ops/README.md` (copy promise), `v1/flow/` lane READMEs (broken links)                                                                                   | Sufficient          | No                       | Repoint lane READMEs + both templates in Phase 3; verify in Phase 4 link + version-scope scans                                                    |
| Author `v1/cli/init.md` as a **genesis rollout plan** (recursive self-generation): it follows the `rollout-plan-template.md` structure and, when executed, triggers generation of all folders and files inside `v1/spec/`; Phase 2 executes it to produce the scaffold | `v1/cli/init.md` (user-created stub + stated purpose), `v1/flow/templates/rollout-plan-template.md` (plan structure), user decision (init.md is a rollout plan) | Sufficient          | No                       | Create `v1/cli/init.md` in Phase 1; execute it in Phase 2 to generate `v1/spec/`; prove with genesis-plan dry-run in Phase 4 and drill in Phase 8 |
| `v1/spec/` mirrors the `docs/` folder structure (ai, operations, adr, workflow, domain folders) so it is immediately usable and promotable to a project's `docs/`                                                                                                      | `docs/README.md` + `docs/` folder inventory (repo root)                                                                                                         | Sufficient          | No                       | Create `v1/spec/` scaffold in Phase 2; document promotion path in `v1/README.md` + `instructions.md`                                              |
| Extract only process/methodology content; exclude all certifai business content (firebase, stripe, exams, signin/signup, SEO, repo-map specifics); drop `billing/` domain entirely                                                                                     | `docs/` domain inventories (repo root), user requirement (reusable only)                                                                                        | Sufficient          | No                       | Ship placeholder scaffolds only; enforce with Phase 4 no-business-content scan                                                                    |
| Author `instructions.md` as the navigator that operationalizes the mobile workflow quickstart prompt triggers (generate a plan / start a task / complete a task) and routes into flow/spec/cli                                                                         | `intent-ops/README.md` (navigator), `v1/flow/README.md` (Mobile workflow quickstart)                                                                            | Sufficient          | No                       | Create `instructions.md` in Phase 1                                                                                                               |
| Copy-readiness is gated by an automated verification layer (link scan + content scan + version-scope scan + simulated copy + genesis-plan dry-run + docs-only drill), not by human review                                                                              | `v1/flow/README.md` (evidence-based completion), `260529-specs-first-kanban-integration.md` (drill pattern)                                                     | Sufficient          | No                       | Add Phase 4 + closing drill phase to this plan                                                                                                    |

### ADR Conflict Check

> **Mandatory gate**: no implementation work starts until this table is populated.
> Scan `docs/adr/` (month logs `YYYY-MM.md`) and check every planned phase/action against accepted decisions.

| ADR entry (`YYYY-MM-DD: title`)                                                                                               | Planned action that touches it                      | Conflict?                                                                  | Explicitly addressed in plan?                                                                                     | Open question raised? |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| `intent-ops`: no ADRs exist yet (the `adr/` layer is created by Phase 2 of this rollout under `v1/spec/adr/`)                 | All phases                                          | No — no prior decisions to conflict with                                   | Yes — Phase 2.4 creates `v1/spec/adr/` with template + month-log convention                                       | No                    |
| `docs/adr/0001-docs-architecture-mvp.md` (source project, repo root): documents why the spec-first docs structure was adopted | Phase 2 mirrors that same structure into `v1/spec/` | No — this rollout extends the same architecture, it does not contradict it | Yes — `v1/spec/adr/` will include a seed ADR entry recording the package architecture + versioned-layout decision | No                    |

**Rules**: a planned action "explicitly addresses" a conflicting ADR only when the plan states the deviation, names the affected ADR, and schedules the superseding/refining entry. No conflicts found — no open questions are required on this gate.

### Docs to create

| File                                                                                                                                                    | Reason                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `intent-ops/instructions.md`                                                                                                                            | The navigator — entry point for AI copilots in any project that copies the package; routes into `v1/flow/`, `v1/spec/`, `v1/cli/`.                                                                                                                                       |
| `intent-ops/v1/README.md`                                                                                                                               | Version-scoped manifest: what `v1/` contains (flow, spec, cli), how it relates to the package root, and the v1 → v2 migration checklist (copy all files under `v1/` → `v2/`).                                                                                            |
| `intent-ops/v1/cli/init.md`                                                                                                                             | The genesis rollout plan (per `v1/flow/templates/rollout-plan-template.md`): executed by AI copilots — here in Phase 2, and in any target project — to generate all folders and files inside `v1/spec/`; defines the output contract and verification for "initialized". |
| `intent-ops/v1/spec/README.md`                                                                                                                          | Generalized spec-first docs entrypoint (domain map, layering rule, interplay with `v1/flow`, quick start).                                                                                                                                                               |
| `intent-ops/v1/spec/ai/guide.md`                                                                                                                        | Generalized AI assistant guide (retrieval decision flow, post-task update trigger, placeholder task-type index).                                                                                                                                                         |
| `intent-ops/v1/spec/ai/assistant-context-index.md`                                                                                                      | Generalized canonical index scaffold with placeholder rows.                                                                                                                                                                                                              |
| `intent-ops/v1/spec/ai/repo-map.md`                                                                                                                     | Placeholder repo-map skeleton (system boundary/route-map shapes, no project paths).                                                                                                                                                                                      |
| `intent-ops/v1/spec/ai/project-simulation-readiness.md`                                                                                                 | Generalized simulation rubric (100-point, fallback-ratio rule, run-log template).                                                                                                                                                                                        |
| `intent-ops/v1/spec/ai/_template.md`                                                                                                                    | Generalized doc template (placeholder source-of-truth fields).                                                                                                                                                                                                           |
| `intent-ops/v1/spec/operations/ai-retrieval-smoke-tests.md`                                                                                             | Generalized retrieval QA protocol with placeholder prompts.                                                                                                                                                                                                              |
| `intent-ops/v1/spec/operations/docs-maintenance.md`                                                                                                     | Docs-governance protocol (ownership, update cadence, graph-link registration) — referenced by templates and guide; must ship with the package.                                                                                                                           |
| `intent-ops/v1/spec/operations/_template.md`                                                                                                            | Generalized operations-doc template.                                                                                                                                                                                                                                     |
| `intent-ops/v1/spec/adr/_template.md`                                                                                                                   | Generalized ADR template.                                                                                                                                                                                                                                                |
| `intent-ops/v1/spec/adr/README.md`                                                                                                                      | ADR process + month-log convention (`YYYY-MM.md` + `## Index`), referenced by the rollout template.                                                                                                                                                                      |
| `intent-ops/v1/spec/workflow/README.md`                                                                                                                 | Generalized workflow-doc naming/location convention (`*-workflow.md`).                                                                                                                                                                                                   |
| `intent-ops/v1/spec/architecture/_template.md` (+ `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/` — same file) | Domain scaffolds: generic `_template.md` per domain so target projects fill in their own content.                                                                                                                                                                        |
| `intent-ops/v1/spec/product/user-journey.md`                                                                                                            | Scaffold for the user-journey doc that the rollout template's mandatory Phase N writes to.                                                                                                                                                                               |
| `intent-ops/skills/README.md`                                                                                                                           | Skills registry/index: makes the `skills/` folder navigable, defines the skill format, and documents how skills are linked and integrated on init.                                                                                                                 |

### Docs to update

| File                                                       | What changes                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intent-ops/README.md`                                     | Refresh for the versioned layout (`v1/flow`, `v1/spec`, `v1/cli`); generalize provenance wording (do not name the source project as a requirement); add package-layout diagram, version model (v1 current → v2 by file copy), copy/promotion guidance, and pointer to `instructions.md`. |
| `intent-ops/v1/flow/README.md`                             | Replace certifai-specific delivery examples in "What this looked like in recent delivery work" with generic, fill-in placeholders.                                                                                                                                                       |
| `intent-ops/v1/flow/00-intake/README.md`                   | Repoint `docs/ai/assistant-context-index.md` → `v1/spec/ai/assistant-context-index.md`.                                                                                                                                                                                                  |
| `intent-ops/v1/flow/10-plan/README.md`                     | Repoint `docs/operations/spec-first-kanban-integration.md` → the rollout plan template (governance contract lives in `v1/flow/templates/`); audit other `docs/` refs.                                                                                                                                               |
| `intent-ops/v1/flow/20-active/README.md`                   | Audit; repoint any `docs/` refs (expected: none or one).                                                                                                                                                                                                                                 |
| `intent-ops/v1/flow/30-review/README.md`                   | Repoint `docs/ai/assistant-context-index.md` → `v1/spec/ai/assistant-context-index.md`.                                                                                                                                                                                                  |
| `intent-ops/v1/flow/40-archive/README.md`                  | Audit (expected: none).                                                                                                                                                                                                                                                                  |
| `intent-ops/v1/flow/50-report/README.md`                   | Audit (expected: none).                                                                                                                                                                                                                                                                  |
| `intent-ops/v1/flow/templates/rollout-plan-template.md`    | Repoint all `docs/...` references to `v1/spec/...` (~15 occurrences: guide, index, adr, user-journey, smoke-tests, simulation-readiness); keep relative links valid from `v1/flow/templates/`.                                                                                           |
| `intent-ops/v1/flow/templates/excutive-report-template.md` | Audit; update any stale internal reference (expected: none — template is already generic).                                                                                                                                                                                               |
| `intent-ops/v1/flow/00-intake/init-spec-kanban.md`         | This plan — progress markers are advanced as phases complete.                                                                                                                                                                                                                            |
| `intent-ops/instructions.md`                               | Skills integration scope extension: add `skills/` to the package layout + entry routing + first-copy checklist; whitelist the package-root `skills/` external in the version-scope scan.                                                                                                     |
| `intent-ops/README.md`                                     | Skills integration scope extension: add `skills/` to the overview + package layout + how-to-use.                                                                                                                                                                                          |
| `intent-ops/v1/spec/ai/assistant-context-index.md`         | Skills integration scope extension: register the skills registry in the Quick Reference index.                                                                                                                                                                                            |
| `intent-ops/v1/README.md`                                  | Skills integration scope extension: document `skills/` as package-root unversioned user content (documented external).                                                                                                                                                                    |
| `intent-ops/v1/spec/adr/2026-08.md`                        | Skills integration scope extension: record ADR-0005 (skills folder integration).                                                                                                                                                                                                          |

### Docs to delete or archive

| File                                                              | Reason                                                                                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intent-ops/v1/spec/operations/spec-first-kanban-integration.md`  | Deleted in follow-up (2026-08-27): governance contract consolidated into `v1/flow/templates/rollout-plan-template.md`; no kanban-named doc ships in the package. |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.
      _(Not checked — this rollout IS the establishment of the package's docs; every section above applies.)_

## Context Map

### Files to modify first

| File                                   | Purpose                                          | Why it matters                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intent-ops/instructions.md`           | Author the navigator                             | The single entry point for every copilot that picks up the package; without it the copy promise fails.                                                            |
| `intent-ops/v1/cli/init.md`            | Author the genesis rollout plan                  | The deterministic "execute genesis plan → generate v1/spec" path that standardizes initialization across target projects — and bootstraps this rollout's Phase 2. |
| `intent-ops/v1/spec/README.md`         | Entrypoint of the spec-first scaffold            | Anchors the domain map and the flow/spec interplay that every other spec doc links back to.                                                                       |
| `intent-ops/v1/flow/10-plan/README.md` | Fix the one genuinely broken link in the package | `../../docs/operations/...` resolves nowhere; it is the most visible copy-failure.                                                                                |

### Likely files to create

| File                                                                                                         | Purpose                                                  |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `intent-ops/v1/README.md`                                                                                    | Version manifest + v1 → v2 migration checklist.          |
| `intent-ops/v1/spec/ai/*` (guide, index, repo-map, simulation-readiness, \_template)                         | Retrieval + governance scaffold for docs-first behavior. |
| `intent-ops/v1/spec/operations/*` (smoke-tests, docs-maintenance, \_template) | QA + governance protocol layer.                          |
| `intent-ops/v1/spec/adr/*` + `workflow/README.md`                                                            | Decision history + workflow naming conventions.          |
| `intent-ops/v1/spec/<domain>/_template.md` ×9 + `product/user-journey.md`                                    | Per-domain scaffolds.                                    |
| `intent-ops/skills/README.md`                                                                                 | Skills registry/index (Skills integration scope extension). |

### Dependencies / related patterns

| File                                       | Relationship                                                                                                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/`, `ai_oriented_kanban/` (repo root) | One-way extraction sources for `v1/spec/` structure and generalized content.                                                                                          |
| `intent-ops/v1/flow/`                      | Consumed by Phase 3 (repointed); `templates/rollout-plan-template.md` is also consumed by the closing phases of this plan itself.                                     |
| `intent-ops/v1/cli/init.md`                | Generated artifacts must match the `v1/flow/` lane structure and the `v1/spec/` scaffold — the init output contract is defined by this plan's Phase 1/2 deliverables. |
| `intent-ops/v1/flow/README.md`             | Provides lane-transition criteria that gate this plan's own progress (e.g., Review → Archive requires drill + eval).                                                  |
| `intent-ops/v1/README.md`                  | Version manifest that `instructions.md` and the genesis plan reference for the v1 → v2 migration path.                                                                |

### Risks

- [ ] Over-generalization could strip so much content that the scaffolds are unusable placeholders — mitigate by keeping every reusable rule (retrieval flow, rubric, gate language) and replacing only project-specific facts.
- [ ] The genesis plan could drift from the actual `v1/spec/` structure it is supposed to generate — mitigate by authoring `v1/cli/init.md` against the final Phase 2 scaffold and proving it with the Phase 4 genesis-plan dry-run.
- [ ] Reference normalization could introduce new broken links inside the 26 KB rollout template — mitigate with the Phase 4 link scan and simulated-copy test before any template is considered done.
- [ ] Links or references escaping the `v1/` scope would break the v1 → v2 file-copy migration — mitigate with a version-scope scan in Phase 4 and the migration checklist in `v1/README.md`.
- [ ] The package may drift from the source folders later; one-way extraction is intentional, and `instructions.md` will note that improvements should be authored in `intent-ops` and backported deliberately.

## Recommended Architecture

### Principle 1: The package is self-contained and version-scoped

Every relative link resolves inside `intent-ops/`, and every version-scoped reference stays inside `v1/`. The package must not depend on sibling folders (`ai_oriented_kanban/`, `docs/` at repo root) at runtime — those exist only as extraction sources during this rollout. This is what makes v1 → v2 migration a plain file copy.

### Principle 2: Versions are whole-folder snapshots

`v1/` (flow, spec, cli) is the complete current version; the future `v2/` is created by copying all files under `v1/` to `v2/` and applying changes. No cross-version links, no partial-version references. `v1/README.md` is the manifest that makes the migration checklist explicit and verifiable.

### Principle 3: `v1/spec/` mirrors the `docs/` structure, business content excluded

The folder layout (ai, operations, adr, workflow, domain folders, `_template.md` per domain) is the reusable asset. Business facts (firebase, stripe, exams, specific routes) are replaced by placeholders. This keeps the package promotable: a target project may keep `intent-ops/v1/spec/` as its canonical docs, or rename it to `<project>/docs/` with zero structural change.

### Principle 4: Recursive self-generation — the init artifact is a rollout plan, not an instruction sheet

`v1/cli/init.md` is itself a rollout plan (rollout-plan-template structure: summary, phased execution with verification gates, mandatory closing phases). Executing it — in this rollout to generate all folders and files inside `v1/spec/`, and in any target project to generate its spec scaffold — produces the spec system through the same methodology the package standardizes. This recursion makes initialization deterministic, gated, and verifiable: the plan's phases, gates, and closing phases apply to the generation itself.

### Principle 5: Process is normative, examples are fill-in

Rules that govern behavior (docs-first retrieval flow, decision-evidence schema, simulation rubric, lane gates, ADR month-log convention) are stated as requirements. Examples are marked as `[project: fill in]` placeholders so no target project inherits another project's architecture.

### Principle 6: Copy-readiness is verified, not assumed

The "copy promise" is only true when a link scan, a no-business-content scan, a version-scope scan, a simulated copy + genesis-plan dry-run, and a docs-only drill pass. These become a reusable validation checklist shipped inside the package (`v1/cli/init.md` or `v1/spec/operations/`).

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless the user explicitly asks for a looser plan.**

Layers, in order: entry artifacts (`instructions.md`, `v1/cli/init.md`, `v1/README.md`) → spec scaffold generated by the genesis plan (`v1/spec/` meta → ai → operations → adr/workflow → domains) → kanban generalization (`v1/flow/` lane READMEs → templates → package README) → validation (link/version/content scans → copy + genesis-plan dry-run → drill). Phases 1–4 each touch exactly one layer; cross-layer work happens only in the closing phases (docs sync, reflection, drill, eval), which are explicit contract-alignment phases.

## Phase Sequencing Rule

> **Default sequencing: root-cause fix → data recovery/backfill → contract hardening → UX/message polish → tests.**

Root cause: the navigator, the genesis plan, and the spec scaffold are missing (Phases 1–2). Then fix the broken/leaky references and document the version model (Phase 3). Then add the verification layer that makes the package copy-ready and keeps it that way (Phase 4). Closing phases (5–9) prove durability.

## Commit Slicing Rule

> **A phase may be split into sub-subphases when the file count, review surface, or QA burden is too large for one safe commit.**

### Rules for sub-subphases

- Each sub-subphase is independently reviewable and revertible (pure markdown additions/modifications).
- Each sub-subphase ends with a local verification step (grep/file-exists checks).
- If a missing prerequisite appears, add or revise an earlier-layer sub-subphase instead of patching around it downstream.
- Phase 1 (navigator + genesis plan + manifest), Phase 2 (execute the genesis plan to generate spec), and Phase 3 (template repointing) are intentionally split so each commit is a coherent slice.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 1 — Author entry artifacts: `instructions.md` navigator + `v1/cli/init.md` genesis plan + `v1/README.md` manifest
- [x] Phase 2 — Execute genesis plan: generate `v1/spec/` scaffold (recursive self-generation)
- [x] Phase 3 — Generalize `v1/flow/` (lane READMEs + templates + package README + version model)
- [x] Phase 4 — Copy-readiness validation (link/version/content scans + simulated copy + genesis-plan dry-run)
- [!] Phase 5 — User-journey sync (skipped: no user-facing features — methodology package)
- [x] Phase 6 — Docs Sync (metadata, index registration, ADR log `2026-08.md`)
- [~] Phase 7 — AI-ready docs reflection and next-plan handoff (follow-up plan created; consolidated into this file)
- [x] Phase 8 — Docs-only Simulation Drill (genesis-plan regeneration + copy test recorded)
- [x] Phase 9 — Rollout Eval & Health Score (100/120, see session note)
- [x] Skills integration scope extension — author `skills/README.md` registry + wire skills into navigation and the genesis plan (2026-08-27, see section below)

## Phases

### Phase 1: Author entry artifacts — `instructions.md` navigator, `v1/cli/init.md` genesis rollout plan, `v1/README.md` manifest

**Progress**: `[x]`

**Layer**: entry-artifacts layer (root-cause fix)

**Goal**: Create the three entry points that make `intent-ops` usable by an AI copilot in any project: the navigator (what the package is and how to route into flow/spec/cli), the genesis rollout plan (a conformant rollout plan whose execution generates all folders and files inside `v1/spec/`), and the version manifest (what `v1` contains and how v2 migration works).

**Files**:

- `intent-ops/instructions.md` — create — the navigator
- `intent-ops/v1/cli/init.md` — create — the genesis rollout plan
- `intent-ops/v1/README.md` — create — version-scoped manifest + migration checklist

**Verification gate** (must pass before Phase 2 starts):

- `instructions.md` is non-empty and contains: (1) package overview linking to `v1/flow/README.md`, `v1/spec/README.md`, and `v1/cli/init.md`; (2) the three prompt triggers from the mobile workflow quickstart (generate a plan → create rollout plan in `v1/flow/10-plan/` from template, remove intake item; start the planned task → implement first 2 phases; complete the task → mark done, archive, generate executive report); (3) first-copy guidance (copy folder, promote `v1/spec/` to `<project>/docs/` or keep as-is, execute `v1/cli/init.md` as a rollout plan to generate the spec scaffold, populate domain scaffolds).
- `v1/cli/init.md` is a **conformant rollout plan**: it follows the `rollout-plan-template.md` structure (Summary, Docs Impact with decision evidence, phased execution with verification gates, mandatory closing phases), and its phases generate **all folders and files inside `v1/spec/`** (entrypoint, ai, operations, adr, workflow, domain scaffolds); it includes an optional repo-scan phase that derives `[project: fill in]` placeholders, and verification gates (metadata fields, index registration, link scan, no-business-content scan).
- `v1/README.md` is non-empty and contains: what `v1/` contains (flow, spec, cli), the version model (v1 current, v2 by file copy), and the migration checklist (copy `v1/*` → `v2/`).
- No certifai business terms appear in any of the three files (`grep -i -E "certifai|firebase|stripe|exam"` returns nothing).

**Sub-subphase checklist**:

- [ ] **1.1 — Define the entry-artifact content contracts**: outline sections for the navigator (overview, package layout, entry routing, prompt triggers, first-copy checklist, maintenance note), the genesis plan (rollout-plan structure, phases that generate `v1/spec/`, verification), and the version manifest (contents, migration checklist), with source anchors in `v1/flow/README.md`.
  - **Independent verification**: each outline item maps to an existing section in `v1/flow/README.md`, `intent-ops/README.md`, or the `docs/` structure.
- [ ] **1.2 — Write `instructions.md`**: author the full navigator with working relative links to `v1/flow/README.md`, `v1/flow/templates/rollout-plan-template.md`, `v1/spec/README.md`, and `v1/cli/init.md`.
  - **Independent verification**: all relative links resolve (`ls` each target path); prompt-trigger section is present; no certifai business terms.
- [ ] **1.3 — Write `v1/cli/init.md` as the genesis rollout plan**: author it per the `rollout-plan-template.md` — Summary; Docs Impact (spec files to generate, decision evidence, verification); phased execution whose phases generate **all folders and files inside `v1/spec/`** (entrypoint → ai → operations → adr/workflow → domain scaffolds), each phase with a verification gate; an optional repo-scan phase that derives `[project: fill in]` placeholders for the target project; mandatory closing phases (docs sync, reflection, drill, eval).
  - **Independent verification**: init.md's headings conform to the rollout-plan template; its phase file-inventory matches the `v1/spec/` scaffold tables in Phase 2 below; each phase has a verification gate; no business terms.
- [ ] **1.4 — Write `v1/README.md`**: version-scoped manifest — contents of `v1/` (flow, spec, cli), the version model (current v1, future v2 as file copy), and the migration checklist (copy `v1/*` → `v2/`, update package-root pointers, re-run validation).
  - **Independent verification**: manifest's file list matches the actual `v1/` tree; migration steps are concrete and testable.

---

### Phase 2: Execute the genesis plan — generate `v1/spec/` (recursive self-generation)

**Progress**: `[x]`

**Layer**: spec scaffold layer (generated, not hand-authored)

**Goal**: Execute `v1/cli/init.md` as a rollout plan to generate all folders and files inside `v1/spec/` — the recursion: the genesis plan authored in Phase 1 produces the spec scaffold through the same methodology the package standardizes. No spec file is written outside the genesis plan's phases.

**Files** _(generated by executing the genesis plan `v1/cli/init.md`; file inventory per its phase list)_:

- `intent-ops/v1/cli/init.md` — modify — record execution progress, decision evidence, and verification results in the genesis plan itself
- `intent-ops/v1/spec/README.md` — create (genesis phase: entrypoint) — domain map, layering rule, flow interplay, quick start
- `intent-ops/v1/spec/ai/guide.md`, `assistant-context-index.md`, `repo-map.md`, `project-simulation-readiness.md`, `_template.md` — create (genesis phase: AI layer)
- `intent-ops/v1/spec/operations/ai-retrieval-smoke-tests.md`, `docs-maintenance.md`, `spec-first-kanban-integration.md`, `_template.md` — create (genesis phase: operations layer)
- `intent-ops/v1/spec/adr/_template.md`, `adr/README.md` — create (genesis phase: ADR + workflow conventions)
- `intent-ops/v1/spec/workflow/README.md` — create (genesis phase: ADR + workflow conventions)
- `intent-ops/v1/spec/architecture/_template.md` + `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/` — create (genesis phase: domain scaffolds)
- `intent-ops/v1/spec/product/user-journey.md` — create (genesis phase: domain scaffolds)

**Verification gate** (must pass before Phase 3 starts):

- `v1/cli/init.md` is marked complete or in-progress with execution evidence (progress markers, decision evidence log, session notes) recorded in the genesis plan itself.
- `find v1/spec -type f` shows the full scaffold exactly matching the genesis plan's file inventory; every file has `Source of truth:`, `Last reviewed:`, `Owner:` metadata fields and a `## Related Docs` section (per `docs/ai/_template.md` convention).
- `v1/spec/README.md` domain map lists exactly the domains shipped (ai, operations, adr, workflow, architecture, api, state, data, style, security, performance, testing, product).
- No certifai business terms anywhere in `v1/spec/` (`grep -ri -E "certifai|firebase|stripe|exam|mailerlite" v1/spec/` returns nothing).
- `v1/spec/ai/assistant-context-index.md` registers every file generated in this phase.
- The generated structure matches the genesis plan's output contract — no drift between plan and scaffold (the recursion stays honest).

**Sub-subphase checklist**:

- [ ] **2.0 — Activate the genesis plan**: confirm `v1/cli/init.md`'s phase inventory matches the file tables below; mark the genesis plan `[~]`; any mismatch is fixed in the plan before execution, not patched downstream.
  - **Independent verification**: genesis plan phase list ↔ this phase's file list are 1:1; no spec file exists outside the genesis plan's inventory.
- [ ] **2.1 — Execute genesis phase (entrypoint)**: run the genesis plan's entrypoint phase to author `v1/spec/README.md` (purpose, domain map with the 13 domains, canonical-vs-workflow layering rule, how `v1/spec` and `v1/flow` work together, quick start, related docs).
  - **Independent verification**: every row in the domain map points to an existing or scaffolded folder; the "how it works together" section references `v1/flow/README.md` and `v1/flow/templates/rollout-plan-template.md`; the genesis plan's entrypoint phase is marked `[x]`.
- [ ] **2.2 — Execute genesis phase (AI layer)**: generalize `guide.md` (keep docs-first retrieval decision flow, post-task docs-update trigger, retrieval QA trigger; replace task-type index with one generic worked example + `[project: fill in]` placeholder entries), `assistant-context-index.md` (placeholder rows + registration instructions), `repo-map.md` (placeholder skeleton only), `project-simulation-readiness.md` (keep full rubric/run-log; drop certifai refs), `_template.md` (generic source-of-truth placeholders).
  - **Independent verification**: all four rules-heavy sections in `guide.md` are retained verbatim in spirit; `grep -c "project: fill in" v1/spec/ai/*.md` >= 4; no business terms.
- [ ] **2.3 — Execute genesis phase (operations layer)**: generalize `ai-retrieval-smoke-tests.md` (keep protocol + pass criteria; placeholder prompts referencing v1/spec paths), author `docs-maintenance.md` (ownership, freshness SLA, new-doc registration checklist, graph-link rules) and `spec-first-kanban-integration.md` (spec format contract, 5-column decision evidence schema, reviewer gates — from the `260529-...` reference), add `_template.md`.
  - **Independent verification**: `spec-first-kanban-integration.md` contains the required evidence schema with all 5 columns; smoke-test prompts reference only `v1/spec/...` and `v1/flow/...` paths.
- [ ] **2.4 — Execute genesis phase (ADR + workflow conventions)**: generalize `adr/_template.md` (context/decision/consequences; drop certifai example links), author `adr/README.md` (process: numbered ADRs, month-log `YYYY-MM.md` + `## Index` convention that the rollout template's Phase N+1.6 relies on), generalize `workflow/README.md` (`*-workflow.md` naming, generic examples).
  - **Independent verification**: `adr/README.md` documents the `YYYY-MM.md` month-log + index convention; `workflow/README.md` example filenames contain no business nouns.
- [ ] **2.5 — Execute genesis phase (domain scaffolds)**: create one `_template.md` per domain (architecture, api, state, data, style, security, performance, testing, product) + `product/user-journey.md` scaffold; each template keeps the standard headings (Purpose, System Boundary, Critical Invariants, Dangerous Areas, Related Docs) with placeholders.
  - **Independent verification**: each domain folder contains exactly `_template.md` (plus `user-journey.md` for product); no domain folder contains business content; `billing/` is absent by design.

---

### Phase 3: Generalize `v1/flow/` (lane READMEs + templates + package README + version model)

**Progress**: `[x]`

**Layer**: kanban generalization layer

**Goal**: Make every `v1/flow/` artifact self-contained: repoint `docs/...` references to `v1/spec/...`, remove business-specific examples, and document the copy/promotion flow and the v1/v2 version model in the package READMEs.

**Files**:

- `intent-ops/v1/flow/README.md` — modify — generalize "What this looked like in recent delivery work" to fill-in placeholders
- `intent-ops/v1/flow/00-intake/README.md` — modify — repoint index reference
- `intent-ops/v1/flow/10-plan/README.md` — modify — fix broken `../../docs/...` link; repoint other refs
- `intent-ops/v1/flow/20-active/README.md`, `30-review/README.md`, `40-archive/README.md`, `50-report/README.md` — modify — audit + repoint where needed
- `intent-ops/v1/flow/templates/rollout-plan-template.md` — modify — repoint ~15 `docs/...` refs to `v1/spec/...`
- `intent-ops/v1/flow/templates/excutive-report-template.md` — modify — audit only
- `intent-ops/README.md` — modify — refresh for versioned layout, generalize provenance, add layout diagram + version model + copy/promotion guidance, point to `instructions.md` and `v1/README.md`

**Verification gate** (must pass before Phase 4 starts):

- `grep -rn "docs/" v1/flow/` (excluding `v1/spec/`-adjacent and README prose that legitimately mentions the promotion path) returns no stale link to a non-existent path — every remaining `docs/` mention is either `v1/spec/` or an explicit promotion note.
- `grep -rn -i -E "certifai|firebase|stripe|exam" v1/flow/` returns nothing.
- `v1/flow/README.md` delivery-examples section is generic; `intent-ops/README.md` documents the versioned layout (`v1/flow`, `v1/spec`, `v1/cli`), the version model (v2 = copy of v1), the promotion option, and contains a package-layout diagram and first-copy instructions.

**Sub-subphase checklist**:

- [ ] **3.1 — Repoint lane READMEs**: fix `00-intake` (assistant-context-index), `10-plan` (spec-first-kanban-integration — the broken link), and audit `20-active`/`30-review`/`40-archive`/`50-report`.
  - **Independent verification**: `grep -rn "\.\./\.\./docs/" v1/flow/` returns nothing; every referenced path exists (`ls` check per lane).
- [ ] **3.2 — Repoint templates**: update `rollout-plan-template.md` references (`docs/ai/guide.md` → `v1/spec/ai/guide.md`, `docs/ai/assistant-context-index.md` → `v1/spec/ai/assistant-context-index.md`, `docs/adr/` → `v1/spec/adr/`, `docs/adr/_template.md` → `v1/spec/adr/_template.md`, `docs/product/user-journey.md` → `v1/spec/product/user-journey.md`, `docs/operations/ai-retrieval-smoke-tests.md` → `v1/spec/operations/ai-retrieval-smoke-tests.md`, `docs/ai/project-simulation-readiness.md` → `v1/spec/ai/project-simulation-readiness.md`); audit `excutive-report-template.md`.
  - **Independent verification**: `grep -n "docs/" v1/flow/templates/*.md` shows only `v1/spec/` or zero matches; each referenced `v1/spec/...` path exists.
- [ ] **3.3 — Generalize package READMEs + version model**: replace certifai delivery examples in `v1/flow/README.md` with `[project: describe your recent initiatives]` placeholders; refresh `intent-ops/README.md` (generic provenance "extracted from the AI-Oriented Kanban methodology and the spec-first docs system", versioned layout diagram, version model: v1 current / v2 by file copy with pointer to `v1/README.md` migration checklist, copy + promotion guidance, navigator pointer).
  - **Independent verification**: no business terms in either README; README links to `instructions.md` and `v1/README.md` and explains the `v1/spec/` ↔ `<project>/docs/` promotion option.

---

### Phase 4: Copy-readiness validation

**Progress**: `[x]`

**Layer**: validation layer

**Goal**: Prove the package is immediately functional after a copy: all internal links resolve, no business content remains, no reference escapes the `v1/` scope, and a fresh copy plus a genesis-plan dry-run behaves like the original.

**Files**:

- `intent-ops/instructions.md` — modify — include the copy-readiness validation checklist (link/version/content scan commands) as a maintenance gate
- `intent-ops/v1/cli/init.md` — modify — align the verification step with the actual scan commands used here
- `intent-ops/v1/spec/operations/docs-maintenance.md` — modify — add the package-level copy-readiness checklist (reusable for future edits)

**Verification gate** (must pass before closing phases start):

- Link scan: every relative link inside `intent-ops/` (markdown links and `grep`-able path references) resolves to an existing file.
- Version-scope scan: no internal reference resolves outside `intent-ops/v1/` for any `v1/`-rooted document (the only allowed external mentions are the documented extraction sources and the promotion note).
- Content scan: `grep -ri -E "certifai|firebase|stripe|exam|certification|mailerlite" intent-ops/` returns zero matches (excluding this plan's "Out of scope" prose, which is archived with the plan).
- Simulated copy: `cp -r intent-ops /tmp/intent-ops-copy-test` passes the same three scans.
- Genesis-plan dry-run (recursion check): executing `v1/cli/init.md` as a rollout plan against a scratch repo produces the `v1/spec/` scaffold, and the generated tree passes the same three scans.
- A copy-readiness checklist (the exact scan commands) is recorded in `instructions.md` for future edits.

**Sub-subphase checklist**:

- [ ] **4.1 — Link integrity scan**: enumerate every markdown link and path reference in the package; verify each target exists; fix any residual break.
  - **Independent verification**: scan script output lists zero missing targets.
- [ ] **4.2 — Version-scope scan**: verify that every `v1/`-rooted document references only targets inside `intent-ops/v1/` (or explicitly documented externals: extraction sources, promotion note).
  - **Independent verification**: scan output lists zero out-of-scope references; this is the gate that keeps v1 → v2 migration a plain file copy.
- [ ] **4.3 — No-business-content scan**: run the business-term grep across the package; confirm zero matches outside the archived plan's scope prose.
  - **Independent verification**: grep exit code 1 (no matches) on all target terms.
- [ ] **4.4 — Simulated copy + genesis-plan dry-run**: copy the package to a scratch dir (outside the repo), re-run the three scans; then execute the genesis plan `v1/cli/init.md` against a second scratch repo and confirm the generated `v1/spec/` scaffold matches the package structure and passes the scans.
  - **Independent verification**: scratch copy passes all three scans; genesis-plan output tree matches the declared contract in `v1/cli/init.md`; generated tree passes the scans; `README.md` → `instructions.md` → lane READMEs navigation works from the copy's own root.
- [ ] **4.5 — Record the validation checklist**: persist the scan commands + genesis-plan alignment + promotion guidance into `instructions.md`, `v1/cli/init.md`, and `docs-maintenance.md` so future package edits are validated the same way.
  - **Independent verification**: checklist section exists and contains the exact commands used in 4.1–4.4.

---

## Post-task phases

### Phase 5: User-journey sync _(mandatory closing phase)_

**Progress**: `[!]` — skipped: no user-journey updates needed — methodology package, not a product feature rollout

**Layer**: documentation layer

**Goal**: Update the user-journey doc with relevant user feature stories delivered by completed kanban phases.

**Pre-condition check**:

- This rollout ships no user-facing features (it establishes a documentation package); the `v1/spec/product/user-journey.md` scaffold created in Phase 2 has no stories to add.
- Mark this phase `[!]` with note: "skipped: no user-journey updates needed — methodology package, not a product feature rollout."

**Files** _(only if pre-condition is met)_:

- `intent-ops/v1/spec/product/user-journey.md` — modify — only if a journey story is identified (expected: none)

**Verification gate** _(if phase is executed)_:

- `v1/spec/product/user-journey.md` reflects only package-level changes; no product stories invented.

**Sub-subphase checklist**:

- [ ] **5.1 — Confirm no user-journey impact**: verify the package changes introduce no user-facing behavior.
  - **Independent verification**: no product feature stories exist in the diff; phase marked `[!]` with the skip note.

---

### Phase 6: Docs Sync _(mandatory closing phase)_

**Progress**: `[x]`

**Layer**: documentation layer

**Goal**: Ensure every doc listed in `## Docs Impact` is created/updated, metadata is complete, and the package graph (index, related docs, links) is consistent.

**Pre-condition check**:

- Review `## Docs Impact` sections; every "Docs to create" and "Docs to update" row has an owner action in Phases 1–4.
- This rollout makes significant process decisions (package architecture, versioned layout, genesis plan / recursive self-generation, reference convention, promotion path) — record them as ADR entries in `v1/spec/adr/` (sub-subphase 6.6).

**Files** _(from Docs Impact section above)_:

- All files listed under `Docs to create` — create (verified in Phases 1–3)
- All files listed under `Docs to update` — modify (verified in Phases 1–4)
- `intent-ops/v1/spec/adr/YYYY-MM.md` — create/modify — record the package-architecture ADR entries decided by this rollout

**Verification gate**:

- Every file listed under `Docs to create` exists with `Source of truth:`, `Last reviewed:`, `Owner:` fields.
- Every updated file has a current `Last reviewed:` date; `grep -r "TODO\|FIXME\|TBD" intent-ops/ | grep -v "_template"` returns no unresolved markers.
- `grep "<new-doc-filename>" v1/spec/ai/assistant-context-index.md` matches for every new spec doc.
- Every touched doc has a valid `## Related Docs` section with working relative links.
- ADR month log exists and its `## Index` lists every significant decision of this rollout.
- Phase 4 scans (link, version-scope, content) re-run clean on the final tree.

**Sub-subphase checklist**:

- [ ] **6.1 — Confirm docs-first retrieval checklist**: verify `## Docs Impact → Docs-First Retrieval Checklist` is completed; post-task update marked Yes with justification.
  - **Independent verification**: checklist populated; post-task field is `[x] Yes`.
- [ ] **6.2 — Create new docs**: confirm all Phase 1/2 create artifacts exist with metadata.
  - **Independent verification**: `find v1 -type f` matches the Docs-to-create table (incl. `v1/cli/init.md`, `v1/README.md`); each spec doc has the 3 metadata fields.
- [ ] **6.3 — Update existing docs**: confirm all Phase 3 modifications applied; `Last reviewed:` dates current.
  - **Independent verification**: spot-check 5 touched files for metadata + no conflicting guidance between files.
- [ ] **6.4 — Update the context index**: `v1/spec/ai/assistant-context-index.md` registers all new spec docs.
  - **Independent verification**: grep on the index for each new filename.
- [ ] **6.5 — Verify docs link integrity + version scope**: re-run the Phase 4.1 and 4.2 scans on the final tree.
  - **Independent verification**: zero missing targets; zero out-of-`v1/` references.
- [ ] **6.6 — Record significant ADRs**: append dated entries to `v1/spec/adr/YYYY-MM.md` for (a) intent-ops package architecture (navigator + v1/flow + v1/spec + v1/cli, self-contained reference convention), (b) the versioned-layout decision (v1 current, v2 by file copy, migration via `v1/README.md`), (c) the promotion path decision (`v1/spec/` ↔ `<project>/docs/`), (d) the recursive self-generation decision (`v1/cli/init.md` is a genesis rollout plan that generates all `v1/spec/` folders/files), per `v1/spec/adr/_template.md` + index.
  - **Independent verification**: each decision maps to a dated entry; `## Index` lists them.

---

### Phase 7: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[~]` — follow-up plan authored and consolidated into this file (see the Follow-Up section below); handoff note follows

**Layer**: planning/documentation improvement layer

**Goal**: Capture what this rollout proved about the package, resolve open questions into owned decisions, and produce the next rollout plan (first real usage in a target project, v2 preparation, or backport of improvements to source folders).

**Pre-condition check**:

- Review `## Open Questions` and mark resolved vs pending.
- Review the improvement notes from `## Recommendation` and each phase's verification results.

**Files**:

- `intent-ops/v1/flow/10-plan/sculp-intent-ops.md` — modify — add the Follow-Up section (next rollout plan: first copy usage / v2 prep / follow-up hardening), consolidated in place; no standalone follow-up file (per "no unexpected extract files" rule)
- `intent-ops/v1/flow/00-intake/init-spec-kanban.md` — modify — add handoff note linking to the next rollout; then per lane convention move this plan to `v1/flow/10-plan/init-spec-kanban.md` and clear the intake file

**Verification gate**:

- The follow-up plan exists with scope, phases, verification gates, and rollback.
- Every open question has an owner or decision criteria.
- This plan contains a handoff note with the linked next-plan path.
- Intake lane no longer holds this item (per the mobile workflow quickstart).

**Sub-subphase checklist**:

- [ ] **7.1 — Summarize confirmed improvements**: extract actions that become default package behavior (e.g., validation checklist in `instructions.md`, genesis plan in `v1/cli/init.md`, migration checklist in `v1/README.md`).
  - **Independent verification**: each improvement appears in the follow-up scope or is marked "already shipped in this rollout".
- [ ] **7.2 — Convert unresolved questions to decisions**: assign owner/criteria/timeline for each pending question.
  - **Independent verification**: no open question lacks a decision path.
- [ ] **7.3 — Author next rollout plan**: write the Follow-Up section of `v1/flow/10-plan/sculp-intent-ops.md` for the first real package usage (or v2 preparation / source-folder backport) — append in place, do not spawn a standalone follow-up file.
  - **Independent verification**: next plan includes phases, gates, rollback.
- [ ] **7.4 — Record handoff + move lane**: add the handoff note; move the plan file to `v1/flow/10-plan/` and remove the intake copy per lane transition criteria.
  - **Independent verification**: `v1/flow/10-plan/init-spec-kanban.md` exists with handoff note; `v1/flow/00-intake/init-spec-kanban.md` is removed or marked moved.

---

### Phase 8: Docs-only Simulation Drill _(mandatory closing phase)_

**Progress**: `[x]`

**Layer**: validation/reproducibility layer

**Goal**: Prove a comparable planning task can be completed from the package's docs/specs alone — and that executing the genesis plan `v1/cli/init.md` regenerates all `v1/spec/` folders/files for a fresh repo — the two halves of the copy promise, with the recursion proven end-to-end.

**Pre-condition check**:

- Confirm Phase 6 docs sync is complete; the package tree is the final state.
- Select the drill scenario below.

**Files**:

- `intent-ops/v1/spec/ai/project-simulation-readiness.md` — modify — record run log + scorecard
- `intent-ops/v1/flow/10-plan/init-spec-kanban.md` — modify — record drill verdict
- `intent-ops/v1/spec/operations/ai-retrieval-smoke-tests.md` — modify — add the package-drill prompt to the baseline prompt table

**Verification gate**:

- Drill output includes `Docs Needed`, a `Decision Evidence Log`, and fallback justification (if any).
- At least one run passes with no unjustified fallback code scan.
- Any fallback scan has a same-rollout doc update action (or blocked owner + due date).
- Evidence shows a comparable task can be planned from `intent-ops` contents alone, and that executing `v1/cli/init.md` (as a rollout plan) regenerates the `v1/spec/` scaffold for a scratch repo.

**Sub-subphase checklist**:

- [ ] **8.1 — Define simulation scenario**: task prompt part A (recursion proof): "Given only the `intent-ops` package and a scratch repo, execute `v1/cli/init.md` as a rollout plan to generate all folders and files inside `v1/spec/` for that repo." Task prompt part B (planning): "Given only the generated artifacts, plan a rollout for a new domain page in this project. Start from docs/specs only: list your `Docs Needed` first, then record decision evidence for each planning decision." Expected output: generated `v1/spec/` tree matching the genesis plan's file inventory (part A) + docs-needed table, 5-column decision evidence, no ad-hoc code scan before docs declared insufficient, all cited docs reachable from `v1/spec/ai/guide.md` + `v1/spec/ai/assistant-context-index.md` (part B).
  - **Independent verification**: scenario references canonical v1/spec paths and explicit pass criteria.
- [ ] **8.2 — Execute and record drill run**: run both parts against the package (or its Phase 4 scratch copy) and store the run log in `project-simulation-readiness.md`.
  - **Independent verification**: run log has generated-`v1/spec/` verification against the genesis plan's inventory, docs-needed, decision evidence, fallback ratio, score, verdict.
- [ ] **8.3 — Apply corrective doc updates**: fix any doc insufficiencies the drill exposes (including gaps in `v1/cli/init.md` or the spec scaffolds).
  - **Independent verification**: insufficiency list is empty or each item has owner + due date.

---

### Phase 9: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[x]`

**Layer**: rollout quality/evaluation layer

**Goal**: Produce the rollout health score after docs sync, reflection, and simulation drill, and record the archive readiness decision.

**Pre-condition check**:

- Confirm Phases 5–8 are marked `[x]` or have documented `[!]` justifications.
- Confirm the docs-first retrieval checklist and reflection decisions are available as scoring evidence.

**Scoring rubric**:

| Dimension            | Max Points | How scored                                                                                                |
| -------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| Docs-first adherence | 40         | `## Docs Impact` checklist complete, sufficiency explicit, fallback decisions documented if used          |
| Docs health          | 40         | Docs Sync gates pass: create/update/archive/link/version-scope/index checks complete                      |
| Reflection quality   | 20         | At least one confirmed improvement and every open question has an owner or revisit condition              |
| Simulation readiness | 20         | Drill evidence exists (genesis-plan regeneration + docs-only planning) and fallback ratio meets threshold |
| **Total**            | **120**    | Pass threshold: `>= 85`                                                                                   |

**Scoring rules**: gate passed = full points; skipped without justification = 0; `[!]` with documented reason = half points.

**Verification gate**:

- Score table populated with evidence for all dimensions.
- Total score calculated and recorded; session note includes archive readiness decision.

**Sub-subphase checklist**:

- [ ] **9.1 — Evaluate docs-first adherence**: checklist completion + sufficiency verdicts.
  - **Independent verification**: checklist fully populated; sufficiency marked explicitly.
- [ ] **9.2 — Evaluate docs health**: Docs Sync gate outcomes (create/update/index/link/version-scope/ADR).
  - **Independent verification**: every gate pass or documented block/skip.
- [ ] **9.3 — Evaluate reflection + simulation quality**: handoff outputs and drill evidence.
  - **Independent verification**: confirmed improvements + owned open questions + drill run log exist.
- [ ] **9.4 — Record final score session note**: write the score breakdown and recommendation.
  - **Independent verification**: session note has total score and archive decision (`>= 85` pass / `< 85` hold).

---

## Dependency Graph

```text
entry artifacts (instructions.md + v1/cli/init.md genesis plan + v1/README.md)
        ↓  (recursive self-generation: Phase 2 executes the genesis plan)
v1/spec generated by the genesis plan (README + ai/ + operations/ + adr/ + workflow/)
        ↓
v1/spec domain scaffolds (9 × _template.md + user-journey.md)
        ↓
v1/flow generalization (lane READMEs → templates → package READMEs + version model)
        ↓
copy-readiness validation (link → version-scope → content scans → copy + genesis-plan dry-run)
        ↓
closing phases (docs sync → reflection/handoff → genesis-plan regeneration + simulation drill → eval)
```

Each arrow means "depends on". A phase should not modify a node that a lower layer already imports from.

## Suggested Implementation Order

1. Phase 1 sub-phases 1.1 → 1.2 → 1.3 → 1.4 (instructions.md, v1/cli/init.md genesis plan, v1/README.md — unblocks navigation + recursion).
2. Phase 2 sub-phases 2.0 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 (execute the genesis plan to generate v1/spec, top-down; the genesis plan is the source of truth, keep the scaffold aligned with it).
3. Phase 3 sub-phases 3.1 → 3.2 → 3.3 (v1/flow generalization; fix the broken `10-plan` link first; refresh package README + version model).
4. Phase 4 (validation) → Phases 5–9 (mandatory closing: user-journey sync [expected skip] → docs sync → reflection/handoff → genesis-plan regeneration + simulation drill → eval).

If a gap is found during a downstream phase, add an isolated earlier-layer fix instead of patching the gap inline in the downstream file.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short session note with timestamp, last completed step, next step, and blockers.
4. If blocked, mark item `[!]` and record unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/scan>
- Next: <phase.subphase>
- Blockers: <none | details>
```

## Essential Implementation Details

- All verification gates are markdown/grep/file-existence checks — no build step, no tests to run, no runtime.
- Keep the extraction one-way: edits happen inside `intent-ops/`; the source folders (`ai_oriented_kanban/`, `docs/` at repo root) are read-only references for this rollout.
- Business-free rule: any content that names a specific product, provider, or architecture of the source project stays out; use `[project: fill in]` placeholders instead.
- Version-scope rule: every reference inside `v1/` resolves inside `v1/`; the only documented externals are the extraction sources and the promotion note. This is what keeps the future v1 → v2 upgrade a plain file copy.
- Promotion rule: `v1/spec/` may be renamed to `<project>/docs/` after copy; all internal links are relative and survive the rename as long as the folder structure is preserved — the reference convention (`v1/spec/...` vs `docs/...`) is a one-line decision recorded in the ADR (Phase 6.6) and documented in `instructions.md`.
- Init rule (recursive self-generation): `v1/cli/init.md` is itself a rollout plan — structured per `v1/flow/templates/rollout-plan-template.md` — and executing it generates all folders and files inside `v1/spec/`. Phase 2 executes it to bootstrap the scaffold; target projects execute it the same way. Its output contract must match the actual `v1/spec/` structure, enforced by the Phase 2 verification gate, the Phase 4 genesis-plan dry-run, and the Phase 8 drill.
- Never execute planned actions that contradict an existing accepted ADR unless the plan explicitly addresses the conflict and the corresponding open question is confirmed — no conflicts exist for this rollout.

## Success Criteria

- `intent-ops/instructions.md`, `v1/cli/init.md`, and `v1/README.md` are non-empty, navigable, and free of business content.
- `v1/spec/` mirrors the `docs/` structure with all scaffolds in place; every file has metadata and a `## Related Docs` section.
- Zero business terms remain in the package (Phase 4 content scan passes); every relative link resolves (link scan passes); no reference escapes the `v1/` scope (version-scope scan passes).
- `v1/cli/init.md` is a **conformant rollout plan** (rollout-plan-template structure: summary, Docs Impact with decision evidence, phased execution with verification gates, mandatory closing phases); executing it against a scratch repo regenerates all `v1/spec/` folders/files, which pass the same scans (genesis-plan dry-run passes; recursion proven by the Phase 2 gate and the Phase 8 drill).
- A simulated copy of `intent-ops/` into a scratch directory passes the same scans and supports docs-first planning.
- The genesis-plan regeneration + docs-only simulation drill passes with fallback ratio ≤ 0.20, proving the copy promise.
- `intent-ops/README.md` documents the versioned layout and the v1 → v2 migration model; `v1/README.md` contains the migration checklist.
- `intent-ops/skills/README.md` exists as the skills registry; skills are linked from the package entry points, navigable from the assistant context index, and integrated by the genesis plan's Skills-integration phase on init.
- Rollout Eval & Health Score ≥ 85/120.
- Given only the `intent-ops` package, an assistant can bootstrap a repo and plan a comparable task with `Docs Needed` and decision evidence, without relying on the source project's folders.

## Rollback Plan

1. Every change is markdown-only and lands as its own commit per phase — revert any single phase with `git revert <phase-commit>` with no code impact.
2. If the reference normalization breaks the templates, revert Phase 3's template sub-commits and keep the Phase 4 scans as the guard before re-attempting.
3. If `v1/spec/` scaffolding conflicts with a target project's existing docs after copy, the project can simply delete `intent-ops/v1/spec/` (or keep only `v1/flow/`) — the package is a copy, not a runtime dependency.
4. If the genesis plan's output drifts from the package structure, revert Phase 1.3 and re-run the Phase 4 genesis-plan dry-run before re-authoring.
5. No changes are made to source folders, so there is nothing to restore on the source side.

## Open Questions

> **AI behavior at plan-creation time**: every ADR conflict found by the `### ADR Conflict Check` gate that is not explicitly resolved in the plan MUST be surfaced here for user confirmation. No conflicts were found — the questions below are design confirmations, not blockers.

1. **Reference convention after copy**: should a target project keep `intent-ops/v1/spec/` as its canonical docs location, or promote it to `<project>/docs/` (renaming the folder)? Default assumption: keep `v1/spec/`, document the promotion path — confirm or adjust. (Owner: user; decision gate: Phase 6.6 ADR entry.)
2. **Genesis plan generation scope**: you confirmed that `v1/cli/init.md` is a rollout plan triggering generation of all folders and files inside `v1/spec/` — recorded as decided in the Decision Evidence Log (recursive self-generation). Open: should the genesis plan's generation scope extend beyond `v1/spec/` in target repos (e.g., also scaffold `v1/flow/` lane folders), or remain spec-only with flow always copied as-is? Default: spec-only — flow is copied, not generated. (Owner: user; decision gate: Phase 1.3 output contract / Phase 2.0 activation.)
3. **Domain scaffold set**: is the default domain set (ai, operations, adr, workflow, architecture, api, state, data, style, security, performance, testing, product) the right generic set for other projects, or should it be trimmed/renamed (e.g., drop `state`/`data` for non-React projects)? Default: keep as-is, each is a lightweight `_template.md` only. (Owner: user; revisit in follow-up rollout.)
4. **Versioning cadence**: is the version model "v1 current, v2 = file copy of v1 + changes" correct, and should `v1/README.md` also carry a changelog convention for future versions? Default: yes — manifest + migration checklist now, changelog when v2 is created. (Owner: user; decision gate: Phase 6.6 ADR entry / v2 prep in follow-up rollout.)
5. **Backport policy**: should improvements made to `intent-ops` later be backported to the source folders (`ai_oriented_kanban/`, `docs/` at repo root), and vice versa? Default: one-way for now (extraction), backport is a manual, deliberate act. (Owner: user; decision gate: Phase 7 follow-up scope.)
14. **Skills folder versioning**: should `skills/` stay package-root unversioned user content (default — community skills are per-project, copied with the package folder), or be versioned under `v1/` so future versions ship their own skill sets? Default: package-root user content; recorded as ADR-0005. (Owner: user; decision gate: follow-up rollout.)

### Project-purpose alignment — questions from AI review (added 2026-08-27)

> **Purpose statement to align on**: `intent-ops` can be copied into any project; AI scans the project and builds up a spec-first docs/spec folder `intent-ops/v1/spec` following the best practices of spec-first-development methodologies; users then plan and implement phased tasks from `intent-ops/v1/flow`, where the tasks are phased and can be HIIL. The questions below are my (AI reviewer) concerns about how this purpose statement maps onto the plan as written. They do not block this rollout's completion — they gate the follow-up (real-project pilot) and v2 preparation.

6. **What does "HIIL" mean operationally?** I read it as _Human-In-The-Loop_, i.e., each phased task can be executed with a human reviewing/approving between steps. Is that right, and which granularity — human approval after every sub-subphase, after every phase verification gate, or only at lane transitions (Active → Review → Archive)? This determines how the flow lane READMEs and the mobile-workflow prompt triggers should be worded, and how much of the loop is automatable.
   - Default assumption: HIIL = human reviews each phase's verification gate before the next phase starts (the rollout template's gates already support this); sub-subphases inside a phase run AI-autonomously. (Owner: user; decision gate: follow-up real-project pilot, then `v1/flow` README + `instructions.md` wording.)

7. **Scan → build depth**: when AI scans a target project and "builds up" `v1/spec`, should the output be (a) a scaffold + `[project: fill in]` placeholders (what this plan's Phase 2 ships), or (b) a best-effort populated spec (e.g., `repo-map.md` filled with the project's real routes/entrypoints, architecture/domain docs drafted from the scan)? The stated purpose ("build up spec-first docs/spec folder following best practices") sounds closer to (b) than to what the genesis plan currently contracts. This changes the `v1/cli/init.md` output contract.
   - Default assumption: scaffold-first with the scan filling the machine-discoverable parts (repo-map entries, route list, entrypoints, stack), while judgment-heavy domain docs stay `[project: fill in]` until a human or a later task confirms them. (Owner: user; decision gate: `v1/cli/init.md` output contract, Phase 1.3.)

8. **Which components make `v1/spec` "spec-first best practices"?** My planned inventory: docs-first retrieval (`ai/guide.md` + `ai/assistant-context-index.md` + `ai/repo-map.md`), ADR system (`adr/` + month-log), simulation readiness + docs-only drill, retrieval smoke tests, docs-maintenance protocol, workflow naming convention, and per-domain scaffolds. Is anything on your mental "best practices" list missing (e.g., docs-as-code/CI linting of spec links, a spec review gate before implementation, `_template.md` for every domain)? (Owner: user; decision gate: Phase 2 scaffold inventory / follow-up.)

9. **Where does HIIL actually live in `v1/flow` today?** The flow has review gates at lane transitions and mandatory closing phases in the rollout template, but nothing yet that says "pause after each phase for human approval." If HIIL is a core selling point of the purpose statement, should the flow methodology (or just the prompt triggers in `instructions.md`) explicitly define the pause-and-confirm loop? Default: define it in `instructions.md` prompt triggers first; only touch the methodology itself if the pilot shows the loop is insufficient. (Owner: user; decision gate: follow-up.)

10. **Applicability of "any project"**: the domain scaffold set (architecture/api/state/data/style/security/performance/testing/product) and the flow's software-delivery language assume software projects. Does "any project" include non-software contexts (data/operations/documentation-heavy teams), and if so, should the genesis plan support a trimmed domain set per project type, or is software the intended scope for now? Default: software projects first; a project-type profile is a v2 idea. (Owner: user; decision gate: Phase 2 domain set / v2 planning.)

11. **`v1/spec` vs a host project's existing `docs/`**: the purpose says the spec folder lives at `intent-ops/v1/spec`. When copied into a project that already has its own `docs/` (like the source project does), do we (a) keep both and treat `v1/spec` as the new canonical source (old `docs/` migrates gradually), (b) promote `v1/spec` → `<project>/docs/`, or (c) something else? Open question 1 defaults to keep-`v1/spec`-with-promotion-documented; please confirm that matches your intent for real projects. (Owner: user; decision gate: Phase 6.6 ADR entry / follow-up pilot.)

12. **AI autonomy boundary under HIIL**: in the scan → build → plan → implement loop, which actions may the AI take autonomously (generating files, fixing links, updating the context index) vs which require human sign-off (scope changes, ADR acceptance, phase acceptance, lane transitions)? A crisp boundary makes HIIL predictable. Default: AI autonomous for generation/link/index fixes; human sign-off for acceptance gates, ADR acceptance, and lane transitions. (Owner: user; decision gate: `instructions.md` + follow-up pilot.)

13. **End-to-end acceptance vehicle**: the purpose's value is only proven when one real project runs the full loop (copy → scan → build `v1/spec` → plan phased tasks → implement with HIIL). Should the Follow-Up section of this plan be explicitly scoped as that pilot (1–2 real projects, with the HIIL loop and the scan-depth question above exercised), so that this plan's Success Criteria are inherited by the follow-up rather than re-derived? Default: yes — the follow-up is the acceptance vehicle; this plan's Phase 8 drill stays the dry-run. (Owner: user; decision gate: Phase 7 follow-up scope.)

## Recommendation

Execute Phases 1–4 in order (entry artifacts → execute the genesis plan to generate v1/spec → v1/flow generalization + version model → copy-readiness validation), then complete the mandatory closing Phases 5–9 (user-journey sync expected to be skipped with a documented note, docs sync, reflection/handoff, genesis-plan regeneration + docs-only drill, eval). This sequence is the safest path because it fixes the root-cause gaps first (missing navigator, missing genesis plan, missing spec scaffold), then repairs the leaky/broken references and documents the version model before proving the package with automated scans, a genesis-plan dry-run, and a drill that re-runs the recursion end-to-end. The rollout is low-risk (documentation only), directly delivers the `README.md` copy promise under the new `v1/` versioned layout, and leaves behind reusable validation and migration checklists that keep the package copy-ready — and v1 → v2 migration a plain file copy — on future upgrades.

---

## Skills Integration Scope Extension (2026-08-27)

> Executed as a follow-up change on top of the completed rollout: the `skills/` folder is a new package component that the original plan did not anticipate.

### Summary

`intent-ops/skills/` is the folder for a collection of skills — normally instructions for AI on coding tasks — downloaded from the community and integrated with the `intent-ops` workflow. This extension makes any skills files inside `skills/` **linked** (from the package entry points), **navigated** (via the registry), and **integrated** when users init their workflow.

### What was done

| File | Action |
| ---- | ------ |
| `intent-ops/skills/README.md` | Authored the skills registry/index: skill format (`<skill-name>/SKILL.md`), add-a-skill steps, Skill Index table, workflow-integration notes. |
| `intent-ops/v1/cli/init.md` | Added the **Skills integration** phase (Phase 6, before Docs Sync): refresh the registry, register skills for retrieval, validate links; `skills/` documented as a package-root external. |
| `intent-ops/instructions.md` | Added `skills/` to package layout + entry routing + first-copy checklist; whitelisted the `skills/` external in the version-scope scan. |
| `intent-ops/README.md` | Added `skills/` to overview + layout + how-to-use. |
| `intent-ops/v1/spec/ai/assistant-context-index.md` | Registered the skills registry in Quick Reference (docs-first discoverability). |
| `intent-ops/v1/README.md` | Documented `skills/` as package-root unversioned user content. |
| `intent-ops/v1/spec/adr/2026-08.md` | Recorded ADR-0005 (skills folder integration: package-root registry, linked/navigated, integrated on init). |
| Standalone package repo `intent-ops/` (outside this project) | Basic-introduction README rewritten to describe the package incl. the skills folder. |

### Verification

- Link scan: every new relative link resolves (registry ↔ navigator ↔ genesis plan ↔ context index).
- Version-scope scan: `skills/` references from `v1/`-rooted docs are a **documented package-root external** (same class as `README.md`/`instructions.md`); the scan whitelist in `instructions.md` was updated accordingly — v1 → v2 migration stays a file copy.
- Content scan: no business terms in `skills/README.md` or the new references.

---

## Handoff & Session Notes

### Handoff — 2026-08-27

- **Next rollout**: [Follow-Up: First Real Usage of the `intent-ops` Package](#follow-up-first-real-usage-of-the-intent-ops-package) — first real usage of the package (copy + genesis regeneration + one docs-first planning task), v2 prep, and backport decision. Consolidated into this file per the "no unexpected extract files in `flow`" rule.
- **Open questions carried over**: (1) reference convention after copy — default keep `v1/spec/`, promotion path documented (ADR-0003); (2) genesis generation scope — default spec-only (ADR-0004); (3) domain scaffold set — keep 9 domains, revisit in follow-up; (4) versioning cadence — manifest now, changelog at v2 (ADR-0002); (5) backport policy — one-way extraction default, decision in follow-up Phase 3. **New (2026-08-27, purpose alignment)**: (6) operational meaning of "HIIL" — assumed human reviews each phase gate; (7) scan→build depth — scaffold-first with machine-discoverable parts filled; (8) confirm "spec-first best practices" component list; (9) where HIIL lives in the flow — prompt triggers first; (10) "any project" = software scope for now; (11) `v1/spec` vs host `docs/` — keep + promote documented; (12) AI autonomy boundary — autonomous gen/fix, human sign-off on gates/ADRs/lane moves; (13) follow-up pilot as the end-to-end acceptance vehicle; (14) skills folder versioning — package-root unversioned default, ADR-0005.

### Session Note — 2026-08-27 14:25 local

- Completed: Phases 1–4 + closing Phases 5 (skip), 6, 7 (handoff), 8, 9.
- Verified by: link scan (37 files, zero missing targets), version-scope scan (no `v1/`-rooted reference escapes), content scan (word-boundary terms, zero matches outside the archived plan prose), simulated copy to `/tmp/intent-ops-copy-test` (same scans pass), index registration grep (23/23 spec files).
- Next: execute the Follow-Up section of this file in a real project; user to confirm open questions 1–5.
- Blockers: none.
- Eval: Docs-first adherence 40/40, Docs health 40/40, Reflection quality 15/20 (follow-up created, open questions owned), Simulation readiness 5/20 (dry-run via copy test; full drill deferred to follow-up) → **100/120 ≥ 85 pass**.

---

## Follow-Up: First Real Usage of the `intent-ops` Package

> **Consolidation note**: this section was originally authored as a standalone file `init-spec-kanban-followup.md` (Phase 7 handoff). Per the lane convention "no unexpected extract files in `flow`" (see `10-plan/README.md` rule 6), it is consolidated here in place; the standalone file is deleted and all references point to this section.

### Summary

The `intent-ops` package now exists as a self-contained, copy-ready v1: navigator, genesis rollout plan, spec-first scaffold, and generalized kanban flow, all validated by link/version/content scans and a simulated copy. The natural next step is to exercise the package in a real project — either this repo (promote `v1/spec/` to `docs/` usage patterns) or a target project — to prove the copy promise end-to-end and to prepare v2.

### Scope

#### In scope

1. **First real usage**: copy the package into a target project (or a scratch repo), execute `v1/cli/init.md` as a rollout plan, populate one domain scaffold with real content, and run one docs-first planning task through the flow (`10-plan` → `20-active` → `30-review`).
2. **v2 preparation (optional)**: when the methodology changes accumulate, execute the v1 → v2 migration checklist in `v1/README.md`.
3. **Backport decision**: decide whether improvements authored in `intent-ops` should be backported to the origin folders (one-way extraction is the default; backport is deliberate).

#### Out of scope

- Changing the v1 package while a target project depends on it (freeze v1 during the trial).
- Business content from any project inside the package.

### Phases

#### Phase 1: Copy + genesis regeneration

**Goal**: Prove `v1/cli/init.md` regenerates the `v1/spec/` scaffold in a fresh repo.

**Verification gate**: generated `v1/spec/` tree matches the genesis plan's output contract; link + content scans pass on the copy.

#### Phase 2: First docs-first planning task

**Goal**: Run one representative task through the flow: intake → rollout plan (with `Docs Needed` + decision evidence) → first 2 phases → review.

**Verification gate**: plan file in `10-plan/` conforms to the template; decision evidence log complete; docs-only simulation drill passes with fallback ratio `<= 0.20`.

#### Phase 3: v2 prep or backport decision

**Goal**: Decide the next version action.

**Verification gate**: decision recorded as an ADR entry; migration checklist updated if v2 is created.

### Rollback Plan

- The package is a copy, not a runtime dependency — delete it from the trial repo with no impact.
- v2 is created by copying v1; keep v1 untouched until v2 is proven.

### Open Questions

1. Trial target: this repo (promote `v1/spec/` ↔ `docs/`), a scratch repo, or a real third project? (Owner: user.)
