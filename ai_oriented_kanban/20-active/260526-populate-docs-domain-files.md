# Executive Report: AI-Oriented Docs Domain Expansion

**Status:** 🔄 In Review
**Completion Date:** 2026-05-27

---

## 1) Executive Summary

This initiative defines the next documentation expansion for `certifai-app`: fill the major domain gaps, move workflow docs into the right location, and make the docs graph easier for humans and AI assistants to navigate.

The work is designed to reduce retrieval misses, prevent stale links, and give the team clearer ownership of core domains like billing, exam lifecycle, SEO, error handling, and consent.

**What was delivered:** A prioritized executive rollout for the missing docs domains and governance updates.
**Why it matters:** It reduces search time, review friction, and documentation drift.
**Current recommendation:** Proceed with Phase 0 first, then execute the remaining phases in order.

**Recommendation:** Approve the rollout plan and move this item to implementation review.

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
| `docs/workflow/consent-workflow.md`        | GDPR consent banner and cookie preferences undocumented                                |

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
| `docs/workflow/consent-workflow.md`        | GDPR consent banner, cookie categories, consent persistence   |

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
## 2) Problem We Solved

### Before (Business Pain)

- Key domains were spread across code, scattered docs, and indirect references.
- AI assistants lacked a reliable map for where to find canonical guidance.
- Workflow docs were in the wrong location, which made discovery inconsistent.
- Several important domains had no single source of truth.

## Phase Sequencing Rule

> Default: create missing domain docs → deepen existing docs → update state layer omissions → register in index/guide.

---

## Progress Dashboard

- [x] Phase 0 — Workflow restructuring (security → workflow migration + link repair + graph audit rule)
- [x] Phase 1 — Architecture docs (component catalog, hooks catalog, server actions)
<<<<<<< HEAD
- [ ] Phase 2 — Billing + Stripe domain doc
- [ ] Phase 3 — Exam lifecycle workflow doc
- [ ] Phase 4 — Architecture utilities (feature flags, SEO, error handling)
- [ ] Phase 5 — Workflow: consent workflow doc
=======
- [x] Phase 2 — Billing + Stripe domain doc
- [x] Phase 3 — Exam lifecycle workflow doc
- [x] Phase 4 — Architecture utilities (feature flags, SEO, error handling)
- [x] Phase 5 — Workflow: consent workflow doc
<<<<<<< HEAD
>>>>>>> 13b71a7 (Populate domain files in docs - phase 3,4,5)
- [ ] Phase 6 — Deepen existing docs (testing, glossary, client-state)
=======
- [x] Phase 6 — Deepen existing docs (testing, glossary, client-state)
<<<<<<< HEAD
>>>>>>> d8362c5 (Populate domain files in docs - phase 6)
- [ ] Phase 7 — Docs Sync (index + guide registration + dead-link + graph audit)
- [ ] Phase 8 — AI-ready docs reflection and next-plan handoff
=======
- [x] Phase 7 — Docs Sync (index + guide registration + dead-link + graph audit)
- [x] Phase 8 — AI-ready docs reflection and next-plan handoff
>>>>>>> 6b1fba1 (Populate domain files in docs - phase 7,8)

---

## Phases

### Phase 0: Workflow restructuring — security workflow migration, link repair, README correction

**Progress**: `[x]`

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

- [x] **0.1 — Migrate `signin-workflow.md`**: copy file to `docs/workflow/signin-workflow.md`; update its internal relative link to `signup-workflow` (`[Signup Workflow](signup-workflow.md)` — already correct since both files will be siblings in `docs/workflow/`).
  - **Independent verification**: file exists at new path; internal cross-link points to sibling, not to `docs/security/`.
- [x] **0.2 — Migrate `signup-workflow.md`**: copy file to `docs/workflow/signup-workflow.md`; update its internal relative link to `signin-workflow`.
  - **Independent verification**: file exists at new path; internal cross-link points to sibling.
- [x] **0.3 — Repair `docs/security/auth-patterns.md`**: replace all 4 occurrences of relative `signin-workflow.md` and `signup-workflow.md` links with correct cross-directory paths `../workflow/signin-workflow.md` and `../workflow/signup-workflow.md`.
  - **Independent verification**: `grep "signin-workflow\|signup-workflow" docs/security/auth-patterns.md` shows only `../workflow/` prefixed links.
