import React, { Suspense } from 'react';
import { UserCertificationsProvider } from '@/context/UserCertificationsContext';
import { UserProfileProvider } from '@/src/context/UserProfileContext';
import { ExamStatsProvider } from '@/src/context/ExamStatsContext';
import AppHeader from '@/components/custom/appheader';
import PageLoader from '@/components/custom/PageLoader';
import ErrorBoundary from '@/components/custom/ErrorBoundary';
import AuthGuard from '@/src/components/custom/AuthGuard';
import SimpleAppFooter from '@/src/components/custom/SimpleAppFooter';
import SystemErrorNotificationBar from '@/src/components/system/SystemErrorNotificationBar';
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
                <SystemErrorNotificationBar />
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
                      'group-[.toaster]:bg-white/95 group-[.toaster]:dark:bg-slate-800/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:border group-[.toaster]:border-slate-200/60 group-[.toaster]:dark:border-slate-700/60 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-slate-900/10 group-[.toaster]:dark:shadow-black/20 group-[.toaster]:rounded-xl',
                    title:
                      'group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-50 group-[.toast]:font-semibold',
                    description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-300',
                    actionButton:
                      'group-[.toast]:bg-gradient-to-r group-[.toast]:from-violet-600 group-[.toast]:to-blue-600 group-[.toast]:hover:from-violet-700 group-[.toast]:hover:to-blue-700 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-md group-[.toast]:transition-all group-[.toast]:duration-200',
                    cancelButton:
                      'group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-700 group-[.toast]:text-slate-700 group-[.toast]:dark:text-slate-300 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-sm group-[.toast]:transition-all group-[.toast]:duration-200',
                    closeButton:
                      'group-[.toast]:bg-slate-100/80 group-[.toast]:dark:bg-slate-700/80 group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:backdrop-blur-sm group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:duration-200',
                    success:
                      'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50/95 group-[.toaster]:to-green-50/95 group-[.toaster]:dark:from-emerald-950/30 group-[.toaster]:dark:to-green-950/30 group-[.toaster]:border-emerald-200/60 group-[.toaster]:dark:border-emerald-700/60',
                    error:
                      'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50/95 group-[.toaster]:to-rose-50/95 group-[.toaster]:dark:from-red-950/30 group-[.toaster]:dark:to-rose-950/30 group-[.toaster]:border-red-200/60 group-[.toaster]:dark:border-red-700/60',
                    warning:
                      'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50/95 group-[.toaster]:to-yellow-50/95 group-[.toaster]:dark:from-amber-950/30 group-[.toaster]:dark:to-yellow-950/30 group-[.toaster]:border-amber-200/60 group-[.toaster]:dark:border-amber-700/60',
                    info: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50/95 group-[.toaster]:to-cyan-50/95 group-[.toaster]:dark:from-blue-950/30 group-[.toaster]:dark:to-cyan-950/30 group-[.toaster]:border-blue-200/60 group-[.toaster]:dark:border-blue-700/60',
                    loading:
                      'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-violet-50/95 group-[.toaster]:to-purple-50/95 group-[.toaster]:dark:from-violet-950/30 group-[.toaster]:dark:to-purple-950/30 group-[.toaster]:border-violet-200/60 group-[.toaster]:dark:border-violet-700/60',
                  },
                }}
                expand={false}
                visibleToasts={4}
              />
            </ExamStatsProvider>
          </UserCertificationsProvider>
        </UserProfileProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
}
