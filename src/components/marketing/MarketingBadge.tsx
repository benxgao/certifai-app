'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';

export type BadgeVariant = 'default' | 'subtle';

export interface MarketingBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * MarketingBadge renders an eyebrow or accent badge for hero sections and feature highlights.
 * Variants:
 * - default: violet accent (use for primary/hero badges)
 * - subtle: neutral slate (use for secondary badges)
 *
 * @param children - Badge text or content
 * @param variant - Badge style variant (default: 'default')
 * @param className - Optional additional classes
 */
export const MarketingBadge: React.FC<MarketingBadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClass = variant === 'subtle' ? marketingTheme.badge.subtle : marketingTheme.badge.default;

  return (
    <div className={`${variantClass} ${className}`}>{children}</div>
  );
};

export default MarketingBadge;
