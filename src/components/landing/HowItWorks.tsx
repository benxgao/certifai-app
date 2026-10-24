'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingSection, SectionIntro, StepList } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

const steps = [
  {
    title: 'Pick a certification',
    body: 'Choose from 100+ tracks. Each one brings its own objectives, question range, and pass score.',
  },
  {
    title: 'Set the scope',
    body: 'Decide how many questions you want, which topics to focus on, and any instruction the generator should follow.',
  },
  {
    title: 'Generate and sit it',
    body: 'A fresh exam is written in minutes. Timed, navigable, and closed-book until you submit.',
  },
  {
    title: 'Read the diagnosis',
    body: 'Topic-by-topic accuracy, strengths, gaps, and the next scope worth generating.',
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="scroll-mt-24">
      <MarketingSection className="relative">
        <SectionIntro
          eyebrow="How it works"
          title="From pick to diagnosis in four steps."
          action={
            <Link
              href="/certifications"
              className={cn(marketingTheme.copy.link, marketingTheme.focusRing)}
            >
              Start with a certification
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <StepList steps={steps} />
      </MarketingSection>
    </div>
  );
}
