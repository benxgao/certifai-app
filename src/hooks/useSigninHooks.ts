/**
 * Custom hooks for signin page functionality
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  shouldRedirectToMain,
  clearURLErrorParams,
  initializeSigninPage,
} from '@/src/lib/signin-helpers';

/**
 * Custom hook for handling authentication timeout
 */
export const useAuthTimeout = (
  loading: boolean,
  authProcessing: boolean,
  isLoading: boolean,
  error: string,
  setError: (error: string) => void,
  setIsLoading: (loading: boolean) => void,
  setAuthProcessing: (processing: boolean) => void,
  setIsRedirecting: (redirecting: boolean) => void,
  timeoutDuration: number = 30000,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only start timeout if we're in a loading/processing state
    if (loading || authProcessing || isLoading) {
      timeoutRef.current = setTimeout(() => {
        console.warn('Authentication process taking too long, user might be stuck');

        // Set a specific error to help user understand what to do
        if (!error) {
          setError(
            'Authentication is taking longer than expected. Please refresh the page and try again.',
          );
        }

        // Clear loading states
        setIsLoading(false);
        setAuthProcessing(false);
        setIsRedirecting(false);
      }, timeoutDuration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    loading,
    authProcessing,
    isLoading,
    error,
    setError,
    setIsLoading,
    setAuthProcessing,
    setIsRedirecting,
    timeoutDuration,
  ]);
};

/**
 * Custom hook for handling authentication redirect
 */
export const useAuthRedirect = (
  loading: boolean,
  authProcessing: boolean,
  isLoading: boolean,
  firebaseUser: any,
  apiUserId: string | null,
  isRedirecting: boolean,
  error: string,
  setError: (error: string) => void,
  setShowVerificationPrompt: (show: boolean) => void,
  setIsRedirecting: (redirecting: boolean) => void,
) => {
  const router = useRouter();

  useEffect(() => {
    if (
      shouldRedirectToMain(
        loading,
        authProcessing,
        isLoading,
        firebaseUser,
        apiUserId,
        isRedirecting,
        error,
      )
    ) {
      console.log('Authentication successful, initiating redirect to /main');

      // Clear any success messages and URL parameters before redirecting
      setError('');
      setShowVerificationPrompt(false);
      clearURLErrorParams();

      // Use a slightly longer delay to ensure all state and URL cleanup is complete
      setTimeout(() => {
        setIsRedirecting(true);
        router.replace('/main');
      }, 100);
    }
  }, [
    firebaseUser,
    loading,
    authProcessing,
    isLoading,
    isRedirecting,
    error,
    router,
    apiUserId,
    setError,
    setShowVerificationPrompt,
    setIsRedirecting,
  ]);
};

/**
 * Custom hook for form state management
 */
export const useFormValidation = (
  error: string,
  authProcessing: boolean,
  isLoading: boolean,
  setIsRedirecting: (redirecting: boolean) => void,
) => {
  useEffect(() => {
    // If there's an error and we're not currently processing/loading,
    // ensure all loading states are cleared to keep the form functional
    if (error && !authProcessing && !isLoading) {
      setIsRedirecting(false);
    }
  }, [error, authProcessing, isLoading, setIsRedirecting]);
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
