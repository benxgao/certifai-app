# Rollout: Certifai App AI-Ready Documentation MVP

## Summary

`certifai-app` already has useful documentation (`README.md`, `docs/`, `styleguide/`, and AI kanban artifacts), but the information is distributed and not optimized for assistant-first retrieval. The immediate goal is to introduce a small, stable, machine-friendly documentation skeleton that AI assistants can use for high-quality context assembly.

This rollout starts with an MVP that prioritizes fast usefulness over full docs-platform setup. We will create a compact layered structure, define a canonical repo map and conventions index, and wire references from Copilot instructions so agents can locate project overview, constraints, and style rules with minimal prompt overhead.

## Current Evaluation

### What already exists

- Root-level onboarding in `README.md` and docs in `docs/` (flat, topic-named files).
- Style and UI conventions in `styleguide/app.md`, `styleguide/shared.md`, `styleguide/marketing.md`.
- Copilot behavior rules in `.github/copilot-instructions.md`.
- Next.js 15 App Router pages under `app/` with layouts, loading states, and templates.
- Authenticated section at `app/main/` (certifications, exams, billing, profile, stripe callback).
- Next.js API routes for auth, auth-cookie, demo, marketing, and public certifications under `app/api/`.
- JWT middleware protecting `/main/*` in `middleware.proxy.ts` using `src/lib/auth-*.ts` and `src/lib/jwt-utils.ts`.
- SWR data-fetching layer: 18 hook files in `src/swr/` (certifications, exams, questions, profile, firms, etc.).
- Matching typed response interfaces in `src/types/swr-data/` (one type file per hook file).
- Base `ApiResponse<T>` type in `src/types/api.ts`; exam status enum in `src/types/exam-status.ts`.
- Client fetch utilities in `src/lib/client-fetch.ts`, `src/lib/fetch-config.ts`, `src/lib/api-utils.ts`.
- React Context providers in `src/context/` (FirebaseAuthContext, UserProfileContext, UserCertificationsContext, ExamStatsContext).
- Local custom hooks in `src/hooks/` (useExamPageLogic, useProfileData, useSigninHooks, useOptimizedForm, etc.).
- Firebase setup in `src/firebase/` (firebaseWebConfig, firebaseAdminConfig, verifyTokenByAdmin).
- shadcn/ui primitives in `src/components/ui/`; domain components in `src/components/custom/`, `/auth/`, `/billing/`, `/analytics/`.
- Utility helpers in `src/lib/` (input-validation, pagination-utils, rate-limiting, consent, etc.).
- Unit tests in `__tests__/` (6 files); E2E tests in `e2e/` (Playwright).

### What is not centralized / stable / complete yet

#### 1. AI-retrieval context is fragmented

- Overview, architecture, style, and testing guidance are spread across multiple locations with no canonical index.
- Copilot instructions define behavior rules but do not point to a machine-friendly repo map and doc index.

Representative files:

- `.github/copilot-instructions.md`
- `README.md`
- `docs/`
- `styleguide/`

#### 2. No explicit MVP documentation contract for phased growth

- There is no clear "MVP now, hardening later" structure with ownership and verification gates.
- Documentation changes are not consistently tied to PR-level impact checks.

Representative files:

- `src/swr/` — hooks undocumented beyond inline comments
- `src/types/swr-data/` — types not linked to API contract docs
- `app/` — page routing not documented for onboarding or AI retrieval

### Risks in the current state

- [ ] AI assistants pull incomplete context, causing inconsistent code suggestions.
- [ ] Onboarding quality varies by which doc a contributor reads first.
- [ ] Documentation drift increases as features evolve without a clear source hierarchy.

## Scope

- Estimated files to create: ~30 (10 section templates + domain docs + AI/ops/ADR files)
- Estimated files to modify: 2
- Risk level: Low

### In scope

Ten documentation domains, each with a `_template.md` so AI assistants can add new domain files consistently:

