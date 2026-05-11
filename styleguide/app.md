# Certifai App Style Guide

Styles and components for **authenticated app surfaces** (dashboard, exam flows, study guides, account pages, etc.).

> Shared design tokens (colors, spacing, typography, interactive states) live in [shared.md](shared.md).
> Marketing page tokens live in `src/config/marketing-theme.ts` — see [marketing.md](marketing.md).

---

## Current State Audit (May 2026)

### What exists

| Primitive                                                        | File                                     | Backed by config?                                                                                               |
| ---------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `DashboardCard` / `DashboardCardHeader` / `DashboardCardContent` | `src/components/ui/dashboard-card.tsx`   | ❌ inline classes                                                                                               |
| `PageWrapper`                                                    | `src/components/ui/page-wrapper.tsx`     | ❌ inline classes                                                                                               |
| `AppHeader`                                                      | `src/components/custom/appheader.tsx`    | ❌ duplicates marketing header tokens inline                                                                    |
| `ActionButton`                                                   | `src/components/custom/ActionButton.tsx` | ✅ partially — uses `marketingTheme.button.*` for primary/secondary; `success`/`outline` variants are hardcoded |
| `StatsCard`                                                      | `src/components/custom/StatsCard.tsx`    | ❌ inline — gradient text, decorative blobs, two variants                                                       |
| `StatusBadge`                                                    | `src/components/ui/status-badge.tsx`     | ❌ inline — per-status color map                                                                                |
| `AlertMessage`                                                   | `src/components/custom/AlertMessage.tsx` | ✅ uses shadcn `Alert` variant system                                                                           |
| `QuestionCard`                                                   | `src/components/custom/QuestionCard.tsx` | ❌ heavy inline gradients, verbose blur/shadow chains                                                           |

### Key problems

1. **No `app-theme.ts`** — there is no app-level equivalent of `src/config/marketing-theme.ts`. All app surface tokens (page background, card surface, header shell) are hardcoded in component files.
2. **AppHeader duplicates marketing tokens** — `appheader.tsx` repeats the exact same Tailwind strings as `marketingTheme.header` without importing from the config.
3. **`DashboardCard` is not token-backed** — the glass-morphism pattern (`bg-white/90 backdrop-blur-md shadow-2xl rounded-xl`) is defined only in the component body.
4. **`StatsCard` uses decorative orbs and gradient text** not aligned with the minimal shared design principles from `shared.md`.
5. **`QuestionCard` has excessive inline noise** — multi-level gradient chains, per-element backdrop-blur, verbose hover chains.
6. **`StatusBadge` color map is local** — semantic status colors (emerald/red/blue/slate per status) are not centralized.

### What is working well

- `ActionButton` already bridges to `marketingTheme` for shared CTA styles.
- `AlertMessage` correctly delegates to the shadcn `Alert` variant system.
- `DashboardCard` exists as a structural primitive — it just needs a config backing.
- `PageWrapper` provides a consistent scroll-optimized shell — background just needs tokenizing.

---

## Target State: App Surface Tokens

The goal is `src/config/app-theme.ts` as the single source of truth for app visual tokens, mirroring the pattern in `marketing-theme.ts`.

### Page shell

```ts
export const appPageShell = {
  background:
    'min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20',
  container: 'max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12',
} as const;
```

### Card surfaces

```ts
export const appSurface = {
  // Standard glass card (DashboardCard base)
  card: 'relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden',
  cardCompact:
    'relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-xl overflow-hidden',
  cardHeader:
    'px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/40',
  cardContent: 'p-6 sm:p-8',
} as const;
```

### App header

```ts
export const appHeader = {
  shell:
    'sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm',
  logoBadge: 'w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm',
  navLink: 'text-sm font-normal transition-colors duration-200 px-2 md:px-3 py-2 rounded-lg',
  navActive: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
  navInactive:
    'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50',
} as const;
```

### Status colors (semantic slots)

```ts
export const appStatus = {
  success: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  pending: { bg: 'bg-slate-100 dark:bg-slate-700/40', text: 'text-slate-600 dark:text-slate-400' },
} as const;
```

