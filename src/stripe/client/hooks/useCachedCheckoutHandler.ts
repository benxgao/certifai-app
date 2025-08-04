/**
 * Hook to handle cached checkout sessions after authentication
 * Automatically completes checkout for users who cached a session before signing in
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import {
  getCachedCheckoutSession,
  removeCachedCheckoutSession,
  generateBrowserFingerprint,
} from '@/src/services/stripe-checkout-cache';

export function useCachedCheckoutHandler() {
  const { firebaseUser: user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    const handleCachedCheckout = async () => {
      // Only check after auth is loaded and user is authenticated
      if (loading || !user) return;

      try {
        const fingerprint = generateBrowserFingerprint();
        const cachedSession = await getCachedCheckoutSession(fingerprint);

        if (cachedSession) {
          console.log('Found cached checkout session, redirecting to Stripe...');

          // Clean up the cached session
          await removeCachedCheckoutSession(fingerprint);

          // Redirect to the Stripe checkout URL - we need to call create-session API with the session_id
          const response = await fetch('/api/stripe/checkout/create-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_key: fingerprint,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data?.checkout_url) {
              window.location.href = result.data.checkout_url;
            } else {
              console.error('Invalid response format from checkout session:', result);
            }
          } else {
            console.error('Failed to create checkout session from cache');
          }
        }
      } catch (error) {
        console.error('Error handling cached checkout session:', error);
        // Don't show user-facing error, just log it
      }
    };

    handleCachedCheckout();
  }, [user, loading, router]);

  return {
    isChecking: loading,
  };
}
