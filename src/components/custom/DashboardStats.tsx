import React, { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useExamStats } from '@/src/context/ExamStatsContext';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from './StatsCard';
import { AlertMessage } from './AlertMessage';

const DashboardStats = () => {
  const { userCertifications, isLoadingUserCertifications } = useUserCertifications();
  const { isError: profileError } = useUserProfileContext();
  const { totalExamCount, certificationCount, isLoading, isError } = useExamStats();

  // Memoize calculated values to prevent unnecessary re-calculations
  const inProgressCount = useMemo(() => {
    return userCertifications?.filter((cert) => cert.status === 'active')?.length || 0;
  }, [userCertifications]);

  // Show loading skeleton only while certifications are loading
  // Profile loading can continue in background since we mainly need certifications here
  if (isLoadingUserCertifications) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-8 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state if profile failed to load but certifications are available
  if (profileError && !isLoadingUserCertifications) {
    return (
      <div className="space-y-4">
        <AlertMessage
          message="Some dashboard data may be incomplete due to profile loading issues."
          variant="warning"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Show only certification stats */}
          <StatsCard
            dotColor="bg-violet-400 dark:bg-violet-500"
            title="Certifications"
            value={userCertifications?.length || 0}
            variant="overview"
          />
          <StatsCard
            dotColor="bg-emerald-400 dark:bg-emerald-500"
            title="In Progress"
            value={inProgressCount}
            variant="overview"
          />
          <StatsCard
            dotColor="bg-blue-400 dark:bg-blue-500"
            title="Total Exams"
            value={
              isLoading ? <Skeleton className="h-8 w-10 mx-auto" /> : isError ? '—' : totalExamCount
            }
            subtitle={isError ? 'Error' : undefined}
            variant="overview"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Total Certifications */}
      <StatsCard
        dotColor="bg-violet-400 dark:bg-violet-500"
        title="Certifications"
        value={certificationCount}
        variant="overview"
      />

      {/* Learning Progress */}
      <StatsCard
        dotColor="bg-emerald-400 dark:bg-emerald-500"
        title="In Progress"
        value={inProgressCount}
        variant="overview"
      />

      {/* Total Exams Created */}
      <StatsCard
        dotColor="bg-blue-400 dark:bg-blue-500"
        title="Total Exams"
        value={
          isLoading ? <Skeleton className="h-8 w-10 mx-auto" /> : isError ? '—' : totalExamCount
        }
        subtitle={isError ? 'Error' : undefined}
        variant="overview"
      />
    </div>
  );
};

export default DashboardStats;
