# <Title>

> **Source of truth**: `src/context/<Context>.tsx`, `src/swr/<hook>.ts`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What state domain or lifecycle this document covers.

## Key Concepts

- **Term**: Definition

## State Layers

| Layer | Mechanism | Location | When to use |
| ----- | --------- | -------- | ----------- |
| Server state | SWR | `src/swr/` | API-backed data |
| Auth state | React Context | `src/context/FirebaseAuthContext.tsx` | User session |
| UI state | `useState` | component | Ephemeral UI |

## Conventions / Rules

- Rule 1

## Dangerous Areas / Anti-patterns

- Anti-pattern and why it is problematic

## Related Docs

- [API / SWR Patterns](../api/swr-patterns.md)
- [Data Models](../data/data-models.md)
