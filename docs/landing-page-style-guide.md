# Landing Page Style Guide - Certifai

A comprehensive style guide for creating consistent, professional landing pages based on the current homepage design patterns.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout Structure](#layout-structure)
5. [Component Patterns](#component-patterns)
6. [Background Effects](#background-effects)
7. [Responsive Design](#responsive-design)
8. [Interactive Elements](#interactive-elements)
9. [Content Sections](#content-sections)
10. [Implementation Guidelines](#implementation-guidelines)

## Design Principles

### Core Philosophy

- **Premium Feel**: Glass-morphism, subtle gradients, and elevated shadows
- **Professional Aesthetic**: Clean, modern, corporate-ready design
- **Adaptive**: Mobile-first responsive design with careful breakpoint handling
- **Accessible**: High contrast ratios and ARIA compliance
- **Performance**: Optimized animations and efficient rendering

### Visual Hierarchy

1. **Primary**: Gradient text, large typography, prominent CTAs
2. **Secondary**: Standard typography with accent colors
3. **Tertiary**: Muted text and supporting elements

## Color System

### Background Gradients

```css
/* Primary page background */
bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800

/* Section backgrounds */
bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900
bg-slate-50/50 dark:bg-slate-800/30

/* Overlay gradients */
bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30
dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10
```

### Brand Colors

```css
/* Primary brand gradient */
bg-gradient-to-r from-violet-600 to-blue-600
text-transparent bg-clip-text

/* Hover states */
hover:from-violet-700 hover:to-blue-700

/* Accent colors for different providers */
AWS: from-orange-500/10 to-amber-500/10
Azure: from-blue-500/10 to-cyan-500/10
GCP: from-emerald-500/10 to-green-500/10
CompTIA: from-purple-500/10 to-violet-500/10
Cisco: from-sky-500/10 to-blue-500/10
```

### Card Colors

```css
/* Primary cards */
bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm

/* Secondary cards */
bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg

/* Borders */
border border-slate-200/60 dark:border-slate-700/60
border-2 border-slate-200 dark:border-slate-700
```

### Text Colors

```css
/* Primary headings */
text-slate-900 dark:text-slate-100

/* Secondary headings */
text-slate-900 dark:text-slate-50

/* Body text */
text-slate-600 dark:text-slate-400

/* Muted text */
text-slate-500 dark:text-slate-400

/* Links */
text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300
```

## Typography

### Heading Scale

```css
/* Hero Title (H1) */
text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold

/* Section Title (H2) */
text-4xl lg:text-5xl xl:text-6xl font-bold

/* Subsection Title (H3) */
text-2xl font-bold

/* Card Title */
text-xl font-bold

/* Small Title */
text-lg font-bold
```

### Body Text

```css
/* Large body */
text-xl lg:text-2xl leading-relaxed font-light

/* Standard body */
text-base sm:text-lg lg:text-xl leading-relaxed

/* Small body */
text-sm leading-relaxed

/* Caption */
text-xs text-slate-500 dark:text-slate-400
```

### Special Typography

```css
/* Gradient text */
bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent font-extrabold

/* Tracking */
tracking-tight /* For headings */
tracking-normal /* For body text */
```

## Layout Structure

### Page Container

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
  {/* Page content */}
</div>
```

### Section Container

```tsx
<section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
  <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">{/* Section content */}</div>
  </div>
</section>
```

### Content Width Limits

```css
max-w-5xl mx-auto   /* Hero content */
max-w-4xl mx-auto   /* Section headers */
max-w-7xl mx-auto   /* Full content */
max-w-3xl mx-auto   /* Narrow content */
```

## Component Patterns

### Hero Section

```tsx
<section className="relative overflow-hidden" role="banner">
  {/* Background decorative elements */}
  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
  <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

  <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
    <div className="text-center max-w-5xl mx-auto">{/* Hero content */}</div>
  </div>
</section>
```

### Feature Cards

```tsx
<div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
  {/* Background gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent dark:from-violet-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

  {/* Icon */}
  <div className="relative w-20 h-20 bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
    {/* Icon content */}
  </div>

  {/* Content */}
  {/* CTA */}
</div>
```

### Stats Display

```tsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
  <div className="text-center">
    <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">100+ Certs</div>
    <div className="text-sm text-slate-500 dark:text-slate-400">AWS • Azure • GCP</div>
  </div>
  <div
    className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"
    aria-hidden="true"
  ></div>
  {/* More stats */}
</div>
```

## Background Effects

### Decorative Blurs

```css
/* Large blur elements */
w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl

/* Medium blur elements */
w-32 sm:w-48 h-32 sm:h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl

/* Positioning */
absolute top-20 right-2 sm:right-10
absolute bottom-20 left-2 sm:left-10
absolute top-10 left-1/4
absolute bottom-10 right-1/4
```

### Overlay Gradients

```css
/* Subtle overlays */
absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20
dark:from-violet-900/5 dark:via-transparent dark:to-blue-900/5

/* Stronger overlays */
absolute inset-0 bg-gradient-to-br from-violet-50/80 via-transparent to-blue-50/60
dark:from-violet-900/20 dark:via-transparent dark:to-blue-900/15
```

## Responsive Design

### Breakpoint Strategy

```css
/* Mobile first approach */
base      /* 0px+ */
sm:       /* 640px+ */
md:       /* 768px+ */
lg:       /* 1024px+ */
xl:       /* 1280px+ */
2xl:      /* 1536px+ */
```

### Common Responsive Patterns

```css
/* Text scaling */
text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl

/* Spacing scaling */
py-16 sm:py-20 lg:py-24
px-4 sm:px-6 lg:px-8
pt-20 sm:pt-24 lg:pt-28

/* Grid scaling */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Flex direction */
flex-col sm:flex-row

/* Visibility */
hidden sm:block
block sm:hidden
```

### Mobile Considerations

```css
/* Touch targets */
min-h-[44px] min-w-[44px]

/* Safe areas */
px-4 /* Minimum side padding */

/* Overflow handling */
overflow-x-hidden

/* Image sizing */
w-full h-auto
```

## Interactive Elements

### Button Styles

```tsx
/* Primary CTA */
<Button className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">

/* Secondary CTA */
<Button variant="outline" className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">

/* Large CTA */
<Button className="w-full sm:w-auto rounded-2xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transform hover:scale-105">
```

### Hover Effects

```css
/* Card hover */
hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105

/* Icon hover */
group-hover:scale-110 group-hover:rotate-3 transition-all duration-500

/* Text hover */
group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300

/* Arrow hover */
group-hover:translate-x-3 transition-all duration-300
```

### Focus States

```css
/* Interactive elements */
focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:outline-none

/* Buttons */
focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
```

## Content Sections

### Section Header Pattern

```tsx
<div className="text-center mb-16 sm:mb-20">
  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
    Section Title with{' '}
    <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
      Gradient Accent
    </span>
  </h2>
  <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
    Supporting description text that provides context and value proposition.
  </p>
</div>
```

### CTA Section Pattern

```tsx
<section className="relative py-16 sm:py-24 overflow-hidden">
  <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/30 dark:from-violet-900/10 dark:to-blue-900/5 rounded-3xl"></div>

      <div className="relative z-10">{/* CTA content */}</div>
    </div>
  </div>
</section>
```

## Implementation Guidelines

### Development Workflow

1. **Start with mobile**: Design and implement mobile-first
2. **Add breakpoints**: Scale up with responsive classes
3. **Test dark mode**: Ensure all variants work properly
4. **Optimize performance**: Use appropriate loading strategies
5. **Validate accessibility**: Check contrast and ARIA labels

### Performance Considerations

```tsx
/* Image optimization */
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={true} // For above-fold images
  className="w-full h-auto"
/>

/* Lazy loading for below-fold content */
loading="lazy"

/* Preload critical resources */
<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin />
```

### SEO Best Practices

```tsx
/* Semantic HTML */
<section role="banner">         // For hero sections
<section aria-labelledby="id">  // For content sections
<nav role="navigation">         // For navigation

/* Structured headings */
<h1> // Page title (only one per page)
<h2> // Section titles
<h3> // Subsection titles

/* Descriptive links */
<Link href="/certifications" className="...">
  View All 100+ IT Certifications
</Link>
```

### Accessibility Checklist

- [ ] Minimum 4.5:1 contrast ratio for text
- [ ] Focus indicators on all interactive elements
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for all images
- [ ] ARIA labels for decorative elements (`aria-hidden="true"`)
- [ ] Keyboard navigation support
- [ ] Screen reader testing

### Testing Checklist

- [ ] Mobile responsiveness (320px to 1920px+)
- [ ] Dark mode functionality
- [ ] Touch target sizes (minimum 44x44px)
- [ ] Performance (Lighthouse score 90+)
- [ ] Cross-browser compatibility
- [ ] Accessibility compliance (WCAG 2.1 AA)

### Code Organization

```
landing/
├── components/
│   ├── HeroSection.tsx
│   ├── FeatureCards.tsx
│   ├── StatsDisplay.tsx
│   ├── CTASection.tsx
│   └── index.ts
├── sections/
│   ├── PopularCertifications.tsx
│   ├── ScreenshotSlideshow.tsx
│   └── SEOContentBlock.tsx
└── LandingPageContent.tsx
```

### Naming Conventions

- **Components**: PascalCase (`HeroSection`, `FeatureCard`)
- **CSS Classes**: TailwindCSS utilities (kebab-case is handled by Tailwind)
- **Props**: camelCase (`isLoading`, `variant`, `onClick`)
- **Files**: PascalCase for components, kebab-case for utilities

This style guide ensures consistent, professional, and maintainable landing pages that align with the current Certifai brand and user experience standards.
