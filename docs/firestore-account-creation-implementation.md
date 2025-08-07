# Firestore Account Creation on Login Implementation

## Overview

This implementation ensures that every authenticated user has a corresponding Firestore account record with default values. The system checks for and creates Firestore accounts during user login and registration processes.

## Key Components

### Backend API Changes

#### 1. Enhanced StripeFirestoreService

**File**: `/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/stripe/db.ts`

Added a new method `createAccount()` to create default Firestore account records:

```typescript
static async createAccount(accountData: {
  api_user_id: string;
  firebase_user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}): Promise<void>
```

This method creates a basic account record with:

- `api_user_id`: The internal UUID for API operations
- `firebase_user_id`: Firebase UID for reference
- `email`: User's email address
- `created_at` and `updated_at`: Timestamps

#### 2. Modified Login Endpoint

**File**: `/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/login.ts`

Enhanced to check and create Firestore accounts:

- Checks if a Firestore account exists for the user
- Creates a default account if none exists
- Updates the `updated_at` timestamp if account exists
- Logs activities for monitoring
- Gracefully handles errors without failing the login process

#### 3. Modified Registration Endpoint

**File**: `/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/register.ts`

Enhanced to create Firestore accounts during signup:

- Creates Firestore account alongside user registration
- Ensures consistency between Prisma user records and Firestore accounts
- Updates existing accounts if they exist
- Provides detailed logging for tracking

#### 4. New Ensure Account Endpoint

**File**: `/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/firestore/ensure-account.ts`

A dedicated endpoint for ensuring Firestore accounts exist:

- Can be called independently to verify/create accounts
- Useful for migration scenarios or edge cases
- Returns detailed status about account creation

### Frontend Integration

#### 1. Firestore Account Utilities

**File**: `/Users/xingbingao/workplace/certifai-app/src/lib/firestore-account-utils.ts`

Utility functions for frontend account management:

```typescript
ensureFirestoreAccount(firebaseUserId: string, email: string)
checkFirestoreAccountExists()
```

These functions:

- Check account existence through the unified account API
- Create accounts via the ensure-account endpoint
- Provide status information and error handling

#### 2. Frontend API Endpoint

**File**: `/Users/xingbingao/workplace/certifai-app/app/api/firestore/ensure-account/route.ts`

Frontend API that proxies to the backend ensure-account endpoint:

- Validates authentication
- Forwards requests to backend API
- Handles errors gracefully

#### 3. Enhanced Authentication Setup

**File**: `/Users/xingbingao/workplace/certifai-app/src/lib/auth-setup.ts`

Modified to include Firestore account verification:

- Calls `ensureFirestoreAccount()` during auth setup
- Non-blocking to avoid impacting login performance
- Logs warnings if account creation fails

## Data Structure

### Default Account Schema

When a new Firestore account is created, it includes:

```typescript
{
  api_user_id: string; // Internal UUID
  firebase_user_id: string; // Firebase UID
  email: string; // User email
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp

  // All Stripe-related fields are optional and undefined by default:
  // stripe_customer_id?: string;
  // stripe_subscription_id?: string;
  // stripe_subscription_status?: string;
  // ... (other Stripe fields)
}
```

## Integration Points

### 1. Login Flow

1. User authenticates with Firebase
2. Backend login API checks Prisma user record
3. Backend checks for Firestore account
4. Creates Firestore account if missing
5. Frontend authentication setup runs
6. Frontend ensures Firestore account exists (fallback)

### 2. Registration Flow

1. User creates Firebase account
2. Backend registration API creates Prisma user record
3. Backend creates corresponding Firestore account
4. User verification process completes
5. Login flow handles any edge cases

### 3. Existing Users

- Existing users without Firestore accounts will have them created on next login
- No manual migration required
- Process is transparent to users

## Error Handling

### Backend

- Firestore errors don't fail the login/registration process
- Comprehensive logging for debugging
- Graceful degradation if Firestore is unavailable

