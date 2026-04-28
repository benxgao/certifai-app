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
