'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface AuthPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNotification?: boolean;
  notificationMessage?: string;
  notificationCta?: string;
  notificationLink?: string;
}

export const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20',
        className,
      )}
    >
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};
