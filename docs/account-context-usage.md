# AccountContext Usage Guide

## Overview

The `AccountContext` provides centralized access to account and subscription data throughout the entire application. It wraps the main routes and makes account state easily accessible on any page without the need to repeatedly fetch data or pass props down through component trees.

## Setup

The `AccountContext` is automatically set up in the app layout and wraps all routes. No additional setup is required in individual components.

### App Structure

```
App Layout
├── ConditionalFirebaseAuthProvider
    ├── AccountProvider ← Provides account context
        ├── PageViewTracker
        ├── Main Content (children)
        └── ConditionalFooter
```

## Available Hooks

### 1. `useAccount()` - Main Hook

The primary hook that provides comprehensive account and subscription information:

```typescript
import { useAccount } from '@/src/context/AccountContext';

function MyComponent() {
  const {
    // Account data
    account,
    isLoading,
    error,

    // Authentication state
    isAuthenticated,
    firebaseUserId,
    apiUserId,
    userEmail,

    // Account status
    hasAccount,
    hasStripeCustomer,

    // Subscription status
    hasSubscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    subscriptionStatus,

    // Plan information
    planId,
    planName,
    planAmount,
    planCurrency,

    // Billing information
    currentPeriodEnd,
    trialEnd,
    cancelAtPeriodEnd,

    // Actions
    refreshAccount,
  } = useAccount();

  // Your component logic here
}
```

### 2. `useSubscriptionStatus()` - Subscription-Focused Hook

For components that only need subscription information:

```typescript
import { useSubscriptionStatus } from '@/src/context/AccountContext';

function SubscriptionBadge() {
  const { hasSubscription, hasActiveSubscription, isTrialing, isCanceled, subscriptionStatus } =
    useSubscriptionStatus();

  return (
    <div>
      {hasActiveSubscription ? (
        <span className="badge-active">{isTrialing ? 'Trial' : 'Active'}</span>
      ) : (
        <span className="badge-inactive">Free</span>
      )}
    </div>
  );
}
```

### 3. `usePlanInfo()` - Plan Details Hook

For components that need billing and plan information:

```typescript
import { usePlanInfo } from '@/src/context/AccountContext';

function BillingInfo() {
  const {
    planId,
    planName,
    planAmount,
    planCurrency,
    currentPeriodEnd,
    trialEnd,
    cancelAtPeriodEnd,
  } = usePlanInfo();

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toUpperCase(),
    }).format((amount || 0) / 100);
  };

  return (
    <div>
      <h3>{planName}</h3>
      {planAmount && planCurrency && <p>Price: {formatPrice(planAmount, planCurrency)}</p>}
      {trialEnd && <p>Trial ends: {new Date(trialEnd * 1000).toLocaleDateString()}</p>}
    </div>
  );
}
```

### 4. `useAccountInfo()` - Account Details Hook

For components that need basic account information:

```typescript
import { useAccountInfo } from '@/src/context/AccountContext';

function UserProfile() {
  const {
    account,
    hasAccount,
    hasStripeCustomer,
    isAuthenticated,
    userEmail,
    apiUserId,
    firebaseUserId,
    refreshAccount,
  } = useAccountInfo();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {userEmail}</p>
      <p>Account Status: {hasAccount ? 'Active' : 'Pending'}</p>
      <button onClick={refreshAccount}>Refresh</button>
    </div>
  );
}
```

## Common Usage Patterns

### 1. Conditional Rendering Based on Subscription

```typescript
function FeatureComponent() {
  const { hasActiveSubscription, isTrialing } = useAccount();

  if (!hasActiveSubscription && !isTrialing) {
    return (
      <div className="upgrade-prompt">
        <h3>Upgrade Required</h3>
        <p>This feature requires an active subscription.</p>
        <a href="/pricing">View Plans</a>
      </div>
    );
  }

  return <div className="premium-feature">{/* Premium feature content */}</div>;
}
```

### 2. Navigation Based on Account Status

```typescript
function Navigation() {
  const { isAuthenticated, hasActiveSubscription } = useAccount();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <a href="/main">Dashboard</a>
          {hasActiveSubscription ? (
            <a href="/main/billing">Billing</a>
          ) : (
            <a href="/pricing">Upgrade</a>
          )}
        </>
      ) : (
        <>
          <a href="/signin">Sign In</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  );
}
```

### 3. Loading States

```typescript
function AccountDashboard() {
  const { isLoading, isAuthenticated, account } = useAccount();

  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading account information...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome back!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### 4. Error Handling

```typescript
function AccountStatus() {
  const { error, refreshAccount, isAuthenticated } = useAccount();

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load account information</p>
        <button onClick={refreshAccount}>Try Again</button>
      </div>
    );
  }

  return <div>{/* Account status content */}</div>;
}
```

## Data Flow

### Authentication Flow

1. User signs in through Firebase
2. `AccountContext` detects authentication state change
3. Context automatically fetches account data via `useAccountStatus()`
4. All components receive updated account information

### Data Refresh

- Account data automatically refreshes every 30 seconds
- Manual refresh available via `refreshAccount()` function
- Automatic refresh on window focus

### Error Handling

- Network errors don't crash the app
- Components can check `error` state and handle gracefully
- Automatic retry on authentication errors

## Performance Considerations

### Automatic Optimization

- Uses SWR for efficient data fetching and caching
- Automatic deduplication of requests
- Background updates without blocking UI

### Loading States

- `isLoading` indicates when data is being fetched
- Separate loading states for authentication and account data
- Smooth transitions between states

### Memory Management

- Context only loads when user is authenticated
- Automatic cleanup when user signs out
- Efficient re-renders with React's context optimization

## Best Practices

### 1. Use Specific Hooks When Possible

```typescript
// Good: Use specific hook for subscription data
const { hasActiveSubscription } = useSubscriptionStatus();

// Less efficient: Use main hook for simple data
const { hasActiveSubscription } = useAccount();
```

### 2. Handle Loading and Error States

```typescript
function MyComponent() {
  const { isLoading, error, hasActiveSubscription } = useAccount();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage onRetry={refreshAccount} />;

  return <FeatureContent />;
}
```

### 3. Check Authentication Before Using Account Data

```typescript
function ProtectedFeature() {
  const { isAuthenticated, hasActiveSubscription } = useAccount();

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  // Safe to use subscription data here
  return hasActiveSubscription ? <PremiumFeature /> : <UpgradePrompt />;
}
```

### 4. Use Manual Refresh Sparingly

```typescript
// Good: Automatic refresh handles most cases
function AccountInfo() {
  const { account } = useAccount();
  return <AccountDisplay account={account} />;
}

// Only use manual refresh for user-initiated actions
function RefreshButton() {
  const { refreshAccount } = useAccount();
  return <button onClick={refreshAccount}>Refresh</button>;
}
```

## Integration with Existing Code

The `AccountContext` is designed to work alongside existing authentication and data fetching patterns. It provides a convenient layer on top of the existing `useUnifiedAccountData` and `useFirebaseAuth` hooks without replacing them.

### Migration from Direct Hook Usage

Before:

```typescript
function MyComponent() {
  const { firebaseUser } = useFirebaseAuth();
  const { data, isLoading } = useUnifiedAccountData();

  const hasActiveSubscription = data?.data?.is_active_subscription || false;

  return <FeatureComponent enabled={hasActiveSubscription} />;
}
```

After:

```typescript
function MyComponent() {
  const { hasActiveSubscription } = useAccount();

  return <FeatureComponent enabled={hasActiveSubscription} />;
}
```

This approach provides cleaner, more maintainable code while ensuring consistent data access patterns across the application.
