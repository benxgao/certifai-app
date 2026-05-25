# Rollout: Populate AI-Friendly Domain Docs for certifai-app

## Summary

The `certifai-app` docs system has a mature governance structure and a solid set of invariant docs, but large parts of the codebase remain undocumented or only superficially indexed. A full scan reveals at least 8 major domains — component catalog, hooks catalog, Stripe/billing, exam lifecycle, feature flags, SEO, error handling, and consent — that have zero canonical docs. Additionally, existing docs for testing, product glossary, and data models have real content gaps that weaken AI retrieval quality.

This rollout populates the missing domain files, deepens shallow existing docs, and restructures the `docs/security/` domain so that an AI assistant can answer questions about any corner of `certifai-app` by loading a single targeted doc rather than reverse-engineering from source code. It also enforces a graph-network linking rule — every doc must be reachable from the index and must cross-link to at least one sibling doc — so the knowledge base has no isolated islands or dead links.

---

## Current Evaluation

### What already exists

- `docs/ai/` — guide, repo-map, assistant-context-index (solid retrieval backbone)
- `docs/architecture/nextjs-conventions.md` — App Router structure, layout hierarchy, server/client split
- `docs/api/api-connection.md` — `ApiResponse<T>`, fetch utilities, error types
- `docs/api/swr-patterns.md` — hook inventory, generic type rules, mutation patterns
- `docs/api/marketing-subscription-workflow.md` — MailerLite/AWS Lambda pipeline
- `docs/state/client-state.md` — three-layer state decision guide, four Context providers
- `docs/data/data-models.md` — type file map, enum rules, interface authoring rules
- `docs/style/conventions.md` — Tailwind, shadcn/ui, `cn()`, dark mode, design tokens
- `docs/security/auth-patterns.md`, `signin-workflow.md`, `signup-workflow.md` — auth invariants and procedures
- `docs/performance/patterns.md` — SWR cache defaults, optimized hooks
- `docs/testing/strategy.md` — unit + E2E inventory, setup file
- `docs/product/glossary.md` — core domain terms

### What is not centralized / stable / complete yet

#### 1. Component catalog is absent

- `src/components/custom/` has 80+ components with no architecture doc.
- No guidance on which folder to add components to (`custom/` vs `auth/` vs `billing/` vs `navigation/` vs domain-specific).
- No explanation of `optimized.ts` barrel exports.

Representative files:

- `src/components/custom/` (80 files)
- `src/components/auth/`, `billing/`, `navigation/`, `landing/`, `seo/`, `system/`, `demo/`
- `src/components/optimized.ts`

#### 2. Hooks catalog does not exist

- `src/hooks/` has 20 custom hooks with no inventory or intent doc.
- AI assistants must read each file to understand whether a hook is local-state, data-fetch shim, or exam-domain logic.

Representative files:

- `src/hooks/useExamPageLogic.ts`, `useExamCounts.ts`, `useExamListGenerationMonitor.ts`
- `src/hooks/useAnalytics.ts`, `useSigninHooks.ts`, `useSystemErrorNotification.ts`

#### 3. Stripe/billing domain is entirely undocumented

- `src/stripe/` has a client SDK layer (`client/hooks/`, `client/components/`) and server layer (`server/index.ts`).
- `AccountContext` wraps unified account + subscription state (Stripe customer, plan, trial, cancellation) but is not referenced in any doc.
- `src/stripe/client/hooks/useCheckoutFlow.ts`, `useEnhancedCheckoutFlow.ts`, `useUnifiedAccountData.ts` are structurally significant but invisible to docs.

Representative files:

- `src/stripe/client/hooks/`
- `src/context/AccountContext.tsx`
- `src/components/billing/BillingComponents.tsx`
- `app/main/billing/`, `app/main/stripe/callback/`

#### 4. Exam lifecycle has no dedicated workflow doc

- Exam creation → generation polling → active exam session → submission → report is a complex multi-step domain.
- `docs/api/swr-patterns.md` lists the hooks but does not describe the lifecycle, state transitions, or polling behavior.
- `ExamStatus` enum and `auth-state-transitions.ts` roles are defined but not stitched together in a workflow doc.

Representative files:

- `src/swr/createExam.ts`, `useExamGeneratingProgress.ts`, `useExamLiveStatus.ts`, `exams.ts`, `questions.ts`, `examReport.ts`
- `src/hooks/useExamPageLogic.ts`, `useExamListGenerationMonitor.ts`, `useExamStatusNotifications.ts`

#### 5. Feature flags, SEO, and error-handling patterns are invisible

- `src/config/featureFlags.ts` defines three flags (`STRIPE_INTEGRATION`, `DEMO_CREDENTIALS_CONSENT_ENABLED`, `DEMO_CREDENTIALS_SOURCE`) with no doc.
- `src/lib/seo.ts`, `src/lib/seo-utils.ts`, `src/config/seo.ts` define the SEO strategy; no architecture doc exists.
- `ErrorBoundary`, `ErrorMessage`, `auth-error-handler.ts`, `CanonicalApiErrorResponse` — error handling patterns are scattered with no consolidating doc.

#### 6. Consent/cookie preferences domain is completely undocumented

- `src/lib/consent.ts` and `ConsentBanner.tsx` implement GDPR consent mechanics.
- `src/components/custom/CookiePreferencesLink.tsx` and `ConditionalFooter.tsx` are usage points.
- No doc explains the consent model, cookie categories, or banner behavior.

