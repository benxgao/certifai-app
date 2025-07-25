import React from 'react';
import { cn } from '@/src/lib/utils';

interface ExamGenerationProgressBarProps {
  progress: number; // 0-100
  estimatedTimeRemaining?: number; // in milliseconds
  className?: string;
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  isAnimated?: boolean;
  variant?: 'default' | 'compact'; // Add variant prop
  realProgress?: {
    currentBatch: number;
    totalBatches: number;
    questionsGenerated: number;
    targetQuestions?: number;
  };
}

export function ExamGenerationProgressBar({
  progress,
  estimatedTimeRemaining,
  className,
  showPercentage = true,
  showTimeRemaining = true,
  isAnimated = true,
  variant = 'default',
  realProgress,
}: ExamGenerationProgressBarProps) {
  const formatTimeRemaining = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress info row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium">
          {variant === 'compact' ? 'Generating...' : 'Generating Questions'}
        </span>
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          {showPercentage && <span className="font-medium">{Math.round(progress)}%</span>}
          {showTimeRemaining &&
            estimatedTimeRemaining &&
            estimatedTimeRemaining > 0 &&
            variant !== 'compact' && (
              <span className="text-xs">• {formatTimeRemaining(estimatedTimeRemaining)} left</span>
            )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div
          className={cn(
            'w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden',
            variant === 'compact' ? 'h-1.5' : 'h-2',
          )}
        >
          <div
            className={cn(
              'h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500 ease-out',
              isAnimated && 'transform-gpu',
            )}
            style={{
              width: `${Math.max(5, Math.min(100, progress))}%`,
              transition: isAnimated ? 'width 0.5s ease-out' : 'none',
            }}
          >
            {/* Animated shimmer effect */}
            {isAnimated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
        </div>

        {/* Pulse effect for very early stages */}
        {progress < 10 && isAnimated && (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400/30 to-blue-400/30 rounded-full animate-pulse" />
        )}
      </div>

      {/* Status indicator - hide for compact variant */}
      {variant !== 'compact' && (
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex space-x-1">
            <div
              className="w-1 h-1 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-1 h-1 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-1 h-1 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <span>
            {realProgress
              ? // Show batch-based progress when real data is available
                `Processing batch ${realProgress.currentBatch}/${realProgress.totalBatches}${
                  realProgress.questionsGenerated > 0
                    ? ` (${realProgress.questionsGenerated}${
                        realProgress.targetQuestions ? `/${realProgress.targetQuestions}` : ''
                      } questions)`
                    : ''
                }`
              : // Fall back to time-based status messages
              progress < 20
              ? 'Initializing AI generation...'
              : progress < 60
              ? 'Creating questions...'
              : progress < 90
              ? 'Finalizing exam...'
              : 'Almost complete...'}
          </span>
        </div>
      )}
    </div>
  );
}

// Enhanced shimmer animation styles (add to globals.css)
export const progressBarStyles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;
