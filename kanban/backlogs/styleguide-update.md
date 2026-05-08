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

## Phases

### Phase 1: Define the marketing theme contract

**Goal**: Create a single source of truth for marketing brand/style decisions before touching many pages.

**Files**:

- `src/config/marketing-theme.ts` — create — central semantic class presets and brand metadata
- `STYLE_GUIDE.md` — update — align documentation with the actual coded theme contract

**Deliverables**:

- brand metadata (name, accent direction, optional gradient usage)
- semantic class groups for:
  - page shell
  - section spacing/container
  - hero eyebrow/badge
  - hero title/body text
  - cards and interactive cards
  - CTA surfaces
  - header/footer styling hooks
  - button variants used on marketing pages

**Implementation note**:

Keep class strings static in the config. Avoid generating Tailwind classes dynamically from raw color names.

**Verification**:

- no visual change yet required
- theme config is readable enough that a branding update can be made in one file
- class names remain Tailwind-safe and searchable

### Phase 2: Extract thin marketing primitives

**Goal**: Introduce a small reusable shell around repeated visual structure without rewriting page logic.

**Files**:

- `src/components/marketing/MarketingPageShell.tsx` — create — shared outer wrapper/background/decor layers
- `src/components/marketing/MarketingSection.tsx` — create — shared container and vertical spacing
- `src/components/marketing/MarketingCard.tsx` — create — semantic surface variants
- `src/components/marketing/MarketingBadge.tsx` — create — shared eyebrow treatment
- `src/components/marketing/MarketingHeading.tsx` — create — consistent hero/section heading styles
- `src/components/custom/LandingHeader.tsx` — modify — consume theme contract
- `src/components/custom/MarketingFooter.tsx` — modify — consume theme contract

**Why this phase matters**:

This is the leverage phase. Once header/footer/page shell/cards consume shared theme definitions, future branding updates become mostly centralized.

**Verification**:

- header and footer still render identically or near-identically
- primitives are stylistic only; no route logic changes
- pages can adopt them incrementally

### Phase 3: Migrate the core marketing pages

**Goal**: Move the highest-value public pages onto the new theme system first.

**Files**:

- `src/components/landing/LandingPageContent.tsx` — modify — adopt page shell, section, badge, and heading primitives
- `app/pricing/page.tsx` — modify — replace one-off CTA, card, and hero classes with semantic theme usage
- `app/about/page.tsx` — modify — replace custom card motion/treatment with standardized variants
- `app/contact/page.tsx` — modify — standardize icon card surfaces, CTA section, and hero styles

**Migration target**:

- reduce repeated raw Tailwind styling in page files
- preserve page-specific layout/content
- keep feature code in place

**Verification**:

- visual QA on `/`, `/pricing`, `/about`, `/contact`
- confirm dark mode still works
- confirm primary/secondary CTA styling is consistent across pages
- grep reduction of repeated long class strings in those files

### Phase 4: Normalize long-tail marketing routes

**Goal**: Bring the rest of the public-facing routes under the same system once the core pattern is stable.

**Candidate files**:

- `app/certifications/page.tsx`
- `app/certifications/categories/cloud/page.tsx`
- `app/certifications/categories/networking/page.tsx`
- `app/certifications/categories/security/page.tsx`
- `app/certifications/[firmCode]/[slug]/page.tsx`
- `src/components/custom/CertificationMarketingPage.tsx`
- `app/study-guides/page.tsx`
- `app/coming-soon/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

**Important decision**:

This phase should decide whether category/provider pages are allowed a small “context accent” layer or whether all marketing pages must fully collapse to a single brand accent. My recommendation:

- keep **one global brand accent system**
- allow category-specific accents only when they communicate information, not branding

**Verification**:

- spot-check that pages still feel intentionally related
- eliminate arbitrary gradient/color exceptions unless product explicitly wants them

### Phase 5: Final branding controls and maintenance guardrails

**Goal**: Make future theme changes genuinely one-place and keep the system from drifting again.

**Files**:

- `STYLE_GUIDE.md` — update — document the new theme architecture and allowed primitives
- optional lint/process docs — update — note which wrappers/classes to use for marketing pages
- kanban doc — update/move to `_completed` after implementation

**Guardrails**:

- all new marketing pages should use the shared shell and section wrappers
- page files should not introduce new raw hero/card/button systems unless there is a strong reason
- brand colors/gradients should be edited in `src/config/marketing-theme.ts`, not ad hoc in routes

**Verification**:

- a test branding tweak should only require editing the central config plus, at most, one documentation file
- code review checklist includes “no new page-local branding primitives”

## Suggested Implementation Order

1. Create `src/config/marketing-theme.ts`
2. Add `MarketingPageShell`, `MarketingSection`, `MarketingCard`, `MarketingBadge`, `MarketingHeading`
3. Refactor `LandingHeader` and `MarketingFooter`
4. Migrate `/`, `/pricing`, `/about`, `/contact`
5. Migrate certification/category and long-tail pages
6. Update `STYLE_GUIDE.md` to reflect the coded system

This order gives fast wins while minimizing risk: shared infrastructure first, visible pages second, edge pages last.

## Success Criteria

- Changing marketing accent/gradient/radii/button treatment happens primarily in one config file
- Shared header/footer/page shell consume the same theme contract
- Core marketing pages stop hardcoding major branding decisions locally
- Page feature logic remains mostly untouched
- The repo has fewer duplicated long Tailwind strings across public marketing pages

## Rollback Plan

1. Keep migrations incremental by page.
2. If a new primitive causes problems, revert that page to local classes without removing the whole theme config.
3. Do not delete existing page structure until the new theme primitives are proven on the core pages.
4. If needed, keep the theme config in place but pause adoption after Phase 2; this still improves header/footer centralization without forcing a full migration.

## Open Questions

1. Should marketing branding remain **violet-first** as defined in `STYLE_GUIDE.md`, or should the current violet→blue gradient remain part of the official brand system?
2. Do certification/category pages intentionally need provider/category accents, or should they be visually normalized under one brand language?
3. Should legal/info pages (`/privacy`, `/terms`) be brought into the same design primitives, or stay simpler and more document-like?
4. Should the future theme config also own marketing copy-level brand details such as product name, CTA labels, and footer text, or should it stay strictly visual?

## Recommendation

Proceed with **Phase 1 + Phase 2 first**, then migrate only `/`, `/pricing`, `/about`, and `/contact` in the first implementation pass. That gives the biggest maintainability gain with the least feature churn, and it will prove whether the architecture is lightweight enough before touching the broader certification marketing surface.
