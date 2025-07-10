import React, { Suspense } from 'react';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';
import { UserProfileProvider } from '@/src/context/UserProfileContext';
import { ExamStatsProvider } from '@/src/context/ExamStatsContext';
import AppHeader from '@/components/custom/appheader';
import PageLoader from '@/components/custom/PageLoader';
import ErrorBoundary from '@/components/custom/ErrorBoundary';
import AuthGuard from '@/src/components/custom/AuthGuard';
import SimpleAppFooter from '@/src/components/custom/SimpleAppFooter';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthGuard>
        {/* Nest providers to minimize re-renders and optimize data flow */}
        <UserProfileProvider>
          <UserCertificationsProvider>
            <ExamStatsProvider>
              <div className="min-h-screen flex flex-col">
                <AppHeader />
                <div className="flex-1">
                  <Suspense
                    fallback={
                      <PageLoader
                        isLoading={true}
                        text="Loading your dashboard..."
                        showSpinner={true}
                        variant="default"
                        fullScreen={false}
                        showBrand={false}
                      />
                    }
                  >
                    {children}
                  </Suspense>
                </div>
                <SimpleAppFooter />
              </div>
            </ExamStatsProvider>
          </UserCertificationsProvider>
        </UserProfileProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
}
