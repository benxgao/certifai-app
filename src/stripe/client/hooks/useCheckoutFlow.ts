/**
 * Custom hook for managing checkout session flow with caching
 * Handles both authenticated and unauthenticated users
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useInitializeCheckoutSession, useCreateCheckoutSession } from '../swr';
import { generateBrowserFingerprint } from '@/src/services/stripe-checkout-cache';
import { STRIPE_URLS } from '../../config';
import { toast } from 'sonner';

interface UseCheckoutFlowProps {
  onAuthRequired?: (sessionKey: string) => void;
}

export function useCheckoutFlow({ onAuthRequired }: UseCheckoutFlowProps = {}) {
  const router = useRouter();
  const { firebaseUser: user } = useFirebaseAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  const { trigger: initializeSession } = useInitializeCheckoutSession();
  const { trigger: createSession } = useCreateCheckoutSession();

  const startCheckoutFlow = useCallback(
    async (priceId: string, trialDays?: number) => {
      setIsProcessing(true);

      try {
        if (user) {
          // User is authenticated, create session directly
          const result = await createSession({
            price_id: priceId,
            success_url: STRIPE_URLS.success,
            cancel_url: STRIPE_URLS.cancel,
            trial_days: trialDays,
          });

          if (result.success && result.data?.checkout_url) {
            window.location.href = result.data.checkout_url;
          } else {
            toast.error('Failed to create checkout session. Please try again.');
          }
        } else {
          // User is not authenticated, initialize session for later
          const browserFingerprint = generateBrowserFingerprint();
          setSessionKey(browserFingerprint);

          const result = await initializeSession({
            price_id: priceId,
            session_key: browserFingerprint,
            success_url: STRIPE_URLS.success,
            cancel_url: STRIPE_URLS.cancel,
            trial_days: trialDays,
          });

          if (result.success) {
            toast.success('Please sign in to continue with your subscription.');
            if (onAuthRequired) {
              onAuthRequired(browserFingerprint);
            } else {
              // Default behavior: redirect to sign in
              router.push(`/signin?redirect=${encodeURIComponent('/main/billing')}`);
            }
          } else {
            toast.error('Failed to initialize checkout. Please try again.');
          }
        }
      } catch (error) {
        console.error('Checkout flow error:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    },
    [user, createSession, initializeSession, router, onAuthRequired],
  );

  const completeCheckoutFlow = useCallback(
    async (cachedSessionKey: string) => {
      if (!user) {
        toast.error('Please sign in to continue.');
        return;
      }

      setIsProcessing(true);

      try {
        const result = await createSession({
          session_key: cachedSessionKey,
        });

        if (result.success && result.data?.checkout_url) {
          window.location.href = result.data.checkout_url;
        } else {
          toast.error('Failed to create checkout session. Please try again.');
        }
      } catch (error) {
        console.error('Complete checkout flow error:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    },
    [user, createSession],
  );

  return {
    startCheckoutFlow,
    completeCheckoutFlow,
    isProcessing,
    sessionKey,
  };
}
