'use client';

import React, { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';

interface FirebaseAuthContextType {
  firebaseUser: User | null;
  setFirebaseUser: (user: User | null) => void;
  firebaseToken: string | null;
  setFirebaseToken: (token: string | null) => void;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  firebaseUser: null,
  setFirebaseUser: () => {},
  firebaseToken: null,
  setFirebaseToken: () => {},
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  return (
    <FirebaseAuthContext.Provider
      value={{ firebaseUser, setFirebaseUser, firebaseToken, setFirebaseToken }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}