- [x] **0.4 — Repair `docs/api/marketing-subscription-workflow.md`**: update `../security/signup-workflow.md` → `../workflow/signup-workflow.md` (2 occurrences).
  - **Independent verification**: `grep "signup-workflow" docs/api/marketing-subscription-workflow.md` shows only `../workflow/` path.
- [x] **0.5 — Correct `docs/workflow/README.md`**: remove the legacy exemption paragraph. Replace with: "All business workflow docs must live in `docs/workflow/` using the `*-workflow.md` naming convention. No exceptions."
  - **Independent verification**: `grep "do not need to move" docs/workflow/README.md` returns no match.
- [x] **0.6 — Delete old `docs/security/` workflow files**: remove `docs/security/signin-workflow.md` and `docs/security/signup-workflow.md`.
  - **Independent verification**: `ls docs/security/` shows only `_template.md` and `auth-patterns.md`.

---

### Phase 1: Architecture docs — component catalog, hooks catalog, server actions

**Progress**: `[x]`

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

- [x] **1.1 — component-catalog.md**: Map `src/components/(ui, custom, auth, billing, navigation, landing, marketing, analytics, seo, system, demo)`. Document `optimized.ts` barrel. Write location rules.
  - **Independent verification**: `grep "custom/" docs/architecture/component-catalog.md` returns a match; all subfolders from `list_dir` appear.
- [x] **1.2 — hooks-catalog.md**: Inventory all 20 files in `src/hooks/`. Categorize each as: auth, exam, SWR shim, analytics, UI utility, or rate-limit.
  - **Independent verification**: `grep "useExamPageLogic\|useSigninHooks\|useAnalytics" docs/architecture/hooks-catalog.md` all return matches.
- [x] **1.3 — server-actions.md**: Document `src/lib/server-actions/certifications.ts` pattern. Explain public JWT, `server-only` import, when to use vs. SWR.
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

**Progress**: `[x]`

**Layer**: `docs/workflow/` — new file

**Goal**: Document the full exam lifecycle from creation to report as a step-by-step workflow, referencing existing SWR and type docs rather than duplicating them. Remove the risk of polling or status-transition bugs from undocumented behavior.

**Files**:

- `docs/workflow/exam-lifecycle-workflow.md` — create — creation → generation polling → active session → submit → report lifecycle

**Verification gate**:

- Doc covers the key exam lifecycle hooks involved: `useCreateExam`, `useExamGeneratingProgress`, `useExamLiveStatus`, `useAllUserExams` / `useExamsForCertification`, `useSubmitExam`, and `useExamReport`.
- `ExamStatus` transitions are represented as a state diagram or table.
- Doc cross-links `swr-patterns.md` (hook signatures) and `data-models.md` (type shapes) rather than duplicating them.
- Includes polling intervals and conditions for stopping polls.

**Sub-subphase checklist**:

- [x] **3.1 — Map exam lifecycle**: read `src/swr/createExam.ts`, `useExamGeneratingProgress.ts`, `useExamLiveStatus.ts`, `exams.ts`, `examReport.ts` and `src/hooks/useExamPageLogic.ts` to confirm the full state machine.
  - **Independent verification**: ExamStatus enum values match `src/types/exam-status.ts`.
- [x] **3.2 — Author `exam-lifecycle-workflow.md`**: write workflow steps, polling config, submit conditions, and report availability trigger.
  - **Independent verification**: File exists in `docs/workflow/`; follows `*-workflow.md` naming from `docs/workflow/README.md`.

---

### Phase 4: Architecture utilities — feature flags, SEO, error handling

**Progress**: `[x]`

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

- [x] **4.1 — feature-flags.md**: document `FeatureFlags` const, `isFeatureEnabled()`, and the `DEMO_CREDENTIALS_SOURCE` variant type.
  - **Independent verification**: `grep "STRIPE_INTEGRATION\|DEMO_CREDENTIALS" docs/architecture/feature-flags.md` returns matches.
- [x] **4.2 — seo-patterns.md**: trace `src/lib/seo.ts`, `src/lib/seo-utils.ts`, `src/config/seo.ts`, `app/sitemap.ts`, `app/robots.ts`.
  - **Independent verification**: Doc includes the `generateMetadata` usage pattern and at least one concrete field example.
