import React from 'react';
import { cn } from '@/src/lib/utils';

/**
 * Shared, purely presentational primitives for the homepage product previews.
 * These are decorative: every preview is wrapped in `aria-hidden` by its parent,
 * so nothing here should carry information that is not also in the copy.
 */

interface PreviewWindowProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function PreviewWindow({ label, children, className, bodyClassName }: PreviewWindowProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] dark:border-slate-700/70 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-slate-200/70 px-4 py-2.5 dark:border-slate-700/60">
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        {label && (
          <span className="ml-2 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {label}
          </span>
        )}
      </div>
      <div className={cn('p-4 sm:p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

interface ScoreRingProps {
  value: number;
  label: string;
  size?: number;
  id: string;
}

export function ScoreRing({ value, label, size = 104, id }: ScoreRingProps) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#ring-${id})`}
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {value}%
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

interface TopicRowProps {
  label: string;
  value: number;
  tone?: 'strong' | 'mid' | 'weak';
}

const toneFill: Record<NonNullable<TopicRowProps['tone']>, string> = {
  strong: 'bg-violet-600 dark:bg-violet-500',
  mid: 'bg-violet-500 dark:bg-violet-400',
  weak: 'bg-violet-400 dark:bg-violet-300',
};

export function TopicRow({ label, value, tone = 'strong' }: TopicRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
        <div
          className={cn('h-full rounded-full', toneFill[tone])}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

interface SparklineProps {
  points: number[];
  id: string;
  className?: string;
}

export function Sparkline({ points, id, className }: SparklineProps) {
  const width = 260;
  const height = 64;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;

  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - min) / span) * (height - 10) - 5;
    return [x, y] as const;
  });

  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-16 w-full', className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spark-${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {coords.slice(-1).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#7c3aed" />
      ))}
    </svg>
  );
}

interface FauxButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'ghost';
}

/** Non-interactive button used inside previews. */
export function FauxButton({ children, className, variant = 'solid' }: FauxButtonProps) {
  return (
    <span
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold',
        variant === 'solid'
          ? 'bg-violet-600 text-white shadow-[0_8px_20px_-10px_rgba(109,40,217,0.8)]'
          : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
