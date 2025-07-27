'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './ActionButton';
import { FaClipboardList } from 'react-icons/fa';

/**
 * A simple button that navigates to certifications without fetching data.
 * Ideal for dashboard usage where we don't need to validate availability.
 */
const SimpleCertificationsButton = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const router = useRouter();

  return (
    <ActionButton
      onClick={() => router.push('/main/certifications')}
      variant="secondary"
      size="lg"
      icon={<FaClipboardList className="w-4 h-4" />}
      className="w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base"
      fullWidth={fullWidth}
    >
      Register for Certification
    </ActionButton>
  );
};

export default SimpleCertificationsButton;
