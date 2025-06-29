'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
// ...existing code...
import {
  // ...existing code...
  useAllAvailableCertifications,
} from '@/swr/certifications';
// ...existing code...
import { Toaster } from 'sonner';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';
// ...existing code...

// ...existing code...

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

  // ...existing code...

  // ...existing code...

  // ...existing code...

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  // Cleanup effect to handle component unmounting
  // ...existing code...

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
                {profile ? (
                  <>
                    You have {profile.credit_tokens} credit tokens and {profile.energy_tokens}{' '}
                    energy tokens available.
                  </>
                ) : isLoadingProfile ? (
                  'Loading your account information...'
                ) : profileError ? (
                  'Ready to continue your certification journey.'
                ) : (
                  'Ready to continue your certification journey.'
                )}
              </p>
            </div>
            {!isLoadingProfile && profile && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{profile.credit_tokens}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Credits</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{profile.energy_tokens}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Energy</p>
                </div>
              </div>
            )}
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
