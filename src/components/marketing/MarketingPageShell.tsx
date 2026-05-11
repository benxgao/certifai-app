'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';

export interface MarketingPageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MarketingPageShell provides the standard outer wrapper for all marketing pages.
 * It applies the page-level background, dark mode gradient, and overflow handling.
 *
 * @param children - Page content to wrap
 * @param className - Optional additional classes to merge (use cn() if needed)
 */
export const MarketingPageShell: React.FC<MarketingPageShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${marketingTheme.pageShell.base} ${className}`}>{children}</div>
  );
};

export default MarketingPageShell;
