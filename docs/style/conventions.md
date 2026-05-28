# Style Conventions

> **Source of truth**: `styleguide/README.md`, `styleguide/app.md`, `styleguide/shared.md`, `src/components/ui/`, `src/config/marketing-theme.ts`
> **Last reviewed**: 2026-05-28
> **Owner**: engineering / design

## Purpose

Documents the UI and styling conventions for `certifai-app`: Tailwind utility patterns, shadcn/ui component usage, `cn()` rules, dark mode requirements, component location rules, and design tokens.

## Key Concepts

- **Tailwind CSS**: utility-first CSS framework. Never write custom CSS files.
- **shadcn/ui**: component library providing accessible primitives in `src/components/ui/`.
- **`cn()`**: class merging utility from `src/lib/utils.ts`. Required for all conditional className logic.
- **Design tokens**: shared visual constants. `styleguide/shared.md` covers all surfaces; `styleguide/app.md` covers authenticated app surfaces; `src/config/marketing-theme.ts` covers marketing-specific tokens.
- **Dark mode**: all components must include `dark:` variant classes.

## Core Design Principles

(From `styleguide/shared.md`)

1. **Minimal & clean** — whitespace-first; avoid decorative noise.
2. **Unified color** — violet accent (`violet-600` / `violet-400` dark) + neutral grays (slate palette).
3. **Glass-morphism** — `bg-white/90 backdrop-blur-md` for cards; never raw `bg-white`.
4. **Mobile-first** — use `sm:`, `md:`, `lg:` breakpoints; never desktop-only styles.
5. **Dark mode always** — every class that changes appearance must have a `dark:` counterpart.
6. **No brand colors** — do not use AWS/Azure/GCP brand colors on shared components.

## Essential Color Tokens

```css
/* Page background */
bg-slate-50 dark:bg-slate-900

/* Card background (glass-morphism) */
bg-white/90 dark:bg-slate-800/90 backdrop-blur-md

/* Primary heading text */
text-slate-900 dark:text-slate-100

/* Body copy */
text-slate-600 dark:text-slate-400

/* Accent (links, highlights) */
text-violet-600 dark:text-violet-400

/* Borders */
border-slate-200/60 dark:border-slate-700/60
```

## Component Location Rules

| Type | Location | Example |
| ---- | -------- | ------- |
| shadcn/ui primitives | `src/components/ui/` | `Button`, `Card`, `Dialog`, `Badge` |
| Domain-specific components | `src/components/custom/` | `ExamCard`, `CertificationCard` |
| Auth-specific components | `src/components/auth/` | `AuthLeftSection`, `ServerAuthWrapper` |
| Billing-specific components | `src/components/billing/` | `BillingComponents` |
| Analytics components | `src/components/analytics/` | `GoogleAnalytics`, `ConsentAwareAnalytics` |
| Navigation components | `src/components/navigation/` | Nav bars, menus |
| Marketing components | `src/components/marketing/` | Landing sections |

Never add domain components directly to `src/components/ui/` — that folder is for shadcn/ui primitives only.

## `cn()` Usage

```typescript
import { cn } from '@/src/lib/utils';

// Always use cn() for conditional / merged classNames
<div className={cn(
  'base-classes here',
  isActive && 'active-state-classes',
  variant === 'compact' && 'compact-variant-classes',
  className,   // always accept and forward incoming className last
)} />
```

Never concatenate class strings with template literals — use `cn()`.

## shadcn/ui Component Usage

shadcn/ui components are copied into `src/components/ui/` and can be modified. Available primitives:

`accordion`, `alert-dialog`, `alert`, `avatar`, `badge`, `button`, `card`, `card-skeletons`, `checkbox`, `dashboard-card`, `dialog`, `dropdown-menu`, `input`, `label`, `loading-spinner`, `page-wrapper`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `tooltip`

Prefer shadcn/ui primitives before building new custom components.

## Conventions / Rules

- Always include `dark:` variants for any class that changes color, background, or border.
- Use the slate + violet palette only — no arbitrary colors.
- Cards must use the glass-morphism pattern: `bg-white/90 dark:bg-slate-900/90 backdrop-blur-md`.
- Page containers: `max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12`.
- Status colors (exam statuses, error/success states) should use the semantic color map in `StatusBadge` — not hardcoded per component.
- `AppHeader` imports from `src/config/marketing-theme.ts` for shared header tokens — do not duplicate inline.

## Dangerous Areas / Anti-patterns

- **Never bypass `cn()`** for conditional class merging — template literals break Tailwind's JIT detection.
- **Never write custom CSS** classes outside of `app/globals.css` — use Tailwind utilities.
- **Never add raw `bg-white`** to cards — always use the glass-morphism pattern.
- **Never skip dark mode** — visual regression in dark mode is a product issue, not cosmetic.
- **Never add decorative orbs, gradients, or blur chains** without first checking `styleguide/shared.md` — visual noise is explicitly called out as an anti-pattern.

## Related Docs

- `styleguide/README.md` — styleguide instruction entry and docs bridge contract
- `styleguide/app.md` — app surface tokens (dashboard, exam, account pages)
- `styleguide/shared.md` — shared design principles and color tokens
- `styleguide/marketing.md` — marketing-specific tokens
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
