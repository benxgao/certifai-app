'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertMessageProps {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable AlertMessage component for displaying status messages
 * Automatically determines variant based on message content if not specified
 */
export function AlertMessage({ message, variant, className, children }: AlertMessageProps) {
  // Auto-detect variant based on message content if not explicitly provided
  const getVariant = (): 'success' | 'destructive' | 'warning' | 'info' => {
    if (variant) {
      return variant === 'error' ? 'destructive' : variant;
    }

    // Auto-detection logic based on message content
    const successPatterns = [
      'created successfully',
      'sent!',
      'verified successfully',
      'reset successful',
      'signed out successfully',
    ];

    const warningPatterns = ['expired', 'pending'];

    const isSuccess = successPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern.toLowerCase()),
    );
    const isWarning = warningPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern.toLowerCase()),
    );

    if (isSuccess) return 'success';
    if (isWarning) return 'warning';
    return 'destructive'; // Default to error for unknown messages
  };

  const alertVariant = getVariant();

  // Get appropriate icon based on variant
  const getIcon = () => {
    switch (alertVariant) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Alert
      variant={alertVariant}
      className={cn('animate-in slide-in-from-top-2 duration-300', className)}
    >
      {getIcon()}
      <AlertDescription className="flex-1">
        {message}
        {children}
      </AlertDescription>
    </Alert>
  );
}
