'use client';

import { useRef, useEffect } from 'react';
import { useInitCertId } from '@/src/hooks/useInitCertId';

/**
 * Component to store the user's initially selected certification ID as a reference
 * This maintains the init_cert_id without rendering any UI
 */
export default function InitialCertificationCard() {
  const { initCertId } = useInitCertId();
  const initCertIdRef = useRef(initCertId);

  useEffect(() => {
    initCertIdRef.current = initCertId;
  }, [initCertId]);

  // No UI rendering - just storing the reference
  return null;
}
