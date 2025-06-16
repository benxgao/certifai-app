# Firebase Auth Token Refresh Implementation

This implementation provides automatic Firebase Auth token refresh to ensure the app continues working even when Firebase tokens expire (after 1 hour). The system includes both client-side and server-side refresh mechanisms.

## How it works

1. **Automatic Client-side Refresh**: Tokens are automatically refreshed every 45 minutes (before the 1-hour expiration) on the client
2. **Server-side Middleware Refresh**: When tokens expire, the middleware automatically attempts to refresh them before redirecting to signin
3. **Error Recovery**: If API calls fail with 401 errors, the system attempts to refresh the token and retry the request
4. **Cookie Management**: Auth cookies are automatically updated when tokens are refreshed

## Key Components

### 1. Server-side Token Refresh

#### Middleware (`middleware.ts`)

- Checks token expiration before processing protected routes (`/main/*`)
- Automatically attempts token refresh when expired tokens are detected
- Updates response cookies with refreshed tokens
- Falls back to signin redirect if refresh fails

#### Refresh API Route (`app/api/auth-cookie/refresh/route.ts`)

- Verifies existing Firebase tokens using Firebase Admin SDK
- Creates new JWT tokens with extended expiration (1 hour)
- Handles various error scenarios (invalid tokens, expired Firebase tokens, etc.)
- Automatically cleans up invalid cookies

### 2. Client-side Token Refresh

#### FirebaseAuthContext (`src/context/FirebaseAuthContext.tsx`)

- Added `refreshToken()` function to the context
- Automatic refresh every 45 minutes using `setInterval`
- Updates auth cookies when tokens are refreshed
- Handles logout and error cases

### 2. useAuthSWR Hook (`src/swr/useAuthSWR.ts`)

- Wraps SWR with automatic token refresh on 401 errors
- Use this instead of regular `useSWR` for authenticated API calls
- Prevents retry loops on auth errors

### 3. Enhanced Fetcher (`src/swr/utils.ts`)

- `fetcherWithAuth()` function handles token refresh automatically
- Retries failed requests after refreshing tokens

### 4. Auth Mutation Helper (`src/swr/useAuthMutation.ts`)

- For POST/PUT/DELETE requests that need authentication
- Handles token refresh for mutation operations

## Usage Examples

### For GET requests (reading data):

```tsx
import { useAuthSWR } from '@/src/swr/useAuthSWR';

export function useCertifications() {
  const { data, error, isLoading } = useAuthSWR<CertificationData>('/api/certifications');

  return { certifications: data, error, isLoading };
}
```

### For mutations (POST/PUT/DELETE):

```tsx
import useSWRMutation from 'swr/mutation';
import { useAuthMutationFetcher } from '@/src/swr/useAuthMutation';

export function useCreateCertification() {
  const authFetcher = useAuthMutationFetcher();

  const { trigger, isMutating, error } = useSWRMutation('/api/certifications', (url, { arg }) =>
    authFetcher(url, { arg }, 'POST'),
  );

  return { createCertification: trigger, isCreating: isMutating, error };
}
```

### Manual token refresh:

```tsx
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

function MyComponent() {
  const { refreshToken } = useFirebaseAuth();

  const handleRefresh = async () => {
    const newToken = await refreshToken();
    if (newToken) {
      console.log('Token refreshed successfully');
    }
  };

  return <button onClick={handleRefresh}>Refresh Token</button>;
}
```

## Benefits

1. **Seamless UX**: Users don't get logged out when tokens expire
2. **Automatic Recovery**: Failed API calls are automatically retried with fresh tokens
3. **Simple Integration**: Just replace `useSWR` with `useAuthSWR` in existing code
4. **Minimal Changes**: Existing API endpoints don't need modifications

## Migration Guide

To update existing SWR hooks:

1. Replace `import useSWR from 'swr'` with `import { useAuthSWR } from '@/src/swr/useAuthSWR'`
2. Replace `useSWR(key, fetcher, options)` with `useAuthSWR(key, options)`
3. Remove custom fetcher functions (they're handled automatically)

The system handles all token refresh logic automatically, ensuring your app continues to work seamlessly even with expired Firebase tokens.
