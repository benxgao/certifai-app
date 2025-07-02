'use client';

import React from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { RateLimitInfo } from '@/src/swr/rateLimitInfo';

interface RateLimitSummaryProps {
  rateLimitInfo: RateLimitInfo;
  className?: string;
}

export const RateLimitSummary: React.FC<RateLimitSummaryProps> = ({
  rateLimitInfo,
  className = '',
}) => {
  const { maxExamsAllowed, currentCount, remainingCount, canCreateExam } = rateLimitInfo;

  const getStatusColor = () => {
    if (!canCreateExam) return 'text-red-600 dark:text-red-400';
    if (remainingCount <= 1) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getIcon = () => {
    if (!canCreateExam) return AlertTriangle;
    if (remainingCount <= 1) return Clock;
    return CheckCircle;
  };

  const IconComponent = getIcon();

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <IconComponent className={`w-4 h-4 ${getStatusColor()}`} />
      <span className="text-slate-600 dark:text-slate-400">Exam Usage:</span>
      <Badge variant="secondary" className="text-xs">
        {currentCount}/{maxExamsAllowed}
      </Badge>
      {remainingCount > 0 && (
        <span className={`text-xs ${getStatusColor()}`}>{remainingCount} remaining today</span>
      )}
      {!canCreateExam && (
        <span className="text-xs text-red-600 dark:text-red-400">Limit reached</span>
      )}
    </div>
  );
};

export default RateLimitSummary;
