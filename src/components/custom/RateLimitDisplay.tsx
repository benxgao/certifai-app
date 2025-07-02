'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { RateLimitError } from '@/src/swr/createExam';

interface RateLimitDisplayProps {
  rateLimitInfo: RateLimitError;
  className?: string;
}

export const RateLimitDisplay: React.FC<RateLimitDisplayProps> = ({
  rateLimitInfo,
  className = '',
}) => {
  const { maxExamsAllowed, currentCount, remainingCount, resetTime } = rateLimitInfo;

  // Parse the reset time
  const resetDate = new Date(resetTime);
  const now = new Date();
  const hoursUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60));

  const isAtLimit = remainingCount === 0;

  return (
    <Card
      className={`border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {isAtLimit ? (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {isAtLimit ? 'Exam Limit Reached' : 'Exam Usage'}
              </h4>
              <Badge
                variant="secondary"
                className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100"
              >
                {currentCount}/{maxExamsAllowed} used
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {isAtLimit ? (
                  <>
                    You&apos;ve reached the maximum of <strong>{maxExamsAllowed} exams</strong>{' '}
                    allowed in 24 hours.
                  </>
                ) : (
                  <>
                    You can create{' '}
                    <strong>
                      {remainingCount} more exam{remainingCount !== 1 ? 's' : ''}
                    </strong>{' '}
                    in the next 24 hours.
                  </>
                )}
              </p>

              {isAtLimit && (
                <div className="flex items-center space-x-2 text-sm text-amber-700 dark:text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>
                    You can create your next exam in approximately{' '}
                    <strong>
                      {hoursUntilReset} hour{hoursUntilReset !== 1 ? 's' : ''}
                    </strong>
                  </span>
                </div>
              )}

              {!isAtLimit && (
                <div className="flex items-center space-x-2 text-sm text-amber-700 dark:text-amber-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    Limit resets at{' '}
                    <strong>
                      {resetDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateLimitDisplay;
