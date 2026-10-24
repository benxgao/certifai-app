'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { CtaPanel, MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';

const stats = [
  { value: '100+', label: 'certifications' },
  { value: '300', label: 'free credits on signup' },
  { value: '0', label: 'credit card required' },
];

export default function FinalCta() {
  return (
    <MarketingSection>
      <CtaPanel
        eyebrow="Free beta"
        title="Your next exam is one prompt away."
        body="Pick the track, describe the scope, and let the generator do the rest. Sit it, then read the report before your next attempt."
        stats={stats}
        actions={
          <>
            <Button
              asChild
              size="lg"
              className={`${marketingTheme.button.onDark} ${marketingTheme.focusRing}`}
            >
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className={`${marketingTheme.button.onDarkOutline} ${marketingTheme.focusRing}`}
            >
              <Link href="/pricing">See what&apos;s included</Link>
            </Button>
          </>
        }
      />
    </MarketingSection>
  );
}
