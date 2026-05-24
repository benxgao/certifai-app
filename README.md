# Certifai Frontend

Next.js 15 frontend for [Certestic](https://certestic.com).

**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Firebase Auth, SWR, Playwright

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Auth**: Firebase Auth with server-side JWT verification
- **Data**: SWR hooks (`src/swr/`), Redis caching
- **UI**: shadcn/ui + custom components in `src/components/custom/`
- **Testing**: Playwright E2E tests

## Getting Started

```bash
npm install

# Configure environment
cp .env.example .env.local
# Add Firebase, API endpoints, etc.

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

## Documentation Map

| Topic | File |
| --- | --- |
| Project overview and system boundaries | [`docs/ai/repo-map.md`](docs/ai/repo-map.md) |
| AI assistant context index | [`docs/ai/assistant-context-index.md`](docs/ai/assistant-context-index.md) |
| Next.js App Router conventions | [`docs/architecture/nextjs-conventions.md`](docs/architecture/nextjs-conventions.md) |
| API envelope and SWR hook patterns | [`docs/api/api-connection.md`](docs/api/api-connection.md), [`docs/api/swr-patterns.md`](docs/api/swr-patterns.md) |
| State (context providers) | [`docs/state/client-state.md`](docs/state/client-state.md) |
| Data models and type conventions | [`docs/data/data-models.md`](docs/data/data-models.md) |
| Styling (Tailwind, shadcn/ui) | [`docs/style/conventions.md`](docs/style/conventions.md) |
| Auth and security patterns | [`docs/security/auth-patterns.md`](docs/security/auth-patterns.md) |
| Performance and caching | [`docs/performance/patterns.md`](docs/performance/patterns.md) |
| Testing strategy | [`docs/testing/strategy.md`](docs/testing/strategy.md) |
| Domain glossary | [`docs/product/glossary.md`](docs/product/glossary.md) |
| Architecture decisions | [`docs/adr/`](docs/adr/) |


## Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Check code
npm run lint:fix      # Auto-fix linting
npm run format        # Format code
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # E2E tests interactive mode
```

## E2E Testing

Playwright tests validate signin flows and exam management.

**Local**: Run `npm run test:e2e`, interactive mode with `npm run test:e2e:ui`

## Deployment

```bash
npm run build
firebase deploy
```

Or use Vercel for static hosting.

## License

MPL 2.0 starting from version 2.0.0. Previous versions were MIT. See [LICENSE](LICENSE).
