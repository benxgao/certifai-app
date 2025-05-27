import React from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
  showSpinner?: boolean; // Added to control spinner visibility if needed
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  text = 'Loading...',
  showSpinner = true,
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {showSpinner && (
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
      )}
      {/* Alternative: Indeterminate Progress Bar */}
      {/* <Progress value={undefined} className="w-1/2 md:w-1/3 lg:w-1/4 mb-4" /> */}
      {text && <p className="text-lg text-foreground">{text}</p>}
    </div>
  );
};

export default PageLoader;
