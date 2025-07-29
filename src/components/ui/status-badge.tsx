'use client';

import React from 'react';
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa';

type StatusType =
  | 'completed'
  | 'passed'
  | 'failed'
  | 'generating'
  | 'generation_failed'
  | 'ready'
  | 'pending'
  | 'in_progress'
  | 'active'
  | 'inactive'
  | 'deleting'
  | 'not_started';

interface StatusBadgeProps {
  status: StatusType;
  customText?: string;
  className?: string;
}

/**
 * Reusable status badge component with consistent styling across the application
 * Supports various status types with appropriate colors and icons
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customText, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
      case 'passed':
        return {
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          icon: null,
          text: customText || 'Completed',
        };

      case 'failed':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-600 dark:text-red-400',
          icon: null,
          text: customText || 'Failed',
        };

      case 'generating':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-600 dark:text-blue-400',
          icon: null,
          text: customText || 'Generating',
        };

      case 'generation_failed':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-600 dark:text-red-400',
          icon: null,
          text: customText || 'Failed',
        };

      case 'ready':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-600 dark:text-green-400',
          icon: null,
          text: customText || 'Ready',
        };

      case 'pending':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-600 dark:text-yellow-400',
          icon: null,
          text: customText || 'Pending',
        };

      case 'in_progress':
        return {
          bgColor: 'bg-violet-100 dark:bg-violet-900/30',
          textColor: 'text-violet-600 dark:text-violet-400',
          icon: null,
          text: customText || 'In Progress',
        };

      case 'active':
        return {
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          icon: null,
          text: customText || 'Active',
        };

      case 'inactive':
        return {
          bgColor: 'bg-slate-100 dark:bg-slate-800/60',
          textColor: 'text-slate-500 dark:text-slate-500',
          icon: null,
          text: customText || 'Inactive',
        };

      case 'deleting':
        return {
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          textColor: 'text-orange-600 dark:text-orange-400',
          icon: null,
          text: customText || 'Deleting',
        };

      case 'not_started':
        return {
          bgColor: 'bg-slate-100 dark:bg-slate-800/60',
          textColor: 'text-slate-600 dark:text-slate-400',
          icon: null,
          text: customText || 'Not Started',
        };

      default:
        return {
          bgColor: 'bg-slate-100 dark:bg-slate-800/60',
          textColor: 'text-slate-500 dark:text-slate-500',
          icon: null,
          text: customText || 'Unknown',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-normal ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;
