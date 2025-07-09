'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Function to refresh token and update cookie
  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!firebaseUser) {
      return null;
    }

    try {
      const newToken = await refreshTokenAndUpdateCookie(firebaseUser);
      setFirebaseToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);

      // Clear all auth state when refresh fails
      setFirebaseUser(null);
      setFirebaseToken(null);
      setApiUserId(null);

      // Clear the auth cookie (non-blocking)
      clearAuthCookie();

      // Only redirect if we're in a protected route and not already on auth pages
      if (shouldRedirectToSignIn()) {
        router.push(
          '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
        );
      }

      return null;
    }
  }, [firebaseUser, router]);

  // Auto-refresh token every 45 minutes (before 1-hour expiration)
  useEffect(() => {
    if (!firebaseUser || !firebaseToken) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [firebaseUser, firebaseToken, refreshToken]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      console.log(`FirebaseAuthProvider auth state changed
        | firebase.uid: ${JSON.stringify(authUser?.uid)}`);

      if (authUser) {
        console.log('Setting new Firebase auth user...');

        // Set the new user immediately without clearing state first
        // This prevents race conditions in components that depend on auth state
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
          }
        } catch (error) {
          console.error('Critical authentication setup failed:', error);

          // Check if this is a timeout/abort error - don't clear auth state immediately
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
            // Don't clear Firebase auth state for timeout errors - user is still authenticated
            // Just clear the API-related state temporarily
            setApiUserId(null);

            // Retry auth setup after a short delay
            setTimeout(async () => {
              try {
                console.log('Retrying auth setup after timeout...');
                // Get a fresh token for the retry
                const retryToken = await authUser.getIdToken(true);
                const retrySetupResult = await performAuthSetup(authUser, retryToken);
                if (retrySetupResult.success && retrySetupResult.apiUserId) {
                  setApiUserId(retrySetupResult.apiUserId);
                  console.log('Auth setup retry successful');
                } else {
                  console.warn('Auth setup retry failed:', retrySetupResult.error);
                }
              } catch (retryError) {
                console.error('Auth setup retry failed:', retryError);
              }
            }, 2000);
          } else {
            // For other critical errors, clear all auth state
            setFirebaseUser(null);
            setFirebaseToken(null);
            setApiUserId(null);

            // Clear the auth cookie on critical error (non-blocking)
            clearAuthCookie();

            // Only redirect if we're in a protected route and not already on auth pages
            if (shouldRedirectToSignIn()) {
              router.push('/signin');
            }
          }
        }
      } else {
        setFirebaseUser(null);
        setFirebaseToken(null);
        setApiUserId(null);

        // Clear the auth cookie when user logs out (non-blocking)
        clearAuthCookie();

        // Only redirect if we're in a protected route and not already on auth pages
        if (shouldRedirectToSignIn()) {
          router.push('/signin');
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
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
