'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

export interface SectionIntroProps {
  /** Small uppercase label above the heading, e.g. "Included". */
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  /** Optional link/action pinned to the right on sm+ screens. */
  action?: React.ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
}

/**
 * SectionIntro is the standard eyebrow → heading → body block used to open
 * every marketing section. On `left` alignment an action can be pinned right.
 *
 * @param eyebrow - Uppercase violet label
 * @param title - Section heading
 * @param description - Supporting copy (optional)
 * @param action - Trailing link or control (optional)
 * @param align - 'left' (default) or 'center'
 * @param as - Heading element (default: 'h2')
 * @param className - Optional additional classes
 */
export const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Heading = 'h2',
  className = '',
}) => {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        centered
          ? 'mx-auto max-w-2xl text-center'
          : 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={centered ? '' : 'max-w-2xl'}>
        <p className={marketingTheme.copy.eyebrow}>{eyebrow}</p>
        <Heading className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
          {title}
        </Heading>
        {description && (
          <div className={cn(marketingTheme.copy.body, 'mt-4', centered && 'mx-auto')}>
            {description}
          </div>
        )}
      </div>
      {action && <div className={cn('shrink-0', centered && 'mt-6')}>{action}</div>}
    </div>
  );
};

export default SectionIntro;
