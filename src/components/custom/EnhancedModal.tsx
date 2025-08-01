'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/src/lib/utils';

interface EnhancedModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;

  // Header configuration
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconClassName?: string;

  // Content and styling
  content: React.ReactNode;
  footer?: React.ReactNode;

  // Modal styling variants
  variant?: 'default' | 'destructive';
  maxWidth?: string;

  // Optional decorative elements
  decorativeElements?: React.ReactNode;
}

export function EnhancedModal({
  isOpen,
  onOpenChange,
  children,
  icon,
  title,
  subtitle,
  iconClassName,
  content,
  footer,
  variant = 'default',
  maxWidth = 'sm:max-w-[500px]',
  decorativeElements,
}: EnhancedModalProps) {
  // Define variant-specific styling
  const variantStyles = {
    default: {
      container:
        'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl',
      iconBg: 'bg-gradient-to-r from-violet-600 to-blue-600',
      iconText: 'text-white',
    },
    destructive: {
      container:
        'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-red-500/10 dark:shadow-red-400/10',
      iconBg:
        'bg-gradient-to-br from-red-100/80 to-orange-100/60 dark:from-red-900/60 dark:to-orange-900/40',
      iconText: 'text-red-600 dark:text-red-400',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className={cn(maxWidth, styles.container)}>
        {/* Decorative elements for enhanced visual appeal */}
        {decorativeElements}

        <div className="relative z-10">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  'flex items-center justify-center rounded-xl shadow-lg',
                  variant === 'default' ? 'h-10 w-10' : 'w-12 h-12',
                  styles.iconBg,
                  iconClassName,
                )}
              >
                <div className={styles.iconText}>{icon}</div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {title}
                </DialogTitle>
                {subtitle && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Modal content */}
          <div className="space-y-6 py-2">{content}</div>

          {/* Footer */}
          {footer && (
            <DialogFooter className="pt-6 flex flex-col sm:flex-row gap-3">{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