| #   | Domain           | Scope                                                                            |
| --- | ---------------- | -------------------------------------------------------------------------------- |
| 02  | **Architecture** | Next.js App Router conventions, system context, module boundaries                |
| 04  | **API**          | `ApiResponse<T>` envelope, auth headers, endpoint naming, error handling         |
| 05  | **State**        | SWR as state layer, auth state, local/server state boundaries                    |
| 06  | **Data**         | Frontend data models, `src/types/swr-data/`, Prisma type usage on client         |
| 07  | **Style**        | Tailwind, shadcn/ui, `cn()`, dark mode, spacing/typography conventions           |
| 08  | **Security**     | Firebase Auth flow, JWT handling, protected routes, middleware rules             |
| 09  | **Performance**  | SWR caching config, Next.js caching, lazy loading, bundle hints                  |
| 10  | **Testing**      | Unit (`__tests__/`), E2E (Playwright `e2e/`), fixture patterns, coverage targets |
| 11  | **AI**           | Repo map, assistant context index, invariants, dangerous areas                   |
| 03  | **ADR**          | Architecture decision record template and log                                    |

Also in scope:

- `_template.md` in every section directory — ensures AI and humans follow consistent structure when adding new domain files.
- Link canonical docs from `.github/copilot-instructions.md` and `README.md`.
- Lightweight PR docs-impact checklist.

### Out of scope

- `ai_oriented_kanban/` — this is an independent planning workflow system, not part of the doc structure.
- Full MkDocs/Docusaurus deployment.
- Automated OpenAPI/Terraform doc generation pipelines.
- Search infrastructure (Algolia/MkDocs Insiders) and deep analytics.

## Minimum Viable Hotfix

- Phase 1 + Phase 2 are the MVP hotfix path.
- These phases are safe/minimal because they only add documentation structure and instruction links, with no runtime code or API behavior changes.

## Context Map

### Files to modify first

| File                              | Purpose                                       | Why it matters                                          |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `.github/copilot-instructions.md` | Add canonical documentation reference section | Makes assistant context loading consistent and explicit |
| `README.md`                       | Add short "Documentation Map" section         | Gives contributors and AI a single jumping-off point    |

### Likely files to create

Full directory tree of all files this rollout will produce:

```
docs/
├── product/
│   ├── _template.md
│   └── glossary.md
├── architecture/
│   ├── _template.md
│   └── nextjs-conventions.md       # app/ layout, routing, loading, template.tsx, middleware
├── adr/
│   ├── _template.md
│   └── 0001-docs-architecture-mvp.md
├── api/
│   ├── _template.md
│   ├── api-connection.md           # src/types/api.ts, src/lib/client-fetch.ts, fetch-config.ts, api-utils.ts
│   └── swr-patterns.md             # src/swr/useAuthSWR.ts, useAuthMutation.ts, utils.ts + 14 domain hooks
├── state/
│   ├── _template.md
│   └── client-state.md             # src/context/ (FirebaseAuthContext, UserProfileContext, UserCertificationsContext, ExamStatsContext)
├── data/
│   ├── _template.md
│   └── data-models.md              # src/types/swr-data/ (16 type files), src/types/exam-status.ts
├── style/
│   ├── _template.md
│   └── conventions.md              # styleguide/app.md, styleguide/shared.md, src/components/ui/, cn() usage
├── security/
│   ├── _template.md
│   └── auth-patterns.md            # middleware.proxy.ts, src/lib/auth-*.ts, src/lib/jwt-utils.ts, app/api/auth*/
├── performance/
│   ├── _template.md
│   └── patterns.md                 # SWR caching, src/lib/rate-limiting.ts, src/hooks/useOptimized*.ts
├── testing/
│   ├── _template.md
│   └── strategy.md                 # __tests__/ (6 unit files), e2e/ (Playwright), setup.ts
├── ai/
│   ├── _template.md
│   ├── repo-map.md
│   └── assistant-context-index.md
└── operations/
    ├── _template.md
    └── docs-maintenance.md
.github/
└── pull_request_template.md
```

### Dependencies / related patterns

