# Rollout: Centralize Marketing Theme & Branding

## Summary

The marketing layer in `certifai-app` already has a recognizable visual language, but it is not truly centralized. The current “design system” is split across `STYLE_GUIDE.md`, partial shared components such as `LandingHeader` and `MarketingFooter`, and repeated Tailwind class strings inside individual pages. As a result, changing branding in one place is harder than it should be: hero gradients, button radii, card hover behavior, icon treatments, and accent colors are still defined locally in many routes.

This rollout focuses on **styles architecture only**. The goal is to introduce a single source of truth for marketing theming and branding with the **smallest possible disruption to feature code**. Rather than rewriting marketing pages into a large component framework, the plan recommends a thin semantic theme config plus a small set of layout/styling primitives that pages can adopt gradually.

## Current Evaluation

### What already exists

- `STYLE_GUIDE.md` already documents a marketing design language: neutral slate backgrounds, violet accent, consistent section spacing, card styles, and button patterns.
- Shared shell pieces already exist:
  - `src/components/custom/LandingHeader.tsx`
  - `src/components/custom/MarketingFooter.tsx`
  - `src/components/custom/ActionButton.tsx`
  - `src/components/landing/LandingPageContent.tsx`
  - `src/components/custom/CertificationMarketingPage.tsx`

### What is not centralized yet

#### 1. Page-level class duplication

The same classes or near-duplicates appear across pages:

- page shell: `min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden`
- section shell: `relative py-16 sm:py-20 lg:py-24 overflow-hidden`
- card shell: `bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 ...`

Representative files:

- `src/components/landing/LandingPageContent.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/pricing/page.tsx`
- `app/certifications/page.tsx`
- `app/certifications/[firmCode]/[slug]/page.tsx`

#### 2. Brand drift across pages

The guide says “neutral palette + violet accent only”, but current pages still mix several accent systems:

- `app/pricing/page.tsx` uses violet → blue gradients in hero text and CTA surfaces.
- `app/contact/page.tsx` mixes violet and blue icon treatments.
- category pages under `app/certifications/categories/*/page.tsx` use provider/category color systems such as blue, green, red, and purple.
- `src/components/custom/CertificationMarketingPage.tsx` contains multiple amber, purple, and blue decorative treatments.

This means changing branding globally is not a “single edit”; it is currently a repo-wide scavenger hunt with extra cardio.

#### 3. Interaction and shape inconsistency

The style guide recommends minimal hover behavior and `rounded-lg` buttons, but pages vary between:

