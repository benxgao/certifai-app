'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingSection } from '@/src/components/marketing';
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className={marketingTheme.copy.eyebrow}>How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
              From pick to diagnosis in four steps.
            </h2>
          </div>
          <Link
            href="/certifications"
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
              marketingTheme.focusRing,
            )}
          >
            Start with a certification
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-12 right-0 top-[18px] hidden h-px bg-linear-to-r from-slate-200 to-transparent lg:block dark:from-slate-700"
                />
              )}
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/80 bg-white text-sm font-semibold text-violet-700 shadow-[0_4px_12px_-6px_rgba(109,40,217,0.45)] dark:border-violet-400/25 dark:bg-slate-900 dark:text-violet-300">
                {index + 1}
              </div>
              <h3 className="mt-5 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </MarketingSection>
    </div>
  );
}
