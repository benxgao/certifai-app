'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

export type ChipVariant = 'accent' | 'neutral';

export interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}

/**
 * Chip renders a small inline pill for topics, providers, and states.
 * Used inside previews and card footers — never as a button.
 *
 * @param children - Chip label (may include a 12px icon)
 * @param variant - 'accent' for violet emphasis, 'neutral' for quiet metadata
 * @param className - Optional additional classes
 */
export const Chip: React.FC<ChipProps> = ({ children, variant = 'neutral', className = '' }) => (
  <span className={cn(marketingTheme.chip.base, marketingTheme.chip[variant], className)}>
    {children}
  </span>
);

export default Chip;
