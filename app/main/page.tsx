'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import { useAllAvailableCertifications } from '@/swr/certifications';
import { Toaster } from 'sonner';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';

const MainPage = () => {
  const { firebaseUser } = useFirebaseAuth();
  const {
    profile,
    isLoading: isLoadingProfile,
    isError: profileError,
    displayName,
  } = useProfileData();
  // ...existing code...
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();
  const router = useRouter();

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Dashboard', current: true }]} />

        {/* Welcome Section */}
        <div className="mb-6 bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome back, {displayName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {profile
                  ? 'Ready to continue your certification journey.'
                  : isLoadingProfile
                  ? 'Loading your account information...'
                  : profileError
                  ? 'Ready to continue your certification journey.'
                  : 'Ready to continue your certification journey.'}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/main/certifications')}
                  disabled={
                    isLoadingAvailableCertifications ||
                    (availableCertifications && availableCertifications.length === 0)
                  }
                >
                  {isLoadingAvailableCertifications ? 'Loading...' : 'Register for Certification'}
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="px-6 py-6">
            <Suspense fallback={<DashboardStatSkeleton count={5} />}>
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
            <Button
              variant="outline"
              onClick={() => router.push('/main/certifications')}
              className="border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Explore More
            </Button>
          </div>

          <Suspense fallback={<UserCertificationCardSkeleton count={3} />}>
            <CertificationsSection />
          </Suspense>
        </section>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default MainPage;
