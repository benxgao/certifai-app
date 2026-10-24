'use client';

import React, { memo } from 'react';
import { Check, Sparkles } from 'lucide-react';

import { Chip } from '@/src/components/marketing';
import { PreviewWindow, TopicRow } from '@/src/components/marketing/visuals';
import { authAside } from '@/src/config/auth-theme';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

/**
 * Decorative product preview shown under the auth aside copy.
 *
 * Built from the homepage's preview primitives (`PreviewWindow`, `TopicRow`,
 * `Chip`) so the left column of `/signin` and `/signup` carries the same
 * product-preview DNA as `/`. Nothing here is interactive or meaningful on its
 * own: the whole block is `aria-hidden`, and every claim it illustrates is
 * already stated in the copy above it.
 *
 * Deliberately button-free: a faux CTA inside a preview reads as a real control
 * and invites clicks that go nowhere. Previews show state, the page owns the
 * actions.
 *
 * - `signup` → the generation moment ("exam studio"), which is what the new
 *   account unlocks first.
 * - `signin` → the last report, which is what the returning user is resuming.
 */

interface AuthAsidePreviewProps {
  mode: 'signin' | 'signup';
}

/** 4px progress rail used by the exam-studio preview (matches the homepage bars). */
const Progress = ({ value }: { value: number }) => (
  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
    <div
      className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

const ExamStudioPreview = () => (
  <PreviewWindow label="Exam studio" className="relative">
    <div className="space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={authAside.microLabel}>Certification</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            AWS Solutions Architect — Associate
          </p>
        </div>
        <Chip variant="neutral" className="shrink-0">
          SAA-C03
        </Chip>
      </div>

      <div className={cn(marketingTheme.surface.inset, 'px-3 py-2.5')}>
        <div className="flex items-center justify-between gap-3">
          <p className={cn(authAside.microLabel, 'flex items-center gap-1.5')}>
            <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-300" aria-hidden="true" />
            Writing questions
          </p>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-violet-600 dark:text-violet-300">
            28 / 40
          </span>
        </div>
        <div className="mt-2">
          <Progress value={70} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['IAM', 'VPC', 'S3', 'Cost control'].map((topic) => (
          <Chip key={topic} variant="accent">
            <Check className="h-3 w-3" aria-hidden="true" />
            {topic}
          </Chip>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-violet-200/70 bg-white p-3 dark:border-violet-400/20 dark:bg-slate-950/50">
        <span
          aria-hidden="true"
          className="absolute inset-y-3 left-0 w-[2px] rounded-r-full bg-linear-to-b from-violet-500 to-indigo-500"
        />
        <p className="pl-2.5 text-[11px] font-medium leading-relaxed text-slate-800 dark:text-slate-200">
          A company needs to enforce guardrails on 40 AWS accounts at once. Which combination meets
          the requirement?
        </p>
        <p className="mt-1.5 pl-2.5 text-[10px] text-slate-500 dark:text-slate-400">
          Mapped to task statement 2.4
        </p>
      </div>
    </div>
  </PreviewWindow>
);

const ReportPreview = () => (
  <PreviewWindow label="Exam report" className="relative">
    <div className="space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={authAside.microLabel}>SAA-C03 · Exam #6</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            Solutions Architect — Associate
          </p>
        </div>
        <Chip variant="accent" className="shrink-0">
          82% overall
        </Chip>
      </div>

      <div className="space-y-2.5">
        <TopicRow label="Identity & access" value={94} tone="strong" />
        <TopicRow label="Networking" value={86} tone="mid" />
        <TopicRow label="Cost management" value={64} tone="weak" />
      </div>

      <div className="rounded-xl border border-violet-200/70 bg-violet-50/70 p-2.5 dark:border-violet-400/20 dark:bg-violet-500/10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
          AI takeaway
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
          Cost management is costing you 6 points. Next: a focused 20-question set.
        </p>
      </div>
    </div>
  </PreviewWindow>
);

const AuthAsidePreview: React.FC<AuthAsidePreviewProps> = memo(({ mode }) => (
  <div className={authAside.preview} aria-hidden="true">
    <div className={authAside.previewGlow} />
    {mode === 'signup' ? <ExamStudioPreview /> : <ReportPreview />}
  </div>
));

AuthAsidePreview.displayName = 'AuthAsidePreview';

export default AuthAsidePreview;
