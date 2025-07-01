/**
 * Enhanced welcome section for the main dashboard
 * Provides better UX focused on user progress
 */

import React from 'react';
import { Badge } from '@/src/components/ui/badge';
import { BookOpen, Target, CheckCircle2 } from 'lucide-react';

interface EnhancedWelcomeSectionProps {
  displayName: string;
  profile: any;
  isLoading: boolean;
  userCertifications?: any[];
  className?: string;
}

const EnhancedWelcomeSection: React.FC<EnhancedWelcomeSectionProps> = ({
  displayName,
  profile,
  isLoading,
  userCertifications = [],
  className = '',
}) => {
  if (isLoading) {
    return null;
  }

  // Calculate progress statistics
  const total = userCertifications.length;
  const active = userCertifications.filter((cert) => cert.status === 'IN_PROGRESS').length;
  const completed = userCertifications.filter((cert) => cert.status === 'COMPLETED').length;

  const getWelcomeMessage = () => {
    if (!profile) {
      return 'Ready to continue your certification journey.';
    }

    // Show progress-based message
    if (total > 0) {
      if (active > 0) {
        return `You have ${active} certification${
          active === 1 ? '' : 's'
        } in progress. Keep up the great work!`;
      } else if (completed > 0) {
        return `You've completed ${completed} certification${
          completed === 1 ? '' : 's'
        }. Ready for your next challenge?`;
      }
    }

    return 'Ready to start your certification journey with AI-powered learning.';
  };

  const renderProgressIndicators = () => {
    if (total === 0) {
      return null;
    }

    const progressStats = [
      {
        icon: Target,
        label: 'Active',
        value: active,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      },
      {
        icon: CheckCircle2,
        label: 'Completed',
        value: completed,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      },
    ];

    return (
      <div className="hidden md:flex items-center space-x-3">
        {progressStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`flex items-center space-x-1 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`mb-6 bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{getWelcomeMessage()}</p>

          {/* Quick action hint when no certifications */}
          {total === 0 && (
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Get Started
              </Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Register for your first certification to begin
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">{renderProgressIndicators()}</div>
      </div>
    </div>
  );
};

export default EnhancedWelcomeSection;
