import React from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <UserCertificationsProvider>{children}</UserCertificationsProvider>
    </FirebaseAuthProvider>
  );
}
