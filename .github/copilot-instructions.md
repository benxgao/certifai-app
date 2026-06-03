# Copilot Instructions (`certifai-app`)

> Last reviewed: 2026-06-03
> Canonical knowledge lives in `docs/`; this file is the fast-start map.

## Start of every task (mandatory)

1. Read `docs/ai/guide.md`, then `docs/ai/repo-map.md`.
2. Load only relevant domain docs via `docs/ai/assistant-context-index.md`.
3. Use code scanning only when docs are insufficient, then update docs in the same change.

## Big picture architecture (frontend boundaries)

- App router entrypoints: `app/layout.tsx` (global providers/SEO/consent), `app/main/layout.tsx` (authenticated provider stack).
- Auth boundary: `middleware.proxy.ts` protects `/main/*`; keep protected pages under `app/main/`.
- Data layer: domain reads/writes flow through `src/swr/*` (`useAuthSWR`, `useAuthMutation`), not direct `fetch` in components.
- State split: auth/account and shared UI state in `src/context/*`; server-state stays in SWR hooks.
- UI layering: primitives in `src/components/ui/`, domain components in `src/components/custom/`, auth in `src/components/auth/`, billing in `src/components/billing/`.

## Project-specific invariants (do not break)

- API contract is `ApiResponse<T>` envelope from `src/types/api.ts`.
- For `useSWRMutation` with trigger args, use 4 generics: `<Data, Error, Key, ExtraArg>`.
- Keep type mapping discipline: SWR hook types belong in `src/types/swr-data/` (avoid `any`).
- Never import `src/firebase/firebaseAdminConfig.ts` in client code.
- Keep auth cookie lifecycle inside `app/api/auth-cookie/*`; do not move token logic to `localStorage`.
- Use `cn()` from `src/lib/utils.ts` for conditional classes; include dark mode variants.
- Respect feature gating in `src/config/featureFlags.ts` (e.g., `STRIPE_INTEGRATION`, demo credential flags).

## Developer workflows that matter here

- Local dev: `npm run dev` (Turbopack).
- Unit tests: `npm test` (Jest), coverage with `npm run test:coverage`.
- E2E tests: `npm run test:e2e` (or `test:e2e:ui` / `test:e2e:headed`).
- Lint/type hygiene for non-trivial changes: `npm run lint` and `npx tsc --noEmit`.

## Integration points and cross-component flows

- Backend integration: `certifai-api` via SWR hooks and Next API routes under `app/api/`.
- Billing: Stripe callback and billing flows under `app/main/stripe/callback/` and billing components/hooks.
- Analytics: consent-gated analytics components in `src/components/analytics/` + cookie consent workflow.

## Guardrails

- Never run `npm run build` during assistant sessions.
- Never reset database or backend infra from frontend tasks.
- Never commit credentials, Firebase service-account files, or real secret values.
- Keep changes scoped; avoid opportunistic refactors.

## Response style at task completion

- Do not end with a paragraph summary.
- Keep final completion output very short: 1-3 bullet points only.
- Include only: (1) files changed, (2) verification run status, (3) optional next step if needed.
- If there is nothing else needed, end after the bullets (no trailing recap text).
- Avoid repeating context already shown earlier in the conversation.

## Rollout/docs policy

- For rollout/migration plans, use `ai_oriented_kanban/templates/rollout-plan-template.md`.
- Follow `docs/operations/spec-first-kanban-integration.md` (`Docs Needed` + decision evidence for non-trivial choices).