### Frontend

- Non-blocking account creation during auth setup
- Warning logs if account creation fails
- User experience remains unaffected

## Monitoring and Logging

### Log Events

- `FIRESTORE_ACCOUNT_CREATED_ON_LOGIN`: Account created during login
- `FIRESTORE_ACCOUNT_UPDATED_ON_LOGIN`: Account updated during login
- `FIRESTORE_ACCOUNT_CREATED_ON_REGISTER`: Account created during registration
- `FIRESTORE_ACCOUNT_CREATED_VIA_ENSURE_ENDPOINT`: Account created via ensure endpoint

### Error Tracking

- `FIRESTORE_ACCOUNT_CHECK_ERROR_ON_LOGIN`: Errors during login account check
- `FIRESTORE_ACCOUNT_CHECK_ERROR_ON_REGISTER`: Errors during registration account check
- `FIRESTORE_ACCOUNT_ENSURE_ERROR`: Errors in ensure-account endpoint

## Benefits

1. **Consistency**: Every user has both Prisma and Firestore records
2. **Stripe Integration**: Ready for Stripe customer/subscription data
3. **Unified Account API**: Frontend can fetch all account data from one endpoint
4. **Zero Downtime**: Implementation doesn't disrupt existing users
5. **Automatic Migration**: Existing users get Firestore accounts on next login
6. **Fault Tolerance**: Graceful error handling preserves user experience
7. **Extensibility**: Easy to add more default fields in the future

## Migration Strategy

### For Existing Users

1. Users without Firestore accounts will have them created on next login
2. No manual intervention required
3. No service disruption

### For New Users

1. Firestore accounts are created during registration
2. Consistent experience from day one

### Monitoring

- Track account creation rates through logs
- Monitor for any unusual error patterns
- Validate that all active users eventually have Firestore accounts

## Future Enhancements

1. **Batch Migration**: Script to create Firestore accounts for all existing users
2. **Health Check**: Endpoint to verify Firestore account consistency
3. **Analytics**: Track account creation metrics
4. **Default Values**: Add more sophisticated default values based on user type or plan

## AccountContext Integration

### Frontend Context Provider

**File**: `/Users/xingbingao/workplace/certifai-app/src/context/AccountContext.tsx`

Added a comprehensive React context that wraps the entire application to provide easy access to account and subscription data on any page:

```typescript
// Main hook providing complete account access
useAccount();

// Specialized hooks for specific use cases
useSubscriptionStatus();
usePlanInfo();
useAccountInfo();
```

**Key Features**:

- Centralized account state management
- Automatic data fetching and caching
- Real-time subscription status
- Easy conditional rendering based on account state
- Loading and error state handling

### App Integration

**File**: `/Users/xingbingao/workplace/certifai-app/app/layout.tsx`

The `AccountProvider` wraps all routes in the app layout:

```tsx
<ConditionalFirebaseAuthProvider>
  <AccountProvider>
    {/* All app content has access to account context */}
    {children}
  </AccountProvider>
</ConditionalFirebaseAuthProvider>
```

### Usage Examples

**File**: `/Users/xingbingao/workplace/certifai-app/src/components/account/AccountExamples.tsx`

Provides practical examples of how to use the AccountContext:

- Account status cards
- Subscription badges
- Plan details displays
- Conditional navigation
- Loading states

### Documentation

**File**: `/Users/xingbingao/workplace/certifai-app/docs/account-context-usage.md`

Comprehensive guide covering:

- Available hooks and their use cases
- Common usage patterns
- Best practices
- Migration from direct hook usage
- Performance considerations

### Benefits of AccountContext

1. **Simplified Access**: No need to import and manage multiple hooks
2. **Consistent State**: Single source of truth for account data
3. **Automatic Updates**: Real-time updates across all components
4. **Type Safety**: Full TypeScript support with proper types
5. **Performance**: Efficient caching and deduplication
6. **Developer Experience**: Easy to use and understand API
