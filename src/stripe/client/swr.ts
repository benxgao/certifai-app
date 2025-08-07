/**
 * SWR hooks for Stripe API integration
 * Following Certifai's established SWR patterns
 *
 * Note: The backend automatically ensures Firestore account records exist
 * for all authenticated users during login/registration. This means that
 * useUnifiedAccountData() will always return valid account data for
 * authenticated users, even if they don't have Stripe customers/subscriptions yet.
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchAuthJSON } from '@/src/lib/auth-utils';
import type { ApiResponse, PaginatedApiResponse } from '@/src/types/api';
import type { UnifiedAccountData } from './hooks/useUnifiedAccountData';

// Types based on backend API responses
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  trial_days?: number;
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
  pricingPlans: '/api/stripe/pricing-plans',
  unifiedAccount: '/api/stripe/account',
  unifiedAccountById: (apiUserId: string) => `/api/stripe/account/${apiUserId}`,
} as const;

// Fetcher functions following Certifai patterns
const stripeFetcher = async (url: string) => {
  try {
    const response = await fetchAuthJSON(url);
    return response;
  } catch (error) {
    // Add context to errors for better debugging
    if (error instanceof Error) {
      console.error(`Stripe API request failed for ${url}:`, error.message);
      throw new Error(`${error.message} (URL: ${url})`);
    }
    throw error;
  }
};

const stripePostFetcher = async (url: string, { arg }: { arg: any }) => {
  try {
    // Validate payload before sending
    if (arg && typeof arg !== 'object') {
      throw new Error('Invalid payload: must be an object');
    }

    const response = await fetchAuthJSON(url, {
      method: 'POST',
      body: JSON.stringify(arg),
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Stripe POST request failed for ${url}:`, error.message, 'Payload:', arg);
      throw new Error(`${error.message} (URL: ${url})`);
    }
    throw error;
  }
};

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
 * Create checkout session (requires auth)
 */
export function useCreateCheckoutSession() {
  return useSWRMutation<
    ApiResponse<CheckoutSessionResponse>,
    Error,
    '/api/stripe/checkout/create-session',
    {
      price_id: string;
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

/**
 * Get unified account data (NEW - replaces multiple hooks)
 * This hook provides all Stripe-related account information in one place
 */
export function useUnifiedAccountData() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<UnifiedAccountData>>(
    STRIPE_KEYS.unifiedAccount,
    stripeFetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      errorRetryCount: 2,
      onError: (error) => {
        // Only log non-auth related errors
        if (!error.message?.includes('authentication') && !error.message?.includes('401')) {
          console.warn('Unified account data fetch error:', error);
        }
      },
    },
  );

  // Extract account data with safe defaults
  const accountData = data?.data || null;

  // Validate account data structure if it exists
  if (accountData) {
    // Check for required fields
    const requiredFields = ['api_user_id', 'firebase_user_id', 'email'];
    const missingFields = requiredFields.filter(
      (field) => !accountData[field as keyof UnifiedAccountData],
    );

    if (missingFields.length > 0) {
      console.warn('Account data missing required fields:', missingFields);
    }
  }

  const hasStripeCustomer = Boolean(accountData?.has_stripe_customer);
  const hasActiveSubscription = Boolean(accountData?.is_active_subscription);
  const isTrialing = Boolean(accountData?.is_trial);
  const isCanceled = Boolean(accountData?.is_canceled);
  const subscriptionStatus = accountData?.subscription_status || null;

  // Validate critical subscription data integrity
  const hasValidSubscriptionData =
    accountData && accountData.has_subscription
      ? Boolean(accountData.subscription_id && accountData.stripe_plan_id)
      : true;

  if (accountData && !hasValidSubscriptionData) {
    console.warn('Subscription data integrity issue detected:', {
      has_subscription: accountData.has_subscription,
      subscription_id: accountData.subscription_id,
      stripe_plan_id: accountData.stripe_plan_id,
    });
  }

  // Enhanced error handling for specific scenarios
  const hasError =
    error && !error.message?.includes('authentication') && !error.message?.includes('401');
  const requiresReauth =
    error?.message?.includes('Authentication required') || (data as any)?.requiresReauth;

  return {
    accountData,
    hasStripeCustomer,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    subscriptionStatus,
    isLoading,
    error: hasError ? error : null,
    requiresReauth,
    refreshAccountData: mutate,
  };
}

/**
 * Get unified account data by API user ID
 * Useful for admin interfaces or when you have the API user ID
 */
export function useUnifiedAccountDataById(apiUserId: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<UnifiedAccountData>>(
    apiUserId ? STRIPE_KEYS.unifiedAccountById(apiUserId) : null,
    stripeFetcher,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
      onError: (error) => {
        console.warn('Unified account data by ID fetch error:', error);
      },
    },
  );

  const accountData = data?.data || null;

  return {
    accountData,
    isLoading,
    error,
    refreshAccountData: mutate,
  };
}
