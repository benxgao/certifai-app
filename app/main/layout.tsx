import React from 'react';
import { FirebaseAuthProvider } from '../../context/FirebaseAuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </div>
  );
}
