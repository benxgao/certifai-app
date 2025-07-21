/**
 * Custom hooks for signin page functionality
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  shouldRedirectToMain,
  clearURLErrorParams,
  initializeSigninPage,
} from '@/src/lib/signin-helpers';

/**
 * Simplified authentication redirect hook
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

  useEffect(() => {
    if (shouldRedirectToMain(loading, firebaseUser, apiUserId, isRedirecting, error)) {
      console.log('Authentication successful, initiating redirect to /main');

      // Clear URL parameters before redirecting
      clearURLErrorParams();

      // Short delay to ensure cleanup is complete
      setTimeout(() => {
        setIsRedirecting(true);
        router.replace('/main');
      }, 100);
    }
  }, [firebaseUser, loading, isRedirecting, error, router, apiUserId, setIsRedirecting]);
};

/**
 * Custom hook for signin page initialization
 */
export const useSigninInitialization = (setError: (error: string) => void) => {
  useEffect(() => {
    const initialize = async () => {
      const errorMessage = await initializeSigninPage();
      if (errorMessage) {
        setError(errorMessage);
      }
    };

    initialize();
  }, [setError]);
};
