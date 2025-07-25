# Authentication System Documentation

## Overview

The certifai authentication system is a Firebase Auth implementation with JWT token management and custom claims integration. This system provides both client-side and server-side authentication with a clean, streamlined flow.

## Architecture

### Core Components

1. **Firebase Authentication**: Primary authentication provider with email verification
2. **JWT Token Management**: JOSE JWT wrapper containing Firebase tokens for server-side validation
3. **Custom Claims Integration**: Stores `api_user_id` from backend API in Firebase custom claims
4. **Route Protection**: AuthGuard with simplified timeout handling for authentication states
5. **Middleware Protection**: Server-side route protection for `/main/*` paths

### Authentication Flow

#### Primary Flow

1. **User Authentication**: Firebase email/password authentication with email verification
2. **Token Generation**: Create JOSE JWT wrapper containing Firebase ID token with unique `jti`
3. **Cookie Setting**: Store JWT in secure HTTP-only cookie (`authToken`)
4. **API Integration**: Get `api_user_id` from backend API and store in custom claims
5. **Route Protection**: Middleware validates JWT and Firebase token for protected routes

#### Token Structure

```json
{
  "token": "firebase_id_token",
  "iat": 1234567890,
  "jti": "1234567890-abc123def",
  "exp": 1234571490
}
```

## Key Features

### 1. Firebase Auth with Custom Claims

**Implementation**:

- Email/password authentication with email verification requirement
- Custom claims store `api_user_id` from backend API
- Claims accessible both client-side and server-side

**Files**:

- `src/lib/auth-claims.ts` - Custom claims utilities
- `app/api/auth/set-claims/route.ts` - Sets custom claims
- `src/hooks/useApiUserId.ts` - React hook for accessing claims

### 2. JWT Token Security

**Features**:

- Unique JWT identifier (`jti`) for each token
- Legacy token detection and rejection
- Secure HTTP-only cookies with proper cleanup
- Token verification via middleware

**Files**:

- `middleware.ts` - Route protection and token validation
- `app/api/auth-cookie/set/route.ts` - JWT creation and cookie setting
- `app/api/auth-cookie/verify/route.ts` - Token verification

### 3. Authentication Context

**Implementation**:

- Centralized Firebase auth state management
- Parallel authentication setup (cookie + API login + custom claims)
- Automatic token refresh every 45 minutes
- Clean error handling with proper timeouts

**Files**:

- `src/context/FirebaseAuthContext.tsx` - Main auth context
- `src/lib/auth-setup.ts` - Authentication setup utilities

### 4. Route Protection System

**Features**:

- AuthGuard with 5-second API timeout for user ID loading
- 20-second emergency timeout with clean error messaging
- Simple authentication state management
- Session expiration handling

**Files**:

- `src/components/custom/AuthGuard.tsx` - Route protection with timeout handling
- `src/components/custom/PageLoader.tsx` - Clean loading interface

### 5. Conditional Firebase Provider

**Implementation**:

- Prevents Firebase initialization on public pages
- Reduces unnecessary Firebase API calls
- Lazy loading for auth-required pages only

**Files**:

- `src/components/auth/ConditionalFirebaseAuthProvider.tsx`

## File Structure

### Core Authentication Files

```
src/
├── context/
│   └── FirebaseAuthContext.tsx           # Main auth context with state management
├── lib/
│   ├── auth-setup.ts                     # Authentication setup utilities
│   ├── auth-claims.ts                    # Custom claims utilities
│   ├── auth-utils.ts                     # General auth utilities
│   ├── server-auth-strategy.ts           # Server-side auth validation
│   ├── service-only.ts                   # Server-side token management
│   ├── signin-helpers.ts                 # Signin flow utilities
│   └── jwt-utils.ts                      # JWT helper functions
├── hooks/
│   ├── useApiUserId.ts                   # React hook for api_user_id access
│   └── useSigninHooks.ts                 # Simplified signin hooks
├── components/
│   ├── auth/
│   │   └── ConditionalFirebaseAuthProvider.tsx  # Conditional auth provider
│   └── custom/
│       ├── AuthGuard.tsx                 # Route protection with timeout
│       └── PageLoader.tsx                # Clean loading interface
└── swr/
    └── useAuthSWR.ts                     # SWR with authentication
```

### API Routes

```
app/api/
├── auth/
│   ├── login/route.ts                    # Backend API login
│   ├── register/route.ts                 # User registration
│   ├── set-claims/route.ts               # Sets Firebase custom claims
│   └── clear-cache/route.ts              # Emergency cache clearing
└── auth-cookie/
    ├── set/route.ts                      # JWT creation and cookie setting
    ├── clear/route.ts                    # Cookie clearing
    ├── refresh/route.ts                  # Token refresh
    ├── verify/route.ts                   # Token verification
    ├── server-refresh/route.ts           # Server-side token refresh
    └── clear-cache/route.ts              # Cache clearing
```

### Layout and Middleware

