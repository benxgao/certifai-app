/**
 * Enhanced checkout flow hook with unified account integration
 * Provides complete subscription management capabilities
 */

import { useCallback, useMemo } from 'react';
import { useCheckoutFlow } from './useCheckoutFlow';
import { useUnifiedAccountData } from '../swr';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseEnhancedCheckoutFlowProps {
  onAuthRequired?: () => void;
  onSubscriptionExists?: () => void;
}

export function useEnhancedCheckoutFlow({
  onAuthRequired,
  onSubscriptionExists,
}: UseEnhancedCheckoutFlowProps = {}) {
  const router = useRouter();

  // Get unified account data
  const {
    accountData,
    hasActiveSubscription,
    hasStripeCustomer,
    isTrialing,
    isCanceled,
    subscriptionStatus,
    isLoading: accountLoading,
    refreshAccountData,
  } = useUnifiedAccountData();

  // Get checkout flow functionality
  const {
    startCheckoutFlow: originalStartCheckout,
    handleCheckoutSuccess,
    isProcessing: checkoutProcessing,
  } = useCheckoutFlow({ onAuthRequired });

  // Enhanced checkout flow with subscription validation
  const startCheckoutFlow = useCallback(
    async (priceId: string, trialDays?: number) => {
      // Check if user already has active subscription
      if (hasActiveSubscription && !isCanceled) {
        const message = 'You already have an active subscription.';
        toast.info(message);

        if (onSubscriptionExists) {
          onSubscriptionExists();
        } else {
          router.push('/main/billing');
        }
        return;
      }

      // If user has canceled subscription, allow reactivation
      if (isCanceled) {
        toast.info('Reactivating your subscription...');
      }

      // Proceed with checkout
      await originalStartCheckout(priceId, trialDays);
    },
    [hasActiveSubscription, isCanceled, onSubscriptionExists, router, originalStartCheckout],
  );

  // Check if user can start a new subscription
  const canStartSubscription = useMemo(() => {
    // Can start if no active subscription or if subscription is canceled
    return !hasActiveSubscription || isCanceled;
  }, [hasActiveSubscription, isCanceled]);

  // Get subscription info for display
  const subscriptionInfo = useMemo(() => {
    if (!accountData) return null;

    return {
      id: accountData.subscription_id,
      status: accountData.subscription_status,
      isActive: hasActiveSubscription,
      isTrialing,
      isCanceled,
      planName: accountData.stripe_plan_name,
      amount: accountData.stripe_amount,
      currency: accountData.stripe_currency,
      currentPeriodEnd: accountData.stripe_current_period_end,
      trialEnd: accountData.stripe_trial_end,
      cancelAtPeriodEnd: accountData.stripe_cancel_at_period_end,
    };
  }, [accountData, hasActiveSubscription, isTrialing, isCanceled]);

  // Navigation helpers
  const goToBilling = useCallback(() => {
    router.push('/main/billing');
  }, [router]);

  const goToPricing = useCallback(() => {
    router.push('/pricing');
  }, [router]);

  // Success handler that refreshes data
  const handleSubscriptionSuccess = useCallback(async () => {
    await handleCheckoutSuccess();
    await refreshAccountData();
  }, [handleCheckoutSuccess, refreshAccountData]);

  return {
    // Account data
    accountData,
    hasStripeCustomer,
    subscriptionInfo,

    // Subscription status
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    canStartSubscription,
    subscriptionStatus,

    // Checkout flow
    startCheckoutFlow,
    handleSubscriptionSuccess,

    // Loading states
    isLoading: accountLoading || checkoutProcessing,
    accountLoading,
    checkoutProcessing,

    // Data refresh
    refreshAccountData,

    // Navigation helpers
    goToBilling,
    goToPricing,
  };
}
