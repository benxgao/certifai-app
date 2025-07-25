'use client';

import React, { useEffect, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';
import AdaptiveLearningInterestModal from '@/src/components/custom/AdaptiveLearningInterestModalEnhanced';
import { Bell } from 'lucide-react';

// Lazy load the all certifications hook to avoid blocking initial render
const LazyAvailableCertificationsButton = React.lazy(
  () => import('@/components/custom/LazyAvailableCertificationsButton'),
);

const MainPage = () => {
  const { firebaseUser } = useFirebaseAuth();
  const { isLoading: isLoadingProfile, displayName } = useProfileData();

  // Memoize static content to prevent unnecessary re-renders
  const breadcrumbItems = useMemo(() => [{ label: 'Dashboard', current: true }], []);

  const welcomeMessage = useMemo(() => {
    if (isLoadingProfile) return 'Loading your account information...';
    return 'An advanced adaptive learning engine is under development, with AI-powered question selection, real-time difficulty adjustment, and personalized study paths to revolutionize your certification experience.';
  }, [isLoadingProfile]);

  useEffect(() => {
    if (firebaseUser) {
    }
  }, [firebaseUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Welcome Section - Enhanced glass-morphism */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden">
          {/* Decorative gradient orb */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                    Welcome, {displayName || 'Learner'}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">
                    {welcomeMessage}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <AdaptiveLearningInterestModal
                      trigger={
                        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg">
                          <Bell className="mr-2 h-4 w-4" />
                          Get Notified When Ready
                        </Button>
                      }
                    />
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-3">
                  <Suspense
                    fallback={
                      <Button variant="secondary" disabled className="rounded-lg">
                        Loading...
                      </Button>
                    }
                  >
                    <LazyAvailableCertificationsButton />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Dashboard Stats - Enhanced layout */}
            <div className="p-8">
              <Suspense fallback={<DashboardStatSkeleton count={3} />}>
                <DashboardStats />
              </Suspense>
            </div>

            {/* Mobile Register Button - Consistent styling */}
            <div className="sm:hidden px-8 pb-8">
              <Suspense
                fallback={
                  <Button variant="secondary" disabled className="w-full rounded-lg">
                    Loading...
                  </Button>
                }
              >
                <LazyAvailableCertificationsButton />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Your Registered Certifications Section - Unified header */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Your Registered Certifications
            </h2>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl p-8">
            <Suspense fallback={<UserCertificationCardSkeleton count={2} />}>
              <CertificationsSection />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPage;