#### 7. Server-only public data fetching pattern lacks a doc

- `src/lib/server-actions/certifications.ts` uses `server-only`, `generatePublicJWTToken`, and makes direct API calls from Server Components.
- This pattern is architecturally significant (bypasses SWR, uses public JWT) but undocumented — violates the SWR invariant unless properly scoped.

#### 8. Security domain mixes invariants with user journey workflows

- `docs/security/signin-workflow.md` and `docs/security/signup-workflow.md` are step-by-step **user journey docs**, not security invariant docs.
- Placing them under `docs/security/` conflates the security rule layer with the workflow procedure layer, making it hard to find user journey docs as the workflow library grows.
- `docs/workflow/README.md` already acknowledges this — it notes those docs live in the wrong place but defers migration. Now is the right time to move them.
- Cross-link blast radius: 4 files reference `docs/security/signin-workflow.md`; 5 files reference `docs/security/signup-workflow.md`. All must be repaired after migration.

#### 9. Docs graph is not enforced — dead links possible, orphan docs exist

- There is no audit verifying all relative links inside `docs/` resolve to real files.
- Several docs have no `## Related Docs` section, making them unreachable from doc-to-doc traversal (only reachable from the index).
- `docs/workflow/README.md` line 76 explicitly says signin/signup workflow docs "do not need to move" — this directly contradicts the new governance rule and must be corrected.

### Risks in the current state

- [ ] AI assistant loads `swr-patterns.md` and directs all data fetching through SWR — misses the legitimate server-action pattern — and generates incorrect code for public marketing pages.
- [ ] AI assistant adds a new component to arbitrary folder because no component location rules exist.
- [ ] AI assistant creates direct Stripe API calls, bypassing `AccountContext` and `useUnifiedAccountData`, because the billing domain has no invariant doc.
- [ ] Exam lifecycle bugs introduced because the polling → submit → report state machine is not documented and can be misunderstood.
- [ ] SEO metadata added inconsistently because no canonical SEO pattern doc exists.
- [ ] A relative link in a doc points to the old `docs/security/signin-workflow.md` path after migration — broken link goes undetected because there is no link audit.
- [ ] An AI assistant loads a doc that has no `## Related Docs` section and cannot navigate to adjacent knowledge without returning to the index every time.

---

## Scope

- Estimated files to create: 10 (9 new domain docs + `docs/workflow/consent-workflow.md` relocated from planned `docs/security/`)
- Estimated files to modify: 9 (5 original + workflow migration link repairs + README correction)
- Estimated files to migrate: 2 (`signin-workflow.md`, `signup-workflow.md`)
- Risk level: Low (all changes are docs-only; no runtime code changes)

### In scope

- **Workflow restructuring**: migrate `docs/security/signin-workflow.md` → `docs/workflow/signin-workflow.md`
- **Workflow restructuring**: migrate `docs/security/signup-workflow.md` → `docs/workflow/signup-workflow.md`
- **Link repair**: update all cross-links in `docs/security/auth-patterns.md`, `docs/ai/assistant-context-index.md`, `docs/ai/guide.md`, `docs/api/marketing-subscription-workflow.md`, and the migrated docs themselves
- **README correction**: update `docs/workflow/README.md` to remove the "docs do not need to move" exemption and set the new canonical rule
- Create `docs/architecture/component-catalog.md`
- Create `docs/architecture/hooks-catalog.md`
- Create `docs/architecture/server-actions.md`
- Create `docs/billing/stripe-billing.md`
- Create `docs/workflow/exam-lifecycle-workflow.md`
- Create `docs/workflow/consent-workflow.md` _(relocated from planned `docs/security/` — consent is a user journey, not a security invariant)_
- Create `docs/architecture/feature-flags.md`
- Create `docs/architecture/seo-patterns.md`
- Create `docs/architecture/error-handling.md`
- **Dead-link audit**: scan all `docs/**/*.md` relative links and confirm each resolves to an existing file
- **Graph-network audit**: verify every doc has a `## Related Docs` section with at least one outbound link, and is referenced from at least one other doc or the index
- Deepen `docs/testing/strategy.md` — add E2E fixture inventory and coverage targets
- Deepen `docs/product/glossary.md` — add Firm, Rate Limit, Adaptive Learning, Demo Credentials, Account/Subscription terms
- Update `docs/state/client-state.md` — add `AccountContext` entry
- Update `docs/ai/assistant-context-index.md` — register all new docs, update migrated doc paths
- Update `docs/ai/guide.md` — update migrated doc paths, add new task-type routing entries for billing, exam lifecycle, SEO

### Out of scope

- Changes to any runtime TypeScript/TSX source code
- Adding tests, fixtures, or mocks
- Rewrites of existing well-documented docs (auth, SWR patterns, style conventions)
- Migration of existing `ARCHITECTURE.md` or `FEATURES.md` from old unstructured files
- Moving any other domain docs between directories beyond the two workflow migrations above

---

## Minimum Viable Hotfix

Phase 0 (workflow migration + link repair) must be executed first because it repairs existing broken-by-design links and corrects the `docs/workflow/README.md` policy. Phases 1–2 (component + hooks catalogs) then unblock the most immediate AI assistant errors. Phases 3–4 (billing + exam lifecycle) address the highest-risk missing domain invariants.

