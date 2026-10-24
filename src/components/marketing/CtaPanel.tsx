'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

export interface CtaStat {
  value: string;
  label: string;
}

export interface CtaPanelProps {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  /** Pre-styled action row (use `marketingTheme.button.onDark*`). */
  actions: React.ReactNode;
  /** Optional right-hand fact column. Omit for a single-column panel. */
  stats?: CtaStat[];
  className?: string;
}

/**
 * CtaPanel is the full-bleed violet→indigo closing panel from the homepage.
 * Section-level chrome only — pass token-styled buttons via `actions`.
 *
 * @param eyebrow - Small uppercase label
 * @param title - Panel headline
 * @param body - Supporting copy
 * @param actions - CTA row (already styled with `button.onDark*` tokens)
 * @param stats - Optional value/label facts rendered in a side column
 * @param className - Optional additional classes
 */
export const CtaPanel: React.FC<CtaPanelProps> = ({
  eyebrow,
  title,
  body,
  actions,
  stats,
  className = '',
}) => (
  <div className={cn(marketingTheme.ctaPanel, className)}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_72%)]" />
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
    </div>

    <div
      className={cn(
        'relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:items-center lg:px-14 lg:py-16',
        stats ? 'lg:grid-cols-[1.25fr_0.75fr]' : '',
      )}
    >
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <div className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/80 sm:text-lg">
          {body}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
      </div>

      {stats && (
        <dl className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 lg:grid-cols-1 lg:gap-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          {stats.map((stat) => (
            <div key={stat.label} className="lg:py-3">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-white/70 sm:text-xs">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  </div>
);

export default CtaPanel;
