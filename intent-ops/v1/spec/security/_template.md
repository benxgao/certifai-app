# <Title>

> **Source of truth**: `[project: fill in — e.g., middleware, auth utilities]`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What security boundary, auth flow, or protection mechanism this document covers.

## Key Concepts

- **Term**: Definition

## Auth Flow

```
[project: fill in — e.g., User → guard (token check) → protected pages
                             ↓ fail
                      → signin redirect]
```

## Conventions / Rules

- Server-only modules must never be imported by client components.
- Token/session lifecycle is managed by dedicated routes/utilities, not ad-hoc code.
- State transitions go through the canonical state manager.

## Dangerous Areas / Anti-patterns

- Calling token verification from a client component.
- Bypassing the central guard with per-route auth.
- Storing tokens in `localStorage` — cookies/session storage only.

## Related Docs

- [State](../state/_template.md)
- [API](../api/_template.md)