- `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- `transition-colors` vs `transition-all`
- subtle hover states vs `hover:scale-105` / `hover:-translate-y-3`

Examples:

- `app/pricing/page.tsx` uses `rounded-xl` CTA buttons and `hover:scale-105`
- `app/about/page.tsx` uses stronger card motion (`hover:-translate-y-3 hover:scale-105`)
- `LandingHeader.tsx` uses `rounded-xl` for the logo badge and CTA button

#### 4. Existing shared components are structural, not thematic

`LandingHeader` and `MarketingFooter` provide shared structure, but they still hardcode visual decisions internally instead of reading from a central marketing theme contract.

#### 5. A raw “theme object” alone will not be enough

Because Tailwind works best with known class strings, the best low-risk approach is **not** a fully dynamic runtime theme engine. A more practical architecture is:

- a semantic **marketing theme config** exporting stable class presets and brand content
- optional **CSS variables** only for truly global tokens
- thin shared wrapper components for repeated page shells/sections/cards/CTA surfaces

That gives one-place branding control without forcing a rewrite of every page into a design-system abstraction maze.

## Scope

- Estimated files to create: 4-8
- Estimated files to modify: 8-18
- Risk level: **Medium**

### In scope

- Centralizing marketing brand tokens and class presets
- Converting repeated layout/style patterns into lightweight shared primitives
- Gradually migrating marketing pages to consume shared theme definitions
- Preserving current page content, route structure, and feature behavior

### Out of scope

- Dashboard/internal app theming under `/main`
- Rewriting page copy, SEO schema, or business logic
- Full white-label or user-selectable runtime theming
- Broad redesign of shadcn/ui base components

## Context Map

### Files to modify first

| File                                            | Purpose                                     | Why it matters                                                          |
| ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `STYLE_GUIDE.md`                                | Existing visual rules                       | Current source of truth is documentation-only, not enforced in code     |
| `src/components/custom/LandingHeader.tsx`       | Shared marketing nav/header                 | Should consume centralized branding and CTA styling                     |
| `src/components/custom/MarketingFooter.tsx`     | Shared marketing footer                     | Should consume centralized branding/tone                                |
| `src/components/landing/LandingPageContent.tsx` | Best current reference page                 | Good baseline for extracting semantic page/section/card styles          |
| `app/pricing/page.tsx`                          | High-visibility marketing route             | Contains multiple one-off gradients, button styles, and card treatments |
| `app/about/page.tsx`                            | Marketing route with card-heavy layout      | Shows motion and card style drift                                       |
| `app/contact/page.tsx`                          | Marketing route with icon/card/CTA patterns | Good candidate for section and card primitives                          |

### Likely files to create

| File                                              | Purpose                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/config/marketing-theme.ts`                   | Single source of truth for semantic marketing tokens and branding content    |
| `src/components/marketing/MarketingPageShell.tsx` | Shared outer wrapper for background, spacing, and optional decorative layers |
| `src/components/marketing/MarketingSection.tsx`   | Standard section padding/container wrapper                                   |
| `src/components/marketing/MarketingCard.tsx`      | Shared card surface variants (default, muted, accent, CTA)                   |
| `src/components/marketing/MarketingBadge.tsx`     | Shared eyebrow/badge treatment                                               |
| `src/components/marketing/MarketingHeading.tsx`   | Shared hero/section heading text treatment                                   |

### Dependencies / related patterns

| File                                                   | Relationship                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `src/components/custom/ActionButton.tsx`               | Existing CTA abstraction; likely should map onto marketing button theme tokens |
| `src/components/custom/CertificationMarketingPage.tsx` | Large marketing-style component with many embedded brand decisions             |
| `app/certifications/categories/cloud/page.tsx`         | Example of category-specific brand drift                                       |
| `app/certifications/categories/networking/page.tsx`    | Same issue as above                                                            |
| `app/certifications/categories/security/page.tsx`      | Same issue as above                                                            |
| `app/study-guides/page.tsx`                            | Another candidate for later migration                                          |
| `app/coming-soon/page.tsx`                             | Another candidate for later migration                                          |
| `app/privacy/page.tsx`                                 | Lower-priority legal page with independent styling                             |
| `app/terms/page.tsx`                                   | Lower-priority legal page with independent styling                             |

### Risks

- [ ] Breaking route behavior or content rendering
- [ ] Tailwind purge issues from overly dynamic classes
- [ ] Accidental redesign of internal app pages
- [ ] Introducing too much abstraction for simple pages

## Recommended Architecture

### Principle 1: Centralize **semantic** styles, not every individual class fragment

Use a single config file that defines meanings such as:

- `pageShell.base`
- `pageShell.decorativeBackground`
- `section.standard`
- `surface.card`
- `surface.cardInteractive`
- `surface.cta`
- `text.heroTitle`
- `text.sectionTitle`
- `text.body`
- `badge.default`
- `button.primary`
- `button.secondary`
- `brand.name`
- `brand.wordmark`

This keeps the system Tailwind-friendly and allows global branding updates without per-page hunting.

### Principle 2: Keep feature code mostly intact

Prefer this kind of migration path:

- page content and data stay where they are
- shared wrappers absorb layout and visual repetition
- pages swap long class strings for semantic wrappers/classes
- no major business logic moves

### Principle 3: Separate tokens from composition

Use two layers:

