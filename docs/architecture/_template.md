# <Title>

> **Source of truth**: `app/<route>/layout.tsx`, `app/<route>/page.tsx`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What routing, rendering, or structural pattern this document covers.

## Key Concepts

- **Term**: Definition

## Conventions / Rules

- Rule 1 (e.g., always co-locate `loading.tsx` when a route uses async data)

## Page / Route Map

| Route | File | Notes |
| ----- | ---- | ----- |
| `/example` | `app/example/page.tsx` | Public |

## Server vs Client Split

- `page.tsx` — server component (data fetching, auth check)
- `client.tsx` — client component (interactive UI)

## Dangerous Areas / Anti-patterns

- Anti-pattern and why it is problematic

## Related Docs

- [API Connection](../api/api-connection.md)
- [Security](../security/auth-patterns.md)
