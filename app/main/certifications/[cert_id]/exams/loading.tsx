import React from 'react';
import PageLoader from '@/src/components/custom/PageLoader';

export default function ExamsLoading() {
  return (
    <PageLoader
      isLoading={true}
      text="Preparing your exam..."
      showSpinner={true}
      variant="default"
      fullScreen={true}
      showBrand={false}
    />
  );
}
