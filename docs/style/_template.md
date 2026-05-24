# <Title>

> **Source of truth**: `styleguide/app.md`, `styleguide/shared.md`, `src/components/ui/`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering / design

## Purpose

What UI pattern, component category, or visual convention this document covers.

## Key Concepts

- **Term**: Definition

## Component Usage

```tsx
// Always use cn() for className merging
import { cn } from '@/src/lib/utils';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

## Conventions / Rules

- Always include dark mode variants (`dark:` prefix).
- Use shadcn/ui primitives from `src/components/ui/` before creating custom components.
- Custom components live in `src/components/custom/`.

## Dangerous Areas / Anti-patterns

- Never bypass `cn()` for className merging.

## Related Docs

- [Architecture](../architecture/nextjs-conventions.md)
