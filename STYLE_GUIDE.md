# Certifai Design System & Style Guide

Essential patterns and reusable components for consistent development.

## Core Design Principles

- **Minimal & Clean**: Focus on content, whitespace, and readable typography
- **Unified Color**: Single accent color (violet) with neutral grays
- **Glass-morphism**: Semi-transparent elements with `backdrop-blur-sm`
- **Mobile-first**: Responsive with `sm:`, `md:`, `lg:` breakpoints
- **Dark mode**: All components support `dark:` variants
- **No visual noise**: Remove colored icons, badges, and excessive styling

## Layout Structure

### Standard Page Container (Landing/Marketing Pages)

```tsx
<div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden">
  {/* Page sections with consistent padding */}
</div>
```

### Standard Section Layout

```tsx
<section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">{/* Section content */}</div>
</section>
```

**Key Section Spacing:**

- Horizontal: `container mx-auto px-4 sm:px-6 lg:px-8` (responsive padding)
- Vertical: `py-16 sm:py-20 lg:py-24` (consistent section spacing)
- Content max-width: `max-w-3xl mx-auto` or `max-w-4xl mx-auto`
- Grid gaps: `gap-8` with `md:grid-cols-2` or `md:grid-cols-3`

## Essential Colors (Landing/Marketing Pages)

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

**Use neutral palette (grays/whites) + violet accent only. No colors for AWS/Azure/GCP/etc.**

## Reusable Components & Patterns

### Feature Card (Landing Page Style)

```tsx
<div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden">
  {/* Numbered step indicator */}
  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center mb-8">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">1</span>
  </div>

  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Feature Title</h3>

  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg grow">
    Feature description text.
  </p>
</div>
```

**Key characteristics:**

- Rounded corners: `rounded-3xl` (large), `rounded-2xl` (medium)
- No colored backgrounds for indicators (first item uses violet, others use slate)
- Padding: `p-8`
- Grid: `gap-8 md:grid-cols-2` or `md:grid-cols-3`
- Hover: subtle shadow increase, border color shift
- Typography: headings `text-2xl font-bold`, body `text-lg leading-relaxed`

### Certification Card (Landing Page Style)

```tsx
<Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-md transition-colors duration-300">
  <CardContent className="p-8 flex flex-col h-full space-y-6">
    {/* Simple text, no colored badge */}
    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Provider Name</div>

    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Certification Name</h3>

    <p className="text-base text-slate-600 dark:text-slate-400 flex-auto">Description text.</p>

    {/* CTA Button */}
    <ActionButton variant="secondary" size="lg" fullWidth>
      Start Practicing
    </ActionButton>
  </CardContent>
</Card>
```

**Key characteristics:**

- No colored badges or provider indicators
- Simple text for provider name (neutral gray)
- Grid: `gap-8 md:grid-cols-2 lg:grid-cols-3`

### Step Indicator Badges

```tsx
{
  /* First step (accent) */
}
<div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center">
  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">1</span>
</div>;

{
  /* Subsequent steps (neutral) */
}
<div className="w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center">
  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">2</span>
</div>;
```

**Key characteristics:**

- Size: `w-10 h-10` (small), `w-12 h-12` (medium)
- Rounded: `rounded-lg`
- First indicator: violet accent
- Others: neutral slate
- Never use colored icons or graphics

## Spacing Scale

```css
space-y-10    /* Between major sections */
space-y-6     /* Between content blocks */
space-y-4     /* Between form elements */
space-y-2     /* Between related items */
```

## Typography (Landing/Marketing Pages)

### Headings

```css
/* Page/Section Title (H1/H2) */
text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight

/* Card Title (H3) */
text-2xl font-bold text-slate-900 dark:text-slate-100

/* Smaller Title (H4) */
text-xl font-bold text-slate-900 dark:text-slate-100
```

### Body Text

```css
/* Primary body - featured content */
text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light

/* Secondary body - smaller */
text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-light

/* Card body text */
text-base text-slate-600 dark:text-slate-400 leading-relaxed
```

### Key Typography Rules

- Use `font-light` for body (lighter weight, more minimal)
- Use `font-bold` for headings only
- Use `leading-relaxed` for readability
- Use `tracking-tight` for tighter letter spacing on headings

## Buttons (Landing/Marketing Pages)

### Primary Button (CTA)

