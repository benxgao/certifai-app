'use client';

import React, { useEffect, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import { Toaster } from 'sonner';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';

// Lazy load the all certifications hook to avoid blocking initial render
const LazyAvailableCertificationsButton = React.lazy(
  () => import('@/components/custom/LazyAvailableCertificationsButton'),
);

const MainPage = () => {
  const { firebaseUser } = useFirebaseAuth();
  const {
    profile,
    isLoading: isLoadingProfile,
    isError: profileError,
    displayName,
  } = useProfileData();

  // Memoize static content to prevent unnecessary re-renders
  const breadcrumbItems = useMemo(() => [{ label: 'Dashboard', current: true }], []);

  const welcomeMessage = useMemo(() => {
    if (profile) return 'Ready to continue your certification journey.';
    if (isLoadingProfile) return 'Loading your account information...';
    if (profileError) return 'Ready to continue your certification journey.';
    return 'Ready to continue your certification journey.';
  }, [profile, isLoadingProfile, profileError]);

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Welcome Section */}
        <div className="mb-6 bg-gradient-to-r from-violet-50 to-violet-50 dark:from-violet-950/30 dark:to-violet-900/40 border border-violet-100 dark:border-violet-800/50 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome back, {displayName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                {welcomeMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Overview</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Suspense
                  fallback={
                    <Button variant="secondary" disabled>
                      Loading...
                    </Button>
                  }
                >
                  <LazyAvailableCertificationsButton />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="px-6 py-6">
            <Suspense fallback={<DashboardStatSkeleton count={3} />}>
              <DashboardStats />
            </Suspense>
          </div>
        </div>

        {/* Your Registered Certifications Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Your Registered Certifications
            </h2>
          </div>

          <Suspense fallback={<UserCertificationCardSkeleton count={2} />}>
            <CertificationsSection />
          </Suspense>
        </section>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default MainPage;
