/**
 * Database utilities for Stripe integration on the frontend
 * Handles client-side data transformations and caching
 */

/**
 * Format subscription data for display
 */
export function formatSubscriptionForDisplay(subscription: any) {
  if (!subscription) return null;

  return {
    ...subscription,
    formattedAmount: formatPrice(subscription.amount, subscription.currency),
    formattedStartDate: formatDate(subscription.current_period_start),
    formattedEndDate: formatDate(subscription.current_period_end),
    daysRemaining: Math.max(
      0,
      Math.ceil((subscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
    ),
  };
}

/**
 * Format pricing plan data for display
 */
export function formatPricingPlanForDisplay(plan: any) {
  if (!plan) return null;

  return {
    ...plan,
    formattedAmount: formatPrice(plan.amount, plan.currency),
    monthlyAmount: plan.interval === 'year' ? plan.amount / 12 : plan.amount,
    formattedMonthlyAmount: formatPrice(
      plan.interval === 'year' ? plan.amount / 12 : plan.amount,
      plan.currency,
    ),
  };
}

/**
 * Format price with proper currency formatting
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate subscription metrics
 */
export function calculateSubscriptionMetrics(subscription: any) {
  if (!subscription) return null;

  const now = Date.now();
  const periodEnd = subscription.current_period_end * 1000;
  const periodStart = subscription.current_period_start * 1000;

  const totalDays = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24)));
  const daysUsed = totalDays - daysRemaining;
  const progressPercentage = Math.min(100, (daysUsed / totalDays) * 100);

  return {
    totalDays,
    daysRemaining,
    daysUsed,
    progressPercentage,
    isNearRenewal: daysRemaining <= 7,
    isExpired: daysRemaining <= 0,
  };
}

/**
 * Get subscription status display info
 */
export function getSubscriptionStatusInfo(status: string) {
  const statusMap = {
    active: {
      label: 'Active',
      color: 'green',
      description: 'Your subscription is active and all features are available.',
    },
    trialing: {
      label: 'Trial',
      color: 'blue',
      description: "You're currently in your free trial period.",
    },
    canceled: {
      label: 'Canceled',
      color: 'red',
      description: 'Your subscription has been canceled.',
    },
    incomplete: {
      label: 'Incomplete',
      color: 'orange',
      description: 'Payment is required to complete your subscription.',
    },
    past_due: {
      label: 'Past Due',
      color: 'red',
      description: 'Payment failed. Please update your payment method.',
    },
    unpaid: {
      label: 'Unpaid',
      color: 'red',
      description: 'Payment is overdue. Please resolve payment issues.',
    },
  };

  return (
    statusMap[status as keyof typeof statusMap] || {
      label: 'Unknown',
      color: 'gray',
      description: 'Unknown subscription status.',
    }
  );
}

/**
 * Cache keys for client-side storage
 */
export const CACHE_KEYS = {
  subscription: 'certifai_subscription',
  plans: 'certifai_pricing_plans',
  customer: 'certifai_customer',
} as const;

/**
 * Simple client-side cache utility
 */
export class ClientCache {
  static set(key: string, data: any, ttlMinutes: number = 30) {
    if (typeof window === 'undefined') return;

    const item = {
      data,
      expires: Date.now() + ttlMinutes * 60 * 1000,
    };

    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  static get(key: string) {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  static remove(key: string) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  static clear() {
    if (typeof window === 'undefined') return;

    Object.values(CACHE_KEYS).forEach((key) => {
      this.remove(key);
    });
  }
}