1. **Theme config** — classes, branding copy, icon/accent treatment, gradients, radii, shadows
2. **Primitives** — page shell, section, card, badge, heading, CTA block

This makes the system flexible enough for future branding changes while staying readable.

### Principle 4: Use CSS variables only where they help

If desired, global CSS variables can hold the few brand primitives most likely to change together:

- primary accent hue
- secondary gradient hue
- hero text gradient
- surface accent tint

Do **not** move the whole marketing system to runtime CSS variables on day one. That would add complexity without much extra value.

## Dependency Rule

> **Each phase must touch exactly one dependency layer. A phase must never simultaneously define a config token and update a component that consumes it. The enforced chain is: Config → Primitives → Shared components → Page components.**

Violating this rule means a broken export in a new config file can cascade silently into a simultaneously-modified component, producing broken refs that are hard to bisect. Every verification gate below must pass before the next phase begins.

## Commit Slicing Rule

> **A phase may be split into sub-subphases when the file count, review surface, or QA burden is too large for one safe commit.**

Sub-subphases are allowed only if they preserve the same dependency-layer rule as the parent phase. In other words, a sub-subphase may make the phase smaller, but it may not reach "downstream" into the next layer early.

### Rules for sub-subphases

- Each sub-subphase should be independently reviewable and revertible.
- Prefer one logical concern per commit: structure, token coverage, migration cluster, or documentation.
- Each sub-subphase should end with a local verification step, even if the parent phase still has a broader final gate.
- If one sub-subphase reveals a missing prerequisite, add a new earlier-layer sub-subphase instead of patching around it in the current commit.
- Do not split a phase in a way that creates temporary broken imports between commits.

## Progress Markers

Use these markers consistently throughout the rollout so current status is visible at a glance:

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

Only mark a sub-subphase as `[x]` after its **independent verification** passes. Only mark a parent phase as `[x]` after all of its child items are `[x]` and the phase-level verification gate passes.

## Progress Dashboard

- [ ] Phase 1 — Config layer
- [ ] Phase 2 — Primitives layer
- [ ] Phase 3 — Shared components layer
- [ ] Phase 4 — Page layer (tier 1)
- [ ] Phase 5 — Page layer (tier 2)
- [ ] Phase 6 — Documentation and guardrails

## Phases

### Phase 1: Config layer — define the marketing theme contract

**Progress**: `[ ]`

**Layer**: `src/config/` only. No component file is touched.

**Goal**: Create `src/config/marketing-theme.ts` as the single source of truth for every visual decision used by marketing pages. It must be fully self-contained before any consumer is written.

**Files**:

- `src/config/marketing-theme.ts` — **create** — central semantic class presets and brand metadata

**Deliverables** (all exported from this one file):

- `brand` — product name, accent direction, gradient usage flag
- `pageShell` — base background and overflow classes
- `section` — standard padding and container classes
- `badge` — eyebrow/badge treatment class string
- `heading` — `hero`, `section`, `body` text style class strings
- `surface` — `card`, `cardInteractive`, `cta` class strings
- `button` — `primary`, `secondary` class strings
- `motion` — single canonical hover/transition class set
- `shape` — single canonical border-radius value (`rounded-lg`)
- `header` — class strings for nav bar surface, logo badge, CTA link
- `footer` — class strings for footer surface and link treatment

**Implementation note**: All values are static string literals. No template interpolation from raw color names. The file is importable with zero side-effects (plain `const` exports, no React).

**Verification gate** (must pass before Phase 2 starts):

- `npx tsc --noEmit` passes with zero errors
- `grep -r "marketing-theme" src/` returns only the config file itself — no consumers yet
- A branding review of the file alone covers the full visual system

**Sub-subphase checklist**:

- [ ] **1.1 — Define token groups**: scaffold `brand`, `pageShell`, `section`, `badge`, `heading`, `surface`, `button`
  - **Independent verification**: file exports these groups without type errors and uses only static class strings
