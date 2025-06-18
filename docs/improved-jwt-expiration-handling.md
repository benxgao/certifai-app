# Improved JWT Expiration Handling

This document outlines the enhanced JWT expiration handling workflow that properly resets/removes cookies and JWTs when refresh tokens fail.

## Overview

The improved system provides comprehensive authentication failure handling that:

- Properly clears all authentication state when refresh tokens fail
- Provides better error messages to users
- Centralizes auth error handling logic
- Ensures no stale tokens remain in the system

## Key Improvements

### 1. Centralized Authentication Utilities (`src/lib/auth-utils.ts`)

A new centralized module that provides:

- **`AuthenticationError`**: Custom error class for auth failures
- **`clearClientAuthState()`**: Comprehensive auth state cleanup
- **`handleAuthenticationFailure()`**: Unified auth failure handling
- **`isAuthenticationError()`**: Helper to identify auth errors
- **`fetchWithAuthRetry()`**: Enhanced fetch with automatic retry logic
- **`fetchAuthJSON()`**: Simplified JSON fetch with auth handling

### 2. Enhanced Token Refresh Logic

#### In Firebase Auth Context (`src/context/FirebaseAuthContext.tsx`)

- Better error handling in `refreshToken()` function
- Comprehensive state cleanup on refresh failures
- Proper cookie clearing
- Improved error messages with redirect reasons

#### In SWR Hooks (`src/swr/useAuth*.ts`)

- Consistent error handling across all auth-aware hooks
- Proper fallback to cookie refresh when Firebase refresh fails
- Clear authentication errors that prevent infinite retry loops

### 3. Improved Middleware (`middleware.ts`)

- Better error messages in redirect URLs
- Proper cookie cleanup on all failure paths
- Consistent error handling across all middleware branches

### 4. Enhanced API Routes

#### Auth Cookie Clear (`app/api/auth-cookie/clear/route.ts`)

- Clears both current and legacy cookie names
- Ensures complete cleanup

#### Auth Cookie Refresh (`app/api/auth-cookie/refresh/route.ts`)

- Already has good error handling with detailed error responses
- Provides `requiresReauth` flag for client-side handling

## Workflow for JWT Expiration

### 1. Token Expiry Detection

When a request returns 401:

1. Attempt Firebase token refresh
2. If successful, retry the original request
3. If Firebase refresh fails, attempt cookie-based refresh
4. If all refresh attempts fail, clear auth state and redirect

### 2. Authentication State Cleanup

When refresh tokens fail:

1. Clear Firebase auth state
2. Clear auth cookies (server-side)
3. Clear any localStorage tokens (client-side)
4. Reset component state
5. Redirect to signin with appropriate error message

### 3. User Experience

- Users see clear error messages explaining why they need to sign in again
- No infinite loading states or retry loops
- Automatic redirect only from protected routes
- Preserved destination for post-signin redirect (via error parameter)

## Usage Examples

### Using Enhanced Fetch

```typescript
import { fetchAuthJSON, AuthenticationError } from '@/src/lib/auth-utils';

try {
  const data = await fetchAuthJSON(
    '/api/protected-endpoint',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    refreshToken,
  );
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Auth failure already handled, just update UI
    console.log('Please sign in again');
  } else {
    // Handle other errors
    console.error('Request failed:', error);
  }
}
```

### Using Auth SWR Hooks

```typescript
import { useAuthSWR } from '@/src/swr/useAuthSWR';

function MyComponent() {
  const { data, error, isLoading } = useAuthSWR('/api/data');

  // Auth failures are handled automatically
  // Component just needs to handle loading/error states

  if (error?.status === 401) {
    return <div>Please sign in to view this content</div>;
  }

  return <div>{/* render data */}</div>;
}
```

## Error Handling Strategy

### Client-Side Errors

- **401 Unauthorized**: Automatic refresh attempt, then auth state cleanup
- **403 Forbidden**: No retry, user needs different permissions
- **500+ Server Errors**: Standard retry logic (not auth-related)

### Server-Side Errors

- **JWT Expired**: Attempt token refresh in middleware
- **Invalid JWT**: Clear cookie and redirect
- **Firebase Token Invalid**: Clear all auth state

## Security Considerations

1. **Complete State Cleanup**: All auth artifacts are cleared on failure
2. **No Token Persistence**: Failed tokens are immediately removed
3. **Secure Redirects**: Only redirect from protected routes
4. **Error Message Safety**: Generic error messages in URLs

## Testing the Implementation

To test the improved JWT expiration handling:

1. **Manual Token Expiration**:

   - Wait for natural token expiry (1 hour)
   - Observe automatic refresh behavior

2. **Forced Token Invalidation**:

   - Manually expire tokens via Firebase console
   - Test application behavior

3. **Network Failures**:

   - Simulate network issues during refresh
   - Verify proper fallback behavior

4. **Edge Cases**:
   - Test with invalid cookies
   - Test with malformed tokens
   - Test concurrent requests during token refresh

## Benefits

1. **Improved Security**: No stale tokens remain in the system
2. **Better UX**: Clear error messages and proper redirects
3. **Reduced Support**: Fewer "stuck" authentication states
4. **Easier Debugging**: Centralized error handling and logging
5. **Maintainability**: Reusable utilities across the application
