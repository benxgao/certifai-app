# <Title>

> **Source of truth**: `[project: fill in — e.g., __tests__/, e2e/]`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What test domain, fixture pattern, or coverage area this document covers.

## Key Concepts

- **Term**: Definition

## Test Layers

| Layer | Location             | Runner               | When to use             |
| ----- | -------------------- | -------------------- | ----------------------- |
| Unit  | `[project: fill in]` | `[project: fill in]` | Logic, hooks, contracts |
| E2E   | `[project: fill in]` | `[project: fill in]` | Full user flows         |

## Conventions / Rules

- Authenticated E2E tests must use the shared authenticated fixture.
- Test environment setup lives in one setup file — do not duplicate setup in individual test files.

## Dangerous Areas / Anti-patterns

- Re-implementing auth manually in E2E instead of using the fixture.
- Swallowing errors silently in test helpers — always throw on failure.

## Related Docs

- [Architecture](../architecture/_template.md)
