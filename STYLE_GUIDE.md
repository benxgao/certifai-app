# Certifai Design System & Style Guide

This document defines the comprehensive design system and style guide for the Certifai application, extracted from the dashboard and certification exam list page implementations. Use this guide to maintain consistent styling across all pages and components.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Page Layout Structure](#page-layout-structure)
3. [Color System](#color-system)
4. [Component System](#component-system)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Interactive Elements](#interactive-elements)
8. [Loading States](#loading-states)
9. [Dark Mode](#dark-mode)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Core Principles

- **Glass-morphism Design**: Semi-transparent elements with backdrop blur effects
- **Gradient-based Visual Hierarchy**: Strategic use of violet/blue gradients for emphasis
- **Responsive-first**: Mobile-first design with progressive enhancement
- **Accessibility**: Semantic HTML with proper contrast ratios and focus management
- **Performance**: Optimized animations and efficient component patterns

### Visual Identity

- Primary brand colors: Violet (#7c3aed) to Blue (#2563eb) gradients
- Background philosophy: Light, airy backgrounds with subtle gradients
- Card-based content organization with consistent elevation
- Smooth micro-interactions and transitions

---

## Page Layout Structure

### Standard Page Container

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
  <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
    {/* Page content */}
  </div>
</div>
```

### Key Layout Elements

1. **Top Padding**: `pt-16` to account for fixed navigation
2. **Max Width**: `max-w-4xl` for optimal reading width
3. **Responsive Padding**: `px-4 py-8 md:px-8 md:py-12`
4. **Vertical Spacing**: `space-y-10` between major sections

### Background Gradient System

- **Light Mode**: `from-slate-50 via-slate-100 to-violet-50/30`
- **Dark Mode**: `dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20`
- **Purpose**: Creates subtle depth while maintaining readability

---

## Color System

### Primary Gradients

```css
/* Primary Action Gradient */
bg-gradient-to-r from-violet-600 to-blue-600
hover:from-violet-700 hover:to-blue-700

/* Success Gradient */
bg-gradient-to-r from-emerald-500 to-emerald-600
hover:from-emerald-600 hover:to-emerald-700

/* Secondary Gradient (Card Headers) */
bg-gradient-to-r from-slate-50/60 to-violet-50/30
dark:from-slate-800/40 dark:to-violet-950/20
```

### Background Colors

```css
/* Card Backgrounds */
bg-white/90 dark:bg-slate-900/90        /* Primary cards */
bg-white/95 dark:bg-slate-800/95        /* Secondary cards */
bg-white/80 dark:bg-slate-800/80        /* Input fields */

/* Status Colors */
bg-slate-100 dark:bg-slate-800          /* Neutral */
bg-green-50 dark:bg-green-900/20        /* Success */
bg-red-50 dark:bg-red-900/20           /* Error */
bg-blue-50 dark:bg-blue-900/20         /* Info */
```

### Text Colors

```css
/* Headings */
text-slate-900 dark:text-slate-50       /* Primary headings */
text-slate-900 dark:text-slate-100      /* Secondary headings */

/* Body Text */
text-slate-600 dark:text-slate-300      /* Primary body text */
text-slate-500 dark:text-slate-400      /* Secondary body text */

/* Interactive */
text-violet-600 dark:text-violet-400    /* Links */
hover:text-violet-500 dark:hover:text-violet-300  /* Link hover */
```

### Border Colors

```css
border-slate-200/60 dark:border-slate-700/60    /* Primary borders */
border-slate-100 dark:border-slate-700/50       /* Subtle borders */
border-violet-200/60 dark:border-violet-700/60  /* Focus states */
```

---

## Component System

### DashboardCard (Primary Container)

```tsx
// Usage
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';

<DashboardCard>
  <DashboardCardHeader>{/* Header content with gradient background */}</DashboardCardHeader>
  <DashboardCardContent>{/* Main content with consistent padding */}</DashboardCardContent>
</DashboardCard>;
```

**Features:**

- Glass-morphism effects with `backdrop-blur-md`
- Decorative gradient orbs for depth
- Consistent border radius: `rounded-xl`
- Shadow elevation: `shadow-2xl` (default) or `shadow-lg` (compact)

### ActionButton (Primary Interactions)

```tsx
// Usage
import { ActionButton } from '@/components/custom';

<ActionButton
  variant="primary" // primary | secondary | success | outline
  size="lg" // sm | lg
  icon={<SomeIcon />}
  onClick={handleClick}
  disabled={isLoading}
  isLoading={isLoading}
  loadingText="Processing..."
>
  Button Text
</ActionButton>;
```

**Variants:**

- **Primary**: Violet-to-blue gradient with white text
- **Secondary**: Semi-transparent background with subtle borders
- **Success**: Emerald gradient for positive actions
- **Outline**: Border-only variant for secondary actions

### Input Fields

```tsx
<Input className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/80 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md" />
```

**Key Features:**

- Consistent border radius: `rounded-xl`
- Semi-transparent backgrounds with backdrop blur
- Violet-themed focus states
- Smooth transitions: `transition-all duration-300`

### Status Badges

```tsx
<StatusBadge
  status="active" // active | inactive | ready
  customText="Custom Text"
/>
```

### NotificationBar (Enhanced)

```tsx
import EnhancedNotificationBar from '@/src/components/custom/EnhancedNotificationBar';

// Basic usage (enhanced styling by default)
<EnhancedNotificationBar
  message="Your action was successful!"
  variant="success" // info | success | warning | promo | announcement | beta
  ctaText="View Details"
  ctaLink="/details"
  dismissible
  onDismiss={() => setShowNotification(false)}
  showIcon
/>

// Disable enhanced styling for simpler appearance
<EnhancedNotificationBar
  message="Simple notification message"
  variant="info"
  enhanced={false}
  showIcon
/>
```

**Key Features:**

- Glass-morphism effects with backdrop blur (enabled by default)
- Variant-specific icons and color schemes
- Enhanced hover and focus states
- Decorative gradient orbs for depth
- Responsive design with proper mobile experience
- Full dark mode support with proper contrast

### Breadcrumb Navigation

```tsx
<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/main' },
    { label: 'Certifications', href: '/main/certifications' },
    { label: 'Current Page', current: true },
  ]}
/>
```

---

## Typography

### Heading Hierarchy

```css
/* Page Titles */
text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight

/* Section Titles */
text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight

/* Card Titles */
text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight

/* Subsection Headings */
text-lg font-semibold text-slate-900 dark:text-slate-50

/* Small Headings */
text-sm font-medium text-slate-700 dark:text-slate-200
```

### Body Text

```css
/* Primary Body */
text-base leading-relaxed text-slate-600 dark:text-slate-300

/* Secondary Body */
text-sm text-slate-600 dark:text-slate-300

/* Small Text */
text-xs text-slate-500 dark:text-slate-400
```

### Font Weights

- **font-bold**: Page titles and primary headings
- **font-semibold**: Secondary headings and emphasized text
- **font-medium**: Labels and form elements
- **Regular weight**: Body text (default)

---

## Spacing & Layout

### Standard Spacing Scale

```css
/* Component Spacing */
space-y-10    /* Between major page sections */
space-y-8     /* Between section subsections */
space-y-6     /* Between related content blocks */
space-y-4     /* Between form elements */
space-y-2     /* Between closely related items */

/* Padding Scale */
p-6 sm:p-8              /* Card content padding */
px-6 sm:px-8 py-6       /* Card header padding */
px-4 py-8 md:px-8 md:py-12  /* Page container padding */
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
sm:   /* 640px and up */
md:   /* 768px and up */
lg:   /* 1024px and up */
xl:   /* 1280px and up */

/* Common Responsive Patterns */
text-sm sm:text-base lg:text-lg        /* Responsive text sizing */
px-4 sm:px-6 lg:px-8                   /* Responsive padding */
space-y-4 sm:space-y-6 lg:space-y-8   /* Responsive spacing */
```

### Grid & Flexbox Patterns

```css
/* Card Grids */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

/* Flexible Content */
flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6

/* Centered Layouts */
flex items-center justify-center
```

---

## Interactive Elements

### Hover Effects

```css
/* Cards */
hover:shadow-xl transition-all duration-300

/* Buttons */
hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300

/* Links */
hover:text-violet-500 dark:hover:text-violet-300 transition-colors duration-200
```

### Focus States

```css
/* Form Elements */
focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500

/* Interactive Elements */
focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
```

### Animation Timing

- **Quick interactions**: `duration-200` (200ms)
- **Standard transitions**: `duration-300` (300ms)
- **Complex animations**: `duration-500` (500ms)
- **Decorative animations**: `duration-1000` (1000ms)

### Button Shine Effect

```tsx
{
  /* Add to buttons for premium feel */
}
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>;
```

---

## Loading States

### Skeleton Components

```tsx
// Use existing skeleton components
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';
import { LoadingComponents } from '@/components/custom';

// Page-level loading
<LoadingComponents.PageSkeleton
  title="Loading..."
  cardCount={3}
  showBreadcrumb={true}
  showHeader={true}
/>;
```

### Loading Buttons

```tsx
<ButtonLoadingText
  isLoading={isLoading}
  loadingText="Processing..."
  defaultText="Submit"
  showSpinner={true}
  spinnerSize="sm"
/>
```

### Progress Indicators

```tsx
// For exam generation or similar processes
<ExamGenerationProgressBar progress={progressData} showDetails={true} />
```

---

## Dark Mode

### Implementation Pattern

All components must support dark mode using Tailwind's `dark:` prefix:

```css
/* Background Examples */
bg-white dark:bg-slate-900
bg-slate-50 dark:bg-slate-800

/* Text Examples */
text-slate-900 dark:text-slate-50
text-slate-600 dark:text-slate-300

/* Border Examples */
border-slate-200 dark:border-slate-700
border-slate-200/60 dark:border-slate-700/60
```

### Dark Mode Testing

Always test both light and dark modes to ensure:

- Sufficient contrast ratios
- Readable text at all sizes
- Proper gradient visibility
- Interactive state clarity

---

## Implementation Guidelines

### Component Creation Checklist

- [ ] Use `DashboardCard` for main content containers
- [ ] Apply consistent background gradients
- [ ] Implement proper responsive breakpoints
- [ ] Include dark mode variants for all styles
- [ ] Add appropriate hover and focus states
- [ ] Use semantic HTML elements
- [ ] Include loading states where applicable
- [ ] Test across different screen sizes

### Page Development Process

1. **Start with layout structure** using standard page container
2. **Add breadcrumb navigation** for non-root pages
3. **Implement main content** using DashboardCard components
4. **Apply consistent spacing** using the spacing scale
5. **Add interactive elements** with proper states
6. **Test responsiveness** across breakpoints
7. **Verify dark mode** compatibility
8. **Add loading states** for async content

### Code Quality Standards

```tsx
// Good: Consistent with design system
<DashboardCard>
  <DashboardCardHeader>
    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
      Page Title
    </h1>
  </DashboardCardHeader>
  <DashboardCardContent>
    <div className="space-y-6">
      {/* Content */}
    </div>
  </DashboardCardContent>
</DashboardCard>

// Avoid: Inconsistent styling
<div className="bg-white p-4 border rounded">
  <h1 className="text-xl font-normal text-black">
    Page Title
  </h1>
  <div>
    {/* Content */}
  </div>
</div>
```

### Performance Considerations

- Use `backdrop-blur-md` sparingly (performance impact)
- Prefer CSS transforms over layout changes for animations
- Implement lazy loading for heavy content
- Use React.memo for expensive computations
- Optimize images and use appropriate formats

### Accessibility Requirements

- Maintain minimum contrast ratio of 4.5:1
- Provide focus indicators for all interactive elements
- Use semantic HTML elements (`nav`, `main`, `section`, etc.)
- Include appropriate ARIA labels where needed
- Test with keyboard navigation
- Ensure screen reader compatibility

---

## Common Patterns & Examples

### Typical Page Structure

```tsx
export default function SamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Header Card */}
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  Page Title
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  Page description
                </p>
              </div>
              <ActionButton variant="primary" onClick={handleAction}>
                Primary Action
              </ActionButton>
            </div>
          </DashboardCardHeader>
          <DashboardCardContent>{/* Main content */}</DashboardCardContent>
        </DashboardCard>

        {/* Content Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Section Title
          </h2>
          <DashboardCard>
            <DashboardCardContent>{/* Section content */}</DashboardCardContent>
          </DashboardCard>
        </section>
      </div>
    </div>
  );
}
```

### Form Pattern

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label className="text-slate-700 dark:text-slate-200 font-medium">Field Label</Label>
    <Input className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/80 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md" />
  </div>

  <ActionButton type="submit" variant="primary" isLoading={isSubmitting}>
    Submit Form
  </ActionButton>
</form>
```

---

This style guide serves as the foundation for maintaining design consistency across the Certifai application. Refer to it when creating new pages or refactoring existing components to ensure a cohesive user experience.
