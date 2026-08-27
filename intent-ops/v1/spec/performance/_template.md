# <Title>

> **Source of truth**: `[project: fill in — e.g., src/lib/performance-utils.ts]`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What performance pattern, caching strategy, or optimization utility this document covers.

## Key Concepts

- **Term**: Definition

## Conventions / Rules

- Rate-limiting/optimization logic belongs in the shared utilities layer — do not duplicate in individual hooks or components.
- Caching options (deduping interval, revalidation triggers) must be configured intentionally per hook, not globally overridden.

## Dangerous Areas / Anti-patterns

- Adding debounce logic inside a component that already has an optimization hook.
- Global cache overrides that break per-hook intent.

## Related Docs

- [API](../api/_template.md)
- [Data](../data/_template.md)
