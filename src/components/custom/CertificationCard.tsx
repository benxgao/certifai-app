'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './ActionButton';
import { UserRegisteredCertification } from '@/swr/certifications';
import { FaBookOpen, FaTrophy, FaPlay, FaTrash } from 'react-icons/fa';
import { useExamCountForCertification } from '@/src/hooks/useExamCounts';
import { cn } from '@/src/lib/utils';
import { DeleteIconButton } from './DeleteIconButton';

interface CertificationCardProps {
  cert: UserRegisteredCertification;
  variant?: 'default' | 'compact';
  onDelete?: (certId: number) => void;
  isDeleting?: boolean;
}

const CertificationCard = ({
  cert,
  variant = 'default',
  onDelete,
  isDeleting = false,
}: CertificationCardProps) => {
  const router = useRouter();
  const examCount = useExamCountForCertification(cert.cert_id);

  // Helper function to map certification status to StatusBadge status type
  const getCertificationStatus = (status: string) => {
    if (isDeleting) return 'deleting';

    switch (status.toLowerCase()) {
      case 'completed':
      case 'passed':
        return 'passed';
      case 'active':
      case 'in_progress':
        return 'in_progress';
      case 'interested':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'not_started':
        return 'not_started';
      default:
        return 'active';
    }
  };

  // Helper function to get display text for status
  const getStatusText = (status: string) => {
    if (isDeleting) return 'Deleting...';

    switch (status.toLowerCase()) {
      case 'active':
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'passed':
        return 'Passed';
      case 'interested':
        return 'Interested';
      case 'failed':
        return 'Failed';
      case 'not_started':
        return 'Not Started';
      default:
        return status;
    }
  };

  // Get card styling based on status
  const getCardVariant = () => {
    const status = getCertificationStatus(cert.status);

    switch (status) {
      case 'passed':
        return {
          container:
            'bg-white/90 dark:bg-slate-900/90 border-emerald-200/60 dark:border-emerald-700/60 shadow-lg hover:shadow-xl ring-1 ring-emerald-100/50 dark:ring-emerald-900/20',
          header:
            'bg-gradient-to-r from-emerald-50/80 to-green-50/60 dark:from-emerald-950/40 dark:to-green-950/30 border-emerald-100 dark:border-emerald-800/50',
          accent: 'bg-emerald-200/20 dark:bg-emerald-600/10',
          iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'in_progress':
        return {
          container:
            'bg-white/90 dark:bg-slate-900/90 border-violet-200/60 dark:border-violet-700/60 shadow-lg hover:shadow-xl ring-1 ring-violet-100/50 dark:ring-violet-900/20',
          header:
            'bg-gradient-to-r from-violet-50/80 to-blue-50/60 dark:from-violet-950/40 dark:to-blue-950/30 border-violet-100 dark:border-violet-800/50',
          accent: 'bg-violet-200/20 dark:bg-violet-600/10',
          iconBg: 'bg-violet-50 dark:bg-violet-900/30',
          iconColor: 'text-violet-600 dark:text-violet-400',
        };
      case 'failed':
        return {
          container:
            'bg-white/90 dark:bg-slate-900/90 border-red-200/60 dark:border-red-700/60 shadow-lg hover:shadow-xl ring-1 ring-red-100/50 dark:ring-red-900/20',
          header:
            'bg-gradient-to-r from-red-50/80 to-rose-50/60 dark:from-red-950/40 dark:to-rose-950/30 border-red-100 dark:border-red-800/50',
          accent: 'bg-red-200/20 dark:bg-red-600/10',
          iconBg: 'bg-red-50 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
        };
      case 'deleting':
        return {
          container:
            'bg-white/60 dark:bg-slate-900/60 border-orange-200/60 dark:border-orange-700/60 shadow-md opacity-75 ring-1 ring-orange-100/50 dark:ring-orange-900/20',
          header:
            'bg-gradient-to-r from-orange-50/80 to-amber-50/60 dark:from-orange-950/40 dark:to-amber-950/30 border-orange-100 dark:border-orange-800/50',
          accent: 'bg-orange-200/20 dark:bg-orange-600/10',
          iconBg: 'bg-orange-50 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
        };
      case 'not_started':
        return {
          container:
            'bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/60 shadow-md hover:shadow-lg ring-1 ring-slate-100/50 dark:ring-slate-900/20',
          header:
            'bg-gradient-to-r from-slate-50/80 to-slate-100/60 dark:from-slate-800/40 dark:to-slate-700/30 border-slate-100 dark:border-slate-700/50',
          accent: 'bg-slate-200/20 dark:bg-slate-600/10',
          iconBg: 'bg-slate-50 dark:bg-slate-800/60',
          iconColor: 'text-slate-600 dark:text-slate-400',
        };
      default:
        return {
          container:
            'bg-white/90 dark:bg-slate-900/90 border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl',
          header:
            'bg-gradient-to-r from-slate-50/80 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20 border-slate-100 dark:border-slate-700/50',
          accent: 'bg-violet-200/20 dark:bg-violet-600/10',
          iconBg: 'bg-violet-50 dark:bg-violet-900/30',
          iconColor: 'text-violet-600 dark:text-violet-400',
        };
    }
  };

  // Get action button configuration based on status
  const getActionConfig = () => {
    const status = getCertificationStatus(cert.status);

    switch (status) {
      case 'passed':
        return {
          variant: 'success' as const,
          icon: <FaTrophy className="w-4 h-4" />,
          text: 'View Certificate',
          disabled: false,
        };
      case 'in_progress':
        return {
          variant: 'primary' as const,
          icon: <FaBookOpen className="w-4 h-4" />,
          text: 'Continue Learning',
          disabled: false,
        };
      case 'failed':
        return {
          variant: 'secondary' as const,
          icon: <FaPlay className="w-4 h-4" />,
          text: 'Retry Certification',
          disabled: false,
        };
      case 'deleting':
        return {
          variant: 'secondary' as const,
          icon: <FaTrash className="w-4 h-4" />,
          text: 'Deleting...',
          disabled: true,
        };
      case 'not_started':
        return {
          variant: 'primary' as const,
          icon: <FaPlay className="w-4 h-4" />,
          text: 'Start Learning',
          disabled: false,
        };
      default:
        return {
          variant: 'primary' as const,
          icon: <FaBookOpen className="w-4 h-4" />,
          text: 'Continue Learning',
          disabled: false,
        };
    }
  };

  const cardVariant = getCardVariant();
  const actionConfig = getActionConfig();

  return (
    <div
      className={cn(
        'relative backdrop-blur-md border rounded-xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1',
        cardVariant.container,
        isDeleting && 'pointer-events-none',
        variant === 'compact'
          ? 'shadow-lg hover:shadow-xl'
          : 'shadow-2xl hover:shadow-3xl hover:shadow-violet-500/10 dark:hover:shadow-violet-400/10',
      )}
    >
      {/* Enhanced decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200/30 to-blue-200/20 dark:from-violet-600/20 dark:to-blue-600/10 rounded-bl-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-emerald-100/20 to-cyan-100/15 dark:from-emerald-600/10 dark:to-cyan-600/5 rounded-tr-full blur-lg"></div>

      {/* Decorative accent gradient - updated for better blending */}
      <div
        className={cn(
          'absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-40',
          cardVariant.accent,
        )}
      ></div>

      {/* Subtle progress indicator for in-progress certifications */}
      {getCertificationStatus(cert.status) === 'in_progress' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500 opacity-60"></div>
      )}

      <div className="relative z-10">
        {/* Enhanced Header with premium gradient */}
        <div
          className={cn(
            'bg-gradient-to-r from-slate-50/90 via-white/80 to-violet-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-violet-950/30 border-b border-slate-200/80 dark:border-slate-700/60 p-5 sm:p-6 backdrop-blur-sm',
            cardVariant.header,
          )}
        >
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                'text-xl font-bold tracking-tight transition-colors',
                getCertificationStatus(cert.status) === 'passed'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : getCertificationStatus(cert.status) === 'failed'
                  ? 'text-red-700 dark:text-red-300'
                  : getCertificationStatus(cert.status) === 'deleting'
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-violet-700 dark:text-violet-300',
              )}
            >
              {cert.certification.name}
            </h3>
            <div className="flex items-center gap-2">
              {onDelete && !isDeleting && getCertificationStatus(cert.status) !== 'deleting' && (
                <DeleteIconButton
                  onClick={() => onDelete(cert.cert_id)}
                  title="Delete certification"
                />
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col space-y-8">
            {/* Enhanced Stats Grid with Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Status Badge */}
              <div className="relative bg-gradient-to-br from-violet-50/90 to-blue-50/80 dark:from-violet-900/30 dark:to-blue-900/25 p-4 sm:p-5 rounded-2xl border border-violet-200/50 dark:border-violet-700/40 shadow-lg hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-400/10 hover:border-violet-300/70 dark:hover:border-violet-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center gap-1 w-full">
                  <div className="flex items-center justify-center mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400 dark:bg-violet-500 mr-2"></span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-700 to-blue-700 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
                    {getStatusText(cert.status)}
                  </span>
                </div>
              </div>

              {/* Practice Exams Badge */}
              <div className="relative bg-gradient-to-br from-emerald-50/90 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/25 p-4 sm:p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/40 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 hover:border-emerald-300/70 dark:hover:border-emerald-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center gap-1 w-full">
                  <div className="flex items-center justify-center mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-emerald-500 mr-2"></span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Practice Exams
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent leading-tight">
                    {examCount}
                  </span>
                </div>
              </div>

              {/* Started Badge */}
              <div className="relative bg-gradient-to-br from-cyan-50/90 to-teal-50/80 dark:from-cyan-900/30 dark:to-teal-900/25 p-4 sm:p-5 rounded-2xl border border-cyan-200/50 dark:border-cyan-700/40 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-cyan-300/70 dark:hover:border-cyan-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center gap-1 w-full">
                  <div className="flex items-center justify-center mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 dark:bg-cyan-500 mr-2"></span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Started
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
                    {new Date(cert.assigned_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <ActionButton
                onClick={() =>
                  !actionConfig.disabled &&
                  router.push(`/main/certifications/${cert.cert_id}/exams`)
                }
                variant={actionConfig.variant}
                size="lg"
                icon={actionConfig.icon}
                disabled={actionConfig.disabled}
                isLoading={isDeleting}
                className={cn(
                  'w-full sm:w-auto font-bold px-6 sm:px-8 py-3.5 sm:py-4 text-base shadow-xl hover:shadow-2xl hover:shadow-violet-500/25 dark:hover:shadow-violet-400/20 transition-all duration-500 rounded-xl backdrop-blur-sm border-0 hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900',
                  actionConfig.disabled && 'opacity-60 cursor-not-allowed',
                )}
              >
                <span className="block sm:inline">{actionConfig.text}</span>
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
