'use client';

import { useState, createContext } from 'react';

// Create a context for the JWT
export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
}>({
  token: null,
  setToken: () => {}, // Default is a no-op function
});

// Create a provider component for the context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}
