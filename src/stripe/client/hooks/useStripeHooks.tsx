/**
 * Custom hooks for Stripe integration
 * Additional utility hooks beyond SWR
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSubscriptionState } from '../swr';

/**
 * Hook to handle checkout success/cancel callbacks
 */
export function useStripeCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { refreshSubscription } = useSubscriptionState();

  const handleCheckoutSuccess = async (sessionId?: string) => {
    setIsProcessing(true);

    try {
      // Give Stripe webhook time to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refresh subscription data
      await refreshSubscription();

      toast.success('Payment successful! Your subscription is now active.');

      // Redirect to main dashboard
      router.push('/main');
    } catch (error) {
      console.error('Checkout success handling error:', error);
      toast.error(
        'Payment was successful, but there was an issue updating your account. Please contact support.',
      );
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
  const { hasActiveSubscription, subscription, isLoading } = useSubscriptionState();

  const hasAccess =
    hasActiveSubscription && (!requiredPlan || subscription?.plan_id === requiredPlan);

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
    subscription,
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
  const { subscription } = useSubscriptionState();

  const insights = {
    daysUntilRenewal: subscription
      ? Math.max(
          0,
          Math.ceil((subscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
        )
      : 0,
    isNearRenewal: subscription
      ? subscription.current_period_end * 1000 - Date.now() < 7 * 24 * 60 * 60 * 1000
      : false,
    monthlyValue: subscription ? subscription.amount / 100 : 0,
  };

  return insights;
}