---

## Layout Structure

### Page background (current pattern — to be tokenized)

```tsx
// PageWrapper provides this automatically
<div
  className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-violet-50/30
                dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20"
>
  <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
    {/* Page content */}
  </div>
</div>
```

### DashboardCard (structural primitive)

```tsx
// Use the primitive — do not inline its classes in page files
<DashboardCard>
  <DashboardCardHeader>...</DashboardCardHeader>
  <DashboardCardContent>...</DashboardCardContent>
</DashboardCard>
```

---

## Cards & Surfaces

App cards use a heavier glass-morphism than marketing cards to create visual depth in data-dense layouts:

```css
/* Standard app card */
bg-white/90 dark:bg-slate-900/90 backdrop-blur-md
border border-slate-200/60 dark:border-slate-700/60
shadow-2xl rounded-xl
```

Decorative gradient orbs (violet/blue blurs) are allowed inside `DashboardCard` but must **not** be added to individual component files — they belong to the card primitive only.

---

## Forms & Inputs

```css
/* Input base */
bg-white dark:bg-slate-900
border border-slate-300 dark:border-slate-600
rounded-lg px-4 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-violet-500
transition-colors duration-150
```

---

## Status & Feedback

Use `StatusBadge` for exam/certification status chips. Use `AlertMessage` for page-level feedback banners. Do not define one-off status color classes in page files.

```
success → emerald
warning → amber
error   → red
info    → blue
pending → slate
```

---

## Banned Patterns (App Pages)

- Route-local card/surface class systems (`const cardClasses = '...'` in page files)
- `hover:scale-*` or `hover:-translate-y-*` on any interactive element
- Decorative gradient orbs outside of `DashboardCard`
- Multi-step gradient chains on individual text labels (use gradient text only on summary numbers in `StatsCard`)
- Redefining AppHeader shell classes outside `appheader.tsx`

---

## Implementation Checklist (App Pages)

- [ ] Wrap page in `PageWrapper` — do not set `min-h-screen` background manually
- [ ] Use `DashboardCard` / `DashboardCardHeader` / `DashboardCardContent` for all card surfaces
- [ ] Use `ActionButton` for all CTAs — do not write raw button variant classes in page files
- [ ] Use `StatusBadge` for exam/cert status — do not define per-status color in page files
- [ ] Use `AlertMessage` for feedback banners
- [ ] Inputs: `rounded-lg`, `focus:ring-2 focus:ring-violet-500`
- [ ] No banned motion patterns (`hover:scale-*`, `hover:-translate-y-*`)
- [ ] All components have `dark:` variants
- [ ] Responsive at `sm:`, `md:`, `lg:` breakpoints
- [ ] Compile check: `npx tsc --noEmit`

---

## Centralization Plan

See the phased plan below for migrating from the current inline-class state to a fully token-backed app theme.

### Phase 0 — Create `src/config/app-theme.ts`

**Goal**: Establish the config file as the single source of truth for app tokens. No component changes yet.

**Tasks**:

1. Create `src/config/app-theme.ts` with `appPageShell`, `appSurface`, `appHeader`, `appStatus`, `appButton`, `appMotion` token objects (shapes defined in Target State above).
2. Export an aggregate `appTheme` object and `AppTheme` type (mirrors `marketingTheme` pattern).
3. Add a JSDoc comment on each token group explaining its role.

**Acceptance criteria**:

- File compiles with `npx tsc --noEmit`.
- No existing component is modified in this phase.

---

### Phase 1 — Token-back `AppHeader`

**Goal**: Remove duplicated marketing-header strings from `appheader.tsx` and drive it from `appTheme.header`.

**Tasks**:

1. Replace the inline shell/navLink/navActive/navInactive/logoBadge class strings in `appheader.tsx` with imports from `appTheme.header`.
2. Verify visual parity by running the app and checking the header in light and dark mode.

