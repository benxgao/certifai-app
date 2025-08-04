/**
 * SWR hooks for Stripe API integration
 * Following Certifai's established SWR patterns
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchAuthJSON } from '@/src/lib/auth-utils';
import type { ApiResponse, PaginatedApiResponse } from '@/src/types/api';

// Types based on backend API responses
export interface SubscriptionData {
  subscription_id: string;
  customer_id: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  trial_end?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}

// SWR Keys
const STRIPE_KEYS = {
  subscription: '/api/stripe/subscription/status',
  subscriptionHistory: '/api/stripe/subscription/history',
  pricingPlans: '/api/stripe/pricing-plans',
} as const;

// Fetcher functions following Certifai patterns
const stripeFetcher = async (url: string) => {
  const response = await fetchAuthJSON(url);
  return response;
};

const stripePostFetcher = async (url: string, { arg }: { arg: any }) => {
  const response = await fetchAuthJSON(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  return response;
};

/**
 * Get current subscription status
 */
export function useSubscriptionStatus() {
  return useSWR<ApiResponse<SubscriptionData | null>>(STRIPE_KEYS.subscription, stripeFetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    errorRetryCount: 2, // Reduced retry count to avoid spam
    // Don't show errors for subscription status since no subscription is a valid state
    onError: (error) => {
      // Only log non-auth related errors
      if (!error.message?.includes('authentication') && !error.message?.includes('401')) {
        console.warn('Subscription status fetch error:', error);
      }
    },
  });
}

/**
 * Get subscription history
 */
export function useSubscriptionHistory() {
  return useSWR<ApiResponse<SubscriptionData[]>>(STRIPE_KEYS.subscriptionHistory, stripeFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

/**
 * Get available pricing plans
 */
export function usePricingPlans() {
  return useSWR<ApiResponse<PricingPlan[]>>(STRIPE_KEYS.pricingPlans, stripeFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // Cache for 5 minutes
    dedupingInterval: 300000,
  });
}

/**
 * Initialize checkout session (public - no auth required)
 */
export function useInitializeCheckoutSession() {
  return useSWRMutation<
    ApiResponse<{ session_key: string; temp_session_id: string; message: string }>,
    Error,
    '/api/stripe/checkout/init-session',
    {
      price_id: string;
      session_key: string;
      success_url?: string;
      cancel_url?: string;
      trial_days?: number;
    }
  >('/api/stripe/checkout/init-session', async (url, { arg }) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });
    return response.json();
  });
}

/**
 * Create checkout session (requires auth, can use cached session)
 */
export function useCreateCheckoutSession() {
  return useSWRMutation<
    ApiResponse<CheckoutSessionResponse>,
    Error,
    '/api/stripe/checkout/create-session',
    {
      price_id?: string;
      session_key?: string;
      success_url?: string;
      cancel_url?: string;
      trial_days?: number;
    }
  >('/api/stripe/checkout/create-session', stripePostFetcher, {
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

/**
 * Create portal session
 */
export function useCreatePortalSession() {
  return useSWRMutation<
    ApiResponse<PortalSessionResponse>,
    Error,
    '/api/stripe/portal/create-session',
    {
      return_url?: string;
    }
  >('/api/stripe/portal/create-session', stripePostFetcher, {
    onError: (error) => {
      // Handle authentication errors gracefully
      if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
        console.warn('Authentication required for portal session');
      } else {
        console.error('Portal session creation error:', error);
      }
    },
  });
}

/**
 * Cancel subscription
 */
export function useCancelSubscription() {
  return useSWRMutation<
    ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>,
    Error,
    '/api/stripe/subscription/cancel',
    {
      cancel_at_period_end?: boolean;
    }
  >('/api/stripe/subscription/cancel', stripePostFetcher);
}

/**
 * Resume subscription
 */
export function useResumeSubscription() {
  return useSWRMutation<
    ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>,
    Error,
    '/api/stripe/subscription/resume',
    Record<string, never>
  >('/api/stripe/subscription/resume', stripePostFetcher);
}

/**
 * Reactivate subscription
 */
export function useReactivateSubscription() {
  return useSWRMutation<
    ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>,
    Error,
    '/api/stripe/subscription/reactivate',
    Record<string, never>
  >('/api/stripe/subscription/reactivate', stripePostFetcher);
}

/**
 * Update subscription plan
 */
export function useUpdateSubscriptionPlan() {
  return useSWRMutation<
    ApiResponse<{ subscription_id: string; status: string; new_price_id: string }>,
    Error,
    '/api/stripe/subscription/update-plan',
    {
      new_price_id: string;
    }
  >('/api/stripe/subscription/update-plan', stripePostFetcher);
}

// Helper hook to get subscription status with loading states
export function useSubscriptionState() {
  const { data, error, isLoading, mutate } = useSubscriptionStatus();

  // Handle the case where data is available but subscription is null (no subscription)
  const subscription = data?.data || null;
  const hasActiveSubscription = Boolean(
    subscription?.status === 'active' || subscription?.status === 'trialing',
  );
  const isTrialing = subscription?.status === 'trialing';
  const isCanceled = Boolean(subscription?.cancel_at_period_end);

  // Don't treat "no subscription" as an error state
  const hasError =
    error && !error.message?.includes('authentication') && !error.message?.includes('401');

  return {
    subscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isLoading,
    error: hasError ? error : null,
    refreshSubscription: mutate,
  };
}