- [x] **4.3 — error-handling.md**: consolidate `ApiErrorResponse`, `CanonicalApiErrorResponse`, `SubmitAnswerError`, `ErrorBoundary`, `auth-error-handler.ts`.
  - **Independent verification**: Doc has a type decision table (which error type to catch in which scenario).

---

<<<<<<< HEAD
## 5) Business Impact by Stakeholder
=======
### Phase 5: Workflow — consent workflow doc

**Progress**: `[x]`

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

- [x] **5.1 — Read `src/lib/consent.ts` and `ConsentBanner.tsx`**: extract exported functions, consent state shape, and persistence strategy.
  - **Independent verification**: consent category names in doc match exported constants in `consent.ts`.
- [x] **5.2 — Author `consent-workflow.md`**: write banner trigger flow, consent update flow, and component usage guidance. Include `## Related Docs` section linking to `auth-patterns.md` and `signin-workflow.md`.
  - **Independent verification**: Doc exists in `docs/workflow/`; `## Related Docs` section present; does not duplicate `auth-patterns.md`.

---

### Phase 6: Deepen existing docs — testing, glossary, client-state

**Progress**: `[x]`

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

- [x] **6.1 — testing/strategy.md**: read `e2e/` directory, add fixture/helper inventory, add Playwright config note.
  - **Independent verification**: `grep "fixtures\|helpers" docs/testing/strategy.md` returns matches.
- [x] **6.2 — glossary.md**: read `AccountContext.tsx` and `src/stripe/` for subscription/plan terms. Read `src/config/featureFlags.ts` for Adaptive Learning context.
  - **Independent verification**: `grep "Adaptive\|Subscription\|Demo Credentials" docs/product/glossary.md` all return matches.
- [x] **6.3 — client-state.md**: add `AccountContext` block and billing row to Decision Guide table.
  - **Independent verification**: `grep "AccountContext" docs/state/client-state.md` returns a match.

---

### Phase 7: Docs Sync — index, guide registration, dead-link audit, graph-network verification
>>>>>>> 13b71a7 (Populate domain files in docs - phase 3,4,5)

<<<<<<< HEAD
### CEO (Growth, Trust, Strategic Velocity)
=======
**Progress**: `[x]`
>>>>>>> 6b1fba1 (Populate domain files in docs - phase 7,8)

- Better docs coverage reduces delivery friction and improves team responsiveness.

### PM / Product Leadership (Roadmap, Delivery, Customer Outcomes)

- Clearer domain docs support faster feature planning and fewer review delays.

### Operations / Support

- Better workflow and troubleshooting docs reduce dependency on engineering for basic guidance.

### Legal / Compliance

- Consent and auth documentation will be easier to audit and keep aligned.

### Engineering Leadership

<<<<<<< HEAD
- The rollout reduces knowledge gaps and creates a cleaner documentation topology for future work.

---

## 6) ROI and Business Value
=======
- [x] **7.1 — Update assistant-context-index.md**: update migrated workflow paths from `security/` to `workflow/`; add one Quick Reference row per new doc; update Key Source Paths with `src/stripe/` and `docs/billing/`.
  - **Independent verification**: No row links to `docs/security/signin-workflow.md` or `docs/security/signup-workflow.md`; new rows present for all 9 new docs.
- [x] **7.2 — Update docs/ai/guide.md**: update `security/signin-workflow` and `security/signup-workflow` references to `workflow/`; add task-type sections for billing (→ `stripe-billing.md`), exam lifecycle (→ `exam-lifecycle-workflow.md`), SEO (→ `seo-patterns.md`), error handling (→ `error-handling.md`).
  - **Independent verification**: Each new task type has a primary doc reference and at least one invariant note; no stale `security/` paths remain.
- [x] **7.3 — Dead-link audit**: manually verify all relative links in new and modified docs resolve to real files. Check each `## Related Docs` section against actual directory listings.
  - **Independent verification**: Zero broken relative links found; dead-link audit: clean.
- [x] **7.4 — Graph-network audit**: for every new doc, confirm it has a `## Related Docs` section AND appears in at least one other doc's `## Related Docs` or in the index. Identify and fix any orphan doc.
  - **Independent verification**: `grep -rL "## Related Docs" docs/ | grep -v _template | grep -v README` returns no files from this rollout's new docs.

---

### Phase 8: AI-ready docs reflection and next-plan handoff

