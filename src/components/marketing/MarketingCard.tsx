'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';

export type CardVariant = 'default' | 'interactive' | 'cta';

export interface MarketingCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

/**
 * MarketingCard renders a card surface with variants:
 * - default: static card with no hover effects
 * - interactive: card with subtle hover state (shadow + border shift)
 * - cta: accent-bordered card for call-to-action blocks
 *
 * @param children - Card content
 * @param variant - Card style variant (default: 'default')
 * @param className - Optional additional classes
 */
export const MarketingCard: React.FC<MarketingCardProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'interactive':
        return marketingTheme.surface.cardInteractive;
      case 'cta':
        return marketingTheme.surface.cta;
      case 'default':
      default:
        return marketingTheme.surface.card;
    }
  };

  return (
    <div className={`${getVariantClass()} ${className}`}>{children}</div>
  );
};

export default MarketingCard;
