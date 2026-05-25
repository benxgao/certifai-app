# AI Retrieval Smoke Tests

> **Source of truth**: `docs/ai/guide.md`, `docs/ai/assistant-context-index.md`, `docs/operations/docs-maintenance.md`
> **Last reviewed**: 2026-05-26
> **Owner**: Engineering team

## Purpose

Define a lightweight manual QA protocol to validate that assistant prompts route to the correct documentation on the first pass after docs changes.

## Key Concepts

- **Retrieval smoke test**: A small set of representative prompts used to verify that the assistant loads the expected docs before implementation.
- **Expected target docs**: The canonical docs the assistant should prioritize for a given prompt.
- **Pass/Fail record**: A short test log proving whether routing was correct.

## Conventions / Rules

- Run smoke tests whenever docs changes may affect assistant routing quality.
- A smoke test run must include at least 3 prompts across different domains.
- A run passes only when expected target docs are selected first (or clearly within the first retrieval step).
- If a prompt fails, update routing guidance in `docs/ai/guide.md` and/or indexing in `docs/ai/assistant-context-index.md`, then re-run.

## When to Run

Run this protocol in any PR that:

1. Creates, renames, or removes docs under `docs/`.
2. Changes task-to-doc routing logic in `docs/ai/guide.md`.
3. Adds new workflow/governance docs that assistants should discover.

## Test Prompts and Expected Routing

Use these baseline prompts (or stronger equivalents) and verify expected target docs are retrieved.

| Prompt | Expected target docs (first-pass) |
| --- | --- |
| "I need to add a new SWR mutation with extra arguments. What constraints should I follow?" | `docs/api/swr-patterns.md`, `docs/api/api-connection.md`, `docs/data/data-models.md` |
| "I’m debugging JWT protection for `/main/*` routes. Where are the auth invariants documented?" | `docs/security/auth-patterns.md`, `docs/state/client-state.md`, `docs/security/signin-workflow.md` |
| "I created a new docs file and want to make sure assistants can find it. What must I update?" | `docs/operations/docs-maintenance.md`, `docs/ai/assistant-context-index.md`, `docs/ai/guide.md` |

## Pass/Fail Recording Template

Copy this block into your PR description or rollout note:

```markdown
## AI Retrieval Smoke Test Results

Date: YYYY-MM-DD
Reviewer: <name>

| Prompt | Expected target docs | Actual docs retrieved first | Result (Pass/Fail) | Notes / Fix applied |
| --- | --- | --- | --- | --- |
| <prompt 1> | <doc A, doc B> | <doc X, doc Y> | <Pass/Fail> | <optional> |
| <prompt 2> | <doc A, doc B> | <doc X, doc Y> | <Pass/Fail> | <optional> |
| <prompt 3> | <doc A, doc B> | <doc X, doc Y> | <Pass/Fail> | <optional> |

Overall outcome: <Pass/Fail>
Follow-up required: <none / list>
```

## Checklist

- [ ] Ran at least 3 prompts.
- [ ] Compared expected vs actual first-pass docs.
- [ ] Recorded results in PR or rollout note.
- [ ] Fixed routing/index docs for any failures and re-ran tests.

## Dangerous Areas / Anti-patterns

- Treating smoke tests as optional after changing `docs/ai/guide.md`.
- Marking pass when expected docs were not retrieved early.
- Testing only one domain (for example, API only) and claiming broad coverage.

## Related Docs

- [AI Assistant Guide](../ai/guide.md)
- [AI Assistant Context Index](../ai/assistant-context-index.md)
- [Docs Maintenance Protocol](./docs-maintenance.md)
