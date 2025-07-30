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
        return firebaseToken;
      }
    }

    try {
      const newToken = await refreshTokenAndUpdateCookie(firebaseUser);
      setFirebaseToken(newToken);
      return newToken;
    } catch (error) {
      // Clear all auth state when refresh fails
      setFirebaseUser(null);
      setFirebaseToken(null);
      setApiUserId(null);

      // Clear the auth cookie (non-blocking)
      clearAuthCookie();

      // Force user to sign in when refresh token is invalid
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
        return;
      }
    }

    const refreshInterval = setInterval(() => {
      // Double-check we're not on auth pages before refreshing
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath.includes('/signin') ||
          currentPath.includes('/signup') ||
          currentPath.includes('/forgot-password');

        if (!isAuthPage) {
          refreshToken();
        }
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => {
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
        if (authUser) {
          // Check if this is a different user than the previous one
          const previousUser = previousUserRef.current;
          const isDifferentUser = previousUser && previousUser.uid !== authUser.uid;

          if (isDifferentUser) {
            // Clear previous user's auth data immediately
            await clearAuthCookie();
            setApiUserId(null);
            setFirebaseToken(null);
          }

          // Update the previous user reference
          previousUserRef.current = authUser;

          setFirebaseUser(authUser);

          try {
            // Force refresh to get a brand new token
            const token = await authUser.getIdToken(true);
            setFirebaseToken(token);

            // Use the extracted authentication setup utility
            const setupResult = await performAuthSetup(authUser, token);

            if (setupResult.success && setupResult.apiUserId) {
              setApiUserId(setupResult.apiUserId);
            } else {
              setApiUserId(null);
            }
          } catch (error) {
            // Check if this is a timeout/abort error
            const isTimeoutError =
              error instanceof Error &&
              (error.message?.includes('signal is aborted') ||
                error.message?.includes('timeout') ||
                error.name === 'AbortError' ||
                error.name === 'TimeoutError');

            if (isTimeoutError) {
              setApiUserId(null);

              // Retry auth setup after a short delay
              setTimeout(async () => {
                try {
                  const retryToken = await authUser.getIdToken(true);
                  const retrySetupResult = await performAuthSetup(authUser, retryToken);
                  if (retrySetupResult.success && retrySetupResult.apiUserId) {
                    setApiUserId(retrySetupResult.apiUserId);
                  } else {
                    setApiUserId(null);
                  }
                } catch (retryError) {
                  setApiUserId(null);
                }
              }, 2000);
            } else {
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
                // This allows the signin page redirect logic to work properly

                setApiUserId(null);
              }
            }
          }
        } else {
          previousUserRef.current = null;
          setFirebaseUser(null);
          setFirebaseToken(null);
          setApiUserId(null);
          clearAuthCookie();

          // Always redirect to signin when user signs out, regardless of current route
          // This ensures users don't get stuck on loading pages after logout
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const authRoutes = ['/signin', '/signup', '/forgot-password'];
            const isAuthRoute = authRoutes.some((route) => currentPath.includes(route));

            if (!isAuthRoute) {
              // Use window.location for more reliable redirect after logout
              window.location.href =
                '/signin?message=' + encodeURIComponent('You have been signed out successfully.');
              return;
            }
          }

          // Fallback to router if window is not available or already on auth route
          if (shouldRedirectToSignIn()) {
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