| Source path                                                                                                                                                                                                                                                                                 | Feeds into                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `styleguide/app.md`, `styleguide/shared.md`, `styleguide/marketing.md`                                                                                                                                                                                                                      | `docs/style/conventions.md`               |
| `src/types/api.ts`                                                                                                                                                                                                                                                                          | `docs/api/api-connection.md`              |
| `src/lib/client-fetch.ts`, `src/lib/fetch-config.ts`, `src/lib/api-utils.ts`                                                                                                                                                                                                                | `docs/api/api-connection.md`              |
| `src/swr/useAuthSWR.ts`, `src/swr/useAuthMutation.ts`, `src/swr/utils.ts`                                                                                                                                                                                                                   | `docs/api/swr-patterns.md`                |
| `src/swr/certifications.ts`, `exams.ts`, `questions.ts`, `profile.ts`, `firms.ts`, `examReport.ts`, `examInfo.ts`, `certSummary.ts`, `createExam.ts`, `deleteAccount.ts`, `rateLimitInfo.ts`, `useAllData.ts`, `useExamGeneratingProgress.ts`, `useExamLiveStatus.ts`, `demoCredentials.ts` | `docs/api/swr-patterns.md`                |
| `src/types/swr-data/` (16 type files), `src/types/exam-status.ts`                                                                                                                                                                                                                           | `docs/data/data-models.md`                |
| `src/context/FirebaseAuthContext.tsx`, `UserProfileContext.tsx`, `UserCertificationsContext.tsx`, `ExamStatsContext.tsx`                                                                                                                                                                    | `docs/state/client-state.md`              |
| `middleware.proxy.ts`, `src/lib/auth-*.ts`, `src/lib/jwt-utils.ts`, `src/firebase/verifyTokenByAdmin.ts`                                                                                                                                                                                    | `docs/security/auth-patterns.md`          |
| `app/api/auth/`, `app/api/auth-cookie/`                                                                                                                                                                                                                                                     | `docs/security/auth-patterns.md`          |
| `app/` (layout.tsx, loading.tsx, template.tsx, page routing)                                                                                                                                                                                                                                | `docs/architecture/nextjs-conventions.md` |
| `app/main/` (certifications, exams, billing, profile, stripe)                                                                                                                                                                                                                               | `docs/architecture/nextjs-conventions.md` |
| `src/lib/rate-limiting.ts`, `src/hooks/useOptimizedForm.ts`, `useOptimizedRateLimit.ts`, `useOptimizedScroll.ts`                                                                                                                                                                            | `docs/performance/patterns.md`            |
| `__tests__/` (6 unit test files), `e2e/` (Playwright), `__tests__/setup.ts`                                                                                                                                                                                                                 | `docs/testing/strategy.md`                |

### Risks

- [ ] Over-documenting too early and losing momentum.
- [ ] Introducing duplicate guidance that conflicts with existing README/style docs.

## Recommended Architecture

### Principle 1: AI-first entrypoint, human-friendly depth

Create one canonical AI index (`docs/ai/assistant-context-index.md`) that points to deeper docs, rather than duplicating long-form content.

### Principle 2: Layered growth with strict SSOT boundaries

Use a numbered 12-section layout covering all domains but only populate one high-value MVP file per section first. Every document must declare its source-of-truth (code path, config, or policy file).

### Principle 3: Template-enforced consistency

Each section directory contains a `_template.md` that defines the required headings, metadata fields, and SSOT declaration for that domain. When AI assistants or contributors add new files, they must copy and fill the section's `_template.md`. This prevents free-form drift and makes new docs machine-retrievable by consistent heading patterns.

Template anatomy (all sections share this skeleton, with domain-specific heading sets):

```markdown
# <Title>

> **Source of truth**: `<path/to/source/file.ts>`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: <team or role>

## Purpose

## Key Concepts

## Conventions / Rules

## Examples

## Dangerous Areas / Anti-patterns

## Related Docs
```

## Dependency Rule

> **Each phase must touch exactly one dependency layer unless the user explicitly asks for a looser plan.**

Dependency chain for this rollout:

1. Docs structure and AI docs (`docs/`)
2. Instruction references (`.github/copilot-instructions.md`, `README.md`)
3. Governance checks (`.github/pull_request_template.md`, operations docs)

Mixing these in one phase increases review risk because structure/content quality, instruction wiring, and governance policy each need different verification lenses.

## Phase Sequencing Rule

> **Default sequencing: root-cause fix → data recovery/backfill → contract hardening → UX/message polish → tests.**

Adapted for documentation rollout:

