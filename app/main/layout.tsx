import React from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';
import AppHeader from '@/components/custom/appheader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <UserCertificationsProvider>
        <AppHeader />
        {children}
      </UserCertificationsProvider>
    </FirebaseAuthProvider>
  );
}
