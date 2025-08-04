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
    errorRetryCount: 3,
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
 * Create checkout session
 */
export function useCreateCheckoutSession() {
  return useSWRMutation<
    ApiResponse<CheckoutSessionResponse>,
    Error,
    '/api/stripe/create-checkout-session',
    {
      price_id: string;
      success_url?: string;
      cancel_url?: string;
      trial_days?: number;
    }
  >('/api/stripe/create-checkout-session', stripePostFetcher);
}

/**
 * Create portal session
 */
export function useCreatePortalSession() {
  return useSWRMutation<
    ApiResponse<PortalSessionResponse>,
    Error,
    '/api/stripe/create-portal-session',
    {
      return_url?: string;
    }
  >('/api/stripe/create-portal-session', stripePostFetcher);
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

  const subscription = data?.data;
  const hasActiveSubscription =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const isTrialing = subscription?.status === 'trialing';
  const isCanceled = subscription?.cancel_at_period_end;

  return {
    subscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isLoading,
    error,
    refreshSubscription: mutate,
  };
}
