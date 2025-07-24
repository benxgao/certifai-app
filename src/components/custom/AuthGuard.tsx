'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { resetAuthenticationState } from '@/lib/auth-utils';
import { toastHelpers } from '@/src/lib/toast';
import PageLoader from './PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Protects routes by checking user authentication and email verification
 * Only renders children if user is authenticated and verified, otherwise shows loading or redirects
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();
  const [apiTimeout, setApiTimeout] = useState(false);
  const [emergencyTimeout, setEmergencyTimeout] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingStartTime = useRef<number>(Date.now());

  // Check for session expiration on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      if (error && (error.includes('session_expired') || error.includes('Session expired'))) {
        setSessionExpired(true);
        // Clear URL parameter immediately
        urlParams.delete('error');
        const newUrl = urlParams.toString()
          ? `${window.location.pathname}?${urlParams.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        // Redirect to signin after a brief moment
        setTimeout(() => {
          router.push(
            '/signin?error=' +
              encodeURIComponent('Your session has expired. Please sign in again.'),
          );
        }, 100);
      }
    }
  }, [router]);

  // Set a 5-second timeout if API user ID doesn't load (increased from 3s for better stability)
  useEffect(() => {
    if (firebaseUser && !apiUserId && !apiTimeout && !sessionExpired) {
      const timer = setTimeout(() => {
        setApiTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [firebaseUser, apiUserId, apiTimeout, sessionExpired]);

  // Reset API timeout when apiUserId becomes available
  useEffect(() => {
    if (apiUserId && apiTimeout) {
      setApiTimeout(false);
    }
  }, [apiUserId, apiTimeout]);

  // Check if user needs email verification
  useEffect(() => {
    if (firebaseUser && !firebaseUser.emailVerified && !sessionExpired) {
      router.push(
        '/signin?error=' +
          encodeURIComponent('Please verify your email address before accessing your account.'),
      );
    }
  }, [firebaseUser, router, sessionExpired]);

  // Emergency redirect if user is stuck in loading state too long (20 seconds)
  useEffect(() => {
    if ((loading || (firebaseUser && !apiUserId && !apiTimeout)) && !sessionExpired) {
      const emergencyTimer = setTimeout(() => {
        router.push(
          '/signin?error=' +
            encodeURIComponent('Authentication timed out. Please try signing in again.'),
        );
      }, 20000); // 20 seconds emergency timeout

      return () => clearTimeout(emergencyTimer);
    }
  }, [loading, firebaseUser, apiUserId, apiTimeout, router, sessionExpired]);

  // Emergency timeout to prevent infinite loading
  useEffect(() => {
    loadingStartTime.current = Date.now();

    if (loading && !sessionExpired) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set emergency timeout - if loading takes more than 15 seconds, trigger recovery
      timeoutRef.current = setTimeout(() => {
        if (loading && !sessionExpired) {
          setEmergencyTimeout(true);
        }
      }, 15000);
    } else {
      // Clear timeout if loading completes normally
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setEmergencyTimeout(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, sessionExpired]);

  // Handle emergency recovery
  const handleEmergencyRecovery = async () => {
    if (isRecovering) return;

    setIsRecovering(true);

    try {
      // Clear all auth state and cache
      await resetAuthenticationState();

      // Clear server-side token cache
      try {
        await fetch('/api/auth/clear-cache', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // Server cache clear failed, continue with recovery
      }

      // Force page reload to reset all state
      toastHelpers.info.loadingData();

      // Small delay before reload to let the toast show
      setTimeout(() => {
        window.location.href = '/signin?recovery=true';
      }, 1000);
    } catch {
      toastHelpers.error.generic('Recovery failed. Please try refreshing the page manually.');
      setIsRecovering(false);
    }
  };

  // Show emergency recovery UI if timeout triggered
  if ((emergencyTimeout || isRecovering) && !sessionExpired) {
    const loadingDuration = Math.round((Date.now() - loadingStartTime.current) / 1000);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full mx-4 p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {isRecovering ? 'Recovering Session...' : 'Loading Taking Too Long?'}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {isRecovering
                ? "We're refreshing your authentication state. This will only take a moment."
                : `Authentication has been loading for ${loadingDuration} seconds. This might be due to a cached session issue.`}
            </p>

            {!isRecovering && (
              <button
                onClick={handleEmergencyRecovery}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                disabled={isRecovering}
              >
                Refresh Authentication
              </button>
            )}

            {isRecovering && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting to sign in...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Case 1: Session expired - show loading while redirecting
  if (sessionExpired) {
    return (
      <PageLoader
        isLoading={true}
        text="Session expired. Redirecting to sign in..."
        showSpinner={true}
        variant="redirect"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 2: Still checking authentication - show loading
  if (loading) {
    return (
      <PageLoader
        isLoading={true}
        text="Verifying your authentication..."
        showSpinner={true}
        variant="auth"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 3: User authenticated but email not verified - show loading while redirect happens
  if (firebaseUser && !firebaseUser.emailVerified) {
    return (
      <PageLoader
        isLoading={true}
        text="Email verification required..."
        showSpinner={true}
        variant="auth"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 4: User authenticated but waiting for API setup - show loading (max 5 seconds)
  if (firebaseUser && !apiUserId && !apiTimeout) {
    return (
      <PageLoader
        isLoading={true}
        text="Setting up your account..."
        showSpinner={true}
        variant="auth"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 5: User is authenticated and verified - render the protected content
  // Allow access if we have a verified Firebase user, regardless of API timeout
  if (firebaseUser && firebaseUser.emailVerified && (apiUserId || apiTimeout)) {
    if (apiTimeout && !apiUserId) {
    }
    return <>{children}</>;
  }

  // Case 6: User not authenticated - show loading while redirect happens
  return (
    <PageLoader
      isLoading={true}
      text="Redirecting to sign in..."
      showSpinner={true}
      variant="redirect"
      fullScreen={true}
      showBrand={true}
    />
  );
};

export default AuthGuard;
