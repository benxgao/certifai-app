# <Title>

> **Source of truth**: `__tests__/<file>.test.ts`, `e2e/<file>.spec.ts`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What test domain, fixture pattern, or coverage area this document covers.

## Key Concepts

- **Term**: Definition

## Test Layers

| Layer | Location | Runner | When to use |
| ----- | -------- | ------ | ----------- |
| Unit | `__tests__/` | Jest | Logic, hooks, contracts |
| E2E | `e2e/` | Playwright | Full user flows |

## Conventions / Rules

- Unit tests use `setup.ts` for environment initialization.
- E2E tests use `authenticatedPage` fixture for auth flows.
- Use step-style console logging: `[STEP N]`, `✓ success`, `⚠ warning`.

## Dangerous Areas / Anti-patterns

- Never swallow errors silently in E2E helpers — always `throw Error`.

## Related Docs

- [Architecture](../architecture/nextjs-conventions.md)