---

## Docs Impact

> Loaded `docs/ai/guide.md` and `docs/ai/assistant-context-index.md` during planning.

### Docs checked during planning

| Doc                                  | Relevant finding                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `docs/ai/assistant-context-index.md` | No billing, hooks, component, exam-lifecycle, SEO, or error entries exist             |
| `docs/ai/repo-map.md`                | Mentions `src/components/(ui,custom,auth,billing,analytics)` but no structural detail |
| `docs/api/swr-patterns.md`           | Lists all SWR hooks but does not describe lifecycle or polling patterns               |
| `docs/state/client-state.md`         | Covers 4 contexts; `AccountContext` is present in codebase but missing from doc       |
| `docs/testing/strategy.md`           | E2E section has 1 sentence; fixture inventory is blank                                |
| `docs/product/glossary.md`           | Missing: Firm details, Rate Limit, Adaptive Learning, Demo Credentials, Subscription  |
| `docs/data/data-models.md`           | Missing: `demoCredentials.ts` type doc entry                                          |

### Docs to create

| File                                       | Reason                                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `docs/architecture/component-catalog.md`   | No component location or extension guide exists                                        |
| `docs/architecture/hooks-catalog.md`       | 20 hooks in `src/hooks/` with no inventory                                             |
| `docs/architecture/server-actions.md`      | Server-only public fetch pattern not documented; could be mistaken for a SWR violation |
| `docs/billing/stripe-billing.md`           | Entire Stripe domain (AccountContext, checkout, callback) undocumented                 |
| `docs/workflow/exam-lifecycle-workflow.md` | No workflow doc for exam creation → generation → active → submit → report              |
| `docs/architecture/feature-flags.md`       | `src/config/featureFlags.ts` entirely absent from docs                                 |
| `docs/architecture/seo-patterns.md`        | SEO utilities and metadata patterns undocumented                                       |
| `docs/architecture/error-handling.md`      | No consolidating doc for error types, error boundary, error contracts                  |
| `docs/security/consent-workflow.md`        | GDPR consent banner and cookie preferences undocumented                                |

### Docs to update

| File                                 | What changes                                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `docs/testing/strategy.md`           | Add E2E fixture inventory (`e2e/fixtures/`, `e2e/helpers/`), add coverage targets                         |
| `docs/product/glossary.md`           | Add: Firm (detail), Rate Limit (detail), Adaptive Learning, Demo Credentials, Account, Subscription, Plan |
| `docs/state/client-state.md`         | Add `AccountContext` entry (Stripe/billing unified state)                                                 |
| `docs/ai/assistant-context-index.md` | Register all 9 new docs + updated docs                                                                    |
| `docs/ai/guide.md`                   | Add task-routing entries: billing changes, exam lifecycle, SEO, error handling                            |

### Docs to delete or archive

_(none — no existing doc is superseded by this rollout)_

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.

---

## Context Map

### Files to modify first

| File                                 | Purpose               | Why it matters                                                   |
| ------------------------------------ | --------------------- | ---------------------------------------------------------------- |
| `docs/ai/assistant-context-index.md` | Quick reference index | Must be updated last, after all new docs exist                   |
| `docs/ai/guide.md`                   | Task-type routing     | Must be updated after billing, exam, SEO docs exist              |
| `docs/state/client-state.md`         | Context layer map     | `AccountContext` omission creates incorrect state layer guidance |

### Likely files to create

| File                                       | Purpose                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| `docs/architecture/component-catalog.md`   | Maps all component subfolders, purpose, and extension rules   |
| `docs/architecture/hooks-catalog.md`       | Matrix of all 20 hooks: category, source, when to use         |
| `docs/architecture/server-actions.md`      | Documents the `server-only` public fetch pattern              |
| `docs/billing/stripe-billing.md`           | Stripe SDK layer, AccountContext, checkout flow, callback     |
| `docs/workflow/exam-lifecycle-workflow.md` | End-to-end exam lifecycle with status transitions and polling |
| `docs/architecture/feature-flags.md`       | `FeatureFlags` object, per-flag purpose, guard usage          |
| `docs/architecture/seo-patterns.md`        | `generateMetadata`, sitemap, robots, SEO config tokens        |
| `docs/architecture/error-handling.md`      | Error types, `CanonicalApiErrorResponse`, ErrorBoundary usage |
| `docs/security/consent-workflow.md`        | GDPR consent banner, cookie categories, consent persistence   |

### Dependencies / related patterns

| File                                               | Relationship                                        |
| -------------------------------------------------- | --------------------------------------------------- |
| `src/context/AccountContext.tsx`                   | Primary source for `docs/billing/stripe-billing.md` |
| `src/stripe/client/hooks/useUnifiedAccountData.ts` | Primary source for billing context data shape       |
| `src/hooks/useExamPageLogic.ts`                    | Key file for exam lifecycle workflow doc            |
| `src/config/featureFlags.ts`                       | Sole source for feature flags doc                   |
| `src/lib/seo.ts`, `src/config/seo.ts`              | Sources for SEO patterns doc                        |
| `src/lib/consent.ts`                               | Source for consent workflow doc                     |

### Risks

