# <Title>

> **Source of truth**: `src/swr/<hook>.ts`, `src/types/swr-data/<types>.ts`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What API interaction or SWR pattern this document covers.

## Key Concepts

- **Term**: Definition

## Request / Response Shape

```typescript
// ApiResponse<T> envelope
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}
```

## Hook Contract

```typescript
// Pattern: useAuthSWR<ResponseType, Error>(key, fetcher, options)
```

## Conventions / Rules

- Rule 1

## Dangerous Areas / Anti-patterns

- Anti-pattern and why it is problematic

## Related Docs

- [Data Models](../data/data-models.md)
- [State](../state/client-state.md)
