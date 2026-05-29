# certifai AI Coding Instructions

## Architecture

- `certifai-app`: Next.js 15 frontend — shadcn/ui, Tailwind CSS, Firebase Auth
- `certifai-api`: Firebase Functions backend — Express.js, Prisma ORM, PostgreSQL, Redis

## Frontend Patterns

- Components: shadcn/ui from `src/components/ui/`, custom in `src/components/custom/`
- Follow `STYLE_GUIDE.md` for styling; always include dark mode variants
- Use existing components before creating new ones
- Data fetching: SWR hooks from `src/swr/` — never call API directly from components
- API response shape: `{ success: boolean; data: T; meta?: PaginationMeta }`
- Absolute imports only: `@/src/components/ui/button`

## Type Safety

- No `any` — use Prisma-generated types on the backend, explicit interfaces on the frontend
- All SWR hooks must have explicit generic parameters: `useSWR<ResponseType, Error>(...)`
- Prefer enums over string literals for fixed value sets (e.g., `ExamStatus.READY` not `'READY'`)
- Mark interface fields as optional (`field?: T`) only when the API genuinely omits them

## Backend Patterns

- Entry: `functions/src/index.ts`, routes in `src/endpoints/api/`
- Prisma client via `src/services/prisma/index.ts` — never use Prisma directly outside the service layer
- Auth middleware: `src/middlewares/authCheck.ts` — use `req.user` for authenticated user data
- Do not use Firebase's default JWT verification for public endpoints; implement custom verification

## Database Migrations

```bash
cd certifai-api/functions
npx prisma migrate dev --name "description"
npx prisma generate
```

- Always add `@default(...)` or make columns nullable when adding new fields to existing tables
- Never run `prisma migrate reset` or drop tables in production

## Development Commands

```bash
# Frontend
cd certifai-app && npm run dev

# Backend
cd certifai-api/functions && npm run serve

# TypeScript check (run after significant type changes)
cd certifai-api/functions && npx tsc --noEmit 2>&1 | grep "^src/"
cd certifai-app && npx tsc --noEmit 2>&1 | grep "^(app|src)/"
```

## Temporary Validation Exception

- `npm run lint` and `npm run test:e2e` may be skipped when there is a known repository-level blocker.
- When skipped, record the reason in the active rollout/session note and continue non-lint/non-test verification gates.
- Remove this exception once the blocking issues are fixed.

## E2E Tests (Playwright)

- See `e2e/instructions.md` for the full authoring guide
- Use `authenticatedPage` fixture (from `e2e/fixtures/auth`) for all authenticated tests
- Use step-style console logging: `[STEP N]`, `  - sub-action`, `✓ success`, `  ⚠ warning`
- Extract reusable multi-step flows into `e2e/helpers/`
- Throw `Error` on failure — never swallow errors silently

## Skill: AI-Oriented Kanban Workflow

- Treat phase execution as plan-first delivery.
- If user asks for a rollout plan, implementation plan, or phased migration plan, use the isolated template at `ai_oriented_kanban/templates/rollout-plan-template.md` as the default house style.

### Rollout file checklist

Each rollout file should follow `ai_oriented_kanban/templates/rollout-plan-template.md` by default.

### Rollout style rules

- Write rollout plans as decision-quality engineering documents, not short task notes.
- Prefer explicit reasoning over vague bullets; explain why each phase exists.
- Make phases independently testable.
- If a phase is heavy, split it into sub-subphases that are independently reviewable, revertible, and verifiable.
- Use the progress markers, dashboard, phase structure, and verification style defined in `ai_oriented_kanban/templates/rollout-plan-template.md`.
- Keep dependency boundaries strict: do not mix config creation with consumer updates in the same phase unless the user explicitly asks for a looser plan.
- When relevant, include concrete grep/TypeScript/manual QA checks instead of generic “test this” wording.
- Prefer wording that makes the plan easy to execute incrementally in separate commits.
- Default to this structured style whenever the user says “rollout plan”, “phased plan”, “migration plan”, or similar planning language.

### Workflow usage

