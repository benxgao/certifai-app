import React, { Suspense } from 'react';
import PageLoader from '@/components/custom/PageLoader';

export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <PageLoader
          isLoading={true}
          text="Preparing your workspace..."
          showSpinner={true}
          variant="default"
          fullScreen={true}
          showBrand={true}
        />
      }
    >
      {children}
    </Suspense>
  );
}