**Files**: `src/components/custom/appheader.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- No functional change to header appearance.
- `appheader.tsx` contains zero raw Tailwind strings for shell/link/badge surfaces.

---

### Phase 2 — Token-back `DashboardCard`

**Goal**: Back `DashboardCard` with `appTheme.surface` tokens so any branding change flows from config.

**Tasks**:

1. Replace hardcoded class strings in `dashboard-card.tsx` with `appTheme.surface.card`, `appTheme.surface.cardHeader`, `appTheme.surface.cardContent`.
2. Ensure `variant="compact"` maps to `appTheme.surface.cardCompact`.

**Files**: `src/components/ui/dashboard-card.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- Changing a value in `appTheme.surface.card` visibly updates all `DashboardCard` instances.
- `dashboard-card.tsx` contains no raw card-surface Tailwind strings.

---

### Phase 3 — Token-back `PageWrapper`

**Goal**: Drive the page background gradient from `appTheme.pageShell`.

**Tasks**:

1. Replace the `bg-linear-to-br from-slate-50 ...` string in `page-wrapper.tsx` with `appTheme.pageShell.background`.
2. Update the container width class to use `appTheme.pageShell.container` where applicable.

**Files**: `src/components/ui/page-wrapper.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- Page background is driven entirely from `app-theme.ts`.

---

### Phase 4 — Centralize `StatusBadge` color map

**Goal**: Move per-status color definitions out of `status-badge.tsx` and into `appTheme.status`.

**Tasks**:

1. Add `appStatus` token map to `app-theme.ts` (see Target State section above).
2. Refactor `StatusBadge` to build its style from `appTheme.status[slot]` instead of inline switch branches.

**Files**: `src/components/ui/status-badge.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- Adding a new status slot requires a change only in `app-theme.ts`.
- `status-badge.tsx` has no hardcoded color classes.

---

### Phase 5 — Extend `ActionButton` with app-only variants

**Goal**: Add `success` and `outline` variants to `appTheme.button` so `ActionButton` has no hardcoded variants.

**Tasks**:

1. Add `appButton.success` and `appButton.outline` token strings to `app-theme.ts`.
2. Update `ActionButton.tsx` to import from `appTheme.button` for these variants instead of inline strings.

**Files**: `src/components/custom/ActionButton.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- `ActionButton` imports zero raw variant class strings.
- All four variants (`primary`, `secondary`, `success`, `outline`) are token-driven.

---

### Phase 6 — Reduce `QuestionCard` inline noise

**Goal**: Replace verbose gradient/blur chains in `QuestionCard` with `appTheme` surface tokens and remove unnecessary decorative layers.

**Tasks**:

1. Replace question badge and topic chip gradient chains with simpler token-aligned classes.
2. Replace card surface classes with `DashboardCard` usage (if not already) or `appTheme.surface.card`.
3. Confirm no `hover:scale-*` / `hover:-translate-y-*` patterns remain.

**Files**: `src/components/custom/QuestionCard.tsx`

**Acceptance criteria**:

- `QuestionCard` contains no multi-step gradient chains on label chips.
- Card surface driven from `DashboardCard` or `appTheme.surface`.

---

### Phase 7 — `StatsCard` alignment

**Goal**: Remove decorative orbs and align gradient-text to a token slot; bring `StatsCard` variants in line with app theme.

**Tasks**:

1. Remove or simplify absolute decorative blur orbs inside `StatsCard`.
2. Define `appTheme.stats.valueGradient` token for the gradient number text.
3. Map `StatsCard` variants to token values.

**Files**: `src/components/custom/StatsCard.tsx`, `src/config/app-theme.ts`

**Acceptance criteria**:

- Decorative orbs are removed or minimal (single orb max per card).
- Gradient text value driven from a token.

---

### PR Review Checklist for App Routes

Before merging any PR that adds/edits authenticated app pages:

- Uses `PageWrapper` for page background
- Uses `DashboardCard` for card surfaces
- Uses `ActionButton` for CTAs
- No route-local card/button/surface class systems
- No `hover:scale-*` or `hover:-translate-y-*`
- `npx tsc --noEmit` passes
