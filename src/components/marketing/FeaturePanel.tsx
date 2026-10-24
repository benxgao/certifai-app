'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';
import { IconTile, type IconTileVariant } from './IconTile';

export interface FeaturePanelProps {
  children: React.ReactNode;
  /** Enables the hairline + border/shadow hover treatment (default: true). */
  interactive?: boolean;
  className?: string;
}

/**
 * FeaturePanel is the homepage bento surface, promoted for reuse.
 * It carries the layered soft shadow, rounded frame, and the violet hairline
 * that appears on hover. Composition: `FeaturePanelHeader` + optional preview.
 *
 * @param children - Panel content
 * @param interactive - Adds hover border/shadow + top hairline (default: true)
 * @param className - Optional additional classes (grid spans, order, padding)
 */
export const FeaturePanel: React.FC<FeaturePanelProps> = ({
  children,
  interactive = true,
  className = '',
}) => (
  <div
    className={cn(
      marketingTheme.surface.feature,
      interactive && marketingTheme.surface.featureInteractive,
      'group flex flex-col p-6 sm:p-7',
      className,
    )}
  >
    {interactive && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-violet-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    )}
    {children}
  </div>
);

export interface FeaturePanelHeaderProps {
  icon: React.ReactNode;
  /** Short eyebrow above the title, e.g. "Scope" or "Principle 01". */
  label: string;
  title: string;
  description: string;
  variant?: IconTileVariant;
  className?: string;
}

/**
 * FeaturePanelHeader renders the icon + eyebrow + title + description stack
 * used at the top of a `FeaturePanel`.
 */
export const FeaturePanelHeader: React.FC<FeaturePanelHeaderProps> = ({
  icon,
  label,
  title,
  description,
  variant = 'accent',
  className = '',
}) => (
  <div className={className}>
    <div className="flex items-center gap-3">
      <IconTile variant={variant}>{icon}</IconTile>
      <span className={marketingTheme.copy.eyebrow}>{label}</span>
    </div>
    <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
      {title}
    </h3>
    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

export default FeaturePanel;
