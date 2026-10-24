'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface Step {
  title: string;
  body: string;
}

export interface StepListProps {
  steps: Step[];
  /** Column count on large screens (default: 4). */
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClass: Record<NonNullable<StepListProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4 lg:gap-8',
};

/**
 * StepList renders an ordered sequence of numbered steps with a hairline
 * connector between them — the same treatment used by the homepage loop.
 *
 * @param steps - Ordered step content
 * @param columns - Large-screen column count (default: 4)
 * @param className - Optional additional classes
 */
export const StepList: React.FC<StepListProps> = ({ steps, columns = 4, className = '' }) => (
  <ol className={cn('mt-12 grid gap-10', columnClass[columns], className)}>
    {steps.map((step, index) => (
      <li key={step.title} className="relative">
        {index < steps.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute left-12 right-0 top-[18px] hidden h-px bg-linear-to-r from-slate-200 to-transparent lg:block dark:from-slate-700"
          />
        )}
        <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/80 bg-white text-sm font-semibold text-violet-700 shadow-[0_4px_12px_-6px_rgba(109,40,217,0.45)] dark:border-violet-400/25 dark:bg-slate-900 dark:text-violet-300">
          {index + 1}
        </div>
        <h3 className="mt-5 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {step.body}
        </p>
      </li>
    ))}
  </ol>
);

export default StepList;
