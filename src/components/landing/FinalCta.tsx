'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';

const stats = [
  { value: '100+', label: 'certifications' },
  { value: '300', label: 'free credits on signup' },
  { value: '0', label: 'credit card required' },
];

export default function FinalCta() {
  return (
    <MarketingSection>
      <div className={marketingTheme.ctaPanel}>
        {/* Decorative layers */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_72%)]" />
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
        </div>

        <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Free beta
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Your next exam is one prompt away.
            </h2>
            <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/80 sm:text-lg">
              Pick the track, describe the scope, and let the generator do the rest. Sit it, then
              read the report before your next attempt.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className={`h-12 w-full gap-2 rounded-lg bg-white px-8 py-0 text-base font-semibold text-violet-700 shadow-sm transition-colors hover:bg-violet-50 sm:w-auto ${marketingTheme.focusRing}`}
              >
                <Link href="/signup">
                  Start free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className={`h-12 w-full rounded-lg border-2 border-white/40 bg-white/10 px-8 py-0 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto ${marketingTheme.focusRing}`}
              >
                <Link href="/pricing">See what&apos;s included</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 lg:grid-cols-1 lg:gap-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {stats.map((stat) => (
              <div key={stat.label} className="lg:py-3">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tracking-tight sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-white/70 sm:text-xs">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </MarketingSection>
  );
}