**Progress**: `[x]`
>>>>>>> 6b1fba1 (Populate domain files in docs - phase 7,8)

### Investment

- **People/time invested:** Planning and documentation work only
- **Business disruption during implementation:** Low

### Return

- **Time saved per search/review cycle:** Less context-switching across scattered docs
- **Cost avoided:** Reduced rework from missing or stale guidance
- **Revenue/progress enablement:** Faster, more consistent feature delivery

### Estimated Payback Period

- Within one planning cycle after the docs are implemented and indexed

### ROI Summary Statement

<<<<<<< HEAD
The rollout should reduce retrieval overhead and review churn with minimal implementation cost.
=======
- Smoke test pass/fail recorded for at least 3 prompts covering newly added domains.
- Any gap found during implementation is documented as a follow-up item.
- This kanban item is moved to `30-review/` after verification.

**Sub-subphase checklist**:

- [x] **8.1 — Run AI retrieval smoke tests**: use prompts from `docs/operations/ai-retrieval-smoke-tests.md` targeting billing, exam lifecycle, component catalog, and error handling.
  - **Independent verification**: Pass/fail recorded; no new doc routes to a 404 or missing file.
- [x] **8.2 — Record session note**: document completed phases, any gaps found, and blockers.
  - **Independent verification**: Session note added to this file.
- [x] **8.3 — Move to review**: copy/move to `ai_oriented_kanban/30-review/`.
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
>>>>>>> 6b1fba1 (Populate domain files in docs - phase 7,8)

---

## 7) Risk Assessment (Post-Delivery)

### Residual Risks

- Some content is still awaiting authoring.
- Link repair and graph audits must be completed together to avoid stale references.

### Current Mitigations in Place

- Phased implementation order
- Required `## Related Docs` links
- Dead-link and orphan-doc audit gates

### Overall Risk Level

**Risk after fix/change:** Low

---

## 8) Decision Request

**Requested decision:** Approve the rollout plan and proceed to execution.
**Why now:** The documentation gaps are known, scoped, and already prioritized.

---

## 9) Optional Next Wave (Not required for current success)

1. Automated dead-link checks for `docs/**/*.md`
2. Docs freshness checks tied to source changes
3. Searchable docs publishing for internal use

---

## 10) One-Page Leadership Snapshot (Copy/Paste)

- Completed: Authored `docs/architecture/component-catalog.md`, `docs/architecture/hooks-catalog.md`, and `docs/architecture/server-actions.md`
- Verified by: component folder audit under `src/components/`, 20-file hook inventory under `src/hooks/`, and source review of `src/lib/server-actions/certifications.ts`, `src/lib/jwt-utils.ts`, and `src/components/optimized.ts`
- Notes: `usePublicCertifications.ts` exists but is currently empty, so the hooks catalog documents it as a placeholder rather than an active API surface; root `.env` created from `.env.sample` to satisfy required server-action placeholders
- Next: Phase 2 or backfill Phase 0, depending on rollout execution order
- Blockers: none

### Session Note — 2026-05-26 (phase 0 complete)

- Completed: Migrated `docs/security/signin-workflow.md` and `docs/security/signup-workflow.md` to `docs/workflow/`, repaired all stale `security/...workflow` references under `docs/`, corrected the canonical placement rule in `docs/workflow/README.md`, and deleted the old security copies
- Verified by: `docs/security/` now contains only `_template.md` and `auth-patterns.md`; `docs/workflow/` now contains `signin-workflow.md` and `signup-workflow.md`; grep for `security/signin-workflow|security/signup-workflow` under `docs/` returns zero matches
- Notes: also repaired stale references in `docs/ai/assistant-context-index.md`, `docs/ai/guide.md`, and `docs/operations/ai-retrieval-smoke-tests.md` so the Phase 0 verification gate is genuinely clean repo-wide
- Next: Phase 2 — Billing / Stripe domain doc
- Blockers: none

### Session Note — 2026-05-26 (open questions resolved)

- Completed: Removed the remaining open questions from the rollout plan and folded the decisions into the execution baseline
- Decisions locked: billing docs stay in `docs/billing/`; Adaptive Learning remains glossary/feature-flag coverage only; consent documentation stays under `docs/workflow/`
- Next: Execute Phase 2 without further planning clarification
- Blockers: none
<<<<<<< HEAD
=======

### Session Note — 2026-05-26 (phase 2 complete)