1. Root-cause fix = fragmented AI context (create canonical docs)
2. Contract hardening = ensure instructions and README link to canonical docs
3. Governance/testing = PR checklist + doc freshness checks

## Commit Slicing Rule

> **A phase may be split into sub-subphases when the file count, review surface, or QA burden is too large for one safe commit.**

### Rules for sub-subphases

- Each sub-subphase should be independently reviewable and revertible.
- Each sub-subphase should end with a local verification step.
- If a missing prerequisite appears, add or revise an earlier-layer sub-subphase instead of patching around it downstream.
- Do not split a phase in a way that creates temporary broken links between docs and references.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 1 — Establish AI docs skeleton
- [x] Phase 2 — Wire canonical links in instructions and README
- [x] Phase 3 — Add governance and freshness checks
- [x] Phase 4 — AI assistant guide, docs-aware planning template, and docs-sync enforcement

## Phases

### Phase 1: Establish AI docs skeleton

**Progress**: `[x]`

**Goal**: Create the minimum documentation set that lets assistants quickly understand project overview, boundaries, style sources, and testing strategy.

**Files** — section templates (commit 1 of Phase 1):

- `docs/product/_template.md` — create
- `docs/architecture/_template.md` — create
- `docs/adr/_template.md` — create (MADR-format skeleton)
- `docs/api/_template.md` — create
- `docs/state/_template.md` — create
- `docs/data/_template.md` — create
- `docs/style/_template.md` — create
- `docs/security/_template.md` — create
- `docs/performance/_template.md` — create
- `docs/testing/_template.md` — create
- `docs/ai/_template.md` — create
- `docs/operations/_template.md` — create

**Files** — MVP domain docs (commits 2–8 of Phase 1, one commit per sub-subphase 1.2–1.8):

| Sub-subphase | File                                      | Source of truth                                                                                                          |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1.2          | `docs/ai/repo-map.md`                     | `app/`, `middleware.proxy.ts`, `src/swr/`, `src/context/`                                                                |
| 1.2          | `docs/ai/assistant-context-index.md`      | All `docs/` sections (generated index)                                                                                   |
| 1.3          | `docs/product/glossary.md`                | Domain terms from `src/types/`, `app/main/`, `src/swr/`                                                                  |
| 1.3          | `docs/adr/0001-docs-architecture-mvp.md`  | This rollout plan                                                                                                        |
| 1.4          | `docs/architecture/nextjs-conventions.md` | `app/layout.tsx`, `app/main/layout.tsx`, `app/main/certifications/`                                                      |
| 1.5          | `docs/api/api-connection.md`              | `src/types/api.ts`, `src/lib/client-fetch.ts`, `src/lib/fetch-config.ts`                                                 |
| 1.5          | `docs/api/swr-patterns.md`                | `src/swr/useAuthSWR.ts`, `src/swr/useAuthMutation.ts`, `src/swr/utils.ts`                                                |
| 1.6          | `docs/state/client-state.md`              | `src/context/FirebaseAuthContext.tsx`, `UserProfileContext.tsx`, `UserCertificationsContext.tsx`, `ExamStatsContext.tsx` |
| 1.6          | `docs/data/data-models.md`                | `src/types/swr-data/` (16 files), `src/types/exam-status.ts`                                                             |
| 1.7          | `docs/style/conventions.md`               | `styleguide/app.md`, `styleguide/shared.md`, `src/components/ui/`                                                        |
| 1.7          | `docs/security/auth-patterns.md`          | `middleware.proxy.ts`, `src/lib/auth-state-manager.ts`, `src/lib/jwt-utils.ts`, `app/api/auth-cookie/`                   |
| 1.8          | `docs/performance/patterns.md`            | `src/lib/rate-limiting.ts`, `src/hooks/useOptimized*.ts`, SWR config                                                     |
| 1.8          | `docs/testing/strategy.md`                | `__tests__/` (6 files), `e2e/`, `__tests__/setup.ts`                                                                     |

**Verification gate** (must pass before Phase 2 starts):

