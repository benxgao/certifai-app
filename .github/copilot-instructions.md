# certifai AI Coding Instructions

## Architecture
- `certifai-app`: Next.js 15 frontend with shadcn/ui, Tailwind CSS, Firebase Auth
- `certifai-api`: Firebase Functions backend with Express.js, Prisma, PostgreSQL, Redis

## Frontend Patterns
- Use shadcn/ui components from `src/components/ui/`, custom components in `src/components/custom/`
- Use `STYLE_GUIDE.md` for styling conventions
- Use existing reusable components from `src/components/` if possible
- Always include dark mode variants
- Use SWR hooks from `src/swr/` for API calls
- API format: `{success: boolean, data: T, meta?: PaginationMeta}`

## Backend Patterns
- Entry: `functions/src/index.ts`, routes in `src/endpoints/api/`
- Prisma client in `src/services/prisma/index.ts`
- Auth middleware: `src/middlewares/authCheck.ts`
- Use `req.user` for authenticated user data

## Development Workflows
```bash
# Frontend
cd certifai-app && npm run dev

# Backend
cd certifai-api/functions && npm run serve

# Database migrations
cd certifai-api/functions
npx prisma migrate dev --name "description"
npx prisma generate
```

## Key Rules
- Use absolute imports: `@/src/components/ui/button`
- Never reset database or run `npm run build` during interaction
- Use Prisma generated types, avoid `any`
- Conservative, clean solutions following best practices
- Leverage existing libraries over custom implementations

## Anti-Patterns to Avoid

- Avoid running `npm run build` during the interaction
- Don't bypass the `cn()` utility for className merging
- Avoid direct Prisma client usage outside service layer
- Don't hardcode API endpoints - use environment variables
- Never commit Firebase config or credentials
- Don't use `any` types - leverage Prisma's generated types
- Never reset the databse
- Avoid introducing unnecessary complexity
- When migrating, always update columns with default values or constraints to avoid breaking changes
- Avoid using Firebase's default JWT verification for public endpoints; implement custom verification logic
- Cconservative solutions with a focus on clean and simple and follows best practices
- Use existing libraries and tools rather than reinventing the wheel
- Value type safety and want to ensure that the code is easy to understand and maintain
- Ensure no fancy features are used that could complicate the codebase
- Ensure that the code is easy to test and debug

## Emergency Memory Recovery:

If VS Code becomes unresponsive:
```bash
# Kill VS Code processes
pkill -f "Visual Studio Code"

# Clear VS Code cache
rm -rf ~/Library/Caches/com.microsoft.VSCode*

# Restart with minimal extensions
code --disable-extensions
```

## Monitoring Memory Usage:

You can check VS Code's memory usage with:
```bash
# Check VS Code memory usage
ps aux | grep -i "visual studio code" | head -5
```