- [ ] **1.2 — Normalize motion and shape**: add `motion` and `shape` tokens to lock hover behavior and radius rules
  - **Independent verification**: the config exposes one canonical hover set and one canonical radius token with no duplicate alternatives
- [ ] **1.3 — Add shell-specific tokens**: add `header` and `footer` token groups
  - **Independent verification**: header/footer token groups exist and are descriptive enough to replace component-local class decisions later
- [ ] **1.4 — Freeze contract**: review naming, remove overlap, confirm no missing semantic buckets before any consumer exists
  - **Independent verification**: naming audit completed; no downstream component requires inventing a new token during initial adoption

---

### Phase 2: Primitives layer — create marketing UI components

**Progress**: `[ ]`

**Layer**: `src/components/marketing/` only. No existing component file is modified.

**Goal**: Build reusable UI primitives. Each primitive imports **only** from `src/config/marketing-theme.ts` and React. No cross-dependency to `src/components/custom/` or `src/components/landing/`.

**Files**:

- `src/components/marketing/MarketingPageShell.tsx` — **create** — outer wrapper: background, overflow, optional decorative layer
- `src/components/marketing/MarketingSection.tsx` — **create** — section container: padding, max-width, overflow
- `src/components/marketing/MarketingCard.tsx` — **create** — surface variants: `default`, `interactive`, `cta`
- `src/components/marketing/MarketingBadge.tsx` — **create** — eyebrow/badge treatment
- `src/components/marketing/MarketingHeading.tsx` — **create** — `hero` and `section` heading text styles
- `src/components/marketing/index.ts` — **create** — barrel export for all primitives

**Verification gate** (must pass before Phase 3 starts):

- `npx tsc --noEmit` passes with zero errors
- `grep -r "from.*components/custom\|from.*components/landing" src/components/marketing/` returns nothing
- `grep -r "marketing-theme" src/components/marketing/` confirms every primitive imports from config

**Sub-subphase checklist**:

- [ ] **2.1 — Layout primitives**: create `MarketingPageShell` and `MarketingSection`
  - **Independent verification**: both components compile and import only React plus `src/config/marketing-theme.ts`
- [ ] **2.2 — Surface primitives**: create `MarketingCard` with `default`, `interactive`, and `cta` variants
  - **Independent verification**: each variant renders from centralized tokens with no local accent system introduced
- [ ] **2.3 — Typography primitives**: create `MarketingBadge` and `MarketingHeading`
  - **Independent verification**: hero/section typography and badge styling compile and resolve from config only
- [ ] **2.4 — Export boundary**: add `src/components/marketing/index.ts` and verify imports stay one-way
  - **Independent verification**: barrel export works and grep confirms no imports from `custom/` or `landing/`

---

### Phase 3: Shared components layer — consume config and primitives

**Progress**: `[ ]`

**Layer**: `src/components/custom/` existing files only. No page-level route files under `app/` or `src/components/landing/` are touched.

**Goal**: Update existing shared components to import from the config and use primitives rather than hardcoding visual decisions locally.

**Files**:

- `src/components/custom/LandingHeader.tsx` — **modify** — replace hardcoded nav/CTA/logo classes with `marketingTheme.header.*` and `marketingTheme.button.*` references
- `src/components/custom/MarketingFooter.tsx` — **modify** — replace hardcoded footer surface and link classes with `marketingTheme.footer.*` references
- `src/components/custom/ActionButton.tsx` — **modify** — map `primary`/`secondary` variant props to `marketingTheme.button.*` classes

**Verification gate** (must pass before Phase 4 starts):

- `npx tsc --noEmit` passes with zero errors
- Visual QA: header and footer render identically or near-identically to before
- `grep -r "rounded-xl\|rounded-2xl\|rounded-3xl\|hover:scale-105\|hover:-translate-y" src/components/custom/LandingHeader.tsx src/components/custom/MarketingFooter.tsx src/components/custom/ActionButton.tsx` returns nothing