```
middleware.ts                             # Route protection for /main/* paths
app/
├── layout.tsx                           # Root layout
├── main/layout.tsx                      # Protected routes with AuthGuard
└── signin/page.tsx                      # Authentication page
```

## Usage Examples

### 1. Using Firebase Auth Context

```tsx
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

function MyComponent() {
  const { firebaseUser, apiUserId, loading } = useFirebaseAuth();

  if (loading) return <div>Loading...</div>;
  if (!firebaseUser) return <div>Please sign in</div>;

  return <div>Welcome {firebaseUser.email}!</div>;
}
```

### 2. Accessing API User ID

```tsx
import { useApiUserId } from '@/src/hooks/useApiUserId';

function ProfileComponent() {
  const { apiUserId, loading } = useApiUserId();

  if (loading) return <div>Loading...</div>;
  if (!apiUserId) return <div>API User ID not available</div>;

  return <div>API User ID: {apiUserId}</div>;
}
```

### 3. Server-Side Authentication

```tsx
import { getServerAuthState } from '@/src/lib/server-auth-strategy';

export default async function ProtectedPage() {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated) {
    redirect('/signin');
  }

  return <div>Protected content</div>;
}
```

### 4. Using AuthGuard

```tsx
import AuthGuard from '@/src/components/custom/AuthGuard';

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

### 5. Emergency Recovery

```tsx
// In case of authentication issues, AuthGuard provides clean error handling
// Authentication state is automatically cleared when needed
```

## Security Features

### Token Management

- JOSE JWT wrapper containing Firebase ID token
- Unique JWT identifier (`jti`) for each token
- Secure HTTP-only cookies with proper expiration
- Legacy token detection and automatic cleanup

### Authentication Security

- Email verification requirement
- Server-side token validation using Firebase Admin SDK
- Middleware protection for all `/main/*` routes
- Automatic cleanup of invalid authentication state

### Error Prevention

- Request timeout handling (10 seconds for auth setup, 5 seconds for API user ID)
- Clean timeout mechanisms with proper error messaging
- Graceful fallback when API is unavailable
- Comprehensive error logging

## Testing

### Manual Testing

1. **Authentication Flow**: Sign up → Email verification → Sign in → Access protected routes
2. **Token Security**: Verify JWT structure includes `jti` field
3. **Emergency Recovery**: Simulate stuck states and verify recovery options
4. **Route Protection**: Test middleware protection on `/main/*` paths

### Key Test Cases

- Email verification requirement
- Legacy token rejection
- Emergency timeout handling
- Conditional Firebase provider behavior
- Server-side authentication validation

## Troubleshooting

### Common Issues

**Email Verification Required**:

- **Symptom**: User can't sign in after registration
- **Solution**: Check email and click verification link
- **Prevention**: Clear messaging about email verification requirement

**Stuck on Loading**:

- **Symptom**: AuthGuard shows loading for extended periods
- **Solution**: Automatic timeout handling with clear error messages after 20 seconds
- **Technical**: API timeout set to 5 seconds for user ID, emergency timeout at 20 seconds with clean error UI

**Legacy Token Issues**:

- **Symptom**: Users redirected to signin unexpectedly
- **Solution**: System automatically clears legacy tokens
- **Prevention**: All new tokens include `jti` field for validation

**Middleware Errors**:

- **Symptom**: 401 errors on protected routes
- **Solution**: Check cookie presence and JWT structure
- **Debug**: Enable middleware logging for detailed error messages

### Developer Tools

**Auth State Check**: `getServerAuthState()`
**Token Verification**: `/api/auth-cookie/verify`
**Cache Clearing**: `/api/auth/clear-cache`

## Configuration

### Environment Variables

```bash
JOSE_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_FIREBASE_BACKEND_URL=your-backend-url
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Firebase Setup

- Email/password authentication enabled
- Email verification required
- Custom claims support configured
- Admin SDK properly initialized

## Migration Notes

### From Previous Versions

- Legacy `joseToken` cookies automatically detected and cleared
- New `authToken` cookie format with `jti` field
- Enhanced middleware validation
- Backward compatible authentication flow

### Future Considerations

- Consider implementing refresh token rotation
- Add support for additional authentication providers
- Implement rate limiting for authentication attempts
- Add comprehensive audit logging

## Benefits of Current Implementation

### Code Quality

- **Simplified Codebase**: Removed ~300 lines of complex workaround code
- **Better Performance**: Eliminated unnecessary timeouts and retries
- **Cleaner Flow**: Straightforward signin process without complex error handling
- **Maintainable**: Easier to understand and debug authentication flow
- **Reliable**: Token refresh mechanism works properly without workarounds

### User Experience

- **Faster Loading**: Reduced authentication setup time
- **Clear Messaging**: Simple, informative error messages
- **Smooth Flow**: Direct signin to main app without recovery screens
- **Responsive**: Quick timeouts with appropriate fallbacks

This documentation reflects the current clean implementation of the certifai authentication system as of January 2025.
