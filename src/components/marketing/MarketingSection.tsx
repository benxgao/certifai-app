'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';

export interface MarketingSectionProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  wide?: boolean;
}

/**
 * MarketingSection wraps section content with standard padding, container constraints, and overflow handling.
 * Use narrow or wide props to adjust max-width constraints.
 *
 * @param children - Section content
 * @param className - Optional additional classes
 * @param narrow - If true, apply max-w-3xl constraint
 * @param wide - If true, apply max-w-6xl constraint
 */
export const MarketingSection: React.FC<MarketingSectionProps> = ({
  children,
  className = '',
  narrow = false,
  wide = false,
}) => {
  const maxWidthClass = narrow
    ? marketingTheme.section.narrow
    : wide
      ? marketingTheme.section.wide
      : '';

  return (
    <section className={`${marketingTheme.section.standard} ${className}`}>
      <div className={`${marketingTheme.section.container} ${maxWidthClass}`}>{children}</div>
    </section>
  );
};

export default MarketingSection;