**Sub-subphase checklist**:

- [ ] **3.1 — Button mapping**: update `ActionButton.tsx` first so shared CTA styling is centralized
  - **Independent verification**: primary/secondary variants resolve from `marketingTheme.button.*` and compile cleanly
- [ ] **3.2 — Header migration**: update `LandingHeader.tsx` to consume `header` and `button` tokens
  - **Independent verification**: header renders with centralized classes and no banned radius/motion classes remain
- [ ] **3.3 — Footer migration**: update `MarketingFooter.tsx` to consume `footer` tokens
  - **Independent verification**: footer renders from centralized classes and no page imports are touched
- [ ] **3.4 — Shared-shell QA**: verify header/footer/button consistency before any page uses them transitively
  - **Independent verification**: visual QA passes for header/footer/button alignment and phase-level grep checks stay green

---

### Phase 4: Page layer (tier 1) — core marketing routes

**Progress**: `[ ]`

**Layer**: `app/` and `src/components/landing/` page files only. No config or primitive file is changed.

**Goal**: Adopt primitives in the highest-value public routes. Pages replace raw Tailwind class strings with `<MarketingPageShell>`, `<MarketingSection>`, `<MarketingCard>`, `<MarketingBadge>`, and `<MarketingHeading>`.

**If a gap is found** in the config or primitives during this phase: stop, raise an isolated fix targeting Phase 1 or Phase 2 only (separate commit), then continue page migration. Do not patch the gap inline in a page file.

**Files**:

- `src/components/landing/LandingPageContent.tsx` — **modify** — adopt `MarketingPageShell`, `MarketingSection`, `MarketingBadge`, `MarketingHeading`
- `app/pricing/page.tsx` — **modify** — replace one-off CTA, card, and hero classes; use `MarketingCard` variant `cta`
- `app/about/page.tsx` — **modify** — replace custom card motion/shape with `MarketingCard` variant `interactive`
- `app/contact/page.tsx` — **modify** — standardize icon card surfaces, CTA section, and hero styles

**Verification gate** (must pass before Phase 5 starts):

- `npx tsc --noEmit` passes with zero errors
- Visual QA on `/`, `/pricing`, `/about`, `/contact` — dark mode included
- `grep -r "rounded-xl\|rounded-2xl\|rounded-3xl\|hover:scale-105\|hover:-translate-y-3" app/pricing app/about app/contact src/components/landing` returns nothing

**Sub-subphase checklist**:

- [ ] **4.1 — Landing shell migration**: update `LandingPageContent.tsx` only
  - **Independent verification**: landing page compiles and uses the new shell/section/heading primitives without local layout fallback classes
- [ ] **4.2 — CTA-heavy route migration**: update `app/pricing/page.tsx`
  - **Independent verification**: pricing page compiles and its CTA surfaces resolve through `MarketingCard`/button tokens only
- [ ] **4.3 — Card-heavy route migration**: update `app/about/page.tsx`
  - **Independent verification**: about page compiles and card motion/shape come from the standardized interactive variant
- [ ] **4.4 — Mixed-content route migration**: update `app/contact/page.tsx`
  - **Independent verification**: contact page compiles and icon cards/hero/CTA sections use only shared primitives
- [ ] **4.5 — Tier-1 QA sweep**: run the parent verification gate after all four page migrations land
  - **Independent verification**: `/`, `/pricing`, `/about`, and `/contact` all pass the phase-level QA and grep checks together

---

### Phase 5: Page layer (tier 2) — long-tail marketing routes

**Progress**: `[ ]`

**Layer**: Remaining `app/` and `src/components/custom/` marketing files only. No config or primitive file is changed.

**Goal**: Bring remaining public-facing routes under the same system once the tier-1 pattern is proven.

**Files**:

