import React from 'react';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
  showSpinner?: boolean;
  fullScreen?: boolean; // Added to control whether to show full screen overlay
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  text = 'Loading...',
  showSpinner = true,
  fullScreen = true,
}) => {
  if (!isLoading) {
    return null;
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md'
    : 'flex flex-col items-center justify-center min-h-[60vh] w-full';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-6 p-8 rounded-lg bg-background/50 border border-border/50 shadow-2xl backdrop-blur-sm">
        {showSpinner && <LoadingSpinner size="xl" variant="primary" className="drop-shadow-lg" />}
        <div className="text-center space-y-2">
          {text && <p className="text-lg font-medium text-foreground">{text}</p>}
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
