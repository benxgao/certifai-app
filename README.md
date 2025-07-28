# certifai-app

**certifai-app** is the Next.js 15 frontend for the certifai AI-powered certification training platform.

## Architecture & Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS, shadcn/ui, glass-morphism, dark mode
- **Auth:** Firebase Auth (JWT, server-side verification)
- **API:** SWR hooks (`src/swr/`), standardized API responses
- **UI:** shadcn/ui, custom components in `src/components/custom/`, Radix UI primitives
- **State & Data:** SWR for fetching/caching, Upstash Redis for distributed caching
- **Type Safety:** TypeScript, shared types in `src/types/`

## Getting Started

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Build for production

```bash
npm run build
```

### 4. Lint & Format

```bash
npm run lint
npm run format
```

### 5. Environment Variables

Copy `.env.example` to `.env.local` and fill in required values (Firebase, API endpoints, etc).

---

## Development Patterns

- **Component Architecture:**
  - Use shadcn/ui from `src/components/ui/`
  - Custom business logic in `src/components/custom/`
  - Use `cn()` from `src/lib/utils.ts` for className merging
- **Styling:**
  - Gradient system: `bg-gradient-to-r from-violet-600 to-blue-600`
  - Glass-morphism: `backdrop-blur-sm` with semi-transparent backgrounds
  - Always include dark mode variants
  - Responsive: Tailwind breakpoints, mobile-first
- **API Integration:**
  - Use SWR hooks from `src/swr/` for data fetching
  - API responses: `{success: boolean, data: T, meta?: PaginationMeta}`
  - Auth: Firebase with JWT, server-side verification
- **Error Handling:**
  - SWR error states, user-friendly messages via `sonner` toast
- **Performance:**
  - SWR for client-side caching, Upstash Redis for distributed caching
  - Loading states: skeletons from `src/components/custom/LoadingComponents.tsx`
- **Type Safety:**
  - Shared types in `src/types/`
  - TypeScript interfaces for API contracts

## Project Conventions

- **Import Paths:** Use absolute imports (e.g., `@/src/components/ui/button`)
- **No direct Prisma usage** (handled in backend)
- **No hardcoded endpoints:** Use environment variables
- **No `any` types:** Use generated or defined types
- **No Firebase config/credentials in repo**
- **Simple, maintainable, and testable code**

## Related Repos

- [certifai-api](../certifai-api): Firebase Functions backend (Express.js, Prisma, PostgreSQL, Redis)

---

## Deployment

- **Vercel:** Recommended for static hosting
- **Firebase Hosting:**
  - Build: `npm run build`
  - Deploy: `firebase deploy`

---

## License

MIT
