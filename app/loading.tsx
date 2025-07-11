import React from 'react';
import PageLoader from '@/src/components/custom/PageLoader';

export default function RootLoading() {
  return (
    <PageLoader
      isLoading={true}
      text="Preparing your experience..."
      showSpinner={true}
      variant="auth"
      fullScreen={true}
      showBrand={true}
    />
  );
}
