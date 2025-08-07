/**
 * New unified account data hook - demonstrates the refactored approach
 * This replaces the need for multiple separate hooks for customer, subscription, etc.
 */

import useSWR from 'swr';
import { fetchAuthJSON } from '@/src/lib/auth-utils';
import type { ApiResponse } from '@/src/types/api';

// New unified account data interface matching the backend response
export interface UnifiedAccountData {
  // Core account info
  api_user_id: string;
  firebase_user_id: string;
  email: string;

  // Stripe customer status
  has_stripe_customer: boolean;
  stripe_customer_id?: string;

  // Subscription status and details
  has_subscription: boolean;
  subscription_status?: string;
  subscription_id?: string;

  // Subscription details (all prefixed with stripe_)
  stripe_plan_id?: string;
  stripe_plan_name?: string;
  stripe_amount?: number;
  stripe_currency?: string;
  stripe_current_period_start?: number;
  stripe_current_period_end?: number;
  stripe_trial_end?: number;
  stripe_cancel_at_period_end?: boolean;
  stripe_canceled_at?: number;

  // Latest invoice info
  stripe_latest_invoice_id?: string;
  stripe_latest_invoice_status?: string;
  stripe_latest_invoice_amount?: number;

  // Computed fields for easier frontend consumption
  is_active_subscription: boolean;
  is_trial: boolean;
  is_canceled: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Hook to get unified account data including all Stripe information
 * Replaces the need for separate useSubscriptionStatus, useCustomerData, etc.
 */
export function useUnifiedAccountData() {
  const response = useSWR<ApiResponse<UnifiedAccountData>>('/api/stripe/account', fetchAuthJSON, {
    refreshInterval: 0, // Disable automatic polling - account data changes infrequently
    revalidateOnFocus: false, // Disable focus revalidation to prevent unnecessary API calls
    revalidateOnReconnect: true, // Only revalidate when network reconnects
    dedupingInterval: 60000, // Cache for 1 minute to prevent duplicate requests
    errorRetryCount: 2,
    onError: (error) => {
      // Only log non-auth related errors
      if (!error.message?.includes('authentication') && !error.message?.includes('401')) {
        console.warn('Unified account data fetch error:', error);
      }
    },
    onSuccess: (data, key, config) => {
      // Log data source for debugging
      const response = data as any;
      if (response.headers) {
        console.debug('Account data source:', {
          source: response.headers['x-data-source'],
          fetchedAt: response.headers['x-data-fetched-at'],
          hasLatestData: response.headers['x-data-source'] === 'stripe-live',
        });
      }
    },
  });

  return response;
}

/**
 * Hook to get account data by API user ID
 * Useful for admin views or when you have the API user ID
 */
export function useUnifiedAccountDataById(apiUserId: string) {
  return useSWR<ApiResponse<UnifiedAccountData>>(
    apiUserId ? `/api/stripe/account/${apiUserId}` : null,
    fetchAuthJSON,
    {
      revalidateOnFocus: false,
      errorRetryCount: 1,
    },
  );
}

/**
 * Derived hook that provides convenient boolean flags and computed values
 * Based on the unified account data
 */
export function useAccountStatus() {
  const { data, error, isLoading, mutate } = useUnifiedAccountData();

  const account = data?.data || null;

  return {
    account,

    // Subscription status
    hasActiveSubscription: account?.is_active_subscription || false,
    hasSubscription: account?.has_subscription || false,
    isTrialing: account?.is_trial || false,
    isCanceled: account?.is_canceled || false,
    subscriptionStatus: account?.subscription_status,

    // Customer status
    hasStripeCustomer: account?.has_stripe_customer || false,

    // Plan information
    planName: account?.stripe_plan_name,
    planAmount: account?.stripe_amount,
    planCurrency: account?.stripe_currency,

    // Billing dates
    currentPeriodEnd: account?.stripe_current_period_end,
    trialEnd: account?.stripe_trial_end,

    // Loading and error states
    isLoading,
    error: error && !error.message?.includes('authentication') ? error : null,

    // Refresh function
    refreshAccount: mutate,
  };
}

/**
 * Helper hook for subscription-specific data
 * Provides the same interface as the old useSubscriptionState for compatibility
 */
export function useSubscriptionStateUnified() {
  const {
    account,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isLoading,
    error,
    refreshAccount,
  } = useAccountStatus();

  // Convert unified account data to legacy subscription format for compatibility
  const subscription =
    account && account.has_subscription
      ? {
          subscription_id: account.subscription_id!,
          customer_id: account.stripe_customer_id!,
          status: account.subscription_status as any,
          current_period_start: account.stripe_current_period_start || 0,
          current_period_end: account.stripe_current_period_end || 0,
          plan_id: account.stripe_plan_id || '',
          plan_name: account.stripe_plan_name || '',
          amount: account.stripe_amount || 0,
          currency: account.stripe_currency || 'usd',
          trial_end: account.stripe_trial_end,
          cancel_at_period_end: account.stripe_cancel_at_period_end || false,
          canceled_at: account.stripe_canceled_at,
          created_at: account.created_at,
          updated_at: account.updated_at,
        }
      : null;

  return {
    subscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isLoading,
    error,
    refreshSubscription: refreshAccount,
  };
}

/**
 * Utility functions for working with unified account data
 */
export const AccountUtils = {
  /**
   * Format subscription amount for display
   */
  formatAmount: (account: UnifiedAccountData | null): string => {
    if (!account?.stripe_amount || !account?.stripe_currency) {
      return '$0';
    }

    // Validate amount is a positive number
    const amount = Number(account.stripe_amount);
    if (isNaN(amount) || amount < 0) {
      console.warn('Invalid stripe amount:', account.stripe_amount);
      return '$0';
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: account.stripe_currency.toUpperCase(),
        minimumFractionDigits: 0,
      }).format(amount / 100);
    } catch (error) {
      console.warn('Error formatting amount:', error);
      return `$${(amount / 100).toFixed(2)}`;
    }
  },

  /**
   * Format billing date for display
   */
  formatBillingDate: (timestamp?: number): string => {
    if (!timestamp) return 'N/A';

    // Validate timestamp is a positive number
    const ts = Number(timestamp);
    if (isNaN(ts) || ts <= 0) {
      console.warn('Invalid timestamp:', timestamp);
      return 'Invalid Date';
    }

    try {
      const date = new Date(ts * 1000);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date from timestamp:', timestamp);
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Get subscription status display info
   */
  getStatusInfo: (account: UnifiedAccountData | null) => {
    if (!account || !account.has_subscription) {
      return { label: 'No Subscription', color: 'gray', description: 'No active subscription' };
    }

    const statusMap = {
      active: { label: 'Active', color: 'green', description: 'Subscription is active' },
      trialing: { label: 'Trial', color: 'blue', description: 'In trial period' },
      canceled: { label: 'Canceled', color: 'red', description: 'Subscription canceled' },
      incomplete: { label: 'Incomplete', color: 'orange', description: 'Payment required' },
      past_due: { label: 'Past Due', color: 'red', description: 'Payment failed' },
      unpaid: { label: 'Unpaid', color: 'red', description: 'Payment overdue' },
    };

    return (
      statusMap[account.subscription_status as keyof typeof statusMap] || {
        label: 'Unknown',
        color: 'gray',
        description: 'Unknown status',
      }
    );
  },

  /**
   * Check if subscription expires soon (within 7 days)
   */
  expiresSoon: (account: UnifiedAccountData | null): boolean => {
    if (!account?.stripe_current_period_end) return false;

    const timestamp = Number(account.stripe_current_period_end);
    if (isNaN(timestamp) || timestamp <= 0) return false;

    try {
      const endDate = new Date(timestamp * 1000);
      const now = new Date();

      // Validate dates
      if (isNaN(endDate.getTime()) || isNaN(now.getTime())) return false;

      const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return daysUntilEnd <= 7 && daysUntilEnd > 0;
    } catch (error) {
      console.warn('Error checking expiry:', error);
      return false;
    }
  },

  /**
   * Get days remaining in current period
   */
  getDaysRemaining: (account: UnifiedAccountData | null): number => {
    if (!account?.stripe_current_period_end) return 0;

    const timestamp = Number(account.stripe_current_period_end);
    if (isNaN(timestamp) || timestamp <= 0) return 0;

    try {
      const endDate = new Date(timestamp * 1000);
      const now = new Date();

      // Validate dates
      if (isNaN(endDate.getTime()) || isNaN(now.getTime())) return 0;

      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return Math.max(0, daysRemaining);
    } catch (error) {
      console.warn('Error calculating days remaining:', error);
      return 0;
    }
  },
};
