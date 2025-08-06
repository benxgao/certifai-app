# Frontend Stripe Checkout Integration with Unified Account APIs

## Overview

This document describes the complete integration of the unified Stripe account APIs with the frontend checkout flow. The integration provides a seamless experience for users to view pricing, manage subscriptions, and access unified account data.

## Key Features

### 1. **Unified Account Data Access**

- Single API endpoint for all Stripe-related account information
- Real-time subscription status and billing information
- Flat data structure with stripe\_ prefixed fields

### 2. **Enhanced Checkout Flow**

- Pre-checkout subscription validation
- Intelligent handling of existing subscriptions
- Trial period support and cancellation management
- Post-checkout account data refresh

### 3. **Comprehensive UI Components**

- Enhanced pricing cards with subscription awareness
- Unified subscription status display
- Real-time billing information
- Responsive design for all devices

## New Frontend Components

### API Routes

#### `/api/stripe/account/route.ts`

```typescript
// GET endpoint to fetch unified account data for current user
export async function GET(req: NextRequest);
```

#### `/api/stripe/account/[apiUserId]/route.ts`

```typescript
// GET endpoint to fetch account data by API user ID
export async function GET(req: NextRequest, { params }: { params: { apiUserId: string } });
```

### SWR Hooks

#### `useUnifiedAccountData()`

```typescript
const {
  accountData, // Complete account information
  hasStripeCustomer, // Boolean: user has Stripe customer
  hasActiveSubscription, // Boolean: user has active subscription
  isTrialing, // Boolean: subscription is in trial
  isCanceled, // Boolean: subscription is canceled
  subscriptionStatus, // Current subscription status
  isLoading, // Loading state
  error, // Error state
  refreshAccountData, // Function to refresh data
} = useUnifiedAccountData();
```

#### `useUnifiedAccountDataById(apiUserId)`

```typescript
const { accountData, isLoading, error, refreshAccountData } = useUnifiedAccountDataById('user123');
```

### Enhanced Checkout Hook

#### `useEnhancedCheckoutFlow()`

```typescript
const {
  // Account data
  accountData,
  subscriptionInfo,
  hasActiveSubscription,
  canStartSubscription,

  // Checkout flow
  startCheckoutFlow,
  completeCheckoutFlow,
  handleSubscriptionSuccess,

  // Loading states
  isLoading,
  checkoutProcessing,

  // Navigation helpers
  goToBilling,
  goToPricing,
} = useEnhancedCheckoutFlow({
  onAuthRequired: (sessionKey) => {
    // Handle authentication requirement
  },
  onSubscriptionExists: () => {
    // Handle existing subscription
  },
});
```

### UI Components

#### `PricingSection`

```tsx
import { PricingSection } from '@/src/stripe/client/components';

function PricingPage() {
  return <PricingSection />;
}
```

Features:

- Displays all available pricing plans
- Shows current subscription status
- Handles subscription validation before checkout
- Supports trial periods and plan switching

#### `SubscriptionStatus`

```tsx
import { SubscriptionStatus } from '@/src/stripe/client/components';

function BillingPage() {
  return <SubscriptionStatus />;
}
```

Features:

- Complete subscription details display
- Trial period and billing cycle information
- Cancellation status and reactivation options
- Direct billing portal access

#### `EnhancedPricingCard`

```tsx
import { EnhancedPricingCard } from '@/src/stripe/client/components';

function CustomPricing() {
  return (
    <EnhancedPricingCard
      planId="price_pro_monthly"
      title="Pro Plan"
      description="Perfect for professionals"
      price={2999}
      currency="usd"
      interval="month"
      features={['Feature 1', 'Feature 2']}
      isPopular={true}
      trialDays={14}
    />
  );
}
```

## Implementation Examples

### Basic Pricing Page

```tsx
'use client';

import { PricingSection, SubscriptionStatus } from '@/src/stripe/client/components';
import { useEnhancedCheckoutFlow } from '@/src/stripe/client/hooks';

export default function PricingPage() {
  const { hasActiveSubscription } = useEnhancedCheckoutFlow();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

      {hasActiveSubscription && (
        <div className="mb-8">
          <SubscriptionStatus />
        </div>
      )}

      <PricingSection />
    </div>
  );
}
```

### Custom Checkout Flow