- All section `_template.md` files exist: `ls docs/*/_template.md` shows 12 files.
- All domain docs exist and cross-links resolve (manual link pass in editor preview).
- `grep -r "TODO" docs/` returns no unresolved placeholder content.
- Every domain doc contains a `Source of truth:` field: `grep -rl "Source of truth" docs/` shows one match per domain doc.

**Sub-subphase checklist**:

- [x] **1.1 — All `_template.md` files**: create 12 section templates with the standard skeleton and domain-specific heading notes. No real content — structure only.
  - **Files**: `docs/{product,architecture,adr,api,state,data,style,security,performance,testing,ai,operations}/_template.md`
  - **Independent verification**: `ls docs/*/_template.md | wc -l` outputs `12`; all render in Markdown preview.

- [x] **1.2 — AI context docs**: author `docs/ai/repo-map.md` and `docs/ai/assistant-context-index.md` from live repo inspection.
  - **Files**: `docs/ai/repo-map.md`, `docs/ai/assistant-context-index.md`
  - **Key content**: entrypoints (`app/layout.tsx`, `middleware.proxy.ts`), core domains (`app/main/`, `src/swr/`, `src/context/`), critical invariants (no direct API calls from components, always use SWR hooks, never bypass `cn()`), dangerous areas (`src/firebase/firebaseAdminConfig.ts` — server-only, `app/api/auth-cookie/` — sensitive cookie handling).
  - **Independent verification**: manual QA prompt "summarize certifai-app boundaries" yields answer grounded in repo map only; no invented details.

- [x] **1.3 — Product and ADR docs**: author glossary and first decision record.
  - **Files**: `docs/product/glossary.md`, `docs/adr/0001-docs-architecture-mvp.md`
  - **Key content**: glossary covers terms like Exam, Certification, Firm, Rate Limit, Auth Cookie, SWR hook; ADR records rationale for this docs structure.
  - **Independent verification**: glossary covers all terms used in `docs/ai/`; ADR status is `Accepted`.

- [x] **1.4 — Architecture docs**: document Next.js App Router conventions from `app/`.
  - **Files**: `docs/architecture/nextjs-conventions.md`
  - **Key content**: public pages (`app/`), authenticated section (`app/main/` with nested `certifications/[cert_id]/exams/[exam_id]/`), Next.js API routes (`app/api/`), layout hierarchy (`app/layout.tsx` → `app/main/layout.tsx`), `loading.tsx`/`template.tsx` conventions, `page.tsx` + `client.tsx` server/client split pattern.
  - **Independent verification**: `grep -r "layout\|loading\|page" app/ | head -10` matches at least 3 conventions documented.

- [x] **1.5 — API docs**: document `ApiResponse<T>` envelope and SWR hook patterns.
  - **Files**: `docs/api/api-connection.md`, `docs/api/swr-patterns.md`
  - **Key content**: `ApiResponse<T>` shape from `src/types/api.ts`; `client-fetch.ts` + `fetch-config.ts` as the fetch layer; `useAuthSWR` (authenticated read), `useAuthMutation` (authenticated write), `useSWRMutation` 4-generic-param rule; all 15 domain hook files in `src/swr/`.
  - **Independent verification**: `grep -r "ApiResponse\|useAuthSWR\|useAuthMutation" src/swr/ | head -20` matches all patterns documented.

- [x] **1.6 — State and Data docs**: document context providers and data model conventions.
  - **Files**: `docs/state/client-state.md`, `docs/data/data-models.md`
  - **Key content**: `src/context/` providers and when to use Context vs SWR; `src/types/swr-data/` layout (one type file per hook), enum usage (`src/types/exam-status.ts`), `[key: string]: any` prohibition.
  - **Independent verification**: `docs/state/client-state.md` references all 4 context files; `docs/data/data-models.md` lists all 16 type files in `src/types/swr-data/`.

