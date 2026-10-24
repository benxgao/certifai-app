# Certifai Shared Design System

Styles and tokens shared across **all** surfaces (marketing pages, app, auth flows, etc.).

> **Precedence rule**: If any class snippet here conflicts with `src/config/marketing-theme.ts`, the config file wins.

---

## Core Design Principles

- **Minimal & Clean**: Focus on content, whitespace, and readable typography
- **Unified Color**: Single accent color (violet) with neutral grays
- **Glass-morphism**: Semi-transparent elements with `backdrop-blur-sm`
- **Mobile-first**: Responsive with `sm:`, `md:`, `lg:` breakpoints
- **Dark mode**: All components support `dark:` variants
- **No visual noise**: Avoid excessive styling and keep decorative accents token-driven

---

## Essential Colors

### Backgrounds

```css
/* Page backgrounds */
bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br

/* Section backgrounds (subtle) */
bg-slate-50/50 dark:bg-slate-800/30

/* Card backgrounds */
bg-white/90 dark:bg-slate-800/90           /* Primary cards */
```

### Text Colors

```css
/* Headings */
text-slate-900 dark:text-slate-100         /* Primary headings (h1, h2) */

/* Body text */
text-slate-600 dark:text-slate-400         /* Primary body copy */
text-slate-500 dark:text-slate-400         /* Secondary text */

/* Accent only */
text-violet-600 dark:text-violet-400       /* Links, highlights */
text-violet-700 dark:text-violet-300       /* Hover states */
```

### Borders

```css
border-slate-200/60 dark:border-slate-700/60
border-slate-300/60 dark:border-slate-600/60       /* Hover state borders */
```

### Key Principle

**Use neutral palette (grays/whites) + violet accent only. No brand colors for AWS/Azure/GCP/etc.**

---

## Spacing Scale

```css
space-y-10    /* Between major sections */
space-y-6     /* Between content blocks */
space-y-4     /* Between form elements */
space-y-2     /* Between related items */
```

---

## Typography

### Headings

```css
/* Hero Title (H1) */
text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight

/* Section Title (H2) */
text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight

/* Card/Feature Titles (H3) */
text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight
```

### Body Text

```css
/* Primary body */
text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light

/* Secondary body text */
text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-light

/* Card/Feature body text */
text-base text-slate-600 dark:text-slate-400 leading-relaxed

/* Provider/Meta text */
text-sm font-semibold text-slate-500 dark:text-slate-400
```

### Key Typography Rules

- Use `font-light` for body (lighter weight, more minimal)
- Use `font-bold` for headings only
- Use `font-semibold` for provider/meta names
- Use `leading-relaxed` for readability
- Use `tracking-tight` on all headings

---

## Interactive States

```css
/* Card hover (minimal approach) */
hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300

/* Button hover */
hover:shadow-sm transition-colors duration-200

/* BANNED: scale/translate transforms — keep all hover interactions minimal */
/* hover:scale-*  hover:-translate-y-* */
```

---

## Auth Screens (`/signin`, `/signup`, `/forgot-password`)

Auth flows are neutral-first like marketing, but use app-grade form density.

**Source of truth:** `src/config/auth-theme.ts` (`authPage`, `authCard`, `authHeading`, `authField`, `authButton`, `authLink`, `authNote`, `authAside`).

**Primitives:** `src/components/auth/` — `AuthPageShell` (background + header/banner slots + two-column grid), `AuthCard`/`AuthCardHeader` (surface + eyebrow/title/subtitle), `AuthField` (label + input + icon/trailing/hint), `PasswordField` (adds the reveal toggle), `AuthLeftSection` (marketing column), `AuthAsidePreview` (decorative product preview for that column).

**Auth aside (left column)**

The aside reuses the homepage hero vocabulary instead of inventing its own: `MarketingBadge` pill → display title with **one** gradient clause (`copy.gradient`) → `font-light` body → a product preview → quiet trust row. Pills, gradients, inset surfaces and the preview primitives (`PreviewWindow`, `TopicRow`, `Chip`) all come from `marketing-theme` / `components/marketing`; only the auth-specific sizes live in `authAside`.

- No button-shaped elements in the preview (see `marketing.md` — faux buttons read as real controls). The preview shows the report/generation state; the card next to it is the only CTA on the page.

- `signup` previews the generation moment (exam studio); `signin` previews the last report — the thing each mode is actually about.
- The preview is decorative: `aria-hidden` at the wrapper, no real `button`/`a` inside, and every fact it shows is repeated in the copy. It is illustrative data (SAA-C03, 82%), never a claim about the user's account.
- Title maxes at 2.5rem (the homepage hero is 3.35rem) so the form card stays the focal point.
- The grid is `items-start`: the aside and the card share a top edge. Do not centre the row — the card's height varies per page, so centring would reintroduce the uneven-shoulder offset (26px on `/signin`, 209px on `/signup`).
- The aside lives in its own stretching track (`authPage.asideColumn` + `asideSticky`): it is top-aligned like the card, then pins 31px under the sticky header once the tall signup form starts scrolling. Two rules keep this working:
  - the page shell uses `overflow-x-clip`, **not** `overflow-x-hidden` — `hidden` makes the shell a scroll container and silently kills `position: sticky` for every descendant;
  - the track overrides the grid's `items-start` with `self-stretch`, otherwise a short aside has no room to travel.

Rules:

- Both auth routes must render through `AuthPageShell` + `AuthCard`; do not reintroduce route-local card/shell class strings.
- Controls are 44px tall (`h-11`) with `rounded-xl`; the card is `rounded-2xl`, so controls never match the card radius.
- Fields use `AuthField`/`PasswordField`. Native props (`id`, `name`, `type`, `autoComplete`, `required`, `minLength`, handlers) must stay on the page — the primitives are presentation only.
- Focus indication is required for both pointer and keyboard users: `focus:` **and** `focus-visible:` border + 2px violet ring.
- No `hover:scale-*` / `hover:-translate-y-*`, no shine sweeps, no per-page gradient button systems.
- Placeholder text must be `slate-500` on light surfaces (slate-400 fails AA).
