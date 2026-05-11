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
