import React, { Suspense } from 'react';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';
import { UserProfileProvider } from '@/src/context/UserProfileContext';
import { ExamStatsProvider } from '@/src/context/ExamStatsContext';
import AppHeader from '@/components/custom/appheader';
import PageLoader from '@/components/custom/PageLoader';
import ErrorBoundary from '@/components/custom/ErrorBoundary';
import AuthGuard from '@/src/components/custom/AuthGuard';
import SimpleAppFooter from '@/src/components/custom/SimpleAppFooter';
import { Toaster } from '@/src/components/ui/sonner';

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
              {/* Global Toaster for notifications throughout the authenticated app */}
              <Toaster
                richColors
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  classNames: {
                    toast:
                      'group-[.toaster]:bg-white/95 group-[.toaster]:dark:bg-slate-900/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:border-slate-200/60 group-[.toaster]:dark:border-slate-700/60',
                    title: 'group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-50',
                    description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-400',
                  },
                }}
                expand={false}
                visibleToasts={3}
              />
            </ExamStatsProvider>
          </UserCertificationsProvider>
        </UserProfileProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
}
