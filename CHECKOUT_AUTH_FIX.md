# Fix for Checkout Session Authentication Errors

## Problem

Users were encountering authentication errors when trying to create checkout sessions:

```
API: Create checkout session error: Error: No authentication token available
    at serverFetchWithAuth (src/stripe/server/index.ts:43:10)
```

This error was occurring because the authentication check was throwing an error instead of returning a proper HTTP status code.

## Root Cause

The issue was in the `serverFetchWithAuth` function and all the API routes that use it. When there was no authentication token, the function would throw an error, which resulted in a 500 Internal Server Error instead of a proper 401 Unauthorized response.

## Solution

### 1. Created Helper Function (`src/stripe/server/index.ts`)

```typescript
/**
 * Helper function for API routes to handle authenticated requests
 */
export async function handleAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<
  { success: true; response: Response } | { success: false; status: number; error: string }
> {
  try {
    const token = await getAuthTokenFromCookies();

    if (!token) {
      return {
        success: false,
        status: 401,
        error: 'Authentication required',
      };
    }

    const response = await serverFetchWithAuth(endpoint, options);
    return { success: true, response };
  } catch (error) {
    console.error('Authenticated request error:', error);

    if (error instanceof Error && error.message.includes('authentication')) {
      return {
        success: false,
        status: 401,
        error: 'Authentication required',
      };
    }

    return {
      success: false,
      status: 500,
      error: 'Internal server error',
    };
  }
}
```

### 2. Updated All Authenticated API Routes

#### Routes Updated:

- `app/api/stripe/checkout/create-session/route.ts`
- `app/api/stripe/portal/create-session/route.ts`
- `app/api/stripe/subscription/cancel/route.ts`
- `app/api/stripe/subscription/resume/route.ts`
- `app/api/stripe/subscription/reactivate/route.ts`
- `app/api/stripe/subscription/update-plan/route.ts`
- `app/api/stripe/subscription/history/route.ts`

#### Pattern Applied:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await handleAuthenticatedRequest('/stripe/endpoint', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.status },
      );
    }

    const responseData = await result.response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 },
    );
  }
}
```

### 3. Enhanced Client-side Error Handling (`src/stripe/client/swr.ts`)

#### Updated Checkout Session Hook:

```typescript
export function useCreateCheckoutSession() {
  return useSWRMutation<...>('/api/stripe/checkout/create-session', stripePostFetcher, {
    onError: (error) => {
      // Handle authentication errors gracefully
      if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
        console.warn('Authentication required for checkout session');
      } else {
        console.error('Checkout session creation error:', error);
      }
    },
  });
}
```

## Key Benefits

### 1. Proper HTTP Status Codes

- **Before**: All auth failures returned 500 Internal Server Error
- **After**: Auth failures return 401 Unauthorized (proper REST API behavior)

### 2. Better Error Messages

- **Before**: Generic "No authentication token available"
- **After**: Clear "Authentication required" messages

### 3. Consistent Error Handling

- All authenticated routes now use the same pattern
- Centralized authentication logic in helper function
- Reduced code duplication

### 4. Improved Client Experience

- Frontend can properly handle 401 errors
- Better error logging and debugging
- Clear distinction between auth errors and server errors

## User Experience Impact

### For Unauthenticated Users:

- Attempting to create subscriptions shows proper "Authentication required" message
- No confusing 500 server errors
- Clear indication that login is required

### For Authenticated Users:

- Normal subscription operations work seamlessly
- Better error feedback for actual server issues
- Improved reliability and debugging

### For Developers:

- Clear error logs with proper categorization
- Easier debugging of authentication vs server issues
- Consistent error handling patterns across all routes

## Testing Scenarios

1. **Unauthenticated User**:

   - Visit billing page → See pricing plans
   - Try to subscribe → Get 401 with clear message

2. **Authenticated User**:

   - Visit billing page → See subscription status
   - Create/manage subscriptions → Works normally

3. **Expired Token**:
   - Operations gracefully fail with 401
   - Clear indication to re-authenticate

## Future Enhancements

1. **Token Refresh**: Automatic token refresh on 401 errors
2. **Redirect Logic**: Auto-redirect to login on authentication failures
3. **User Feedback**: Toast notifications for auth failures
4. **Session Management**: Better session timeout handling

This fix ensures that authentication errors are handled gracefully throughout the billing system, providing a better user experience and clearer debugging information for developers.
