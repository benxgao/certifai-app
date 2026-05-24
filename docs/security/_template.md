# <Title>

> **Source of truth**: `middleware.proxy.ts`, `src/lib/auth-*.ts`, `src/firebase/`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What security boundary, auth flow, or protection mechanism this document covers.

## Key Concepts

- **Term**: Definition

## Auth Flow

```
User → middleware.proxy.ts (JWT check) → /main/* pages
                ↓ fail
         → /signin redirect
```

## Conventions / Rules

- Rule 1

## Dangerous Areas / Anti-patterns

- Never use Firebase's default JWT verification for public endpoints.
- `src/firebase/firebaseAdminConfig.ts` is **server-only** — never import in client components.
- `app/api/auth-cookie/` routes handle sensitive cookie operations — never expose cookie internals to client.

## Related Docs

- [Architecture](../architecture/nextjs-conventions.md)
- [State](../state/client-state.md)
