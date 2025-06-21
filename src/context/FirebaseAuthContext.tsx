'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/firebaseWebConfig';
import { optimizedFetch, AUTH_FETCH_OPTIONS } from '@/src/lib/fetch-config';

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
      const newToken = await firebaseUser.getIdToken(true); // Force refresh
      setFirebaseToken(newToken);

      // Update the auth cookie with the new token (non-blocking)
      const cookiePromise = optimizedFetch('/api/auth-cookie/set', {
        ...AUTH_FETCH_OPTIONS,
        method: 'POST',
        body: JSON.stringify({ firebaseToken: newToken }),
      }).catch((err) => {
        console.error('Failed to update auth cookie during refresh:', err);
        return null;
      });

      // Don't block on cookie update - it's not critical for immediate functionality
      cookiePromise.then((response) => {
        if (response && !response.ok) {
          console.warn('Auth cookie update failed during refresh, but continuing');
        } else if (response) {
          console.log('Token refreshed and cookie updated successfully');
        }
      });

      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);

      // Clear all auth state when refresh fails
      setFirebaseUser(null);
      setFirebaseToken(null);
      setApiUserId(null);

      // Clear the auth cookie (non-blocking)
      fetch('/api/auth-cookie/clear', {
        method: 'POST',
      }).catch((err) => console.error('Failed to clear auth cookie:', err));

      // Only redirect if we're in a protected route and not already on auth pages
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/main') &&
        !window.location.pathname.includes('/signin') &&
        !window.location.pathname.includes('/signup')
      ) {
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
        console.log('Setting new Firebase auth user, clearing any existing state...');

        // Clear any existing auth state first to ensure clean slate
        setFirebaseUser(null);
        setFirebaseToken(null);
        setApiUserId(null);

        // Now set the new user
        setFirebaseUser(authUser);

        try {
          // Force refresh to get a brand new token
          const token = await authUser.getIdToken(true);
          setFirebaseToken(token);

          console.log('Retrieved fresh Firebase token for auth state change');

          // Prepare parallel requests for better performance
          const promises = [];

          // 1. Set auth cookie (only if not on signin/signup pages)
          let cookiePromise = null;
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/signin') &&
            !window.location.pathname.includes('/signup')
          ) {
            cookiePromise = optimizedFetch('/api/auth-cookie/set', {
              ...AUTH_FETCH_OPTIONS,
              method: 'POST',
              body: JSON.stringify({ firebaseToken: token }),
            }).catch((err) => {
              console.error('Failed to set auth cookie:', err);
              return null;
            });
            promises.push(cookiePromise);
          }

          // 2. API login to get user ID and check custom claims
          const loginPromise = optimizedFetch('/api/auth/login', {
            ...AUTH_FETCH_OPTIONS,
            method: 'POST',
            headers: {
              ...AUTH_FETCH_OPTIONS.headers,
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          }).catch((err) => {
            console.error('API login request failed:', err);
            return null;
          });
          promises.push(loginPromise);

          // 3. Check for api_user_id in custom claims as an alternative source
          const claimsPromise = authUser
            .getIdTokenResult(true)
            .then((idTokenResult) => {
              const customClaims = idTokenResult.claims;
              return (customClaims.api_user_id as string) || null;
            })
            .catch((err) => {
              console.error('Failed to get custom claims:', err);
              return null;
            });
          promises.push(claimsPromise);

          // 4. If no claims found, retry after a short delay (for newly created accounts)
          const retryClaimsPromise = claimsPromise.then(async (initialResult) => {
            if (!initialResult) {
              // Wait a bit for custom claims to propagate
              await new Promise((resolve) => setTimeout(resolve, 2000));

              try {
                const retryTokenResult = await authUser.getIdTokenResult(true);
                const retryClaims = retryTokenResult.claims;
                const retryApiUserId = (retryClaims.api_user_id as string) || null;

                if (retryApiUserId) {
                  console.log('Got api_user_id on retry:', retryApiUserId);
                }

                return retryApiUserId;
              } catch (retryError) {
                console.error('Failed to get custom claims on retry:', retryError);
                return null;
              }
            }
            return initialResult;
          });
          promises.push(retryClaimsPromise);

          // Execute requests in parallel
          const results = await Promise.allSettled(promises);

          // Handle cookie response (if it was made)
          if (cookiePromise) {
            const cookieResult = results[promises.indexOf(cookiePromise)];
            if (cookieResult.status === 'fulfilled' && cookieResult.value) {
              const cookieRes = cookieResult.value as Response;
              if (!cookieRes.ok) {
                console.warn('Failed to set auth cookie, but continuing with authentication');
              } else {
                console.log('Successfully set new auth cookie in FirebaseAuthContext');
              }
            }
          }

          // Handle API login response and custom claims
          const loginResult = results[promises.indexOf(loginPromise)];
          const claimsResult = results[promises.indexOf(claimsPromise)];
          const retryClaimsResult = results[promises.indexOf(retryClaimsPromise)];

          let userIdFromApi = null;
          let userIdFromClaims = null;

          // Try to get user_id from API login
          if (loginResult.status === 'fulfilled' && loginResult.value) {
            const loginRes = loginResult.value as Response;
            if (loginRes.ok) {
              try {
                const { api_user_id } = await loginRes.json();
                userIdFromApi = api_user_id;
                console.log('Got api_user_id from API login:', api_user_id);
              } catch (parseError) {
                console.warn('Failed to parse API login response:', parseError);
              }
            } else {
              console.warn('API login failed, checking custom claims as fallback');
            }
          }

          // Try to get user_id from custom claims (use retry result if available)
          const claimsResultToUse =
            retryClaimsResult.status === 'fulfilled' && retryClaimsResult.value
              ? retryClaimsResult
              : claimsResult;

          if (claimsResultToUse.status === 'fulfilled' && claimsResultToUse.value) {
            userIdFromClaims = claimsResultToUse.value as string;
            if (userIdFromClaims) {
              console.log('Got api_user_id from custom claims:', userIdFromClaims);
            }
          }

          // Use API result if available, otherwise use custom claims
          const finalUserId = userIdFromApi || userIdFromClaims;

          // If we have api_user_id from API but not in claims, patch the claims
          if (userIdFromApi && (!userIdFromClaims || userIdFromApi !== userIdFromClaims)) {
            try {
              const patchClaimsRes = await fetch('/api/auth/set-claims', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ api_user_id: userIdFromApi }),
              });
              if (patchClaimsRes.ok) {
                console.log('Patched Firebase custom claims with api_user_id:', userIdFromApi);
                // Optionally, force refresh token to get new claims
                await authUser.getIdToken(true);
              } else {
                console.warn(
                  'Failed to patch Firebase custom claims:',
                  await patchClaimsRes.text(),
                );
              }
            } catch (patchError) {
              console.error('Error patching Firebase custom claims:', patchError);
            }
          }

          if (finalUserId) {
            console.log(`FirebaseAuthProvider authentication successful
              | api_user_id: ${finalUserId}
              | source: ${userIdFromApi ? 'API' : 'custom claims'}
              | current_path: ${
                typeof window !== 'undefined' ? window.location.pathname : 'server'
              }`);

            setApiUserId(finalUserId);
          } else {
            console.warn('No api_user_id found from either API login or custom claims');
          }

          // Authentication setup completed (even if some parts failed)
          console.log('Authentication setup completed');
        } catch (error) {
          console.error('Critical authentication setup failed:', error);
          setFirebaseUser(null);
          setFirebaseToken(null);
          setApiUserId(null);

          // Clear the auth cookie on critical error (non-blocking)
          fetch('/api/auth-cookie/clear', {
            method: 'POST',
          }).catch((err) => console.error('Failed to clear auth cookie after error:', err));

          // Only redirect if we're in a protected route and not already on auth pages
          if (
            typeof window !== 'undefined' &&
            window.location.pathname.startsWith('/main') &&
            !window.location.pathname.includes('/signin') &&
            !window.location.pathname.includes('/signup')
          ) {
            router.push('/signin');
          }
        }
      } else {
        setFirebaseUser(null);
        setFirebaseToken(null);
        setApiUserId(null);

        // Clear the auth cookie when user logs out (non-blocking)
        fetch('/api/auth-cookie/clear', {
          method: 'POST',
        }).catch((err) => console.error('Failed to clear auth cookie during logout:', err));

        // Only redirect if we're in a protected route and not already on auth pages
        if (
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/main') &&
          !window.location.pathname.includes('/signin') &&
          !window.location.pathname.includes('/signup')
        ) {
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
