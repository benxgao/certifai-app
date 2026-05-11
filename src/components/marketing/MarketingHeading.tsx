'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';

export type HeadingLevel = 'hero' | 'section' | 'card' | 'body';

export interface MarketingHeadingProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
}

/**
 * MarketingHeading applies semantic typography styles for marketing pages.
 * Levels:
 * - hero: large page title (h1)
 * - section: section heading (h2)
 * - card: feature/card heading (h3)
 * - body: emphasized body text (p)
 *
 * @param children - Heading text
 * @param level - Text style level (default: 'section')
 * @param as - HTML element to render as (default: matches level)
 * @param className - Optional additional classes
 */
export const MarketingHeading: React.FC<MarketingHeadingProps> = ({
  children,
  level = 'section',
  as,
  className = '',
}) => {
  const headingClass = marketingTheme.heading[level];
  const Component = (as ||
    (level === 'hero' ? 'h1' : level === 'section' ? 'h2' : level === 'card' ? 'h3' : 'p')) as
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p';

  return (
    <Component className={`${headingClass} ${className}`}>{children}</Component>
  );
};

export default MarketingHeading;
