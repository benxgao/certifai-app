# Enhanced JWT Token Security for Signin

This document outlines the improvements made to ensure brand new JWT tokens are created on signin and existing legacy cookies are not effective.

## Key Security Enhancements

### 1. **Complete Auth State Reset on Signin**

When a user signs in, the system now:

- Clears all existing authentication cookies (both current and legacy)
- Removes any client-side stored tokens
- Generates completely fresh JWT tokens with unique identifiers
- Ensures no stale authentication state remains

### 2. **JWT Token Uniqueness**

Every new JWT token now includes:

- **`jti` (JWT ID)**: A unique identifier combining timestamp and random string
- **Fresh `iat` (Issued At)**: Current timestamp for token age validation
- **Enhanced payload**: Structured to detect legacy tokens

### 3. **Legacy Token Detection and Rejection**

The system actively identifies and rejects legacy tokens by:

- Checking for missing `jti` field (unique to new tokens)
- Validating token age (tokens older than 24 hours require refresh)
- Middleware inspection of cookie names and formats
- Automatic cleanup of outdated authentication state

### 4. **Enhanced Middleware Security**

The middleware now:

- Detects and clears legacy cookies (`joseToken` vs current `authToken`)
- Validates JWT structure and required fields
- Rejects tokens without unique identifiers
- Provides clear error messages for different failure scenarios

## Implementation Details

### New JWT Token Structure

```typescript
{
  token: firebaseToken,           // Firebase ID token
  iat: currentTimestamp,          // Issued at time
  jti: "timestamp-randomId",      // Unique JWT identifier
  exp: expirationTime             // Expiration time (1 hour)
}
```

### Auth Cookie Setting Process

1. **Clear Existing Cookies**: Remove any existing auth cookies
2. **Generate Unique JWT**: Create token with unique identifier
3. **Set Secure Cookie**: HttpOnly, Secure, SameSite strict
4. **Log Success**: Confirm new token generation

### Legacy Token Handling

The system identifies legacy tokens by:

- Missing `jti` field
- Old cookie names (`joseToken` instead of `authToken`)
- Tokens older than 24 hours
- Invalid or malformed JWT structure

## User Experience

### Signin Flow

1. User enters credentials
2. System clears any existing auth state
3. Firebase authentication generates fresh token
4. New JWT created with unique identifier
5. Secure cookie set with new token
6. User redirected to main application

### Legacy Token Scenarios

- **Legacy Cookie Detected**: User redirected to signin with message
- **Old Token Found**: Automatic refresh or signin prompt
- **Invalid Format**: Clear error message and signin redirect

## Security Benefits

### 1. **No Token Reuse**

- Every signin creates completely new tokens
- Old tokens are immediately invalidated
- No possibility of stale token exploitation

### 2. **Enhanced Detection**

- Unique identifiers allow precise token tracking
- Legacy tokens are immediately identified
- System can audit token usage patterns

### 3. **Improved Cleanup**

- Complete authentication state reset
- No orphaned tokens or cookies
- Clean slate for each authentication session

### 4. **Better Error Handling**

- Clear messages for different failure types
- User-friendly guidance for resolution
- Proper security without confusion

## API Changes

### `/api/auth-cookie/set`

- Now clears existing cookies before setting new ones
- Generates JWT with unique identifier (`jti`)
- Enhanced error handling and logging

### `/api/auth-cookie/verify`

- Validates presence of unique identifier
- Checks token age (rejects tokens older than 24 hours)
- Enhanced Firebase token validation

### `/api/auth-cookie/clear`

- Clears both current and legacy cookie names
- Ensures complete cleanup

## Testing the Implementation

### Verify New Token Generation

1. Sign in and check browser dev tools for new cookie
2. Verify JWT payload includes `jti` field
3. Confirm old cookies are cleared

### Test Legacy Token Rejection

1. Manually set old-format cookie
2. Try to access protected route
3. Verify redirect to signin with appropriate message

### Validate Token Uniqueness

1. Sign in multiple times
2. Verify each signin generates different `jti`
3. Confirm tokens are not reused

## Migration Considerations

### Existing Users

- Users with legacy tokens will be prompted to sign in again
- Clear messaging explains the enhanced security
- One-time inconvenience for improved security

### Development

- All development environments get fresh tokens
- No need to manually clear browser state
- Consistent behavior across environments

## Configuration

### Environment Variables

- `JOSE_JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Determines cookie security settings

### Cookie Settings

- **Production**: Secure flag enabled
- **Development**: Secure flag disabled for localhost
- **Always**: HttpOnly, SameSite strict, 1-hour expiration

## Best Practices

1. **Always Clear State**: Before setting new authentication
2. **Use Unique Identifiers**: For all new JWT tokens
3. **Validate Token Age**: Reject overly old tokens
4. **Clear Error Messages**: Help users understand requirements
5. **Complete Cleanup**: Remove all authentication artifacts

This enhanced security ensures that every signin creates fresh, unique authentication tokens while preventing any legacy or stale tokens from being effective.
