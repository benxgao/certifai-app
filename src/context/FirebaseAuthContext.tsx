'use client';

/**
 * Enhanced Firebase Auth Context with intelligent refresh token management
 *
 * Key improvements to prevent signin flow bugs:
 * 1. Prevents token refresh during signin/signup/forgot-password pages to avoid race conditions
 * 2. Forces users to sign in when refresh tokens become invalid
 * 3. Uses window.location.replace() for auth failures to prevent back navigation to protected pages
 * 4. Only sets up auto-refresh intervals when users are on non-auth pages
 * 5. Intelligent auth state clearing based on current page context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/firebaseWebConfig';
import {
  performAuthSetup,
  refreshTokenAndUpdateCookie,
  clearAuthCookie,
  shouldRedirectToSignIn,
} from '@/src/lib/auth-setup';

interface FirebaseAuthContextType {
  firebaseUser: User | null;
  setFirebaseUser: (user: User | null) => void;
  firebaseToken: string | null;
  setFirebaseToken: (token: string | null) => void;
  apiUserId: string | null;
  setApiUserId: (token: string | null) => void;
  refreshToken: () => Promise<string | null>;
  loading: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return ctx;
};

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [apiUserId, setApiUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const previousUserRef = useRef<User | null>(null);

  // Function to refresh token and update cookie
  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!firebaseUser) {
      return null;
    }

    // Prevent token refresh during signin/signup flow to avoid race conditions
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/signin') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/forgot-password');

      if (isAuthPage) {
        console.log('Skipping token refresh - user is on auth page:', currentPath);
        return firebaseToken;
      }
    }

    try {
      console.log('Attempting token refresh for authenticated user session');
      const newToken = await refreshTokenAndUpdateCookie(firebaseUser);
      setFirebaseToken(newToken);
      console.log('Token refresh successful');
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);

      // Clear all auth state when refresh fails
      setFirebaseUser(null);
      setFirebaseToken(null);
      setApiUserId(null);

      // Clear the auth cookie (non-blocking)
      clearAuthCookie();

      // Force user to sign in when refresh token is invalid
      console.log('Forcing user to sign in due to invalid refresh token');
      if (typeof window !== 'undefined') {
        // Use replace to prevent back navigation to protected pages
        window.location.replace(
          '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
        );
      } else if (shouldRedirectToSignIn()) {
        router.push(
          '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
        );
      }

      return null;
    }
  }, [firebaseUser, router, firebaseToken]);

  // Auto-refresh token every 45 minutes (before 1-hour expiration)
  // Only active when user is authenticated and not on auth pages
  useEffect(() => {
    if (!firebaseUser || !firebaseToken) return;

    // Don't start auto-refresh if user is currently on auth pages
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/signin') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/forgot-password');

      if (isAuthPage) {
        console.log('Skipping auto-refresh setup - user is on auth page:', currentPath);
        return;
      }
    }

    console.log('Setting up auto-refresh token interval for authenticated session');
    const refreshInterval = setInterval(() => {
      // Double-check we're not on auth pages before refreshing
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath.includes('/signin') ||
          currentPath.includes('/signup') ||
          currentPath.includes('/forgot-password');

        if (!isAuthPage) {
          console.log('Auto-refresh triggered for active user session');
          refreshToken();
        } else {
          console.log('Auto-refresh skipped - user moved to auth page');
        }
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => {
      console.log('Clearing auto-refresh token interval');
      clearInterval(refreshInterval);
    };
  }, [firebaseUser, firebaseToken, refreshToken]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Check for session expiration on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const sessionError = urlParams.get('error');

    if (
      sessionError &&
      (sessionError.includes('Session expired') || sessionError === 'session_expired')
    ) {
      console.log('Session expiration detected, clearing auth state');
      setFirebaseUser(null);
      setFirebaseToken(null);
      setApiUserId(null);
      clearAuthCookie();
      setLoading(false);
    } else {
      // Set up auth state change listener only if no session expiration
      unsubscribe = auth.onAuthStateChanged(async (authUser) => {
        console.log(`FirebaseAuthProvider auth state changed
          | firebase.uid: ${JSON.stringify(authUser?.uid)}
          | email_verified: ${authUser?.emailVerified}`);

        if (authUser) {
          // Check if this is a different user than the previous one
          const previousUser = previousUserRef.current;
          const isDifferentUser = previousUser && previousUser.uid !== authUser.uid;

          if (isDifferentUser) {
            console.log('Different user detected, clearing previous auth state...');
            // Clear previous user's auth data immediately
            await clearAuthCookie();
            setApiUserId(null);
            setFirebaseToken(null);
          }

          // Update the previous user reference
          previousUserRef.current = authUser;

          console.log('Setting new Firebase auth user...');
          setFirebaseUser(authUser);

          try {
            // Force refresh to get a brand new token
            const token = await authUser.getIdToken(true);
            setFirebaseToken(token);

            console.log('Retrieved fresh Firebase token for auth state change');

            // Use the extracted authentication setup utility
            const setupResult = await performAuthSetup(authUser, token);

            if (setupResult.success && setupResult.apiUserId) {
              setApiUserId(setupResult.apiUserId);
              console.log('Authentication setup completed successfully');
            } else {
              console.warn('Authentication setup failed:', setupResult.error);
              setApiUserId(null);
            }
          } catch (error) {
            console.error('Critical authentication setup failed:', error);

            // Check if this is a timeout/abort error
            const isTimeoutError =
              error instanceof Error &&
              (error.message?.includes('signal is aborted') ||
                error.message?.includes('timeout') ||
                error.name === 'AbortError' ||
                error.name === 'TimeoutError');

            if (isTimeoutError) {
              console.warn(
                'Auth setup timed out, but keeping Firebase user authenticated. Will retry in 2 seconds.',
              );
              setApiUserId(null);

              // Retry auth setup after a short delay
              setTimeout(async () => {
                try {
                  console.log('Retrying auth setup after timeout...');
                  const retryToken = await authUser.getIdToken(true);
                  const retrySetupResult = await performAuthSetup(authUser, retryToken);
                  if (retrySetupResult.success && retrySetupResult.apiUserId) {
                    setApiUserId(retrySetupResult.apiUserId);
                    console.log('Auth setup retry successful');
                  } else {
                    console.warn('Auth setup retry failed:', retrySetupResult.error);
                    setApiUserId(null);
                  }
                } catch (retryError) {
                  console.error('Auth setup retry failed:', retryError);
                  setApiUserId(null);
                }
              }, 2000);
            } else {
              // For other critical errors, handle based on current location and error type
              console.error('Non-timeout auth setup error, evaluating next steps');

              // Don't clear auth state if user is currently on auth pages
              const currentPath = window.location.pathname;
              const isAuthPage =
                currentPath.includes('/signin') ||
                currentPath.includes('/signup') ||
                currentPath.includes('/forgot-password');

              // Don't clear auth state if user just signed in after session expiry
              const urlParams = new URLSearchParams(window.location.search);
              const isSessionExpired = urlParams.get('error') === 'session_expired';

              if (!isSessionExpired && !isAuthPage) {
                console.log('Clearing auth state due to setup error on non-auth page');
                setFirebaseUser(null);
                setFirebaseToken(null);
                setApiUserId(null);
                clearAuthCookie();

                if (shouldRedirectToSignIn()) {
                  router.push(
                    '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
                  );
                }
              } else {
                // For session expiry or auth pages, keep Firebase user but clear API user ID
                // This allows the redirect logic to work based on the updated shouldRedirectToMain function
                console.log(
                  'Auth setup error on auth page or session expiry - keeping Firebase user, clearing API user ID',
                );
                setApiUserId(null);
              }
            }
          }
        } else {
          console.log('Firebase user signed out, clearing all auth state');
          previousUserRef.current = null;
          setFirebaseUser(null);
          setFirebaseToken(null);
          setApiUserId(null);
          clearAuthCookie();

          // Only redirect to signin if we're on a protected route
          if (shouldRedirectToSignIn()) {
            console.log('Redirecting to signin from protected route after signout');
            router.push('/signin');
          }
        }

        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  // Optionally, provide stable setters
  const setUser = useCallback((user: User | null) => setFirebaseUser(user), []);
  const setToken = useCallback((token: string | null) => setFirebaseToken(token), []);
  const setUserId = useCallback((token: string | null) => setApiUserId(token), []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        firebaseUser,
        setFirebaseUser: setUser,
        firebaseToken,
        setFirebaseToken: setToken,
        apiUserId,
        setApiUserId: setUserId,
        refreshToken,
        loading,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
