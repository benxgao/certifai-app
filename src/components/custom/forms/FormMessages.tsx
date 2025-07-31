'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  return (
    <div
      className={cn(
        'bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/50 text-red-800 dark:text-red-200 text-sm p-4 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300',
        className,
      )}
    >
      <div className="flex items-start">
        <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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

export interface FormSuccessProps {
  message: string;
  className?: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ message, className }) => {
  return (
    <div
      className={cn(
        'bg-green-50/80 dark:bg-green-900/20 border border-green-200/60 dark:border-green-800/50 text-green-800 dark:text-green-200 text-sm p-4 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300',
        className,
      )}
    >
      <div className="flex items-start">
        <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};
