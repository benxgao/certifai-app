# certifai AI Instructions

This file stays intentionally lightweight. For detailed coding standards, repo-specific workflows, and spec-first guidance, read `.github/copilot-instructions.md`.

## Day-to-day rules

- Prefer the simplest safe change that solves the request.
- Reuse existing components, utilities, services, and patterns before adding new abstractions.
- Keep edits focused and avoid unrelated refactors.
- Use strict typing when changing code, and avoid `any` unless there is a strong existing pattern that requires it.
- Protect secrets and credentials; never commit real keys, tokens, or service-account files.
- Do not reset databases or make destructive infra changes unless the user explicitly asks and the detailed instructions allow it.
- Avoid running heavy or disruptive commands unless they are needed for the task.

## When in doubt

- Check `.github/copilot-instructions.md` for the fuller rules and the current preferred workflow.
- If the task involves implementation details, tests, docs, or architecture choices, follow the spec-first and repo guidance there.
- If the scope is unclear, choose the smallest safe step and ask a focused follow-up only when necessary.
