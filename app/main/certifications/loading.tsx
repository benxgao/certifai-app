import React from 'react';
import PageLoader from '@/src/components/custom/PageLoader';

export default function CertificationsLoading() {
  return (
    <PageLoader
      isLoading={true}
      text="Loading certifications..."
      showSpinner={true}
      variant="auth"
      fullScreen={true}
      showBrand={false}
    />
  );
}
