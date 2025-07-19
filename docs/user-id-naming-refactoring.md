# User ID Naming Refactoring Documentation

## Overview

This refactoring clarifies the distinction between different types of user identifiers used throughout the authentication system, making the codebase more maintainable and reducing confusion.

## ID Types Clarified

### 1. `firebase_user_id` (Firebase UID)

- **Source**: Firebase Authentication service
- **Format**: Firebase-generated string (e.g., "abc123def456")
- **Purpose**: Used to identify users within Firebase systems
- **Usage**: Authentication, Firebase custom claims, external references

### 2. `api_user_id` (Internal API User ID)

- **Source**: Our PostgreSQL database (auto-generated UUID)
- **Format**: UUID v4 (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **Purpose**: Primary key for user operations within our API
- **Usage**: Database relationships, API operations, business logic

### 3. `user_id` (Deprecated)

- **Status**: Deprecated in favor of explicit naming
- **Migration**: Use `api_user_id` for new code
- **Backward Compatibility**: Still returned in responses for existing clients

## Changes Made

### Backend API Endpoints

#### `/api/auth/register` (Firebase Functions)

**Before**:

```typescript
const firebaseUserId = firebaseUser.user_id as string;
// ...
res.status(200).json({
  success: true,
  api_user_id: user.user_id,
  user_id: user.user_id, // For backward compatibility
});
```

**After**:

```typescript
// Extract Firebase user ID - this is NOT the api_user_id, it's the Firebase UID
const firebaseUserId = firebaseUser.user_id || firebaseUser.uid || firebaseUser.sub;
// ...
res.status(200).json({
  success: true,
  api_user_id: user.user_id, // Our internal UUID for API operations
  firebase_user_id: firebaseUserId, // Firebase UID for reference
  // Deprecated: keeping for backward compatibility only
  user_id: user.user_id, // @deprecated Use api_user_id instead
});
```

#### `/api/auth/login` (Firebase Functions)

**Before**:

```typescript
const firebaseUserId = firebaseUser.user_id as string;
// ...
res.status(200).json({
  success: true,
  api_user_id: user?.user_id,
});
```

**After**:

```typescript
// Extract Firebase user ID - this is NOT the api_user_id, it's the Firebase UID
const firebaseUserId = firebaseUser.user_id || firebaseUser.uid || firebaseUser.sub;
// ...
res.status(200).json({
  success: true,
  api_user_id: user.user_id, // Our internal UUID for API operations
  firebase_user_id: firebaseUserId, // Firebase UID for reference
  // Deprecated: keeping for backward compatibility only
  user_id: user.user_id, // @deprecated Use api_user_id instead
});
```

### Frontend API Routes

#### `/app/api/auth/register/route.ts`

**Before**:

```typescript
const decodedToken = await auth.verifyIdToken(firebaseToken);
const uid = decodedToken.uid;
// ...
firebase_user_id: uid,
  // ...
  (apiUserId = `fb_${uid}`);
```

**After**:

```typescript
const decodedToken = await auth.verifyIdToken(firebaseToken);
const firebaseUserId = decodedToken.uid; // Firebase UID (not our api_user_id)
// ...
firebase_user_id: firebaseUserId, // Send Firebase UID to backend
  // ...
  (apiUserId = `fb_${firebaseUserId}`);
```

#### `/app/api/auth/login/route.ts`

**Before**:

```typescript
const uid = decodedToken.uid;
// ...
return NextResponse.json({
  message: 'Authentication successful',
  uid,
  api_user_id: apiUserId,
  email,
});
```

**After**:

```typescript
const firebaseUserId = decodedToken.uid; // Firebase UID (not our api_user_id)
// ...
return NextResponse.json({
  message: 'Authentication successful',
  firebase_user_id: firebaseUserId, // Firebase UID for reference
  api_user_id: apiUserId, // Our internal UUID for API operations
  email,
  // Deprecated: keeping for backward compatibility only
  uid: firebaseUserId, // @deprecated Use firebase_user_id instead
});
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- This becomes api_user_id
  firebase_user_id VARCHAR NOT NULL UNIQUE,            -- Firebase UID
  email VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships

- `firebase_user_id` links to Firebase Authentication
- `user_id` (api_user_id) used for all internal relationships
- Foreign keys reference `user_id` (api_user_id)

## Migration Guidelines

### For New Code

1. **Always use explicit naming**: `firebase_user_id` vs `api_user_id`
2. **Never use generic `user_id`** without context
3. **Add comments** explaining which ID type is being used
4. **Include both IDs in responses** when relevant

### For Existing Code

1. **Backward compatibility maintained** - existing `user_id` fields still work
2. **Gradual migration** - update when touching related code
3. **Client updates** should prefer `api_user_id` over `user_id`

### Response Format Standards

#### Authentication Responses

```typescript
{
  success: true,
  firebase_user_id: "abc123def456",     // Firebase UID
  api_user_id: "550e8400-e29b-...",     // Our internal UUID
  // Deprecated fields (backward compatibility)
  uid: "abc123def456",                  // @deprecated Use firebase_user_id
  user_id: "550e8400-e29b-..."         // @deprecated Use api_user_id
}
```

#### API Operation Responses

```typescript
{
  success: true,
  data: {
    api_user_id: "550e8400-e29b-...",   // Primary reference for API operations
    // Other user data...
  }
}
```

## Benefits

### 1. **Clarity**

- Developers immediately understand which ID type they're working with
- Reduces confusion during debugging and development
- Self-documenting code through explicit naming

### 2. **Maintainability**

- Easier to track data flow between Firebase and internal systems
- Simplified debugging when ID mismatches occur
- Clear separation of concerns between authentication and business logic

### 3. **Scalability**

- Consistent patterns for future endpoint development
- Easy to onboard new developers with clear conventions
- Reduced risk of ID confusion in complex operations

### 4. **Backward Compatibility**

- Existing clients continue to work without changes
- Gradual migration path for legacy code
- No breaking changes to public APIs

## Testing Considerations

### Unit Tests

- Test both new explicit fields and deprecated fields
- Verify ID type consistency across related operations
- Validate fallback ID generation logic

### Integration Tests

- Test Firebase UID → api_user_id mapping
- Verify custom claims contain correct api_user_id
- Test registration and login flows with new response format

### Migration Tests

- Ensure existing clients still receive expected fields
- Verify new clients can use either naming convention
- Test ID consistency across multiple API calls

This refactoring establishes a clear, maintainable pattern for user identification that will scale well as the system grows.