```tsx
<Button className="rounded-lg px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-sm transition-colors duration-200 bg-violet-600 hover:bg-violet-700">
  Begin Learning
</Button>
```

### Outline Button (Secondary CTA)

```tsx
<Button
  variant="outline"
  className="rounded-lg px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
>
  Sign In
</Button>
```

### ActionButton Component (Preferred)

```tsx
<ActionButton variant="primary" size="lg">
  Explore All Topics
</ActionButton>
```

**Button Characteristics:**

- Border radius: `rounded-lg` (NOT `rounded-xl` or `rounded-3xl`)
- Padding: `px-8 py-4` for full-size, `px-6 py-3` for medium
- Font: `font-semibold text-lg` or `font-semibold`
- States: `transition-colors duration-200` (color only, no scale/translate)
- Hover shadow: minimal `hover:shadow-sm`
- Primary color: `bg-violet-600 hover:bg-violet-700`

## Interactive States

```css
/* Card hover - Landing pages (MINIMAL approach) */
hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300

/* Button hover - Landing pages */
hover:shadow-sm transition-colors duration-200

/* NO scale/translate transforms on landing pages - keep minimal */
```

## Implementation Checklist (Landing/Marketing Pages)

- [ ] **Color palette**: Use whites, grays, and violet accent only (NO colored badges/indicators)
- [ ] **Typography**: Headings `font-bold`, body `font-light` with `leading-relaxed`
- [ ] **Cards**: Use `rounded-2xl` or `rounded-3xl`, `p-8`, `gap-8` in grids
- [ ] **Buttons**: Use `rounded-lg` (NOT `rounded-xl`), `transition-colors` only
- [ ] **Spacing**: Sections use `py-16 sm:py-20 lg:py-24`, containers use `px-4 sm:px-6 lg:px-8`
- [ ] **Step indicators**: Use numbered badges, violet accent for first step only
- [ ] **Hover states**: Minimal (shadow + border color shift, NO scale/translate)
- [ ] **Dark mode**: All components have `dark:` variants
- [ ] **Responsive**: Test at `sm:`, `md:`, `lg:` breakpoints
- [ ] **No visual noise**: Remove icons, gradients, and excessive effects

---

## Quick Reference: Landing Page CSS Patterns

### Most Common Classes

```tsx
// Page wrapper
'min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden';

// Section container
'relative py-16 sm:py-20 lg:py-24 overflow-hidden';
'container mx-auto px-4 sm:px-6 lg:px-8';

// Feature/Product Card
'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300';

// Certification Card
'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl';

// Step Badge (First - Violet)
'w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center';

// Step Badge (Other - Neutral)
'w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center';

// Primary Button
'rounded-lg px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-sm transition-colors duration-200 bg-violet-600 hover:bg-violet-700';

// Heading (H2/Section Title)
'text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight';

// Body Text
'text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light';
```

## Key Changes from Previous Design

| Aspect             | Before                                             | Now                                                   |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------- |
| **Colors**         | Colored badges (AWS: orange, Azure: blue, etc.)    | Neutral palette + violet accent only                  |
| **Icons**          | Colored SVG icons with gradients                   | Numbered step badges (1, 2, 3, 4)                     |
| **Cards**          | `rounded-3xl` with hover scale/translate           | `rounded-2xl`/`rounded-3xl` with subtle hover effects |
| **Buttons**        | `rounded-xl` with complex styling                  | `rounded-lg` with `transition-colors` only            |
| **Spacing**        | Various padding sizes                              | Standardized `py-16 sm:py-20 lg:py-24` sections       |
| **Visual Effects** | Multiple hover effects (scale, translate, shadows) | Minimal (shadow increase + border color shift)        |
| **Typography**     | Bold headers with colored spans                    | Clean bold headers, `font-light` body text            |

## Refactoring Other Pages

When refactoring marketing pages to match this style:

1. **Remove all colored badges/icons** - Replace with neutral styling
2. **Update button styling** - Change all buttons to `rounded-lg`
3. **Simplify cards** - Remove colored backgrounds, use neutral whites/slates
4. **Standardize spacing** - Use section padding `py-16 sm:py-20 lg:py-24`
5. **Minimize hover effects** - Keep to shadow and border color changes only
6. **Use single accent color** - Violet only for highlights and CTAs
7. **Apply typography rules** - `font-light` for body, `font-bold` for headings
