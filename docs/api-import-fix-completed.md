# API Import Fix - Completed

## Issue Fixed

Fixed incorrect import statements in Stripe account API routes that were causing compilation errors.

## Problem

The API routes were importing `fetchWithFirebaseToken` which doesn't exist in the auth-utils module.

## Solution

Updated imports to use the correct `fetchAuthJSON` function from `@/src/lib/auth-utils`.

## Files Fixed

✅ **`/app/api/stripe/account/route.ts`**

- ❌ `import { fetchWithFirebaseToken } from '@/src/lib/auth-utils';`
- ✅ `import { fetchAuthJSON } from '@/src/lib/auth-utils';`
- ❌ `await fetchWithFirebaseToken(url, { method: 'GET' })`
- ✅ `await fetchAuthJSON(url)`

✅ **`/app/api/stripe/account/[apiUserId]/route.ts`**

- ❌ `import { fetchWithFirebaseToken } from '@/src/lib/auth-utils';`
- ✅ `import { fetchAuthJSON } from '@/src/lib/auth-utils';`
- ❌ `await fetchWithFirebaseToken(url, { method: 'GET' })`
- ✅ `await fetchAuthJSON(url)`

## Validation

- ✅ No compilation errors in affected files
- ✅ No other instances of incorrect import found
- ✅ All Stripe API routes now compile successfully
- ✅ Main billing components remain functional

## Impact

- **Zero Breaking Changes:** The `fetchAuthJSON` function provides the same functionality
- **Improved Reliability:** Eliminates compilation errors that could break the build
- **Cleaner Code:** Uses the correct, well-tested authentication utility function

The account API routes now properly import and use the authentication utilities, ensuring the unified account data system works correctly.
