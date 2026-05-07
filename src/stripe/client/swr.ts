/**
 * SWR hooks for Stripe API integration
 * Following Certifai's established SWR patterns
 *
 * Note: For account data access, use the useAccountStatus hook from
 * './hooks/useUnifiedAccountData' which provides a cleaner interface
 * with proper destructuring patterns.
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchAuthJSON } from '@/src/lib/auth-utils';
import type { ApiResponse, PaginatedApiResponse } from '@/src/types/api';

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
} as const;

// Fetcher functions following Certifai patterns
const stripeFetcher = async <T = unknown>(url: string): Promise<T> => {
  try {
    const response = await fetchAuthJSON<T>(url);
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

const stripePostFetcher = async <T = unknown>(url: string, { arg }: { arg: any }): Promise<T> => {
  try {
    // Validate payload before sending
    if (arg && typeof arg !== 'object') {
      throw new Error('Invalid payload: must be an object');
    }

    const response = await fetchAuthJSON<T>(url, {
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
  return useSWR<ApiResponse<PricingPlan[]>>(
    STRIPE_KEYS.pricingPlans,
    (url: string) => stripeFetcher<ApiResponse<PricingPlan[]>>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // Cache for 5 minutes
      dedupingInterval: 300000,
    },
  );
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
  >(
    '/api/stripe/checkout/create-session',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<ApiResponse<CheckoutSessionResponse>>(url, options),
    {
      onError: (error) => {
        // Handle authentication errors gracefully
        if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
          console.warn('Authentication required for checkout session');
        } else {
          console.error('Checkout session creation error:', error);
        }
      },
    },
  );
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
  >(
    '/api/stripe/portal/create-session',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<ApiResponse<PortalSessionResponse>>(url, options),
    {
      onError: (error) => {
        // Handle authentication errors gracefully
        if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
          console.warn('Authentication required for portal session');
        } else {
          console.error('Portal session creation error:', error);
        }
      },
    },
  );
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
  >(
    '/api/stripe/subscription/cancel',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<
        ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>
      >(url, options),
  );
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
  >(
    '/api/stripe/subscription/resume',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<
        ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>
      >(url, options),
  );
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
  >(
    '/api/stripe/subscription/reactivate',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<
        ApiResponse<{ subscription_id: string; status: string; cancel_at_period_end: boolean }>
      >(url, options),
  );
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
  >(
    '/api/stripe/subscription/update-plan',
    (url: string, options: { arg: any }) =>
      stripePostFetcher<
        ApiResponse<{ subscription_id: string; status: string; new_price_id: string }>
      >(url, options),
  );
}