- [ ] `docs/billing/` is a new subdirectory — must create folder; verify `assistant-context-index.md` link works after creation.
- [ ] `docs/workflow/exam-lifecycle-workflow.md` must not duplicate SWR hook details already in `swr-patterns.md` — cross-link instead of duplicating.

---

## Recommended Architecture

### Principle 1: One doc per domain boundary, not per file

Each doc should cover an entire coherent domain (e.g., all billing, all exam lifecycle) rather than mirroring individual source files. Links to source files are provided as anchors, not as replacements for conceptual explanation.

### Principle 2: Index-first authoring

Write the Quick Reference entry in `assistant-context-index.md` before writing the doc body. This forces the author to define the retrieval trigger phrase before filling in content.

### Principle 3: Cross-link, never duplicate

When a new doc covers an area that overlaps an existing doc, cross-link explicitly and state the scope boundary. Example: `exam-lifecycle-workflow.md` refers to `swr-patterns.md` for hook signatures and `data-models.md` for type shapes rather than copying them.

### Principle 4: Graph-network linking rule

The docs system must form a connected graph, not a collection of isolated files. Every doc must satisfy two conditions:

1. **Inbound reachability** — the doc is referenced from at least one other doc or from `docs/ai/assistant-context-index.md`. A doc that exists but is linked from nowhere is an orphan.
2. **Outbound links** — every doc must have a `## Related Docs` section with at least one link to a sibling or parent doc.

This ensures an AI assistant that starts at any node in the graph can navigate to adjacent knowledge without returning to the index. It also makes dead links observable: a broken link in a `## Related Docs` section fails immediately on inspection.

---

## Dependency Rule

> **Each phase must touch exactly one documentation layer.**

Phases are sequenced: new domain docs first, then updates to existing shallow docs, then index/guide registration last. Index registration is always the final step because it requires all target docs to exist.

## Phase Sequencing Rule

> Default: create missing domain docs → deepen existing docs → update state layer omissions → register in index/guide.

---

## Progress Dashboard

- [ ] Phase 0 — Workflow restructuring (security → workflow migration + link repair + graph audit rule)
- [ ] Phase 1 — Architecture docs (component catalog, hooks catalog, server actions)
- [ ] Phase 2 — Billing + Stripe domain doc
- [ ] Phase 3 — Exam lifecycle workflow doc
- [ ] Phase 4 — Architecture utilities (feature flags, SEO, error handling)
- [ ] Phase 5 — Workflow: consent workflow doc
- [ ] Phase 6 — Deepen existing docs (testing, glossary, client-state)
- [ ] Phase 7 — Docs Sync (index + guide registration + dead-link + graph audit)
- [ ] Phase 8 — AI-ready docs reflection and next-plan handoff

---

## Phases

### Phase 0: Workflow restructuring — security workflow migration, link repair, README correction

**Progress**: `[ ]`

**Layer**: `docs/security/` → `docs/workflow/` migration; cross-link repair across `docs/`

**Goal**: Move the two user journey workflow docs out of `docs/security/` into `docs/workflow/` where they belong. Repair all cross-links that reference the old paths. Correct `docs/workflow/README.md` to establish the canonical rule. This is a prerequisite for all subsequent phases because new workflow docs created in later phases depend on consistent placement.

**Files**:

- `docs/workflow/signin-workflow.md` — create (migrate from `docs/security/signin-workflow.md`)
- `docs/workflow/signup-workflow.md` — create (migrate from `docs/security/signup-workflow.md`)
- `docs/security/signin-workflow.md` — delete after migration and link repair
- `docs/security/signup-workflow.md` — delete after migration and link repair
- `docs/security/auth-patterns.md` — modify — update 4 relative links to new `../workflow/` paths
- `docs/api/marketing-subscription-workflow.md` — modify — update link to `../workflow/signup-workflow.md`
- `docs/workflow/README.md` — modify — remove legacy exemption line; establish mandatory placement rule

**Verification gate**:

- `ls docs/security/` no longer contains `signin-workflow.md` or `signup-workflow.md`.
- `ls docs/workflow/` contains both `signin-workflow.md` and `signup-workflow.md`.
- `grep -r "security/signin-workflow\|security/signup-workflow" docs/` returns zero matches.
- `grep "workflow/signin-workflow\|workflow/signup-workflow" docs/security/auth-patterns.md` returns matches (links updated).
- `grep "workflow/signup-workflow" docs/api/marketing-subscription-workflow.md` returns a match.
- `docs/workflow/README.md` no longer contains the "do not need to move" exemption text.

**Sub-subphase checklist**:

- [ ] **0.1 — Migrate `signin-workflow.md`**: copy file to `docs/workflow/signin-workflow.md`; update its internal relative link to `signup-workflow` (`[Signup Workflow](signup-workflow.md)` — already correct since both files will be siblings in `docs/workflow/`).
  - **Independent verification**: file exists at new path; internal cross-link points to sibling, not to `docs/security/`.
- [ ] **0.2 — Migrate `signup-workflow.md`**: copy file to `docs/workflow/signup-workflow.md`; update its internal relative link to `signin-workflow`.
  - **Independent verification**: file exists at new path; internal cross-link points to sibling.
- [ ] **0.3 — Repair `docs/security/auth-patterns.md`**: replace all 4 occurrences of relative `signin-workflow.md` and `signup-workflow.md` links with correct cross-directory paths `../workflow/signin-workflow.md` and `../workflow/signup-workflow.md`.
  - **Independent verification**: `grep "signin-workflow\|signup-workflow" docs/security/auth-patterns.md` shows only `../workflow/` prefixed links.
