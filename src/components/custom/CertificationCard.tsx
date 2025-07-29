'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './ActionButton';
import { UserRegisteredCertification } from '@/swr/certifications';
import {
  FaCertificate,
  FaClipboardList,
  FaBookOpen,
  FaTrophy,
  FaTrash,
  FaClock,
  FaPlay,
} from 'react-icons/fa';
import { useExamCountForCertification } from '@/src/hooks/useExamCounts';
import { StatusBadge } from '@/src/components/ui/status-badge';
import { cn } from '@/src/lib/utils';

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
        'relative backdrop-blur-md border rounded-xl overflow-hidden group transition-all duration-300',
        cardVariant.container,
        isDeleting && 'pointer-events-none',
        variant === 'compact' && 'shadow-md hover:shadow-lg',
      )}
    >
      {/* Decorative accent gradient */}
      <div
        className={cn(
          'absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-60',
          cardVariant.accent,
        )}
      ></div>

      {/* Subtle progress indicator for in-progress certifications */}
      {getCertificationStatus(cert.status) === 'in_progress' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500 opacity-60"></div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className={cn('p-6 border-b', cardVariant.header)}>
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                'text-xl font-semibold tracking-tight transition-colors',
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
              <StatusBadge
                status={getCertificationStatus(cert.status)}
                customText={getStatusText(cert.status)}
                className="text-xs px-3 py-1.5 font-medium"
              />
              {onDelete && !isDeleting && getCertificationStatus(cert.status) !== 'deleting' && (
                <button
                  onClick={() => onDelete(cert.cert_id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete certification"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exam Count */}
              <div className="flex items-center space-x-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg px-4 py-3 border border-slate-100/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    cardVariant.iconBg,
                  )}
                >
                  <FaClipboardList className={cn('w-4 h-4', cardVariant.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Practice Exams
                  </p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {examCount}
                  </p>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-center space-x-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg px-4 py-3 border border-slate-100/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    cardVariant.iconBg,
                  )}
                >
                  <FaClock className={cn('w-4 h-4', cardVariant.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Started
                  </p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {new Date(cert.assigned_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center sm:justify-end pt-2">
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
                  'w-full sm:w-auto font-medium px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-200',
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
