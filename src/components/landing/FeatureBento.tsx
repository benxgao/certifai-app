'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Flag,
  Layers,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { FeaturePanel, FeaturePanelHeader, MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';
import { Sparkline, TopicRow } from '@/src/components/marketing/visuals';


const objectives = [
  { code: '1.2', label: 'Design secure access', value: 100 },
  { code: '2.4', label: 'Multi-account governance', value: 100 },
  { code: '3.1', label: 'Cost-optimized storage', value: 100 },
];

const providers = [
  'AWS',
  'Microsoft Azure',
  'Google Cloud',
  'Cisco',
  'CompTIA',
  'Kubernetes (CNCF)',
  'HashiCorp',
  'ISC2',
];

export default function FeatureBento() {
  return (
    <MarketingSection className="relative border-y border-slate-200/60 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="max-w-2xl">
        <p className={marketingTheme.copy.eyebrow}>The platform</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
          Built around one loop.
        </h2>
        <p className={cn(marketingTheme.copy.body, 'mt-4')}>
          Scope the topics, generate a fresh exam, sit it under real conditions, then let the
          report tell you what to do next.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6">
        {/* Generation */}
        <FeaturePanel className="md:order-1 md:col-span-2 lg:order-1 lg:col-span-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <FeaturePanelHeader
                icon={<Sparkles className="h-5 w-5" />}
                label="Generation"
                title="Written from the blueprint, not pulled from a dump."
                description="Each exam is generated against the certification's current objectives. Scenarios, wording, and answer options differ on every run, so you can't memorize your way through."
              />
            </div>

            <div className={cn(marketingTheme.surface.inset, 'p-4')} aria-hidden="true">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Run #024
                </span>
                <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                  SAA-C03
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {objectives.map((objective) => (
                  <div key={objective.code} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="mr-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {objective.code}
                      </span>
                      {objective.label}
                    </span>
                    <span className="shrink-0 text-[10px] font-medium text-violet-600 dark:text-violet-300">
                      covered
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-slate-200/70 pt-2.5 text-[10px] font-medium text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                40 questions mapped to 12 task statements
              </div>
            </div>
          </div>
        </FeaturePanel>

        {/* Topic scope */}
        <FeaturePanel className="md:order-2 lg:order-2 lg:col-span-2">
          <FeaturePanelHeader
            icon={<Target className="h-5 w-5" />}
            label="Scope"
            title="Tell it what to include — and what to skip."
            description="Set the question count, then narrow the scope in plain English. Only the topics you name get written."
            variant="soft"
          />
          <div className={cn(marketingTheme.surface.inset, 'mt-5 space-y-3 p-4')} aria-hidden="true">
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Azure networking, NSGs and private endpoints. Skip identity.
              <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-violet-500 motion-safe:animate-pulse" />
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>
                Networking
              </span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>NSG</span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral} line-through`}>
                Identity
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <span>Scope</span>
                <span>3 domains selected</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                <div className="h-full w-[22%] rounded-full bg-violet-500" />
              </div>
            </div>
          </div>
        </FeaturePanel>

        {/* Analysis */}
        <FeaturePanel className="md:order-4 md:col-span-2 lg:order-3 lg:col-span-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <FeaturePanelHeader
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analysis"
                title="Scores are the least interesting part."
                description="Every answer is mapped to a topic. You see exactly where the points went missing, in plain language, with the next exam already suggested."
                variant="soft"
              />
            </div>

            <div className={cn(marketingTheme.surface.inset, 'p-4')} aria-hidden="true">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Exam report
                </span>
                <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>
                  82% overall
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <TopicRow label="Identity & access" value={94} tone="strong" />
                <TopicRow label="Networking" value={86} tone="mid" />
                <TopicRow label="Cost management" value={64} tone="weak" />
              </div>
              <div className="mt-3 rounded-xl border border-violet-200/70 bg-violet-50/70 p-2.5 dark:border-violet-400/20 dark:bg-violet-500/10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                  AI takeaway
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                  Cost management is costing you 6 points. Generate a focused 20-question set.
                </p>
              </div>
            </div>
          </div>
        </FeaturePanel>

        {/* Exam conditions */}
        <FeaturePanel className="md:order-3 lg:order-4 lg:col-span-2">
          <FeaturePanelHeader
            icon={<Timer className="h-5 w-5" />}
            label="Exam conditions"
            title="Sit it like the real thing."
            description="A countdown, a question navigator, flags for review, and no feedback until you submit."
            variant="soft"
          />
          <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                01:24:08
              </span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                <Timer className="h-3 w-3" />
                Timed
              </span>
            </div>
            <div className="mt-3 grid grid-cols-8 gap-1.5">
              {Array.from({ length: 24 }).map((_, index) => {
                const answered = index < 18;
                const flagged = index === 5 || index === 14;
                const current = index === 18;
                return (
                  <span
                    key={index}
                    className={cn(
                      'flex h-4 w-full items-center justify-center rounded-[3px] text-[8px] font-semibold',
                      answered && 'bg-violet-200/90 text-violet-800 dark:bg-violet-500/30 dark:text-violet-200',
                      !answered && 'border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
                      flagged && 'ring-1 ring-violet-500 text-violet-700 dark:text-violet-300',
                      current && 'border-violet-500 bg-white text-violet-700 dark:bg-slate-900 dark:text-violet-300',
                    )}
                  >
                    {flagged ? <Flag className="h-2 w-2" /> : index + 1}
                  </span>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <span>18 answered</span>
              <span>2 flagged</span>
              <span>20 left</span>
            </div>
          </div>
        </FeaturePanel>

        {/* Catalog */}
        <FeaturePanel className="md:order-5 lg:order-5 lg:col-span-3">
          <FeaturePanelHeader
            icon={<Layers className="h-5 w-5" />}
            label="Catalog"
            title="100+ certifications, one workflow."
            description="Cloud, networking, security, containers, infrastructure as code — each track carries its own objective set."
          />
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2" aria-hidden="true">
            {providers.map((provider) => (
              <span
                key={provider}
                className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300"
              >
                <span className="h-1 w-1 rounded-full bg-violet-500" />
                {provider}
              </span>
            ))}
          </div>
          <Link
            href="/certifications"
            className={cn(
              'mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
              marketingTheme.focusRing,
            )}
          >
            Browse the catalog
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </FeaturePanel>

        {/* Progress */}
        <FeaturePanel className="md:order-6 lg:order-6 lg:col-span-3">
          <FeaturePanelHeader
            icon={<TrendingUp className="h-5 w-5" />}
            label="Progress"
            title="Two exams in, the bigger picture appears."
            description="Your AI Learning Journey rolls every report into one view: mastery by domain, performance trend, strengths, and the gaps still holding the score down."
            variant="soft"
          />
          <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Average score
              </p>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.accent}`}>
                <TrendingUp className="h-3 w-3" />
                Improving
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              78%
              <span className="ml-2 align-middle text-[11px] font-semibold text-violet-600 dark:text-violet-300">
                +11 pts across 6 exams
              </span>
            </p>
            <Sparkline points={[52, 58, 55, 64, 67, 66, 74, 78]} id="bento" className="mt-1" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                Expert 2
              </span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                Proficient 5
              </span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                Developing 3
              </span>
            </div>
          </div>
        </FeaturePanel>
      </div>
    </MarketingSection>
  );
}