- [ ] **0.4 — Repair `docs/api/marketing-subscription-workflow.md`**: update `../security/signup-workflow.md` → `../workflow/signup-workflow.md` (2 occurrences).
  - **Independent verification**: `grep "signup-workflow" docs/api/marketing-subscription-workflow.md` shows only `../workflow/` path.
- [ ] **0.5 — Correct `docs/workflow/README.md`**: remove the legacy exemption paragraph. Replace with: "All business workflow docs must live in `docs/workflow/` using the `*-workflow.md` naming convention. No exceptions."
  - **Independent verification**: `grep "do not need to move" docs/workflow/README.md` returns no match.
- [ ] **0.6 — Delete old `docs/security/` workflow files**: remove `docs/security/signin-workflow.md` and `docs/security/signup-workflow.md`.
  - **Independent verification**: `ls docs/security/` shows only `_template.md` and `auth-patterns.md`.

---

### Phase 1: Architecture docs — component catalog, hooks catalog, server actions

**Progress**: `[ ]`

**Layer**: `docs/architecture/` — new files only

**Goal**: Document the component folder taxonomy, the hooks inventory, and the server-only public fetch pattern. These three gaps cause the most frequent AI assistant errors when generating new code.

**Files**:

- `docs/architecture/component-catalog.md` — create — component subfolder map, location rules, barrel export notes
- `docs/architecture/hooks-catalog.md` — create — 20-hook matrix with category, source path, when to use
- `docs/architecture/server-actions.md` — create — `server-only` public fetch, `generatePublicJWTToken`, scope constraint

**Verification gate**:

- Each file has `Source of truth`, `Last reviewed`, and `Owner` fields.
- `component-catalog.md` explicitly lists all subfolders under `src/components/` with one-line purpose each.
- `hooks-catalog.md` has one row per hook file in `src/hooks/`.
- `server-actions.md` includes scope warning: "This pattern is for Server Components fetching public data only — never call from SWR hooks."

**Sub-subphase checklist**:

- [ ] **1.1 — component-catalog.md**: Map `src/components/(ui, custom, auth, billing, navigation, landing, marketing, analytics, seo, system, demo)`. Document `optimized.ts` barrel. Write location rules.
  - **Independent verification**: `grep "custom/" docs/architecture/component-catalog.md` returns a match; all subfolders from `list_dir` appear.
- [ ] **1.2 — hooks-catalog.md**: Inventory all 20 files in `src/hooks/`. Categorize each as: auth, exam, SWR shim, analytics, UI utility, or rate-limit.
  - **Independent verification**: `grep "useExamPageLogic\|useSigninHooks\|useAnalytics" docs/architecture/hooks-catalog.md` all return matches.
- [ ] **1.3 — server-actions.md**: Document `src/lib/server-actions/certifications.ts` pattern. Explain public JWT, `server-only` import, when to use vs. SWR.
  - **Independent verification**: Doc includes explicit note distinguishing this pattern from client-side SWR fetching.

---

### Phase 2: Billing / Stripe domain doc

**Progress**: `[ ]`

**Layer**: `docs/billing/` — new directory + new file

**Goal**: Give assistants a single invariant doc for the entire Stripe/billing domain: `AccountContext`, unified account data, checkout flow, billing page, Stripe callback. Prevent direct Stripe API calls bypassing the established layer.

**Files**:

- `docs/billing/stripe-billing.md` — create — AccountContext shape, checkout hooks, SubscriptionManagementCard, callback flow

**Verification gate**:

- File covers: `AccountContext` exported shape, `useUnifiedAccountData` return fields, `useCheckoutFlow` vs. `useEnhancedCheckoutFlow` distinction, callback route, and at least one critical invariant.
- Includes `## Critical Invariants` section with at least: "Never call Stripe API directly from components — use `useAccountStatus()` from `AccountContext`."
- File has `Source of truth`, `Last reviewed`, `Owner`.

**Sub-subphase checklist**:

- [ ] **2.1 — Create `docs/billing/` directory**: add `_template.md` stub so the folder is Git-trackable.
  - **Independent verification**: `ls docs/billing/` shows the directory exists.
- [ ] **2.2 — Author `stripe-billing.md`**: read `AccountContext.tsx` and `src/stripe/client/hooks/` to extract exported interface and hook inventory.
  - **Independent verification**: File lists all 4 hooks from `src/stripe/client/hooks/`; `AccountContextType` fields are recapped.

---

### Phase 3: Exam lifecycle workflow doc

**Progress**: `[ ]`

**Layer**: `docs/workflow/` — new file

**Goal**: Document the full exam lifecycle from creation to report as a step-by-step workflow, referencing existing SWR and type docs rather than duplicating them. Remove the risk of polling or status-transition bugs from undocumented behavior.

**Files**:

- `docs/workflow/exam-lifecycle-workflow.md` — create — creation → generation polling → active session → submit → report lifecycle

**Verification gate**:

- Doc covers all 6 SWR hooks involved: `useCreateExam`, `useExamGeneratingProgress`, `useExamLiveStatus`, `useExams`, `useSubmitExam`, `useExamReport`.
- `ExamStatus` transitions are represented as a state diagram or table.
- Doc cross-links `swr-patterns.md` (hook signatures) and `data-models.md` (type shapes) rather than duplicating them.
- Includes polling intervals and conditions for stopping polls.

