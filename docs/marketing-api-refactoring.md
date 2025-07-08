# Marketing API Architecture Refactoring

## Overview

This document describes the refactored marketing API architecture that moves server-side operations to proper API routes and ensures security by keeping sensitive operations server-side only.

## Before vs After

### Before (❌ Security Issue)

```
Client (signup page)
    ↓ (direct import)
marketing-api.ts (contains JWT secrets + AWS calls)
    ↓
AWS Lambda
    ↓
MailerLite
```

**Problems:**

- JWT secrets exposed to client-side
- Server-only operations happening in client context
- Environment variables accessible in browser

### After (✅ Secure)

```
Client (signup page)
    ↓ (fetch to internal API)
/api/marketing/subscribe (API route)
    ↓ (server-side import)
marketing-api.ts (server-only)
    ↓
AWS Lambda
    ↓
MailerLite
```

**Benefits:**

- JWT secrets stay server-side
- Clear separation of client/server responsibilities
- Environment variables secure
- Better error handling and logging

## File Structure

```
app/
├── api/
│   └── marketing/
│       └── subscribe/
│           └── route.ts          # Server-side API route
└── signup/
    └── page.tsx                  # Updated to use client-safe function

src/lib/
├── marketing-api.ts              # Server-side only (JWT + AWS calls)
└── marketing-client.ts           # Client-side safe (calls internal API)
```

## Usage

### Client-side (Components, Pages)

```typescript
import { subscribeUserToMarketing } from '@/src/lib/marketing-client';

// Safe to use in client components
const result = await subscribeUserToMarketing(email, firstName, lastName, userAgent);
```

### Server-side (API Routes, Server Actions)

```typescript
import { subscribeUserToMarketing } from '@/src/lib/marketing-api';

// Only use in server context - protected by 'server-only' directive
const result = await subscribeUserToMarketing(email, firstName, lastName, userAgent);
```

## API Route Details

### Endpoint: `POST /api/marketing/subscribe`

**Request Body:**

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**

```json
{
  "success": true,
  "subscriberId": "12345"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

All environment variables remain the same:

```bash
# Required for API route
MARKETING_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
MARKETING_API_JWT_SECRET=your-jwt-secret-key
```

## Security Improvements

1. **JWT Secrets**: Now only accessible server-side
2. **Environment Variables**: Protected from client exposure
3. **Server-Only Directive**: Added `import 'server-only'` to prevent client-side usage
4. **Error Handling**: Server-side errors don't expose internals to client
5. **Input Validation**: Centralized validation in API route
6. **Rate Limiting**: Can be added at API route level

## Migration Notes

- ✅ No breaking changes to existing signup flow
- ✅ Same user experience and error handling
- ✅ All existing functionality preserved
- ✅ Better security and separation of concerns
- ✅ Easier to test and debug

## Testing

The marketing subscription can be tested the same way as before - the client-side interface remains identical, only the underlying implementation has been secured.
