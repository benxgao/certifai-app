# Build Fix: Conditional AccountProvider

## Issue Summary

The build was failing with the error:

```
Error: useFirebaseAuth must be used within a FirebaseAuthProvider
```

This occurred because the `AccountProvider` was wrapping the entire application in the root layout, causing it to execute during static site generation (SSG) for pages like `/documentation`.

## Root Cause

- `AccountProvider` depends on `useFirebaseAuth` hook from `FirebaseAuthContext`
- Firebase hooks are client-side only and cannot run during build-time static generation
- All static pages (like documentation, about, etc.) were trying to render the AccountProvider during build

## Solution Implemented

### 1. Created ConditionalAccountProvider

Created `/src/components/auth/ConditionalAccountProvider.tsx` that:

- Only wraps pages that require authentication with `AccountProvider`
- Uses the same path logic as `ConditionalFirebaseAuthProvider`
- Prevents AccountProvider from running on static pages

```typescript
const accountRequiredPaths = ['/main', '/signin', '/signup', '/forgot-password'];
const requiresAccount = accountRequiredPaths.some((path) => pathname.startsWith(path));
```

### 2. Updated Root Layout

Modified `/app/layout.tsx` to:

- Import `ConditionalAccountProvider` instead of `AccountProvider`
- Wrap children with conditional provider

```tsx
// Before
<AccountProvider>
  {children}
</AccountProvider>

// After
<ConditionalAccountProvider>
  {children}
</ConditionalAccountProvider>
```

## Benefits

1. **Build Success**: Static pages can now be generated without Firebase dependencies
2. **Performance**: No unnecessary AccountProvider initialization on public pages
3. **Security**: Account context only available where needed
4. **Consistency**: Matches the existing ConditionalFirebaseAuthProvider pattern

## Pages Affected

### Static Pages (No AccountProvider)

- `/` (landing page)
- `/about`
- `/documentation`
- `/privacy`
- `/terms`
- `/contact`
- `/pricing`
- All other public marketing pages

### Dynamic Pages (With AccountProvider)

- `/main/*` (dashboard and authenticated pages)
- `/signin`
- `/signup`
- `/forgot-password`

## Testing Results

- ✅ Build completes successfully
- ✅ All 59 pages generated
- ✅ No Firebase errors during static generation
- ✅ Billing components work correctly on authenticated pages
- ✅ AccountContext available where needed

## Implementation Notes

The ConditionalAccountProvider:

- Is a client component using `usePathname()`
- Follows the same pattern as ConditionalFirebaseAuthProvider
- Ensures AccountProvider only runs on pages that need authentication
- Prevents SSG conflicts with client-side Firebase hooks

This fix maintains all functionality while enabling successful builds and optimal performance.
