import React, { Suspense } from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';
import ErrorBoundary from '@/components/custom/ErrorBoundary';
import { LoadingSpinner } from '@/components/custom/LoadingComponents';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner text="Loading certifications..." size="large" />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </FirebaseAuthProvider>
  );
}
