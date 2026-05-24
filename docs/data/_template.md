# <Title>

> **Source of truth**: `src/types/swr-data/<types>.ts`, `src/types/api.ts`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What data model, type, or enum this document covers.

## Key Concepts

- **Term**: Definition

## Type Definitions

```typescript
// Example shape
interface ExampleData {
  /** Always present @guaranteed */
  id: number;
  /** May be absent @optional */
  label?: string;
}
```

## Enums

```typescript
enum ExampleStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
```

## Conventions / Rules

- Never use `[key: string]: any` — define explicit interfaces.
- Use enums over string literals for fixed value sets.
- Mark optional fields only when API genuinely omits them.

## Dangerous Areas / Anti-patterns

- Anti-pattern and why it is problematic

## Related Docs

- [API Connection](../api/api-connection.md)
- [SWR Patterns](../api/swr-patterns.md)
