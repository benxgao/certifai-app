# Certifai AI Coding Instructions

## Architecture Overview

**Certifai** is a dual-repo AI-powered certification training platform:

- `certifai-app`: Next.js 15 frontend with App Router, TypeScript, Tailwind CSS, Firebase Auth
- `certifai-api`: Firebase Functions backend with Express.js, Prisma, PostgreSQL, Redis caching

## Key Development Patterns

### Frontend (certifai-app)

**Component Architecture:**

- Use **shadcn/ui** components from `src/components/ui/` - these follow class-variance-authority patterns
- Custom components in `src/components/custom/` - use these for business logic
- Combine with `cn()` utility from `src/lib/utils.ts` for className merging: `cn(baseClasses, conditionalClasses)`

**Styling Conventions:**

- **Gradient system**: Use violet/purple/blue gradients consistently - `bg-gradient-to-r from-violet-600 to-blue-600`
- **Glass-morphism**: Apply `backdrop-blur-sm` with semi-transparent backgrounds for modern UI
- **Dark mode**: Always include dark mode variants - `text-slate-600 dark:text-slate-300`
- **Responsive**: Use Tailwind breakpoints starting with mobile-first design

**API Integration:**

- Use SWR hooks from `src/swr/` for data fetching
- API responses follow standardized format: `{success: boolean, data: T, meta?: PaginationMeta}`
- Auth uses Firebase with JWT tokens, verified on server-side

**Component Examples:**

```tsx
// Typical button with gradient
<Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
  <Icon className="mr-2 h-4 w-4" />
  Action
</Button>

// Card with glass-morphism
<Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
```

### Backend (certifai-api)

**Function Structure:**

- Entry point: `functions/src/index.ts` exports `endpoints` and `delegators`
- Express app in `src/endpoints/index.ts` with middleware pipeline
- Route handlers in `src/endpoints/api/` following REST conventions

**Database Patterns:**

- **Prisma ORM**: Client in `src/services/prisma/index.ts` with singleton pattern
- **Performance**: Use Prisma's `select` for optimized queries, leverage Redis caching
- **Transactions**: Wrap multi-table operations in `prisma.$transaction()`

**Authentication Flow:**

- Middleware: `src/middlewares/authCheck.ts` verifies Firebase JWT tokens
- Attach decoded user to `req.user` for downstream handlers
- Use Firebase Admin SDK for server-side token verification
- api_user_id is used to identify the user in API requests
- public endpoints require authentication by customized JWT token verification rather than Firebase's default

**Service Layer Pattern:**

```typescript
// Services follow dependency injection pattern
export async function getCertifications(
  filters: CertificationFilters,
  pagination: PaginationParams,
): Promise<PaginatedResult<Certification>> {
  // Implementation with caching, error handling
}
```

## Critical Development Workflows

### Running the Stack

```bash
# Frontend development
cd certifai-app && npm run dev  # Next.js with Turbopack

# Backend development
cd certifai-api/functions && npm run serve  # Firebase emulator
```

### Database Migrations

```bash
cd certifai-api/functions
npx prisma migrate dev --name "description"  # Creates and applies migration
npx prisma generate  # Regenerates client after schema changes
```

### Firebase Deployment

```bash
cd certifai-api && firebase deploy --only functions  # Uses gcp_credentials.json
cd certifai-app && npm run build && firebase deploy  # Static hosting
```

## Project-Specific Conventions

### Import Paths

- Use absolute imports: `@/src/components/ui/button` (frontend), `../services/prisma` (backend)
- Group imports: external libraries, internal services, types

### Error Handling

- **Frontend**: Use SWR's error states, show user-friendly messages via `sonner` toast
- **Backend**: Return standardized error responses with HTTP status codes
- **Logging**: Use Firebase Functions logger for structured logging

### Performance Patterns

- **Caching**: Redis for expensive queries, SWR for client-side caching
- **Database**: Use performance indexes in `prisma/performance_indexes.sql`
- **UI**: Implement loading states with skeleton components from `src/components/custom/LoadingComponents.tsx`

### Type Safety

- **Shared types**: Define in respective `src/types/` directories
- **API contracts**: Use TypeScript interfaces for request/response schemas
- **Database**: Leverage Prisma's generated types for type-safe queries

## Integration Points

### Firebase Services

- **Auth**: Client-side authentication with server-side verification
- **AI**: Vertex AI integration for question generation via `firebase/ai`
- **Functions**: Express.js backend deployed as Firebase Functions

### External Dependencies

- **Caching**: Upstash Redis for distributed caching
- **Monitoring**: Firebase Functions logger with structured logging
- **UI**: Radix UI primitives with Tailwind styling layer

## Anti-Patterns to Avoid

- Don't bypass the `cn()` utility for className merging
- Avoid direct Prisma client usage outside service layer
- Don't hardcode API endpoints - use environment variables
- Never commit Firebase config or credentials
- Don't use `any` types - leverage Prisma's generated types
- Never reset the databse
- When migrating, always update columns with default values or constraints to avoid breaking changes
- Avoid using Firebase's default JWT verification for public endpoints; implement custom verification logic