- `app/certifications/page.tsx` — **modify**
- `app/certifications/categories/cloud/page.tsx` — **modify**
- `app/certifications/categories/networking/page.tsx` — **modify**
- `app/certifications/categories/security/page.tsx` — **modify**
- `app/certifications/[firmCode]/[slug]/page.tsx` — **modify**
- `src/components/custom/CertificationMarketingPage.tsx` — **modify**
- `app/study-guides/page.tsx` — **modify**
- `app/coming-soon/page.tsx` — **modify**
- `app/privacy/page.tsx` — **modify** (lightweight: `MarketingPageShell` + `MarketingSection` only)
- `app/terms/page.tsx` — **modify** (same lightweight treatment)

**Important decision**: Category/provider pages may retain a narrow informational accent (e.g., a provider logo tint inside a badge icon) but must not introduce a second button, card, or gradient system outside the canonical config tokens.

**Verification gate** (must pass before Phase 6 starts):

- `npx tsc --noEmit` passes with zero errors
- `grep -rn "bg-blue-\|bg-green-\|bg-amber-\|bg-purple-" app/certifications src/components/custom/CertificationMarketingPage.tsx` returns only intentional informational uses (provider icons, status indicators), not layout surfaces

**Sub-subphase checklist**:

- [ ] **5.1 — Certification shell routes**: migrate `app/certifications/page.tsx` and `src/components/custom/CertificationMarketingPage.tsx`
  - **Independent verification**: certification shell pages compile and primary surfaces come from shared primitives, not route-local brand classes
- [ ] **5.2 — Category routes batch A**: migrate `cloud` and `networking`
  - **Independent verification**: both routes compile and retain only informational accents where truly needed
- [ ] **5.3 — Category routes batch B**: migrate `security` and `[firmCode]/[slug]`
  - **Independent verification**: both routes compile and do not introduce a second card/button/gradient system
- [ ] **5.4 — Supporting marketing routes**: migrate `study-guides` and `coming-soon`
  - **Independent verification**: both routes compile and follow the same shell/section/card structure as tier 1
- [ ] **5.5 — Legal/document routes**: migrate `privacy` and `terms` with lightweight wrappers only
  - **Independent verification**: both legal pages compile with shared wrappers while staying intentionally simpler than marketing-heavy pages
- [ ] **5.6 — Tier-2 QA sweep**: verify any remaining accent colors are informational only
  - **Independent verification**: grep and visual review confirm no stray layout-level accent systems remain

---

### Phase 6: Documentation and guardrails

**Progress**: `[ ]`

**Layer**: Documentation only. No source file logic changes.

**Goal**: Make future drift impossible and codify the architecture as the authoritative reference.

**Files**:

- `STYLE_GUIDE.md` — **update** — replace documentation-only rules with direct references to the coded config; describe the primitive component API; list banned patterns
- `src/config/marketing-theme.ts` — **update** (JSDoc only) — add inline comments explaining the intent of each token group

**Guardrails to document**:

- All new marketing pages must use `<MarketingPageShell>` and `<MarketingSection>` as the outer wrapper
- Page files must not declare local card, button, or hero class constants
- Brand accent, gradients, radii, and motion are edited only in `src/config/marketing-theme.ts`
- PRs adding a new marketing route must include a grep check showing no banned local style patterns

**Verification gate**:

- A simulated branding tweak (e.g., change button radius from `rounded-lg` to `rounded-xl`) requires editing only `src/config/marketing-theme.ts` and the doc
- `STYLE_GUIDE.md` references the primitives by component name, not just visual description

**Sub-subphase checklist**:

- [ ] **6.1 — Document the coded contract**: update `STYLE_GUIDE.md` to point to the config and primitive APIs
  - **Independent verification**: docs explicitly name the config file and primitive entry points
- [ ] **6.2 — Document banned patterns**: list forbidden local style definitions and review checks
  - **Independent verification**: review guidance clearly states what must not appear in future page files
- [ ] **6.3 — Self-document the config**: add JSDoc comments to `src/config/marketing-theme.ts`
  - **Independent verification**: each token group has enough inline explanation for future editors to use it without guessing
