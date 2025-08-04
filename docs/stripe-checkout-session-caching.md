# Stripe Checkout Session Caching Implementation

## Overview

This implementation creates a sophisticated checkout session caching system that allows unauthenticated users to select subscription plans and complete checkout after authentication. The system uses Firebase Realtime Database to temporarily store checkout session data.

## Architecture

### Key Components

1. **Firebase RTDB Service** (`src/services/stripe-checkout-cache.ts`)
2. **API Routes** (`app/api/stripe/checkout/`)
3. **React Hooks** (`src/stripe/client/hooks/`)
4. **SWR Integration** (`src/stripe/client/swr.ts`)

## User Flow

### For Unauthenticated Users

1. User clicks on a subscription plan
2. System generates browser fingerprint as session key
3. Session data is cached in Firebase RTDB at `stripe_checkout_init_sessions/{fingerprint}`
4. User is prompted to sign in
5. After authentication, cached session is retrieved and checkout is completed
6. Cache is cleaned up after successful redirect

### For Authenticated Users

1. User clicks on a subscription plan
2. System creates Stripe checkout session directly
3. User is redirected to Stripe checkout immediately

## Implementation Details

### Firebase RTDB Structure

```
stripe_checkout_init_sessions/
  {browser_fingerprint}/
    session_id: string
    price_id: string
    success_url?: string
    cancel_url?: string
    trial_days?: number
    created_at: number
    expires_at: number (30 minutes from creation)
```

### Browser Fingerprinting

Uses a combination of:

- User agent
- Screen resolution
- Timezone
- Language
- Platform
- Random component for uniqueness

### API Endpoints

1. **POST `/api/stripe/checkout/init-session`**

   - Caches checkout session data for unauthenticated users
   - Public endpoint, no authentication required
   - Validates price_id against available plans

2. **POST `/api/stripe/checkout/create-session`**
   - Creates actual Stripe checkout sessions
   - Handles both direct requests and cached session completion
   - Requires authentication for direct use

### React Hooks

1. **`useCheckoutFlow`**

   - Manages entire checkout process
   - Handles auth state detection
   - Coordinates between caching and direct checkout

2. **`useCachedCheckoutHandler`**
   - Automatically handles cached sessions after authentication
   - Runs on pages where users land after signin
   - Cleans up cached data after use

### Error Handling

- Graceful fallbacks for expired or missing cached sessions
- Clear error messages for users
- Comprehensive logging for debugging
- No sensitive data exposed in client-side errors

## Security Considerations

- Session data expires after 30 minutes
- Browser fingerprinting adds entropy to prevent collisions
- No sensitive payment data stored in cache
- Cleanup mechanisms prevent data accumulation
- Authentication still required for actual payment processing

## Integration Points

### With Existing Billing System

- Uses existing Stripe API integration
- Compatible with current subscription management
- Leverages existing authentication flow
- Maintains billing page patterns

### With Profile Management

- Cached checkout handler integrated into billing page
- Automatic completion on authentication
- Seamless user experience

## Testing Flow

### Manual Testing Steps

1. **Unauthenticated User Flow:**

   - Visit billing page while logged out
   - Click on a subscription plan
   - Verify session is cached
   - Sign in
   - Verify redirect to Stripe checkout

2. **Authenticated User Flow:**

   - Visit billing page while logged in
   - Click on a subscription plan
   - Verify immediate redirect to Stripe checkout

3. **Error Cases:**
   - Test expired cache (wait 30+ minutes)
   - Test invalid price_id
   - Test network failures

## Deployment Checklist

- [ ] Firebase Realtime Database rules configured
- [ ] Environment variables set for Stripe
- [ ] RTDB cleanup job scheduled (optional)
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled

## Maintenance

### Cleanup Strategy

The system includes automatic cleanup mechanisms:

- Sessions expire after 30 minutes
- `cleanupExpiredSessions()` function available for batch cleanup
- Can be run via scheduled job or manual trigger

### Monitoring

Key metrics to monitor:

- Cache hit rate (successful cached session completions)
- Session expiration rate
- Authentication conversion rate
- Error rates on API endpoints

## Future Enhancements

1. **Analytics Integration**

   - Track conversion rates from cached sessions
   - Monitor abandonment points

2. **Advanced Cleanup**

   - Scheduled Cloud Function for expired session cleanup
   - Metrics on cache usage patterns

3. **Enhanced Security**

   - Additional fingerprinting factors
   - Rate limiting on session creation

4. **User Experience**
   - Progress indicators during checkout flow
   - Better error messaging
   - Offline support for cached sessions

## Configuration

### Environment Variables Required

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_APP_URL=
```

### Firebase RTDB Rules

```json
{
  "rules": {
    "stripe_checkout_init_sessions": {
      ".read": false,
      ".write": false,
      "$sessionKey": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['session_id', 'price_id', 'created_at', 'expires_at'])"
      }
    }
  }
}
```

This implementation provides a robust, secure, and user-friendly solution for managing subscription checkouts across authentication states while maintaining high code quality and following Certifai's established patterns.
