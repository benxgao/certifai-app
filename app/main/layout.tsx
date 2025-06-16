import React, { Suspense } from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';
import AppHeader from '@/components/custom/appheader';
import PageLoader from '@/components/custom/PageLoader';
import ErrorBoundary from '@/components/custom/ErrorBoundary';
import AuthGuard from '@/src/components/custom/AuthGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <FirebaseAuthProvider>
        <AuthGuard>
          <UserCertificationsProvider>
            <AppHeader />
            <Suspense
              fallback={
                <PageLoader isLoading={true} text="Loading your dashboard..." showSpinner={true} />
              }
            >
              {children}
            </Suspense>
          </UserCertificationsProvider>
        </AuthGuard>
      </FirebaseAuthProvider>
    </ErrorBoundary>
  );
}