- Completed: Created `docs/billing/_template.md` and authored `docs/billing/stripe-billing.md`
- Verified by: source review of `src/context/AccountContext.tsx`, `src/stripe/client/hooks/*`, `src/stripe/client/swr.ts`, `src/components/billing/BillingComponents.tsx`, and `app/main/(billing|stripe/callback)/`; markdown validation reported no errors in the new billing docs
- Notes: the billing doc records both the preferred read path (`AccountContext`) and the lower-level Stripe SWR mutation layer so assistants can choose the correct abstraction boundary
- Next: Phase 3 — Exam lifecycle workflow doc
- Blockers: none

### Session Note — 2026-05-26 (phase 3 complete)

- Completed: Authored `docs/workflow/exam-lifecycle-workflow.md`
- Verified by: source review of `src/swr/createExam.ts`, `src/swr/exams.ts`, `src/swr/useExamLiveStatus.ts`, `src/swr/useExamGeneratingProgress.ts`, `src/swr/examReport.ts`, `src/swr/questions.ts`, `src/hooks/useExamPageLogic.ts`, and `src/types/exam-status.ts`; markdown validation reported no errors in the workflow doc
- Notes: the workflow doc captures the real polling cadence (2s live status / exam state during generation, 5s list polling for generating exams) and clarifies that the current list-layer hooks are `useAllUserExams` / `useExamsForCertification`, not a singular `useExams` export
- Next: Phase 4 — Architecture utilities (feature flags, SEO, error handling)
- Blockers: none

### Session Note — 2026-05-26 (phase 4 complete)

- Completed: Authored `docs/architecture/feature-flags.md`, `docs/architecture/seo-patterns.md`, and `docs/architecture/error-handling.md`
- Verified by: source review of `src/config/featureFlags.ts`, `src/lib/seo.ts`, `src/lib/seo-utils.ts`, `src/config/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `src/types/api.ts`, `src/lib/auth-error-handler.ts`, `src/components/custom/ErrorBoundary.tsx`, and `src/types/swr-data/questions.ts`; markdown validation reported no errors in the new docs
- Notes: the error-handling doc now distinguishes envelope errors, SWR transport errors, contextual mutation errors like `SubmitAnswerError`, and render-boundary containment as separate layers
- Next: Phase 5 — Workflow: consent workflow doc
- Blockers: none

### Session Note — 2026-05-26 (phase 5 complete)

- Completed: Authored `docs/workflow/consent-workflow.md`
- Verified by: source review of `src/lib/consent.ts`, `src/components/custom/ConsentBanner.tsx`, `src/components/analytics/ConsentAwareAnalytics.tsx`, `src/components/custom/CookiePreferencesLink.tsx`, `src/components/custom/NotificationBar.tsx`, and `app/layout.tsx`; markdown validation reported no errors in the workflow doc
- Notes: the doc records that the current cookie-consent implementation is a binary analytics-consent model stored in localStorage and explicitly separates it from the demo-credentials consent modal flow
- Next: Phase 6 — Deepen existing docs (testing, glossary, client-state)
- Blockers: none
<<<<<<< HEAD
>>>>>>> 13b71a7 (Populate domain files in docs - phase 3,4,5)
=======

### Session Note — 2026-05-26 (phase 6 complete)

- Completed: Deepened `docs/testing/strategy.md`, `docs/product/glossary.md`, and `docs/state/client-state.md`
- Verified by: inventory review of `e2e/`, `e2e/fixtures/`, `e2e/helpers/`, `playwright.config.ts`, `src/context/AccountContext.tsx`, `src/stripe/`, and Adaptive Learning source references; markdown validation reported no errors in the updated docs
- Notes: corrected the E2E environment note to match the actual Playwright config (`.env.local` / `PLAYWRIGHT_TEST_BASEURL`) and added the missing `AccountContext` guidance to the state doc
- Next: Phase 7 — Docs Sync (index + guide registration + dead-link + graph audit)
- Blockers: none
<<<<<<< HEAD
>>>>>>> d8362c5 (Populate domain files in docs - phase 6)
=======

### Session Note — 2026-05-26 (phase 7 complete)

- Completed: Updated `docs/ai/assistant-context-index.md` and `docs/ai/guide.md` with the newly added domains (billing, exam lifecycle, feature flags, SEO, error handling, server actions, consent workflow), then completed dead-link and graph-network audits
- Verified by: stale security-workflow path grep returned zero matches; doc marker grep (`TODO|TBD|FIXME`) returned zero matches; shell-based dead-link check returned `BROKEN_LINKS=0`; graph check returned `MISSING_RELATED=0` after adding `## Related Docs` to `assistant-context-index.md`
- Notes: a false-positive dead-link run occurred initially due missing `realpath` in zsh; audit was re-run with a portable existence check and passed cleanly
- Next: Phase 8 — AI-ready docs reflection and next-plan handoff
- Blockers: none

