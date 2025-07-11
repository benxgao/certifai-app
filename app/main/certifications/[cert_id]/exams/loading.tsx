import React from 'react';
import PageLoader from '@/src/components/custom/PageLoader';

export default function ExamsLoading() {
  return (
    <PageLoader
      isLoading={true}
      text="Loading exams..."
      showSpinner={true}
      variant="auth"
      fullScreen={true}
      showBrand={false}
    />
  );
}
