/**
 * Enhanced notification component to provide better user feedback
 * when tokens are hidden or when transitioning between different UX states
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Info, Star } from 'lucide-react';

interface EnhancedNotificationProps {
  variant?: 'info' | 'success' | 'beta' | 'announcement';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const EnhancedNotification: React.FC<EnhancedNotificationProps> = ({
  variant = 'info',
  title,
  message,
  actionLabel,
  onAction,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const getIconAndStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor:
            'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          badgeColor:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100',
        };
      case 'beta':
        return {
          icon: Star,
          bgColor:
            'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
          borderColor: 'border-violet-200 dark:border-violet-800',
          iconColor: 'text-violet-600 dark:text-violet-400',
          badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-100',
        };
      case 'announcement':
        return {
          icon: Bell,
          bgColor:
            'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
        };
      default:
        return {
          icon: Info,
          bgColor:
            'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20',
          borderColor: 'border-slate-200 dark:border-slate-700',
          iconColor: 'text-slate-600 dark:text-slate-400',
          badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-100',
        };
    }
  };

  const { icon: IconComponent, bgColor, borderColor, iconColor, badgeColor } = getIconAndStyles();

  return (
    <Card
      className={`${bgColor} ${borderColor} shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
              {variant === 'beta' && (
                <Badge variant="secondary" className={`text-xs ${badgeColor}`}>
                  Beta
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {message}
            </p>

            <div className="flex items-center justify-between">
              {actionLabel && onAction && (
                <Button variant="outline" size="sm" onClick={onAction} className="text-xs">
                  {actionLabel}
                </Button>
              )}

              {dismissible && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedNotification;
