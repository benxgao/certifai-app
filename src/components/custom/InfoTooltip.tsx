'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import ResponsiveTooltip from './ResponsiveTooltip';

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  sideOffset?: number;
  iconSize?: 'sm' | 'md';
}

/**
 * InfoTooltip - A standardized tooltip component with consistent styling
 * following the Certifai design system.
 *
 * Features:
 * - Uses HelpCircle icon for consistent visual language
 * - Slate color scheme with proper hover states
 * - Responsive behavior (hover on desktop, tap on mobile)
 * - Accessible with keyboard navigation
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  className,
  sideOffset = 4,
  iconSize = 'md',
}) => {
  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  };

  return (
    <ResponsiveTooltip content={content} sideOffset={sideOffset} className={className}>
      <HelpCircle
        className={`${iconSizeClasses[iconSize]} text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-help`}
      />
    </ResponsiveTooltip>
  );
};
