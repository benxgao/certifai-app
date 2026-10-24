'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Timer } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { marketingTheme } from '@/src/config/marketing-theme';
import { PreviewWindow } from '@/src/components/marketing/visuals';
import { TypingInstruction } from '@/src/components/landing/TypingInstruction';

const trustPoints = ['300 free credits on signup', 'No credit card required', '100+ certification tracks'];

/**
 * Example instructions cycled by the hero's simulated-typing field.
 * Kept under ~100 characters so the preview never grows past two lines.
 */
const instructionExamples = [
  'Focus on multi-account governance and real-world trade-offs.',
  "Skip the billing basics — I've sat through those twice already.",
  'Make it harder than the real exam: longer scenario stems.',
  'Weight it toward S3 encryption and cost-control edge cases.',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-20">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-600/15" />
        <div className="absolute -left-32 top-24 h-[22rem] w-[22rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/15" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
          {/* Copy */}
          <div className="max-w-2xl">
            <div className={marketingTheme.badge.default}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>AI-generated practice exams</span>
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-[3.35rem]">
              Practice exams, generated for{' '}
              <span className={marketingTheme.copy.gradient}>exactly what you&apos;re studying.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
              Pick a certification, describe the scope in your own words, and AI writes a fresh
              exam in minutes. Sit it under real test conditions, then get a topic-by-topic read on
              what&apos;s solid and what needs another pass.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-12 w-full gap-2 px-7 py-0 sm:w-auto`}
              >
                <Link href="/signup">
                  Generate your first exam
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={`${marketingTheme.button.secondary} ${marketingTheme.focusRing} h-12 w-full px-7 py-0 sm:w-auto`}
              >
                <Link href="#analysis">See the analysis</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview */}
          <div className="relative lg:pl-2" aria-hidden="true">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />

            <PreviewWindow label="Exam studio" className="relative">
              <div className="space-y-4">
                {/* Certification */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Certification
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                      AWS Solutions Architect — Associate
                    </p>
                  </div>
                  <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral} shrink-0`}>
                    SAA-C03
                  </span>
                </div>

                {/* Size + time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${marketingTheme.surface.inset} px-3 py-2.5`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Questions
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-50">
                      40
                      <span className="ml-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        / 100 max
                      </span>
                    </p>
                  </div>
                  <div className={`${marketingTheme.surface.inset} px-3 py-2.5`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Sitting time
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-slate-50">
                      <Timer className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      130<span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">min</span>
                    </p>
                  </div>
                </div>

                {/* Custom instruction — animated as if the visitor is typing it */}
                <TypingInstruction phrases={instructionExamples} />

                {/* Topics covered by the instruction */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      In scope
                    </p>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      4 topics
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['IAM', 'VPC', 'S3', 'Cost control'].map((topic) => (
                      <span
                        key={topic}
                        className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}
                      >
                        <Check className="h-3 w-3" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-violet-500 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-600" />
                      </span>
                      Writing questions
                    </span>
                    <span className="tabular-nums">28 / 40</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                    <div className="h-full w-[70%] rounded-full bg-linear-to-r from-violet-500 to-indigo-500" />
                  </div>
                </div>

                {/* Generated sample */}
                <div className="border-t border-slate-200/70 pt-3 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Generated sample
                    </span>
                    <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>
                      <Sparkles className="h-3 w-3" />
                      Q.12
                    </span>
                  </div>

                  <div className="relative mt-2 overflow-hidden rounded-xl border border-violet-200/70 bg-white p-3 shadow-[0_10px_24px_-16px_rgba(109,40,217,0.5)] dark:border-violet-400/20 dark:bg-slate-950/50">
                    <span className="absolute inset-y-3 left-0 w-[2px] rounded-r-full bg-linear-to-b from-violet-500 to-indigo-500" />
                    <p className="pl-2.5 text-[11px] font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      A company needs to enforce guardrails on 40 AWS accounts at once. Which
                      combination meets the requirement?
                    </p>
                    <div className="mt-2 space-y-1.5 pl-2.5">
                      <div className="rounded-lg border border-violet-300/80 bg-violet-50/80 px-2.5 py-1.5 text-[11px] font-medium text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200">
                        Organizations + service control policies
                      </div>
                      <div className="rounded-lg border border-slate-200/80 px-2.5 py-1.5 text-[11px] text-slate-500 dark:border-slate-700/70 dark:text-slate-400">
                        IAM users in every account
                      </div>
                    </div>
                    <p className="mt-2 pl-2.5 text-[10px] text-slate-500 dark:text-slate-400">
                      Mapped to task statement 2.4 · multi-account governance
                    </p>
                  </div>
                </div>
              </div>
            </PreviewWindow>
          </div>
        </div>
      </div>
    </section>
  );
}
