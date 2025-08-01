# Certifai Design System & Style Guide

Essential patterns and reusable components for consistent development.

## Core Design Principles

- **Glass-morphism**: Semi-transparent elements with `backdrop-blur-md`
- **Gradient system**: Violet/blue gradients (`from-violet-600 to-blue-600`)
- **Mobile-first**: Responsive with `sm:`, `md:`, `lg:` breakpoints
- **Dark mode**: All components support `dark:` variants

## Layout Structure

### Standard Page Container

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
  <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
    {/* Page content */}
  </div>
</div>
```

## Essential Colors

```css
/* Backgrounds */
bg-white/90 dark:bg-slate-900/90        /* Primary cards */
bg-white/95 dark:bg-slate-800/95        /* Secondary cards */

/* Text */
text-slate-900 dark:text-slate-50       /* Primary headings */
text-slate-600 dark:text-slate-300      /* Body text */

/* Borders */
border-slate-200/60 dark:border-slate-700/60
```

## Reusable Components

### EnhancedModal

```tsx
import { EnhancedModal } from '@/src/components/custom/EnhancedModal';

<EnhancedModal
  isOpen={isModalOpen}
  onOpenChange={setIsModalOpen}
  icon={<SomeIcon className="h-5 w-5" />}
  title="Modal Title"
  subtitle="Optional subtitle"
  variant="default" // default | destructive
  content={modalContent}
  footer={modalFooter}
/>;
```

### AlertMessage

```tsx
import { AlertMessage } from '@/src/components/custom/AlertMessage';

<AlertMessage
  variant="warning" // success | error | warning | info
  message="Your message here"
  className="backdrop-blur-sm"
/>;
```

### DeleteIconButton

```tsx
import { DeleteIconButton } from '@/src/components/custom/DeleteIconButton';

<DeleteIconButton
  onClick={handleDelete}
  disabled={isDeleting}
  title="Delete item"
  size="md" // sm | md | lg
  className="absolute top-4 right-4"
/>;
```

### ActionButton

```tsx
import { ActionButton } from '@/src/components/custom/ActionButton';

<ActionButton
  variant="primary" // primary | secondary | success | outline
  size="lg"
  onClick={handleClick}
  isLoading={isLoading}
  loadingText="Processing..."
>
  Button Text
</ActionButton>;
```

## Spacing Scale

```css
space-y-10    /* Between major sections */
space-y-6     /* Between content blocks */
space-y-4     /* Between form elements */
space-y-2     /* Between related items */
```

## Typography

```css
/* Headings */
text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight  /* Page titles */
text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight   /* Card titles */

/* Body */
text-base leading-relaxed text-slate-600 dark:text-slate-300         /* Primary body */
text-sm text-slate-600 dark:text-slate-300                          /* Secondary body */
```

## Interactive States

```css
/* Hover effects */
hover:shadow-xl transition-all duration-300
hover:scale-[1.02] hover:-translate-y-1

/* Focus states */
focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
```

## Implementation Checklist

- [ ] Use glass-morphism with `backdrop-blur-md`
- [ ] Include dark mode variants (`dark:`)
- [ ] Apply consistent spacing (`space-y-*`)
- [ ] Use ActionButton for interactions
- [ ] Test responsive breakpoints
- [ ] Add proper focus states
