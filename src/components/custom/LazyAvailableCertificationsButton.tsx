'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAllAvailableCertifications } from '@/swr/certifications';

const LazyAvailableCertificationsButton = () => {
  const router = useRouter();
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();

  return (
    <Button
      variant="secondary"
      onClick={() => router.push('/main/certifications')}
      disabled={
        isLoadingAvailableCertifications ||
        (availableCertifications && availableCertifications.length === 0)
      }
    >
      {isLoadingAvailableCertifications ? 'Loading...' : 'Register for Certification'}
    </Button>
  );
};

export default LazyAvailableCertificationsButton;
