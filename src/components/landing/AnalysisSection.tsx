'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';
import { FauxButton, PreviewWindow, ScoreRing, TopicRow } from './visuals';

const reportPoints = [
  'Topic-level accuracy for every domain in the exam',
  'Strengths and gaps written in plain language',
  'Trend across your last exams, not a single snapshot',
  'A recommended next scope you can generate in one click',
];

export default function AnalysisSection() {
  return (
    <div id="analysis" className="scroll-mt-24">
      <MarketingSection className="relative overflow-hidden border-y border-slate-200/60 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-200/25 blur-3xl dark:bg-violet-700/10"
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className={marketingTheme.copy.eyebrow}>After the exam</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
              A report that tells you what to do next.
            </h2>
            <p className={cn(marketingTheme.copy.body, 'mt-4')}>
              Not a score — a diagnosis. Every exam ends with an AI-written report: the topics that
              held up, the domains quietly costing you points, and one concrete next step.
            </p>

            <ul className="mt-8 space-y-3.5">
              {reportPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3 rounded-2xl border border-violet-200/70 bg-violet-50/70 p-4 dark:border-violet-400/20 dark:bg-violet-500/10">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Two reports unlock your{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  AI Learning Journey
                </span>{' '}
                — a cross-exam mastery summary for each certification.
              </p>
            </div>

            <Link
              href="/signup"
              className={cn(
                'mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
                marketingTheme.focusRing,
              )}
            >
              Generate an exam and see your own report
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Report preview */}
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-tr from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />
            <PreviewWindow label="Exam report" className="relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      SAA-C03 · Exam #6
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Solutions Architect — Associate
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>
                        Improving
                      </span>
                      <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                        40 questions
                      </span>
                    </div>
                  </div>
                  <ScoreRing value={82} label="score" id="report" size={92} />
                </div>

                <div className="space-y-2.5">
                  <TopicRow label="Identity & access" value={94} tone="strong" />
                  <TopicRow label="Networking" value={86} tone="mid" />
                  <TopicRow label="Storage" value={78} tone="mid" />
                  <TopicRow label="Cost management" value={64} tone="weak" />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700/60 dark:bg-slate-950/40">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Strongest
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      IAM policy design
                    </p>
                  </div>
                  <div className="rounded-xl border border-violet-200/80 bg-violet-50/80 p-3 dark:border-violet-400/20 dark:bg-violet-500/10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                      Next focus
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      Cost allocation &amp; budgets
                    </p>
                  </div>
                </div>

                <div className={`${marketingTheme.surface.inset} p-3`}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    AI summary
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    You read governance questions accurately but default to single-account answers.
                    Drill cost allocation before your next full-length attempt.
                  </p>
                </div>

                <FauxButton>
                  Generate follow-up exam
                  <ArrowRight className="h-3.5 w-3.5" />
                </FauxButton>
              </div>
            </PreviewWindow>
          </div>
        </div>
      </MarketingSection>
    </div>
  );
}