### Session Note — 2026-05-26 (phase 8 complete)

- Completed: Ran retrieval smoke checks for newly added routing domains, recorded outcomes, and finalized handoff readiness for review move
- Verified by: routing checks in `docs/ai/assistant-context-index.md` and `docs/ai/guide.md` for billing, exam lifecycle, component catalog, and error handling all resolve to canonical docs; docs sync audits remain clean (`BROKEN_LINKS=0`, `MISSING_RELATED=0`)
- Smoke test results:

| Prompt                                                                | Expected target docs                                                                                 | Actual docs retrieved first                                           | Result | Notes                                                 |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ | ----------------------------------------------------- |
| "I need to update Stripe checkout/subscription behavior"              | `docs/billing/stripe-billing.md`, `docs/state/client-state.md`, `docs/architecture/feature-flags.md` | `stripe-billing.md` route section in `guide.md` + index billing row   | Pass   | Billing task route added and discoverable             |
| "I need to debug exam generation polling and report availability"     | `docs/workflow/exam-lifecycle-workflow.md`, `docs/api/swr-patterns.md`, `docs/data/data-models.md`   | exam lifecycle route section in `guide.md` + index exam lifecycle row | Pass   | Polling + report lifecycle guidance present           |
| "Where should a new shared component go and what folder rules apply?" | `docs/architecture/component-catalog.md`, `docs/style/conventions.md`                                | index component-catalog row + UI component section in `guide.md`      | Pass   | Folder taxonomy and placement invariants linked       |
| "I need to update API error contracts and UI error boundaries"        | `docs/architecture/error-handling.md`, `docs/api/api-connection.md`, `docs/api/swr-patterns.md`      | error-handling route section in `guide.md` + index error-handling row | Pass   | Type decision table and error-layer boundaries linked |

- Follow-up required: none
- Next: In review — `ai_oriented_kanban/30-review/260526-populate-docs-domain-files.md`
- Blockers: none

---

# Review: Populate AI-Friendly Domain Docs for certifai-app

## Outcome

This rollout is complete through Phase 8 and ready for review.

Implemented domains and updates include:

- New architecture docs:
  - `docs/architecture/component-catalog.md`
  - `docs/architecture/hooks-catalog.md`
  - `docs/architecture/server-actions.md`
  - `docs/architecture/feature-flags.md`
  - `docs/architecture/seo-patterns.md`
  - `docs/architecture/error-handling.md`
- New billing/workflow docs:
  - `docs/billing/stripe-billing.md`
  - `docs/workflow/exam-lifecycle-workflow.md`
  - `docs/workflow/consent-workflow.md`
- Workflow restructuring completed:
  - moved signin/signup workflow docs from `docs/security/` to `docs/workflow/`
  - repaired stale cross-links and updated workflow placement rules
- Existing docs deepened:
  - `docs/testing/strategy.md`
  - `docs/product/glossary.md`
  - `docs/state/client-state.md`
- AI routing sync completed:
  - `docs/ai/assistant-context-index.md`
  - `docs/ai/guide.md`

## Verification Summary

- Stale security workflow path checks: clean (`0` matches)
- Dead-link audit across docs: clean (`BROKEN_LINKS=0`)
- Graph-network audit for rollout docs (`## Related Docs` coverage): clean (`MISSING_RELATED=0`)
- Marker audit (`TODO|TBD|FIXME`): clean in docs content
- Retrieval smoke checks (billing, exam lifecycle, component catalog, error handling): pass

## Notes for Reviewers

- The active working plan remains at:
  - `ai_oriented_kanban/20-active/260526-populate-docs-domain-files.md`
- This review file is the handoff summary for governance and approval.
>>>>>>> 6b1fba1 (Populate domain files in docs - phase 7,8)