- [x] **1.7 — Style and Security docs**: document UI conventions and auth patterns.
  - **Files**: `docs/style/conventions.md`, `docs/security/auth-patterns.md`
  - **Key content style**: Tailwind + shadcn/ui (`src/components/ui/`), `cn()` from `src/lib/utils.ts`, dark mode always required, custom components in `src/components/custom/`, conventions from `styleguide/app.md` and `styleguide/shared.md`.
  - **Key content security**: `middleware.proxy.ts` (JWT validation for `/main/*`), `src/lib/auth-state-manager.ts` and `auth-state-transitions.ts` (state machine), `src/firebase/verifyTokenByAdmin.ts` (server-side), `app/api/auth-cookie/` routes (cookie lifecycle), `src/lib/input-validation.ts`.
  - **Independent verification**: `docs/style/conventions.md` links to all 3 styleguide files; `docs/security/auth-patterns.md` references `middleware.proxy.ts` and at least 3 `src/lib/auth-*.ts` files.

- [x] **1.8 — Performance and Testing docs**: document caching and test patterns.
  - **Files**: `docs/performance/patterns.md`, `docs/testing/strategy.md`
  - **Key content performance**: SWR `revalidateOnFocus`/`dedupingInterval` config, `src/lib/rate-limiting.ts`, `src/hooks/useOptimizedForm.ts` + `useOptimizedRateLimit.ts` + `useOptimizedScroll.ts`, Next.js `loading.tsx` skeleton pattern.
  - **Key content testing**: unit tests in `__tests__/` (exam-status, exam-cert-error-contract, exam-report, demo-credentials — 6 files), Playwright E2E in `e2e/`, `__tests__/setup.ts` for test environment config.
  - **Independent verification**: `docs/testing/strategy.md` lists all 6 `__tests__/` files by name and explains what each covers.

---

### Phase 2: Wire canonical links in instructions and README

**Progress**: `[x]`

**Layer**: instruction and onboarding layer

**Goal**: Ensure assistants and humans are guided to the same canonical docs.

**Files**:

- `.github/copilot-instructions.md` — modify — add "Canonical Documentation References" section.
- `README.md` — modify — add concise "Documentation Map" and AI docs links.

**Verification gate** (must pass before Phase 3 starts):

- Both files link to `docs/ai/repo-map.md` and `docs/ai/assistant-context-index.md`.
- Link targets exist and open correctly in editor.

**Sub-subphase checklist**:

- [x] **2.1 — Add instruction references**: append deterministic doc pointers for AI assistants.
  - **Independent verification**: manual read-through confirms no conflicting guidance with existing instruction rules.
- [x] **2.2 — Add README map**: provide short map without duplicating full content.
  - **Independent verification**: README remains concise and points to canonical docs.

---

### Phase 3: Add governance and freshness checks

**Progress**: `[x]`

**Layer**: process/governance layer

**Goal**: Prevent drift by making docs impact explicit in review workflow.

**Files**:

- `.github/pull_request_template.md` — create/modify — add docs impact assessment block.
- `docs/operations/docs-maintenance.md` — create — define owners, update cadence, and monthly review checks.

**Verification gate**:

- PR template includes docs-impact checkboxes and verification items.
- Operations guide includes cadence, ownership, and freshness SLA.

**Sub-subphase checklist**:

- [x] **3.1 — Introduce PR checklist**: codify when docs updates are required.
  - **Independent verification**: open a PR draft and confirm checklist appears.
- [x] **3.2 — Define maintenance protocol**: document monthly freshness review process.
  - **Independent verification**: protocol can be executed by any maintainer without additional tribal knowledge.

---

### Phase 4: AI assistant guide, docs-aware planning template, and docs-sync enforcement

**Progress**: `[x]`

**Layer**: assistant-tooling and planning-process layer

**Goal**: Make the docs system actively useful to AI assistants at task time, and enforce docs-sync discipline in every future rollout plan.

This phase operates on three levers:
1. **`docs/ai/guide.md`** — a task-time navigation guide for AI assistants that explains _how_ to use the existing docs (not what the docs say), with query-pattern → doc mappings so an assistant can orient itself quickly for any task type.
2. **`rollout-plan-template.md`** — extend the planning template with a mandatory `## Docs Impact` section and a `## Docs Sync` phase so every future plan explicitly lists which docs were checked, which will be created/updated/deleted, and ends with a structured docs-sync step.
3. **`docs/ai/assistant-context-index.md`** — add `docs/ai/guide.md` to the Quick Reference table and adding a reference to the updated planning template.

**Files**:

