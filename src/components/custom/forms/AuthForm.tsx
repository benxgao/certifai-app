'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  autoComplete?: 'on' | 'off';
}

export const AuthForm: React.FC<AuthFormProps> = ({
  children,
  onSubmit,
  className,
  autoComplete = 'on',
}) => {
  return (
    <form onSubmit={onSubmit} autoComplete={autoComplete} className={cn('space-y-6', className)}>
      {children}
    </form>
  );
};