**Sub-subphase checklist**:

- [ ] **3.1 — Map exam lifecycle**: read `src/swr/createExam.ts`, `useExamGeneratingProgress.ts`, `useExamLiveStatus.ts`, `exams.ts`, `examReport.ts` and `src/hooks/useExamPageLogic.ts` to confirm the full state machine.
  - **Independent verification**: ExamStatus enum values match `src/types/exam-status.ts`.
- [ ] **3.2 — Author `exam-lifecycle-workflow.md`**: write workflow steps, polling config, submit conditions, and report availability trigger.
  - **Independent verification**: File exists in `docs/workflow/`; follows `*-workflow.md` naming from `docs/workflow/README.md`.

---

### Phase 4: Architecture utilities — feature flags, SEO, error handling

**Progress**: `[ ]`

**Layer**: `docs/architecture/` — three new files

**Goal**: Document the three utility domains that affect code generation quality but have no canonical docs.

**Files**:

- `docs/architecture/feature-flags.md` — create — `FeatureFlags` object, `isFeatureEnabled()`, per-flag purpose, guard usage in components
- `docs/architecture/seo-patterns.md` — create — `generateMetadata`, sitemap, robots.ts, SEO config tokens, `seo-utils.ts` helpers
- `docs/architecture/error-handling.md` — create — `CanonicalApiErrorResponse` contract, `ErrorBoundary` usage, `auth-error-handler.ts` surface types, error logging conventions

**Verification gate**:

- `feature-flags.md` lists all three current flags with their purpose.
- `seo-patterns.md` references `app/sitemap.ts`, `app/robots.ts`, `src/config/seo.ts`, and `src/lib/seo-utils.ts`.
- `error-handling.md` distinguishes API error types (`ApiErrorResponse` vs. `CanonicalApiErrorResponse`) and component-level handling (`ErrorBoundary`).
- All three files include `Source of truth`, `Last reviewed`, `Owner`.

**Sub-subphase checklist**:

- [ ] **4.1 — feature-flags.md**: document `FeatureFlags` const, `isFeatureEnabled()`, and the `DEMO_CREDENTIALS_SOURCE` variant type.
  - **Independent verification**: `grep "STRIPE_INTEGRATION\|DEMO_CREDENTIALS" docs/architecture/feature-flags.md` returns matches.
- [ ] **4.2 — seo-patterns.md**: trace `src/lib/seo.ts`, `src/lib/seo-utils.ts`, `src/config/seo.ts`, `app/sitemap.ts`, `app/robots.ts`.
  - **Independent verification**: Doc includes the `generateMetadata` usage pattern and at least one concrete field example.
- [ ] **4.3 — error-handling.md**: consolidate `ApiErrorResponse`, `CanonicalApiErrorResponse`, `SubmitAnswerError`, `ErrorBoundary`, `auth-error-handler.ts`.
  - **Independent verification**: Doc has a type decision table (which error type to catch in which scenario).

---

### Phase 5: Workflow — consent workflow doc

**Progress**: `[ ]`

**Layer**: `docs/workflow/` — new file

**Goal**: Document the GDPR consent banner, cookie preference model, and consent persistence. Consent is a **user-facing journey** (banner appears, user chooses, preferences persist) — not a security invariant — so it belongs in `docs/workflow/` alongside other user journey docs.

**Files**:

- `docs/workflow/consent-workflow.md` — create — banner trigger, cookie categories, `consent.ts` API, persistence strategy, `ConsentBanner.tsx` behavior

**Verification gate**:

- File covers: consent trigger conditions, cookie categories (required vs. analytics vs. marketing), `src/lib/consent.ts` exported API, `ConsentBanner.tsx` render conditions, persistence mechanism (localStorage/cookie).
- Cross-links to `docs/security/auth-patterns.md` for the broader auth cookie model (outbound link required by graph rule).
- Has `Source of truth`, `Last reviewed`, `Owner`.
- File is in `docs/workflow/`, not `docs/security/`.

**Sub-subphase checklist**:

- [ ] **5.1 — Read `src/lib/consent.ts` and `ConsentBanner.tsx`**: extract exported functions, consent state shape, and persistence strategy.
  - **Independent verification**: consent category names in doc match exported constants in `consent.ts`.
- [ ] **5.2 — Author `consent-workflow.md`**: write banner trigger flow, consent update flow, and component usage guidance. Include `## Related Docs` section linking to `auth-patterns.md` and `signin-workflow.md`.
  - **Independent verification**: Doc exists in `docs/workflow/`; `## Related Docs` section present; does not duplicate `auth-patterns.md`.

---

### Phase 6: Deepen existing docs — testing, glossary, client-state

**Progress**: `[ ]`

**Layer**: updates to existing docs only

**Goal**: Fill known content holes in three existing docs that leave gaps in AI retrieval.

**Files**:

- `docs/testing/strategy.md` — modify — add E2E fixture inventory (`e2e/fixtures/`, `e2e/helpers/`), Playwright config reference, coverage targets
- `docs/product/glossary.md` — modify — add terms: Firm (full detail), Rate Limit (per-user quota context), Adaptive Learning (feature flag gated), Demo Credentials, Account, Subscription, Plan, Checkout
- `docs/state/client-state.md` — modify — add `AccountContext` entry under `## Context Providers` section; update Decision Guide table with billing row