```tsx
'use client';

import { useEnhancedCheckoutFlow } from '@/src/stripe/client/hooks';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';

export default function CustomCheckout() {
  const { startCheckoutFlow, hasActiveSubscription, subscriptionInfo, isLoading } =
    useEnhancedCheckoutFlow({
      onSubscriptionExists: () => {
        toast.info('You already have an active subscription!');
      },
      onAuthRequired: (sessionKey) => {
        // Store session key and redirect to login
        localStorage.setItem('checkout_session', sessionKey);
        window.location.href = '/signin';
      },
    });

  const handleSubscribe = async () => {
    await startCheckoutFlow('price_pro_monthly', 14); // 14-day trial
  };

  if (hasActiveSubscription) {
    return (
      <div className="text-center">
        <h2>Current Subscription</h2>
        <p>Plan: {subscriptionInfo?.planName}</p>
        <p>Status: {subscriptionInfo?.status}</p>
      </div>
    );
  }

  return (
    <Button onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Start Free Trial'}
    </Button>
  );
}
```

### Account Dashboard

```tsx
'use client';

import { useUnifiedAccountData } from '@/src/stripe/client/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function AccountDashboard() {
  const { accountData, hasActiveSubscription, isTrialing, isLoading, error } =
    useUnifiedAccountData();

  if (isLoading) {
    return <div>Loading account data...</div>;
  }

  if (error) {
    return <div>Error loading account: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {accountData?.email}</p>
          <p>Customer ID: {accountData?.stripe_customer_id}</p>
          <p>Has Subscription: {hasActiveSubscription ? 'Yes' : 'No'}</p>
          {isTrialing && <p>Trial Period Active</p>}
        </CardContent>
      </Card>

      {accountData?.stripe_subscription_id && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Plan: {accountData.stripe_plan_name}</p>
            <p>Status: {accountData.stripe_subscription_status}</p>
            <p>
              Amount:{' '}
              {accountData.stripe_amount && accountData.stripe_currency
                ? `${accountData.stripe_amount / 100} ${accountData.stripe_currency.toUpperCase()}`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Migration Guide

### From Legacy Components

#### Before (Multiple Hooks)

```tsx
// Old approach - multiple API calls
const { subscription } = useSubscriptionStatus();
const { customer } = useCustomerData();
const { invoices } = useInvoiceHistory();
```

#### After (Unified Hook)

```tsx
// New approach - single API call
const { accountData } = useUnifiedAccountData();
// All data available in accountData with stripe_ prefixes
```

### Component Updates

#### Legacy Pricing Component

```tsx
// Replace this
import { PricingCard } from '@/src/stripe/client/components';

// With this
import { EnhancedPricingCard as PricingCard } from '@/src/stripe/client/components';
```

#### Legacy Checkout Flow

```tsx
// Replace this
import { useCheckoutFlow } from '@/src/stripe/client/hooks';

// With this
import { useEnhancedCheckoutFlow } from '@/src/stripe/client/hooks';
```

## Benefits

### 1. **Performance Improvements**

- Reduced API calls (single unified endpoint vs multiple separate calls)
- Faster page load times
- Better caching with unified data structure

### 2. **Developer Experience**

- Simplified state management
- Type-safe data access
- Consistent error handling
- Better debugging capabilities

### 3. **User Experience**

- Real-time subscription status
- Intelligent checkout flow
- Seamless subscription management
- Better error messages and feedback

### 4. **Maintainability**

- Single source of truth for account data
- Easier to add new features
- Consistent data structure across the application
- Simplified testing

## Testing

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useUnifiedAccountData } from '@/src/stripe/client/hooks';

test('should fetch unified account data', async () => {
  const { result } = renderHook(() => useUnifiedAccountData());

  expect(result.current.isLoading).toBe(true);

  // Wait for data to load
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
    expect(result.current.accountData).toBeDefined();
  });
});
```

### Integration Tests

```typescript
import { render, screen } from '@testing-library/react';
import { PricingSection } from '@/src/stripe/client/components';

test('should display pricing plans with subscription awareness', async () => {
  render(<PricingSection />);

  expect(screen.getByText('Choose Your Plan')).toBeInTheDocument();

  // Should show current subscription if user has one
  await waitFor(() => {
    expect(screen.getByText(/Current Subscription/i)).toBeInTheDocument();
  });
});
```

## Next Steps

### Phase 1: Basic Integration ✅

- ✅ API routes created
- ✅ SWR hooks implemented
- ✅ Enhanced checkout flow
- ✅ Basic UI components

### Phase 2: Advanced Features (Next)

- [ ] Webhook event integration for real-time updates
- [ ] Advanced error handling and retry logic
- [ ] Offline support with data caching
- [ ] Analytics and tracking integration

### Phase 3: Optimization (Future)

- [ ] Bundle size optimization
- [ ] Server-side rendering improvements
- [ ] Progressive Web App features
- [ ] Advanced caching strategies

## Support

For questions or issues with the frontend integration:

1. Check the component documentation in the code
2. Review the example implementations
3. Test with the enhanced checkout flow
4. Verify backend API connectivity

The integration provides a complete, production-ready solution for Stripe subscription management with unified account data access.
