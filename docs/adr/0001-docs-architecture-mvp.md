# ADR-0001: AI-Ready Documentation MVP Structure

> **Status**: Accepted
> **Date**: 2026-05-24
> **Owner**: engineering

## Context

`certifai-app` had useful but fragmented documentation: a flat `docs/` folder, `styleguide/` files, and rules embedded in `.github/copilot-instructions.md`. AI assistants could not reliably locate canonical information about architecture, API patterns, state management, or security conventions, leading to inconsistent code suggestions. New contributors had no single starting point.

The team evaluated two options:
1. **Full docs platform** (MkDocs + Algolia + CI pipeline): high setup cost, overkill for current team size.
2. **Markdown-first skeleton with AI index**: low cost, immediately useful, grows incrementally.

## Decision

Adopt a markdown-first docs structure under `docs/` with these properties:
- **Twelve domain sections** (product, architecture, adr, api, state, data, style, security, performance, testing, ai, operations) — each with a `_template.md` to enforce consistent structure.
- **AI entrypoint** at `docs/ai/assistant-context-index.md` — one file that indexes all canonical docs.
- **Repo map** at `docs/ai/repo-map.md` — system boundaries, route map, critical invariants, and dangerous areas for AI context assembly.
- **SSOT declarations** — every doc must declare a `Source of truth:` metadata field pointing to real source file(s).
- **Links-only in Copilot instructions** — `.github/copilot-instructions.md` points to canonical docs rather than duplicating rules inline.

## Consequences

- ✅ AI assistants can assemble accurate project context from one canonical index.
- ✅ New contributors have a clear entry point and domain-specific reference docs.
- ✅ Templates prevent free-form drift and make new docs machine-retrievable.
- ⚠️ Requires discipline to keep docs fresh when source code changes — mitigated by PR checklist (Phase 3).
- ⚠️ No search infrastructure yet — relies on direct links and file navigation.
- ❌ Does not auto-generate docs from OpenAPI or Terraform — planned for a future phase.

## Related Docs

- [Assistant Context Index](../ai/assistant-context-index.md)
- [Repo Map](../ai/repo-map.md)
- [Docs Maintenance](../operations/docs-maintenance.md)
