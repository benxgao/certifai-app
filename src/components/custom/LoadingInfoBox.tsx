'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface LoadingInfoBoxProps {
  message?: string;
  className?: string;
}

export const LoadingInfoBox: React.FC<LoadingInfoBoxProps> = ({
  message = 'Processing your request...',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/50 text-blue-800 dark:text-blue-200 text-sm p-4 rounded-xl backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};
