'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/firebaseWebConfig';

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

      // Update the auth cookie with the new token
      await fetch('/api/auth-cookie/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebaseToken: newToken }),
      });

      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setFirebaseToken(null);
      router.push('/signin');
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
      setFirebaseUser(authUser);

      console.log(`FirebaseAuthProvider
        | firebase.uid: ${JSON.stringify(authUser?.uid)}`);

      if (authUser) {
        const token = await authUser.getIdToken(true);
        setFirebaseToken(token);

        // Set the auth cookie for server-side requests
        await fetch('/api/auth-cookie/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebaseToken: token }),
        });

        const loginUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth/login`;
        const [loginRes] = await Promise.all([
          fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          }),
        ]);

        if (loginRes.ok) {
          const { user_id } = await loginRes.json();

          console.log(`FirebaseAuthProvider
            | api_user_id: ${user_id}`);

          setApiUserId(user_id);
          console.log(`user_id: ${user_id}`);
        } else {
          // const loginError: any = await loginRes.json();

          setFirebaseToken(null);
          router.push('/signin');
        }
      } else {
        setFirebaseToken(null);
        // Clear the auth cookie when user logs out
        await fetch('/api/auth-cookie/clear', {
          method: 'POST',
        });
        router.push('/signin');
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
