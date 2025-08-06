/**
 * Custom hook for managing simplified checkout session flow
 * Handles authenticated users directly, prompts unauthenticated users to sign in
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useCreateCheckoutSession, useUnifiedAccountData } from '../swr';
import { STRIPE_URLS } from '../../config';
import { toast } from 'sonner';

interface UseCheckoutFlowProps {
  onAuthRequired?: () => void;
}

export function useCheckoutFlow({ onAuthRequired }: UseCheckoutFlowProps = {}) {
  const router = useRouter();
  const { firebaseUser: user } = useFirebaseAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get unified account data to check subscription status
  const { accountData, hasActiveSubscription, refreshAccountData } = useUnifiedAccountData();

  const { trigger: createSession } = useCreateCheckoutSession();

  const startCheckoutFlow = useCallback(
    async (priceId: string, trialDays?: number) => {
      setIsProcessing(true);

      try {
        // Validate price ID format
        if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
          toast.error('Invalid plan selected. Please try again.');
          return;
        }

        // Check if user already has an active subscription
        if (user && hasActiveSubscription) {
          toast.info(
            'You already have an active subscription. Use the billing portal to manage it.',
          );
          router.push('/main/billing');
          return;
        }

        if (user) {
          // User is authenticated, create session directly
          const result = await createSession({
            price_id: priceId,
            success_url: STRIPE_URLS.success,
            cancel_url: STRIPE_URLS.cancel,
            trial_days: trialDays,
          });

          if (result.success && result.data?.checkout_url) {
            // Validate checkout URL before redirecting
            if (result.data.checkout_url.startsWith('https://checkout.stripe.com/')) {
              window.location.href = result.data.checkout_url;
            } else {
              console.error('Invalid checkout URL received:', result.data.checkout_url);
              toast.error('Invalid checkout session. Please try again.');
            }
          } else {
            console.error('Checkout session creation failed:', result);
            const errorMessage =
              !result.success && 'error' in result
                ? (result as any).error
                : 'Failed to create checkout session. Please try again.';
            toast.error(errorMessage);
          }
        } else {
          // User is not authenticated, prompt to sign in first
          toast.info('Please sign in to subscribe to a plan.');
          if (onAuthRequired) {
            onAuthRequired();
          } else {
            // Default behavior: redirect to sign in with plan selection after login
            router.push(`/signin?redirect=${encodeURIComponent(`/pricing?plan=${priceId}`)}`);
          }
        }
      } catch (error) {
        console.error('Checkout flow error:', error);

        // Provide more specific error messages based on error type
        if (error instanceof Error) {
          if (error.message.includes('Authentication required')) {
            toast.error('Please sign in to continue with your subscription.');
            router.push('/signin');
          } else if (error.message.includes('Invalid price_id')) {
            toast.error('Invalid plan selected. Please choose a valid plan.');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [user, hasActiveSubscription, createSession, router, onAuthRequired],
  );

  // Function to refresh account data after successful checkout
  const handleCheckoutSuccess = useCallback(async () => {
    // Refresh account data to get latest subscription info
    await refreshAccountData();
    toast.success('Subscription activated successfully!');
  }, [refreshAccountData]);

  return {
    startCheckoutFlow,
    handleCheckoutSuccess,
    isProcessing,
    // Expose account data for components to use
    accountData,
    hasActiveSubscription,
  };
}