**Verification gate**:

- `testing/strategy.md` now lists at least the `e2e/fixtures/` directory and names the two main spec files.
- `product/glossary.md` has entries for all 8 new terms listed above.
- `state/client-state.md` `AccountContext` entry matches the exported `AccountContextType` interface shape.
- All three files have updated `Last reviewed: 2026-05-26`.

**Sub-subphase checklist**:

- [ ] **6.1 — testing/strategy.md**: read `e2e/` directory, add fixture/helper inventory, add Playwright config note.
  - **Independent verification**: `grep "fixtures\|helpers" docs/testing/strategy.md` returns matches.
- [ ] **6.2 — glossary.md**: read `AccountContext.tsx` and `src/stripe/` for subscription/plan terms. Read `src/config/featureFlags.ts` for Adaptive Learning context.
  - **Independent verification**: `grep "Adaptive\|Subscription\|Demo Credentials" docs/product/glossary.md` all return matches.
- [ ] **6.3 — client-state.md**: add `AccountContext` block and billing row to Decision Guide table.
  - **Independent verification**: `grep "AccountContext" docs/state/client-state.md` returns a match.

---

### Phase 7: Docs Sync — index, guide registration, dead-link audit, graph-network verification

**Progress**: `[ ]`

**Layer**: documentation layer — `docs/ai/` + full `docs/` audit

**Goal**: Register all new and updated docs in the assistant index, update task-routing in the guide, verify no dead links exist anywhere in `docs/`, and confirm the docs graph satisfies the connectivity rule (Principle 4).

**Pre-condition check**:

- All phases 0–6 must be complete before this phase starts.
- Verify each new file exists with metadata fields before adding its index entry.

**Files**:

- `docs/ai/assistant-context-index.md` — modify — update migrated workflow doc paths; add 9 new docs to Quick Reference table; add `docs/billing/` to Key Source Paths
- `docs/ai/guide.md` — modify — update migrated paths; add task-type entries for: billing changes, exam lifecycle, SEO, error handling

**Verification gate**:

- `grep -r "security/signin-workflow\|security/signup-workflow" docs/` returns zero matches (no stale links).
- `grep "workflow/signin-workflow\|workflow/signup-workflow" docs/ai/assistant-context-index.md` returns matches (index updated).
- `grep "component-catalog\|hooks-catalog\|stripe-billing\|exam-lifecycle-workflow\|feature-flags\|seo-patterns\|error-handling\|consent-workflow\|server-actions" docs/ai/assistant-context-index.md` returns 9 matches.
- `docs/ai/guide.md` has entries for billing and exam lifecycle task types.
- `grep "TODO\|TBD\|FIXME" docs/` (excluding `_template` files) returns no hits.
- Dead-link audit: every relative link in `docs/**/*.md` resolves to an existing file (`find docs -name '*.md' | xargs grep -oP '\(\.\.?/[^)]+\.md[^)]*\)' | ...` or manual spot-check of each new and modified file).
- Graph audit: every doc created or modified in this rollout has a `## Related Docs` section with at least one outbound link; each is referenced from at least one other doc or the index.

**Sub-subphase checklist**:

- [ ] **7.1 — Update assistant-context-index.md**: update migrated workflow paths from `security/` to `workflow/`; add one Quick Reference row per new doc; update Key Source Paths with `src/stripe/` and `docs/billing/`.
  - **Independent verification**: No row links to `docs/security/signin-workflow.md` or `docs/security/signup-workflow.md`; new rows present for all 9 new docs.
- [ ] **7.2 — Update docs/ai/guide.md**: update `security/signin-workflow` and `security/signup-workflow` references to `workflow/`; add task-type sections for billing (→ `stripe-billing.md`), exam lifecycle (→ `exam-lifecycle-workflow.md`), SEO (→ `seo-patterns.md`), error handling (→ `error-handling.md`).
  - **Independent verification**: Each new task type has a primary doc reference and at least one invariant note; no stale `security/` paths remain.
- [ ] **7.3 — Dead-link audit**: manually verify all relative links in new and modified docs resolve to real files. Check each `## Related Docs` section against actual directory listings.
  - **Independent verification**: Zero broken relative links found; record "dead-link audit: clean" in session note.
- [ ] **7.4 — Graph-network audit**: for every new doc, confirm it has a `## Related Docs` section AND appears in at least one other doc's `## Related Docs` or in the index. Identify and fix any orphan doc.
  - **Independent verification**: `grep -rL "## Related Docs" docs/ | grep -v _template | grep -v README` returns no files from this rollout's new docs.

---

### Phase 8: AI-ready docs reflection and next-plan handoff

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture what was learned during execution, identify any follow-up gaps discovered, and produce a handoff note.

**Pre-condition check**:

- Phase 7 complete and verified.
- Run smoke tests from `docs/operations/ai-retrieval-smoke-tests.md` against the new docs before closing.

**Files**:

- `ai_oriented_kanban/30-review/260526-populate-docs-domain-files.md` — create — move this plan to review and convert to executive report if approved

**Verification gate**:

- Smoke test pass/fail recorded for at least 3 prompts covering newly added domains.
- Any gap found during implementation is documented as a follow-up item.
- This kanban item is moved to `30-review/` after verification.

