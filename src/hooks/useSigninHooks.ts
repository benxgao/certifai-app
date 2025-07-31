/**
 * Custom hooks for signin page functionality
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { initializeSigninPage } from '@/src/lib/signin-helpers';

/**
 * Simplified and reliable authentication redirect hook
 * Ensures /main route redirection always works correctly
 */
export const useAuthRedirect = (
  loading: boolean,
  firebaseUser: any,
  apiUserId: string | null,
  isRedirecting: boolean,
  error: string,
  setIsRedirecting: (redirecting: boolean) => void,
) => {
  const router = useRouter();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Reset redirect attempt flag when auth state changes significantly
    if (loading || !firebaseUser || !apiUserId) {
      redirectAttempted.current = false;
    }
  }, [loading, firebaseUser, apiUserId]);

  useEffect(() => {
    // Simple and reliable redirect conditions
    const shouldRedirect = 
      !loading && 
      firebaseUser && 
      firebaseUser.emailVerified && 
      apiUserId && 
      !isRedirecting && 
      !redirectAttempted.current &&
      !error.includes('verification') && // Ignore verification errors
      !error.includes('expired') &&     // Ignore session expired errors
      window.location.pathname === '/signin'; // Only redirect from signin page

    if (shouldRedirect) {
      
      // Prevent multiple redirect attempts
      redirectAttempted.current = true;
      setIsRedirecting(true);

      // Multiple redirect strategies for maximum reliability
      const performRedirect = () => {
        try {
          // Strategy 1: Next.js router (preferred)
          router.replace('/main');
          
          // Strategy 2: Fallback with native redirect after short delay
          setTimeout(() => {
            if (window.location.pathname === '/signin') {
              window.location.replace('/main');
            }
          }, 1000);
        } catch (error) {
          // Strategy 3: Immediate fallback
          window.location.replace('/main');
        }
      };

      // Immediate redirect attempt
      performRedirect();
    }
  }, [
    loading, 
    firebaseUser, 
    apiUserId, 
    isRedirecting, 
    error, 
    router, 
    setIsRedirecting
  ]);
};

/**
 * Simplified signin page initialization
 */
export const useSigninInitialization = (setError: (error: string) => void) => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const errorMessage = await initializeSigninPage();
        if (errorMessage) {
          setError(errorMessage);
        }
      } catch (error) {
      }
    };

    initialize();
  }, [setError]);
};
