'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type ActionButtonsVariant = 'success' | 'expired' | 'error';

interface ActionButtonsProps {
  variant: ActionButtonsVariant;
  onContinueToSignIn?: () => void;
  onRequestNewLink?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  variant,
  onContinueToSignIn,
  onRequestNewLink,
  onContactSupport,
  className,
}) => {
  const renderButtons = () => {
    switch (variant) {
      case 'success':
        return (
          <Button
            onClick={onContinueToSignIn}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
            size="lg"
          >
            Continue to Sign In
          </Button>
        );

      case 'expired':
        return (
          <Button
            onClick={onRequestNewLink}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
            size="lg"
          >
            Request New Link
          </Button>
        );

      case 'error':
        return (
          <div className="space-y-3">
            <Button
              onClick={onRequestNewLink}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              size="lg"
            >
              Get New Link
            </Button>
            <Button
              onClick={onContactSupport}
              variant="outline"
              className="w-full border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 rounded-xl"
              size="lg"
            >
              Contact Support
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={className}>{renderButtons()}</div>;
};
