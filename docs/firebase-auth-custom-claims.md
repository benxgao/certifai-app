# Firebase Auth Custom Claims Integration

## Overview

This implementation stores the `api_user_id` from the backend API as Firebase Auth custom claims, providing multiple ways to access the user's API ID throughout the application.

## Architecture

### 1. Signup Flow Enhancement

During the signup process (`/app/signup/page.tsx`):

1. User creates Firebase Auth account
2. Backend user record is created via `/api/auth/register`
3. `api_user_id` is returned from the backend
4. Custom claims are set via `/api/auth/set-claims` with the `api_user_id`

### 2. Authentication Context Enhancement

The `FirebaseAuthContext` now checks both:

- Backend API login endpoint (primary source)
- Firebase Auth custom claims (fallback/alternative source)

This provides redundancy and ensures the `api_user_id` is available even if one source fails.

### 3. API Route for Custom Claims

- **Endpoint**: `/api/auth/set-claims`
- **Method**: POST
- **Purpose**: Sets Firebase Auth custom claims with `api_user_id`
- **Authentication**: Requires valid Firebase ID token in Authorization header

## Usage

### 1. Access api_user_id in Components

```tsx
import { useApiUserId } from '@/src/hooks/useApiUserId';

function MyComponent() {
  const { apiUserId, loading, user } = useApiUserId();

  if (loading) return <div>Loading...</div>;
  if (!apiUserId) return <div>No API user ID available</div>;

  return <div>API User ID: {apiUserId}</div>;
}
```

### 2. Access api_user_id in Context

```tsx
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

function MyComponent() {
  const { apiUserId, firebaseUser, loading } = useFirebaseAuth();

  // Use apiUserId directly from context
}
```

### 3. Server-side Access in API Routes

```tsx
import { getApiUserIdFromToken } from '@/src/lib/auth-claims';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function GET() {
  const firebaseToken = await getFirebaseTokenFromCookie();
  if (!firebaseToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiUserId = await getApiUserIdFromToken(firebaseToken);
  if (!apiUserId) {
    return NextResponse.json({ error: 'API User ID not found' }, { status: 404 });
  }

  // Use apiUserId for API calls
}
```

### 4. Direct Custom Claims Access

```tsx
import { getApiUserIdFromClaims } from '@/src/lib/auth-claims';

// In a client component
const apiUserId = await getApiUserIdFromClaims();
```

## Files Modified/Created

### Created Files:

1. `/app/api/auth/set-claims/route.ts` - API endpoint to set custom claims
2. `/src/lib/auth-claims.ts` - Utility functions for custom claims
3. `/src/hooks/useApiUserId.ts` - React hook for accessing api_user_id

### Modified Files:

1. `/app/signup/page.tsx` - Enhanced signup flow to set custom claims
2. `/src/context/FirebaseAuthContext.tsx` - Enhanced to check both API and custom claims

## Benefits

1. **Redundancy**: api_user_id available from both API and custom claims
2. **Offline Capability**: Custom claims work without network requests
3. **Performance**: Custom claims are cached in JWT tokens
4. **Consistency**: Same user ID accessible across client and server
5. **Flexibility**: Multiple access patterns for different use cases

## Error Handling

The system gracefully handles failures:

- If custom claims setting fails during signup, the user can still sign up
- If API login fails, custom claims serve as a fallback
- If custom claims are missing, API login provides the data
- All operations log appropriate warnings without blocking user flow

## Security

- Custom claims are set server-side using Firebase Admin SDK
- Claims are verified using Firebase ID tokens
- All API endpoints require proper authentication
- Claims are included in JWT tokens and validated by Firebase

## Testing the Implementation

1. **Test Signup Flow**:

   - Create a new account
   - Check browser console for custom claims logs
   - Verify `api_user_id` is available in context

2. **Test Custom Claims Access**:

   ```tsx
   // In a component
   const { apiUserId } = useApiUserId();
   console.log('API User ID from claims:', apiUserId);
   ```

3. **Test Server-side Access**:
   - Create API endpoint using `getApiUserIdFromToken`
   - Verify it correctly retrieves the ID from custom claims
