import React, { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useExamStats } from '@/src/context/ExamStatsContext';
import { FaGraduationCap, FaCertificate, FaClipboardList } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Some dashboard data may be incomplete due to profile loading issues.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Show only certification stats */}
          <StatsCard
            icon={<FaCertificate className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
            title="Certifications"
            value={userCertifications?.length || 0}
          />
          <StatsCard
            icon={<FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            title="In Progress"
            value={inProgressCount}
          />
          <StatsCard
            icon={<FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            title="Total Exams"
            value={
              isLoading ? <Skeleton className="h-6 w-8 mx-auto" /> : isError ? '—' : totalExamCount
            }
            subtitle={isError ? 'Error' : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Certifications */}
      <StatsCard
        icon={<FaCertificate className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
        title="Certifications"
        value={certificationCount}
      />

      {/* Learning Progress */}
      <StatsCard
        icon={<FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        title="In Progress"
        value={inProgressCount}
      />

      {/* Total Exams Created */}
      <StatsCard
        icon={<FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        title="Total Exams"
        value={
          isLoading ? <Skeleton className="h-6 w-8 mx-auto" /> : isError ? '—' : totalExamCount
        }
        subtitle={isError ? 'Error' : undefined}
      />
    </div>
  );
};

// Reusable StatsCard component for cleaner code
const StatsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string | React.ReactNode;
  subtitle?: string;
}> = ({ icon, title, value, subtitle }) => (
  <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/40 dark:to-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-violet-700 dark:from-slate-100 dark:to-violet-300 bg-clip-text text-transparent">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export default DashboardStats;