- [ ] **6.4 — Final maintainability check**: confirm a brand tweak stays confined to config plus docs
  - **Independent verification**: a sample brand change can be described without requiring route-level edits

## Dependency Graph

```
src/config/marketing-theme.ts          ← Phase 1  (no dependents yet; zero imports from src/)
  │
  ▼
src/components/marketing/*.tsx         ← Phase 2  (imports config only; no custom/ or landing/)
  │
  ▼
src/components/custom/LandingHeader.tsx
src/components/custom/MarketingFooter.tsx   ← Phase 3  (imports config + primitives; no app/ pages)
src/components/custom/ActionButton.tsx
  │
  ▼
src/components/landing/LandingPageContent.tsx
app/pricing/page.tsx                   ← Phase 4  (imports primitives; no new config/primitive creation)
app/about/page.tsx
app/contact/page.tsx
  │
  ▼
app/certifications/**
src/components/custom/CertificationMarketingPage.tsx   ← Phase 5  (imports primitives only)
app/study-guides/page.tsx
app/coming-soon/page.tsx
app/privacy/page.tsx
app/terms/page.tsx
  │
  ▼
STYLE_GUIDE.md + JSDoc                 ← Phase 6  (documentation only)
```

Each arrow means "depends on". A phase must not modify a node that a lower layer already imports from.

## Suggested Implementation Order

1. Create `src/config/marketing-theme.ts` — verify build and zero consumers (Phase 1)
2. Create all five primitive components and barrel export — verify build and import constraints (Phase 2)
3. Update `LandingHeader`, `MarketingFooter`, `ActionButton` — visual QA, verify banned classes removed (Phase 3)
4. Migrate `LandingPageContent`, `/pricing`, `/about`, `/contact` — visual QA (Phase 4)
5. Migrate certification, category, and long-tail pages (Phase 5)
6. Update `STYLE_GUIDE.md` and add JSDoc to config (Phase 6)

If a gap is found during Phase 4 or 5, open an isolated fix commit targeting Phase 1 or 2 only, then continue the page migration in a separate commit. Never patch the gap inline in a page file.

When a phase is too large for one commit, implement its listed sub-subphases in order and treat the parent phase gate as the final "phase complete" checkpoint.

## Success Criteria

- Changing marketing accent/gradient/radii/button treatment requires editing only `src/config/marketing-theme.ts`
- Shared header/footer/page shell consume the same theme contract
- Core marketing pages stop hardcoding major branding decisions locally
- Page feature logic remains untouched
- The repo has fewer duplicated long Tailwind strings across public marketing pages
- Each phase's verification gate passes independently before the next phase begins

## Rollback Plan

1. Keep migrations incremental by page.
2. If a primitive causes problems, revert that page to local classes without touching the primitive or config.
3. If a Phase 3 shared component update causes problems, revert that component — the config and primitives remain intact.
4. Do not delete existing page structure until the Phase 3 shared components are proven.
5. If needed, keep the config and primitives in place but pause adoption at Phase 3; this still centralizes header/footer without forcing full page migration.

## Open Questions

1. Should marketing branding remain **violet-first** as defined in `STYLE_GUIDE.md`, or should the current violet→blue gradient remain part of the official brand system?
2. Do certification/category pages intentionally need provider/category accents, or should they be visually normalized under one brand language?
3. Should legal/info pages (`/privacy`, `/terms`) be brought into the same design primitives, or stay simpler and more document-like?
4. Should the future theme config also own marketing copy-level brand details such as product name, CTA labels, and footer text, or should it stay strictly visual?

## Recommendation

Proceed with **Phase 1 → Phase 2 → Phase 3** before touching any page, but allow each of those phases to land as multiple small sub-subphase commits if review scope gets too large. The dependency graph still must be complete and verified at each parent layer before page migration begins. This preserves clean bisects, safer rollbacks, and fewer "which commit broke the theme?" detective stories.
