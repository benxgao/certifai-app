# App Styleguide Upgrade — Rollout Plan

**Created**: 11 May 2026
**Status**: Backlog
**Reference**: [`styleguide/app.md`](../../styleguide/app.md)

## Context

The marketing layer already has a centralized token system (`src/config/marketing-theme.ts`) and a set of primitive components (`MarketingPageShell`, `MarketingSection`, `MarketingCard`, etc.) that enforce consistent styling with no route-level drift.

The authenticated app has no equivalent. All surface styles — page backgrounds, card glass-morphism, header shell, status colors, button variants — are hardcoded inline across individual component files. This causes:

- Branding changes requiring edits across many files
- Duplicate Tailwind strings (e.g. `AppHeader` re-defines strings already in `marketingTheme.header`)
- Visual inconsistency between components (varying shadow levels, border opacities, blur depths)
- Review noise: PRs cannot be checked against a single style contract

The goal of this rollout is to produce `src/config/app-theme.ts` as the app-layer equivalent of `marketing-theme.ts`, and to back all major app primitives against it.

---

## Scope

**Files to create**: 1 (`src/config/app-theme.ts`)

**Files to modify**: 6

- `src/components/custom/appheader.tsx`
- `src/components/ui/dashboard-card.tsx`
- `src/components/ui/page-wrapper.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/custom/ActionButton.tsx`
- `src/components/custom/QuestionCard.tsx`
- `src/components/custom/StatsCard.tsx`

**Out of scope**:

- Changing visual appearance (pixel-identical output expected at each phase)
- Refactoring component props or APIs
- Marketing page components (already token-backed)
- `AlertMessage` (already delegates to shadcn Alert system — no change needed)

---

## Risk

**Low–Medium.** Each phase is independently mergeable and reversible. The only functional risk is a visual regression if a token string is copied incorrectly. All phases gate on `npx tsc --noEmit` and manual light/dark visual check.

---

## Phase 0 — Create `src/config/app-theme.ts`

**Goal**: Establish the config file as sole source of truth. No component changes.

### Tasks

1. Create `src/config/app-theme.ts` with the following token groups:
   - `appPageShell` — page background + container width
   - `appSurface` — `card`, `cardCompact`, `cardHeader`, `cardContent`
   - `appHeader` — `shell`, `logoBadge`, `navLink`, `navActive`, `navInactive`
   - `appStatus` — semantic color slots: `success`, `warning`, `error`, `info`, `pending` (each has `bg` + `text`)
   - `appButton` — `success`, `outline` (primary/secondary remain in `marketingTheme.button`)
   - `appMotion` — `card`, `subtle` (mirrors marketing motion tokens)
2. Export aggregate `appTheme` object and `AppTheme` type.
3. Add JSDoc comment on each token group.

### Acceptance criteria

- `npx tsc --noEmit` passes with no errors in `src/config/app-theme.ts`.
- No existing component is modified.
- Token strings match exactly what is currently hardcoded in consuming components (verified by grep).

### Grep verification

```bash
# Verify card token matches current DashboardCard
grep -n "bg-white/90 dark:bg-slate-900/90" src/components/ui/dashboard-card.tsx

# Verify header token matches current AppHeader
grep -n "sticky top-0 z-50" src/components/custom/appheader.tsx
```

---

## Phase 1 — Token-back `AppHeader`

**Goal**: Remove duplicated marketing-header strings; drive `AppHeader` from `appTheme.header`.

### Tasks

1. Import `appTheme` from `src/config/app-theme.ts` in `appheader.tsx`.
2. Replace inline class strings for: `shell`, `logoBadge`, `navLink`, `navActive`, `navInactive` with `appTheme.header.*` references.
3. Remove any remaining strings that are identical to `marketingTheme.header` (should be zero after this change).

### Files

- `src/components/custom/appheader.tsx`

### Acceptance criteria

- Header renders identically in light and dark mode.
- `appheader.tsx` contains no raw Tailwind strings for shell/link/badge surfaces.
- `npx tsc --noEmit` passes.

---

## Phase 2 — Token-back `DashboardCard`

**Goal**: Back the `DashboardCard` glass-morphism surface against `appTheme.surface`.

### Tasks

1. Import `appTheme` in `src/components/ui/dashboard-card.tsx`.
2. Replace hardcoded class strings:
   - `DashboardCard` base → `appTheme.surface.card`
   - `DashboardCard variant="compact"` → `appTheme.surface.cardCompact`
   - `DashboardCardHeader` → `appTheme.surface.cardHeader`
   - `DashboardCardContent` → `appTheme.surface.cardContent`

### Files

- `src/components/ui/dashboard-card.tsx`

### Acceptance criteria

- Changing `appTheme.surface.card` visibly updates all `DashboardCard` instances.
- `dashboard-card.tsx` contains no raw card-surface Tailwind strings.
- `npx tsc --noEmit` passes.

---

## Phase 3 — Token-back `PageWrapper`

**Goal**: Drive page background gradient from `appTheme.pageShell`.

### Tasks

