import React from 'react';
import PageLoader from '@/src/components/custom/PageLoader';

export default function MainLoading() {
  return (
    <PageLoader
      isLoading={true}
      text="Loading your dashboard..."
      showSpinner={true}
      variant="auth"
      fullScreen={true}
      showBrand={false}
    />
  );
}