- `docs/ai/guide.md` — create — task-type → docs navigation guide for AI assistants
- `ai_oriented_kanban/templates/rollout-plan-template.md` — modify — add `## Docs Impact` section and `## Docs Sync` mandatory closing phase
- `docs/ai/assistant-context-index.md` — modify — add `guide.md` to Quick Reference table

**Verification gate** (must pass before plan is considered complete):

- `docs/ai/guide.md` covers at least 8 task types with concrete doc pointers.
- `rollout-plan-template.md` contains a `## Docs Impact` section and a `### Phase N: Docs Sync` phase template.
- `grep "guide.md" docs/ai/assistant-context-index.md` returns a match.
- No content from `guide.md` duplicates content already owned in `repo-map.md` or `assistant-context-index.md` — it navigates, not restates.

**Sub-subphase checklist**:

- [x] **4.1 — Author `docs/ai/guide.md`**: write a task-oriented navigation guide mapping task types (e.g., "adding a SWR hook", "changing auth flow", "adding a route") to the exact doc sequence an assistant should load, with per-task invariants and anti-patterns to check.
  - **Independent verification**: manual QA — given 3 different task prompts, the guide unambiguously routes to the correct docs without the assistant needing to guess.
- [x] **4.2 — Extend `rollout-plan-template.md`**: add `## Docs Impact` section (checked docs, planned creates/updates/deletes) and a mandatory `### Phase N: Docs Sync` closing phase template with its own verification gate and sub-subphase checklist.
  - **Independent verification**: create a minimal stub plan using the updated template and confirm both `## Docs Impact` and the docs-sync phase are present.
- [x] **4.3 — Update `docs/ai/assistant-context-index.md`**: add `guide.md` row to Quick Reference table under a new "AI Assistant Tooling" group.
  - **Independent verification**: `grep "guide.md" docs/ai/assistant-context-index.md` returns a match; link is valid in editor preview.

---

## Dependency Graph

```text
docs content skeleton (Phase 1)
  ↓
instruction + README linking (Phase 2)
  ↓
governance and freshness policy (Phase 3)
  ↓
assistant guide + planning template enforcement (Phase 4)
```

## Suggested Implementation Order

1. Phase 1.1 → Phase 1.2
2. Phase 2.1 → Phase 2.2
3. Phase 3.1 → Phase 3.2
4. Phase 4.1 → Phase 4.2 → Phase 4.3

If any gap is found in Phase 2/3, add it back to Phase 1 docs content rather than duplicating information in instruction/governance files.

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
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>
```

## Essential Implementation Details

- Use machine-readable section headers in AI docs (e.g., `## System Boundary`, `## Critical Invariants`, `## Dangerous Areas`).
- Keep Copilot instructions short; they should point to canonical docs, not restate them.
- For any rule duplicated across docs, keep one canonical owner file and link from others.
- If future API/infra docs are added, define SSOT and generation method in `docs/operations/docs-maintenance.md`.

## Success Criteria

- AI assistants can answer "project overview + coding style + key boundaries" using only canonical docs links.
- New contributors can locate architecture/style/testing references within 5 minutes.
- Documentation updates become reviewable via explicit PR checklist impact markers.

## Rollback Plan

1. Revert Phase 3 governance changes if checklist/process introduces review friction.
2. Revert Phase 2 link changes if they conflict with existing onboarding flow.
3. Keep Phase 1 docs as non-invasive reference assets; archive under `docs/` if partial rollback is needed.

## Resolved Decisions

1. **ADR numbering scope**: Local per repo. `certifai-app` ADRs are numbered independently (e.g., `0001-...`). `certifai-api` will maintain its own ADR sequence when that repo adopts the same structure.

2. **AI docs index structure**: Single file (`docs/ai/assistant-context-index.md`) for now. Split into "overview" and "retrieval map" only if the file grows too large or sections benefit from independent retrieval.

3. **Copilot instructions style**: Concise with links only — no inline summaries. All details live in canonical docs. A "Key Points" section can be added to canonical docs if common questions arise.

## Recommendation

Execute Phase 1 and Phase 2 immediately as the safest MVP path: they deliver the highest AI-context value with minimal operational risk and zero runtime impact. Treat Phase 3 as the stabilization step that prevents drift once the new structure proves useful in active development.