- Use `ai_oriented_kanban/` for planning artifacts: `00-intake/` for new ideas, `20-active/` for in-progress work, `30-review/` for review, `40-archive/` for completed work.
- Keep one rollout file per initiative.
- Update progress status and decisions in the same file as work continues.
- Use evidence-based completion (tests/checks/validation notes), not opinion-based completion.
- When a user says they like the style of an existing rollout plan, mirror that structure in future rollout docs for this repo unless they ask for a lighter format.
- If the template evolves, update `ai_oriented_kanban/templates/rollout-plan-template.md` rather than expanding this instructions file.

## Spec-First Retrieval Protocol

**Read docs first**: Before reading or writing any code, load the task-relevant spec docs listed under the **Canonical Documentation References** section below. This is a mandatory execution gate, not a recommendation.

**Fallback**: scan codebase only when the relevant docs are:

- Missing for the specific task type
- Ambiguous or contradictory for the current implementation decision
- Outdated relative to the current codebase state (e.g., a file was renamed or an API changed since the doc was last updated)

**Fallback record**: If a code scan is required, note which docs were insufficient and update them after implementation so the gap does not recur.

### Spec-First Decision Evidence Gate (Mandatory)

Before implementation starts for rollout/planning/governance tasks:

1. Declare a `Docs Needed` list (doc path + why needed).
2. Record a `Decision Evidence Log` for each major decision with these columns:
	- `Decision`
	- `Docs cited`
	- `Sufficiency verdict`
	- `Fallback code scan used?`
	- `Doc update action`

Implementation must not start until both artifacts exist.

### Insufficiency Remediation Rule (Mandatory)

When docs are missing, ambiguous, contradictory, or outdated for a decision:

- Use code scan as a controlled fallback for that decision only.
- In the same rollout/PR, update the insufficient docs (or mark blocked with owner + due date).
- Record the remediation in the plan/PR so future assistants can complete comparable work docs-first.

## Canonical Documentation References

> Use these docs for grounded context before generating or reviewing code. They are the authoritative source for architecture, style, API contracts, security rules, and test strategy.

| Purpose | File |
| --- | --- |
| Task-type navigation guide (load this first) | [`docs/ai/guide.md`](../docs/ai/guide.md) |
| Project overview and system boundaries | [`docs/ai/repo-map.md`](../docs/ai/repo-map.md) |
| Full doc index for AI context retrieval | [`docs/ai/assistant-context-index.md`](../docs/ai/assistant-context-index.md) |
| Next.js App Router conventions | [`docs/architecture/nextjs-conventions.md`](../docs/architecture/nextjs-conventions.md) |
| API envelope and fetch layer | [`docs/api/api-connection.md`](../docs/api/api-connection.md) |
| SWR hook patterns and domain hooks | [`docs/api/swr-patterns.md`](../docs/api/swr-patterns.md) |
| Context providers and state boundaries | [`docs/state/client-state.md`](../docs/state/client-state.md) |
| Frontend data models and type conventions | [`docs/data/data-models.md`](../docs/data/data-models.md) |
| Tailwind, shadcn/ui, and `cn()` rules | [`docs/style/conventions.md`](../docs/style/conventions.md) |
| Firebase Auth flow and JWT handling | [`docs/security/auth-patterns.md`](../docs/security/auth-patterns.md) |
| SWR caching and performance patterns | [`docs/performance/patterns.md`](../docs/performance/patterns.md) |
| Unit and E2E testing strategy | [`docs/testing/strategy.md`](../docs/testing/strategy.md) |
| Domain glossary | [`docs/product/glossary.md`](../docs/product/glossary.md) |
| Architecture decision records | [`docs/adr/`](../docs/adr/) |

When answering questions about project structure, style, API behavior, or security, load the relevant doc above before making assumptions.

## Hard Rules

- **Never** run `npm run build` or reset the database during a session
- **Never** commit Firebase config, service account keys, or credentials
- **Never** hardcode API endpoints — use environment variables
- **Never** use `cn()` bypass for className merging
- Scope all changes to what is explicitly requested — no unsolicited refactors or feature additions
- Prefer the minimum code change that solves the problem correctly
