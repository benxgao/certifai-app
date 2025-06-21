# Skeleton Loading Components

This documentation covers the reusable skeleton loading components available in the CertifAI application.

## Overview

Skeleton loading components provide visual placeholders while content is loading, improving the user experience by showing the expected layout structure before actual data arrives.

## Available Components

### Base Skeleton

```tsx
import { Skeleton } from '@/src/components/ui/skeleton';

// Basic skeleton element
<Skeleton className="h-4 w-32" />
```

### Specialized Card Skeletons

All specialized skeleton components are available from the card-skeletons module:

```tsx
import {
  CertificationCardSkeleton,
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
  ExamCardSkeleton,
  GenericCardSkeleton,
  ListItemSkeleton,
} from '@/src/components/ui/card-skeletons';
```

#### CertificationCardSkeleton

Used for certification listing pages with grid layouts.

```tsx
<CertificationCardSkeleton count={4} className="my-4" />
```

**Props:**
- `count?: number` - Number of skeleton cards (default: 4)
- `className?: string` - Additional CSS classes

**Usage:** Certification catalog pages, available certifications sections

#### DashboardStatSkeleton

Used for dashboard statistics cards.

```tsx
<DashboardStatSkeleton 
  count={5} 
  gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
/>
```

**Props:**
- `count?: number` - Number of stat cards (default: 5)
- `gridCols?: string` - Grid layout classes (default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5')
- `className?: string` - Additional CSS classes

**Usage:** Dashboard overview sections, statistics displays

#### UserCertificationCardSkeleton

Used for user's registered certification cards.

```tsx
<UserCertificationCardSkeleton count={3} />
```

**Props:**
- `count?: number` - Number of certification cards (default: 3)
- `className?: string` - Additional CSS classes

**Usage:** User dashboard, registered certifications sections

#### ExamCardSkeleton

Used for exam listing pages.

```tsx
<ExamCardSkeleton count={3} />
```

**Props:**
- `count?: number` - Number of exam cards (default: 3)
- `className?: string` - Additional CSS classes

**Usage:** Exam listing pages, certification exam sections

#### GenericCardSkeleton

A flexible skeleton for basic card layouts.

```tsx
<GenericCardSkeleton 
  count={6}
  gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  height="h-48"
/>
```

**Props:**
- `count?: number` - Number of cards (default: 6)
- `gridCols?: string` - Grid layout classes (default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
- `height?: string` - Card height (default: 'h-48')
- `className?: string` - Additional CSS classes

**Usage:** Any generic card grid layout

#### ListItemSkeleton

Used for list-based layouts.

```tsx
<ListItemSkeleton count={5} showAvatar={true} />
```

**Props:**
- `count?: number` - Number of list items (default: 5)
- `showAvatar?: boolean` - Show avatar placeholder (default: true)
- `className?: string` - Additional CSS classes

**Usage:** List views, search results, navigation menus

## Usage with Suspense

The skeleton components are designed to work with React Suspense for optimal loading experiences:

```tsx
import { Suspense } from 'react';
import { CertificationCardSkeleton } from '@/src/components/ui/card-skeletons';
import CertificationGrid from '@/components/custom/CertificationGrid';

<Suspense fallback={<CertificationCardSkeleton count={4} />}>
  <CertificationGrid />
</Suspense>
```

## Design System

All skeleton components follow the application's design system:

- **Colors:** `bg-slate-200 dark:bg-slate-600` (consistent with the theme)
- **Animation:** `animate-pulse` for loading effect
- **Borders:** Matches the corresponding real components
- **Spacing:** Uses the same padding and margin as actual components

## Best Practices

1. **Match Real Components:** Skeleton layouts should closely match the structure of the actual components they represent.

2. **Appropriate Count:** Use realistic counts that match typical data loads:
   - Certifications: 4-6 items
   - Dashboard stats: 3-5 items
   - Exams: 3-4 items

3. **Consistent Styling:** Always use the provided skeleton components to maintain visual consistency.

4. **Grid Layouts:** For grid-based layouts, ensure the skeleton grid matches the actual component grid.

5. **Loading States:** Use with Suspense boundaries for clean loading experiences.

## Example Implementations

### Certification Page
```tsx
<Suspense fallback={<CertificationCardSkeleton count={4} />}>
  <CertificationGrid />
</Suspense>
```

### Dashboard
```tsx
<Suspense fallback={<DashboardStatSkeleton count={5} />}>
  <DashboardStats />
</Suspense>

<Suspense fallback={<UserCertificationCardSkeleton count={3} />}>
  <CertificationsSection />
</Suspense>
```

### Exams Page
```tsx
{isLoadingExams && (
  <div className="max-w-4xl mx-auto px-4 py-6">
    <BreadcrumbSkeleton />
    <div className="mb-8">
      <Skeleton className="h-8 w-96" />
      <Skeleton className="h-4 w-64" />
    </div>
    <ExamCardSkeleton count={3} />
  </div>
)}
```

## Customization

### Custom Skeleton Components

When creating new skeleton components, follow this pattern:

```tsx
interface CustomSkeletonProps {
  count?: number;
  className?: string;
}

export function CustomSkeleton({ count = 3, className }: CustomSkeletonProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`custom-skeleton-${index}`} className="...">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      ))}
    </div>
  );
}
```

### Adding to Index

Remember to export new components from the index file:

```tsx
// src/components/ui/index.ts
export { CustomSkeleton } from './card-skeletons';
```

This ensures consistent imports across the application.
