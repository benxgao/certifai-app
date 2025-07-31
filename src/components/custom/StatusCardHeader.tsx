'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusIcon, StatusType } from './StatusIcon';

interface StatusCardHeaderProps {
  status: StatusType;
  title: string;
  description: string;
  className?: string;
}

export const StatusCardHeader: React.FC<StatusCardHeaderProps> = ({
  status,
  title,
  description,
  className,
}) => {
  return (
    <CardHeader className={`text-center space-y-4 pb-6 ${className || ''}`}>
      <StatusIcon status={status} />
      <div className="space-y-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-slate-300">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
  );
};
