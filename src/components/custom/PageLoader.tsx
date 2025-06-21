import React from 'react';

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
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center min-h-[60vh] w-full';

  return (
    <div className={containerClasses}>
      <div className="loading-fade-in">
        {showSpinner && (
          <div className="loading-spinner rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mb-4"></div>
        )}
        {/* Alternative: Indeterminate Progress Bar */}
        {/* <Progress value={undefined} className="w-1/2 md:w-1/3 lg:w-1/4 mb-4" /> */}
        {text && <p className="text-lg text-foreground text-center max-w-md">{text}</p>}
      </div>
    </div>
  );
};

export default PageLoader;
