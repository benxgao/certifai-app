## Summary

<!-- Describe what this PR does and why. Link related issues or kanban cards. -->

## Changes

<!-- List key files changed and what changed in each. -->

## Docs Impact Assessment

**Does this PR affect any of the following?** Check all that apply.

- [ ] App Router conventions (`app/` structure, layouts, loading, routing) → update [`docs/architecture/nextjs-conventions.md`](../docs/architecture/nextjs-conventions.md)
- [ ] API envelope, fetch utilities, or error handling → update [`docs/api/api-connection.md`](../docs/api/api-connection.md)
- [ ] SWR hooks or domain hook patterns (`src/swr/`) → update [`docs/api/swr-patterns.md`](../docs/api/swr-patterns.md)
- [ ] Context providers or state boundaries (`src/context/`) → update [`docs/state/client-state.md`](../docs/state/client-state.md)
- [ ] Data models or type conventions (`src/types/swr-data/`) → update [`docs/data/data-models.md`](../docs/data/data-models.md)
- [ ] Styling rules (Tailwind, shadcn/ui, `cn()`) → update [`docs/style/conventions.md`](../docs/style/conventions.md)
- [ ] Auth flow, JWT handling, or middleware → update [`docs/security/auth-patterns.md`](../docs/security/auth-patterns.md)
- [ ] SWR config, rate limiting, or performance hooks → update [`docs/performance/patterns.md`](../docs/performance/patterns.md)
- [ ] Test setup, fixtures, or coverage strategy → update [`docs/testing/strategy.md`](../docs/testing/strategy.md)
- [ ] Domain terminology or glossary terms → update [`docs/product/glossary.md`](../docs/product/glossary.md)
- [ ] None of the above — no doc updates required

**If docs were updated**, confirm:

- [ ] `Source of truth:` field in the doc still points to the correct source file(s)
- [ ] `Last reviewed:` date updated to today
- [ ] No content duplicated across docs (linked instead)

## Architecture Decision (if applicable)

- [ ] This PR introduces a new architectural decision → create an ADR in [`docs/adr/`](../docs/adr/) using the [`_template.md`](../docs/adr/_template.md)
- [ ] Not applicable

## Verification

- [ ] `npx tsc --noEmit` passes with no new errors
- [ ] Unit tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] E2E tests run (if auth or routing changed): `npm run test:e2e`
- [ ] Manually tested in browser at `http://localhost:3000`
