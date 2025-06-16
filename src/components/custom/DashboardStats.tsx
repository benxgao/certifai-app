import React from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { FaGraduationCap, FaCertificate, FaTrophy } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStats = () => {
  const { userCertifications, isLoadingUserCertifications } = useUserCertifications();

  if (isLoadingUserCertifications) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Certifications */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <FaCertificate className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Certifications
            </p>
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
            {userCertifications?.length || 0}
          </p>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              In Progress
            </p>
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
            {userCertifications?.filter((cert) => cert.status === 'active')?.length || 0}
          </p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <FaTrophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Completed
            </p>
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
            {userCertifications?.filter((cert) => cert.status === 'completed')?.length || 0}
          </p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Progress
            </p>
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
            {userCertifications?.length
              ? `${Math.round(
                  (userCertifications.filter((cert) => cert.status === 'completed').length /
                    userCertifications.length) *
                    100,
                )}%`
              : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
