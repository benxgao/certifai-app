'use client';

import { useState, useEffect } from 'react';
import { hasAnalyticsConsent } from '@/src/lib/consent';
import GoogleAnalytics from './GoogleAnalytics';

interface ConsentAwareAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

/**
 * Renders GoogleAnalytics only when the user has accepted cookie consent.
 * Listens for the `certestic:consent-updated` DOM event so it reacts
 * immediately when the ConsentBanner accept button is clicked.
 */
export default function ConsentAwareAnalytics({ GA_MEASUREMENT_ID }: ConsentAwareAnalyticsProps) {
  const [gaEnabled, setGaEnabled] = useState(false);

  useEffect(() => {
    // Check saved consent on mount
    setGaEnabled(hasAnalyticsConsent());

    const handleConsentUpdate = () => {
      setGaEnabled(hasAnalyticsConsent());
    };

    window.addEventListener('certestic:consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('certestic:consent-updated', handleConsentUpdate);
  }, []);

  if (!gaEnabled) return null;
  return <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />;
}