**Sub-subphase checklist**:

- [ ] **8.1 — Run AI retrieval smoke tests**: use prompts from `docs/operations/ai-retrieval-smoke-tests.md` targeting billing, exam lifecycle, component catalog, and error handling.
  - **Independent verification**: Pass/fail recorded; no new doc routes to a 404 or missing file.
- [ ] **8.2 — Record session note**: document completed phases, any gaps found, and blockers.
  - **Independent verification**: Session note added to this file.
- [ ] **8.3 — Move to review**: copy/move to `ai_oriented_kanban/30-review/`.
  - **Independent verification**: File exists in `30-review/`.

---

## Dependency Graph

```text
Phase 0: Workflow restructuring (security → workflow migration + link repair)
  ↓
Phase 1: Architecture docs (component, hooks, server-actions)  ┐
Phase 2: Billing domain doc                                    │ can run in parallel
Phase 3: Exam lifecycle workflow doc                           │
Phase 4: Architecture utilities (feature flags, SEO, errors)   │
Phase 5: Consent workflow doc                                  ┘
  ↓
Phase 6: Deepen existing docs (testing, glossary, client-state)
  ↓
Phase 7: Docs Sync (index + guide + dead-link audit + graph audit)
  ↓
Phase 8: AI reflection and handoff
```

Phase 0 must run first — it repairs pre-existing link breakage that would otherwise contaminate link audits in Phase 7. Phases 1–5 can then run in parallel (no inter-phase dependencies). Phase 6 depends on phases 1–5 to verify that new terms and context entries are accurate. Phase 7 depends on all prior phases. Phase 8 depends on Phase 7.

---

## Suggested Implementation Order

1. Phase 0 (workflow migration + link repair — must be first; unblocks clean graph state)
2. Phase 1.1 → 1.2 → 1.3 (architecture docs — highest AI-assistant frequency)
3. Phase 2 (billing domain — highest risk gap)
4. Phase 3 (exam lifecycle — complex multi-hook domain)
5. Phase 4 (feature flags → SEO → error handling)
6. Phase 5 (consent workflow)
7. Phase 6 (deepen testing, glossary, client-state)
8. Phase 7 (index + guide + dead-link + graph audit)
9. Phase 8 (reflection + smoke tests)

---

## Success Criteria

- `docs/security/` contains only `auth-patterns.md` and `_template.md` — no workflow procedures.
- All 9 new domain docs exist with complete metadata fields.
- `docs/ai/assistant-context-index.md` Quick Reference table contains entries for all new docs with correct `docs/workflow/` paths for signin and signup.
- `grep -r "security/signin-workflow\|security/signup-workflow" docs/` returns zero matches.
- `grep "TODO\|TBD\|FIXME" docs/` (excluding templates) returns no hits.
- Every doc created or modified in this rollout has a `## Related Docs` section.
- Dead-link audit: zero broken relative links in any `docs/**/*.md` file.
- Running the smoke test protocol against 3+ billing/exam/component prompts produces correct doc routing.
- No doc duplicates content from another doc — all cross-references use links.

---

## Rollback Plan

1. All changes are doc-only; rollback is safe without runtime risk.
2. Revert individual new files if content is found to be inaccurate after review.
3. Revert index entries (`assistant-context-index.md`) before reverting the docs themselves to prevent broken links.
4. Use Git history to restore any overwritten existing doc section.

---

## Open Questions

1. **`docs/billing/` directory**: Should billing docs live under `docs/billing/` (new top-level domain) or `docs/architecture/billing.md` (folded into architecture)? Default decision: new top-level `docs/billing/` to keep billing domain isolated and extensible as Stripe integration grows.
2. **Adaptive Learning domain**: `AdaptiveLearningInterestModal*` and `AdaptiveLearningNotification` components exist but the feature appears to be pre-launch. Should a domain doc be created now (placeholder) or deferred? Default decision: add a glossary term and a note in `feature-flags.md`; defer a dedicated domain doc until the feature is active.

---

## Recommendation

Execute Phases 1–3 in the first session for immediate retrieval quality lift (component location, hooks catalog, billing invariants, exam lifecycle). Complete Phases 4–6 in the second session to cover utility patterns and deepen existing docs. Finish with Phase 7 (index sync) and Phase 8 (smoke tests + handoff) before closing the kanban item.

---

## Session Notes

### Session Note — 2026-05-26 (initial plan)

- Completed: Full codebase scan and rollout plan authored
- Verified by: Cross-referenced `docs/ai/assistant-context-index.md`, all `docs/` subdirectories, `src/components/`, `src/hooks/`, `src/swr/`, `src/stripe/`, `src/context/`, `src/config/`
- Next: Phase 0 — workflow migration (security → workflow), link repair, README correction
- Blockers: none

### Session Note — 2026-05-26 (plan revision)

- Completed: Plan updated with workflow restructuring (Phase 0), graph-network linking rule (Principle 4), consent-workflow relocated to `docs/workflow/`, dead-link audit added to Phase 7, all affected cross-links identified across 4 files
- Verified by: grep audit confirming 4 files reference `security/signin-workflow` and 5 reference `security/signup-workflow`; `docs/workflow/README.md` line 76 exemption confirmed
- Next: Execute Phase 0
- Blockers: none
