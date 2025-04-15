import React from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}
