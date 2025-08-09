/**
 * Custom hooks for Stripe integration
 * Additional utility hooks beyond SWR
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAccountStatus } from './useUnifiedAccountData';

/**
 * Hook to handle checkout success/cancel callbacks
 */
export function useStripeCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { refreshAccount: refreshAccountData } = useAccountStatus();

  const handleCheckoutSuccess = async (sessionId?: string) => {
    setIsProcessing(true);

    try {
      // Poll for subscription status up to 5 times, 2s apart for better reliability
      let attempts = 0;
      let subscriptionActive = false;

      while (attempts < 5 && !subscriptionActive) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Refresh account data
        await refreshAccountData();

        // Re-fetch to check if subscription is now active
        const response = await fetch('/api/stripe/account');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.is_active_subscription) {
            subscriptionActive = true;
            break;
          }
        }

        attempts++;
      }

      if (subscriptionActive) {
        toast.success('Payment successful! Your subscription is now active.');
        router.push('/main');
      } else {
        toast.warning(
          'Payment was successful, but your subscription is still being processed. Please refresh the page in a few moments or contact support if the issue persists.',
          { duration: 6000 },
        );
        router.push('/main/billing');
      }
    } catch (error) {
      console.error('Checkout success handling error:', error, 'Session ID:', sessionId);
      toast.error(
        'Payment was successful, but there was an issue updating your account. Please contact support with session ID: ' +
          (sessionId || 'N/A'),
        { duration: 8000 },
      );
      router.push('/main/billing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutCancel = () => {
    toast.error('Payment was canceled. You can try again anytime.');
    router.push('/main/billing');
  };

  return {
    handleCheckoutSuccess,
    handleCheckoutCancel,
    isProcessing,
  };
}

/**
 * Hook to check subscription requirements for protected features
 */
export function useSubscriptionGate(requiredPlan?: string) {
  const { hasActiveSubscription, account: accountData, isLoading } = useAccountStatus();

  const hasAccess =
    hasActiveSubscription && (!requiredPlan || accountData?.stripe_plan_id === requiredPlan);

  const canAccess = (feature: string) => {
    if (isLoading) return false;

    // Define feature access rules here
    const freeFeatures = ['basic-exams', 'profile', 'dashboard'];
    const premiumFeatures = ['advanced-exams', 'analytics', 'export'];

    if (freeFeatures.includes(feature)) {
      return true;
    }

    if (premiumFeatures.includes(feature)) {
      return hasActiveSubscription;
    }

    return false;
  };

  return {
    hasActiveSubscription,
    hasAccess,
    canAccess,
    subscription: accountData,
    isLoading,
  };
}

/**
 * Hook to manage plan comparison and selection
 */
export function usePlanComparison() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);

  const comparePlans = (planIds: string[]) => {
    // Implementation for plan comparison logic
    setComparisonMode(true);
  };

  const selectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const clearSelection = () => {
    setSelectedPlan(null);
    setComparisonMode(false);
  };

  return {
    selectedPlan,
    comparisonMode,
    selectPlan,
    comparePlans,
    clearSelection,
  };
}

/**
 * Hook for subscription analytics and insights
 */
export function useSubscriptionInsights() {
  const { account: accountData } = useAccountStatus();

  const insights = {
    daysUntilRenewal: accountData?.stripe_current_period_end
      ? Math.max(
          0,
          Math.ceil(
            (accountData.stripe_current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0,
    isNearRenewal: accountData?.stripe_current_period_end
      ? accountData.stripe_current_period_end * 1000 - Date.now() < 7 * 24 * 60 * 60 * 1000
      : false,
    monthlyValue: accountData?.stripe_amount ? accountData.stripe_amount / 100 : 0,
  };

  return insights;
}
