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

## E2E Tests (Playwright)

- See `e2e/instructions.md` for the full authoring guide
- Use `authenticatedPage` fixture (from `e2e/fixtures/auth`) for all authenticated tests
- Use step-style console logging: `[STEP N]`, `  - sub-action`, `✓ success`, `  ⚠ warning`
- Extract reusable multi-step flows into `e2e/helpers/`
- Throw `Error` on failure — never swallow errors silently

## Skill: AI-Oriented Kanban Workflow

- Treat phase execution as plan-first delivery.
- If user asks `implement phase <n>`, first create:
  - `kanban/backlogs/public-trial-rag-phase-0<n>-rollout.md`
- Do this before any code implementation.

### Rollout file checklist

Each rollout file should include:

- Objective
- In scope / out of scope
- Dependencies
- Step checklist
- Acceptance checklist
- Rollback note
- Open questions
- Handoff notes for next phase

### Workflow usage

- Use `kanban/backlogs/` for planning artifacts.
- Keep one rollout file per phase.
- Update progress status and decisions in the same file as work continues.
- Use evidence-based completion (tests/checks/validation notes), not opinion-based completion.

## Hard Rules

- **Never** run `npm run build` or reset the database during a session
- **Never** commit Firebase config, service account keys, or credentials
- **Never** hardcode API endpoints — use environment variables
- **Never** use `cn()` bypass for className merging
- Scope all changes to what is explicitly requested — no unsolicited refactors or feature additions
- Prefer the minimum code change that solves the problem correctly
