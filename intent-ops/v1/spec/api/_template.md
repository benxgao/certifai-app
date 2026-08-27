# <Title>

> **Source of truth**: `[project: fill in — e.g., src/<data-layer>/<hook>.ts]`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What API interaction or data-fetching pattern this document covers.

## Key Concepts

- **Term**: Definition

## Request / Response Shape

```typescript
// [project: fill in — envelope type]
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}
```

## Conventions / Rules

- Rule 1 (e.g., every data-fetching hook must declare explicit generic parameters)
- Rule 2 (e.g., no `any` types in hook return values)

## Dangerous Areas / Anti-patterns

- Anti-pattern and why it is problematic

## Related Docs

- [Data](../data/_template.md)
- [Architecture](../architecture/_template.md)
