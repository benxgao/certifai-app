# Repo Map

> **Source of truth**: `[project: fill in — e.g., app/, src/]`
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

Establish the system boundary of this project so assistants can identify which domains are involved before loading docs.

## System Boundary

- **Entrypoints**:
  - `[project: fill in — root layout / entry file]`
  - `[project: fill in — auth guard / middleware]`
  - `[project: fill in — public landing page]`
  - `[project: fill in — authenticated dashboard]`

- **Core domains**:
  - `[project: fill in — authenticated section]`
  - `[project: fill in — API routes]`
  - `[project: fill in — server-state layer]`
  - `[project: fill in — state/context layer]`
  - `[project: fill in — shared utilities]`
  - `[project: fill in — UI components]`

- **External dependencies**:
  - `[project: fill in — auth provider]`
  - `[project: fill in — backend API]`
  - `[project: fill in — billing/third-party services]`

## Route Map

| Route | Auth | Purpose |
| --- | --- | --- |
| `[project: fill in]` | Public | Landing/marketing pages |
| `[project: fill in]` | Public | Auth flows |
| `[project: fill in]` | Protected | Authenticated app sections |

## Critical Invariants

1. `[project: fill in — e.g., never call the backend API directly from components]`
2. `[project: fill in — e.g., all authenticated routes live under a single guarded prefix]`
3. `[project: fill in]`
4. `[project: fill in]`

## Dangerous Areas ⚠️

- `[project: fill in — path]` — `[project: fill in — why it is dangerous]`
- `[project: fill in — path]` — `[project: fill in — why it is dangerous]`

## Test Strategy

- **Unit**: `[project: fill in — test runner + locations]`
- **E2E**: `[project: fill in — E2E runner + fixture conventions]`
- **Setup**: `[project: fill in — test environment initialization]`

## Related Docs

- [Assistant Context Index](assistant-context-index.md)
- [AI Guide](guide.md)
- [Domain scaffolds](../architecture/_template.md)
