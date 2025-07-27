'use client';

import React, { useEffect, Suspense, useMemo } from 'react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import { ActionButton } from '@/components/custom';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import AdaptiveLearningInterestModal from '@/src/components/custom/AdaptiveLearningInterestModalEnhanced';
import { Bell } from 'lucide-react';
import SimpleCertificationsButton from '@/components/custom/SimpleCertificationsButton';

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
        <DashboardCard>
          <DashboardCardHeader>
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
                      <ActionButton
                        onClick={() => {}}
                        variant="primary"
                        size="lg"
                        icon={<Bell className="h-4 w-4" />}
                        className="shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Get Notified When Ready
                      </ActionButton>
                    }
                  />
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <SimpleCertificationsButton />
              </div>
            </div>
          </DashboardCardHeader>

          <DashboardCardContent>
            {/* Dashboard Stats - Enhanced layout */}
            <Suspense fallback={<DashboardStatSkeleton count={3} />}>
              <DashboardStats />
            </Suspense>

            {/* Mobile Register Button - Consistent styling */}
            <div className="sm:hidden mt-6">
              <SimpleCertificationsButton fullWidth />
            </div>
          </DashboardCardContent>
        </DashboardCard>

        {/* Your Registered Certifications Section - Unified header */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Your Registered Certifications
            </h2>
          </div>

          <DashboardCard>
            <Suspense fallback={<UserCertificationCardSkeleton count={2} />}>
              <CertificationsSection />
            </Suspense>
          </DashboardCard>
        </section>
      </div>
    </div>
  );
};

export default MainPage;
