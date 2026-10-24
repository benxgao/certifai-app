'use client';

import * as React from 'react';

import { cn } from '@/src/lib/utils';
import { authCard, authHeading } from '@/src/config/auth-theme';

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Surface shared by every auth screen: a hairline-bordered card with one
 * layered shadow and a thin violet rule along the top edge.
 *
 * Header/body/footer padding lives in `authCard` so signin, signup and the
 * email-verification step keep identical rhythm.
 */
export const AuthCard = ({ children, className }: AuthCardProps) => (
  <div className={cn(authCard.shell, className)}>
    <div className={authCard.accentRule} aria-hidden="true" />
    {children}
  </div>
);

export interface AuthCardHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  /** Optional icon tile rendered above the eyebrow. */
  icon?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const AuthCardHeader = ({
  eyebrow,
  title,
  subtitle,
  icon,
  align = 'left',
  className,
}: AuthCardHeaderProps) => (
  <div
    className={cn(authCard.header, align === 'center' && 'text-center', className)}
  >
    {icon && <div className={cn('mb-4', align === 'center' && 'flex justify-center')}>{icon}</div>}
    {eyebrow && <p className={authHeading.eyebrow}>{eyebrow}</p>}
    <h1 className={authHeading.title}>{title}</h1>
    {subtitle && <p className={authHeading.subtitle}>{subtitle}</p>}
  </div>
);

AuthCard.displayName = 'AuthCard';

export default AuthCard;
