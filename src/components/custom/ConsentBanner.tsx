'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { getConsent, setConsent } from '@/src/lib/consent';

interface ConsentBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only when no consent has been recorded yet
    if (getConsent() === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    window.dispatchEvent(new Event('certestic:consent-updated'));
    setVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setConsent('declined');
    window.dispatchEvent(new Event('certestic:consent-updated'));
    setVisible(false);
    onDecline?.();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 shadow-lg"
    >
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          We use Google Analytics to understand how visitors use our site. No personal data is sold
          or shared with third parties.{' '}
          <Link
            href="/privacy"
            className="underline text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
