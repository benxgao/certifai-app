'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebaseWebConfig';

interface FirebaseAuthContextType {
  user: User | null;
  firebaseToken: string | null;
  setFirebaseToken: (token: string | null) => void;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  firebaseToken: null,
  setFirebaseToken: () => {},
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const token = await authUser.getIdToken(true);
        setUser(authUser);
        setFirebaseToken(token);

        // store token in cookie
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } else {
        setUser(null);
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user, firebaseToken, setFirebaseToken }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
