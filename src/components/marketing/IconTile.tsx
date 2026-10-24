'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

export type IconTileVariant = 'accent' | 'soft' | 'neutral';
export type IconTileSize = 'sm' | 'md';

export interface IconTileProps {
  children: React.ReactNode;
  variant?: IconTileVariant;
  size?: IconTileSize;
  className?: string;
}

/**
 * IconTile is the canonical container for an icon inside marketing surfaces.
 * Variants:
 * - accent: violet→indigo gradient tile (one per section, at most)
 * - soft: tinted violet tile for supporting markers
 * - neutral: quiet slate tile for metadata
 *
 * @param children - The icon element
 * @param variant - Visual treatment (default: 'accent')
 * @param size - 'md' (40/44px, default) or 'sm' (28px, inline lists)
 * @param className - Optional additional classes
 */
export const IconTile: React.FC<IconTileProps> = ({
  children,
  variant = 'accent',
  size = 'md',
  className = '',
}) => (
  <span
    aria-hidden="true"
    className={cn(
      marketingTheme.iconTile.base,
      size === 'sm' && marketingTheme.iconTile.sizeSm,
      marketingTheme.iconTile[variant],
      className,
    )}
  >
    {children}
  </span>
);

export default IconTile;