1. Import `appTheme` in `src/components/ui/page-wrapper.tsx`.
2. Replace the `bg-linear-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:...` string with `appTheme.pageShell.background`.

### Files

- `src/components/ui/page-wrapper.tsx`

### Acceptance criteria

- Page background is driven entirely from `app-theme.ts`.
- Authenticated pages render with unchanged background gradient.
- `npx tsc --noEmit` passes.

---

## Phase 4 — Centralize `StatusBadge` color map

**Goal**: Replace local per-status color switch in `StatusBadge` with `appTheme.status` slots.

### Tasks

1. Add `appStatus` token map to `app-theme.ts` (if not already in Phase 0 output).
2. In `status-badge.tsx`, replace each `bgColor`/`textColor` inline string with the corresponding `appTheme.status[slot].bg` and `appTheme.status[slot].text`.
3. Map existing status types: `completed/passed → success`, `failed/generation_failed → error`, `generating/info → info`, `pending/not_started → pending`, `ready/active → success or pending` (confirm mapping with design).

### Files

- `src/components/ui/status-badge.tsx`
- `src/config/app-theme.ts`

### Acceptance criteria

- Adding a new status slot requires a change only in `app-theme.ts`.
- `status-badge.tsx` has no hardcoded color class strings.
- All existing badge variants render with unchanged appearance.
- `npx tsc --noEmit` passes.

---

## Phase 5 — Complete `ActionButton` token coverage

**Goal**: Remove the two remaining hardcoded variants (`success`, `outline`) from `ActionButton`.

### Tasks

1. Add `appButton.success` and `appButton.outline` to `app-theme.ts`.
2. Update `ActionButton.tsx` to import from `appTheme.button` for these two variants.
3. Verify `primary` and `secondary` still resolve through `marketingTheme.button` (no change needed).

### Files

- `src/components/custom/ActionButton.tsx`
- `src/config/app-theme.ts`

### Acceptance criteria

- `ActionButton` imports zero raw variant class strings for any of its four variants.
- All button variants (`primary`, `secondary`, `success`, `outline`) render identically to current.
- `npx tsc --noEmit` passes.

---

## Phase 6 — Reduce `QuestionCard` inline noise

**Goal**: Remove multi-layer gradient chains and align `QuestionCard` to `DashboardCard` / `appTheme.surface`.

### Tasks

1. Replace the card wrapper surface classes in `QuestionCard` with `DashboardCard` (or `cn(appTheme.surface.card, ...)` if wrapping would change DOM structure).
2. Simplify the question number badge: replace multi-step gradient chain with a single violet accent class from `appTheme`.
3. Simplify the topic chip: replace multi-step gradient chain with a neutral slate surface from `appTheme.surface`.
4. Confirm no `hover:scale-*` or `hover:-translate-y-*` patterns remain.

### Files

- `src/components/custom/QuestionCard.tsx`

### Acceptance criteria

- `QuestionCard` contains no multi-step gradient chains on label chips.
- Card surface is consistent with other `DashboardCard` instances.
- Visual appearance is equivalent — same color family, same depth impression.
- `npx tsc --noEmit` passes.

---

## Phase 7 — `StatsCard` alignment

**Goal**: Reduce decorative noise in `StatsCard` and align gradient-text to a token slot.

### Tasks

1. Remove or reduce the two absolute gradient orbs (violet/blue blurs) inside `StatsCard`. At most one orb is allowed per card (to remain consistent with `DashboardCard`'s own orb treatment).
2. Define `appTheme.stats.valueGradient` token for the gradient number text (e.g. `from-slate-900 via-violet-700 to-blue-700 dark:from-slate-100 dark:via-violet-300 dark:to-blue-300`).
3. Map `StatsCard` `overview` and `default` variant surface classes to `appTheme.surface.card` / `appTheme.surface.cardCompact`.
4. Remove `hover:shadow-2xl` and `hover:shadow-xl` transition chains — replace with `appTheme.motion.card`.

### Files

- `src/components/custom/StatsCard.tsx`
- `src/config/app-theme.ts`

### Acceptance criteria

- Decorative orbs reduced to one or zero per card.
- Gradient text number driven from a single token.
- StatsCard hover behavior uses motion token.
- `npx tsc --noEmit` passes.

---

## Post-Rollout: PR Guardrails

After all phases are merged, add the following checks to the PR review process for authenticated app routes (mirror the marketing checklist in `styleguide/app.md`):

```bash
# No banned motion patterns
grep -rn "hover:scale-\|hover:-translate-y-" app/main src/components/custom src/components/ui

# No route-local card/button surface class systems
grep -rn "const .*\(card\|button\|surface\).*class\|const .*Classes\s*=" app/main
```

Update `styleguide/app.md` PR checklist to reference `app-theme.ts` once Phase 0 is live.

---

## Implementation Order

```
Phase 0  →  Phase 1  →  Phase 2  →  Phase 3
                                         ↓
                         Phase 7  ←  Phase 4
                             ↓
                         Phase 5
                             ↓
                         Phase 6
```

Phases 1–3 are independent after Phase 0 and can be reviewed in parallel. Phases 4–7 depend on Phase 0 only.
