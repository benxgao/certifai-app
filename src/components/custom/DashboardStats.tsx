import React from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { FaGraduationCap, FaCertificate, FaTrophy } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStats = () => {
  const { userCertifications, isLoadingUserCertifications } = useUserCertifications();
  const { isLoading: isLoadingProfile, isError: profileError } = useUserProfileContext();

  const isLoading = isLoadingUserCertifications || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
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
            value={userCertifications?.filter((cert) => cert.status === 'active')?.length || 0}
          />
          <StatsCard
            icon={<FaTrophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
            title="Completed"
            value={userCertifications?.filter((cert) => cert.status === 'completed')?.length || 0}
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
        value={userCertifications?.length || 0}
      />

      {/* Learning Progress */}
      <StatsCard
        icon={<FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        title="In Progress"
        value={userCertifications?.filter((cert) => cert.status === 'active')?.length || 0}
      />

      {/* Completed */}
      <StatsCard
        icon={<FaTrophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
        title="Completed"
        value={userCertifications?.filter((cert) => cert.status === 'completed')?.length || 0}
      />
    </div>
  );
};

// Reusable StatsCard component for cleaner code
const StatsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
}> = ({ icon, title, value, subtitle }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="space-y-3">
      <div className="flex items-center justify-center space-x-2">
        {icon}
        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          {title}
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default DashboardStats;
