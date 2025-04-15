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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setFirebaseUser(authUser);

      console.log(`FirebaseAuthProvider
        | authUser: ${JSON.stringify(authUser)}`);

      if (authUser) {
        const firebaseToken = await authUser.getIdToken(true);
        setFirebaseToken(firebaseToken);

        // // store token in cookie
        await fetch('/api/auth-cookie/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseToken }),
        });
      } else {
        setFirebaseToken(null);
        router.push('/signin');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Optionally, provide stable setters
  const setUser = useCallback((user: User | null) => setFirebaseUser(user), []);
  const setToken = useCallback((token: string | null) => setFirebaseToken(token), []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        firebaseUser,
        setFirebaseUser: setUser,
        firebaseToken,
        setFirebaseToken: setToken,
        loading,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
