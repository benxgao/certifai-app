# <Title>

> **Source of truth**: `[project: fill in — e.g., src/types/]`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What data model, type, or typing convention this document covers.

## Key Concepts

- **Term**: Definition

## Type Conventions

- One type file per data-fetching hook file.
- Enums for all fixed value sets — no raw string literals.
- Fields optional (`field?: T`) only when the API genuinely omits them.

## Dangerous Areas / Anti-patterns

- Adding `[key: string]: any` to an interface — always add explicit fields instead.
- Duplicating a type that already exists in the typed-response layer.

## Related Docs

- [API](../api/_template.md)
- [State](../state/_template.md)
