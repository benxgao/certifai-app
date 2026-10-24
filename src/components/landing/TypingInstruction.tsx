'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MousePointer2, Wand2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { marketingTheme } from '@/src/config/marketing-theme';

/**
 * Decorative "live typing" instruction field for the homepage hero preview.
 *
 * Cycles a small set of example instructions through a realistic input rhythm:
 * pointer glides in -> field focuses -> characters are typed one by one ->
 * pause -> text is cleared -> next phrase. Timers are all cleared on unmount,
 * and the whole animation collapses to static text for users who prefer
 * reduced motion.
 */

const TYPE_DELAY_MIN = 26;
const TYPE_DELAY_JITTER = 46;
const DELETE_DELAY = 14;
const HOLD_DELAY = 2600;
const POINTER_DELAY = 820;
const NEXT_PHRASE_DELAY = 380;

type Phase = 'pointer' | 'typing' | 'hold' | 'clear';

interface TypingInstructionProps {
  /** Instructions cycled through by the animation. */
  phrases: string[];
  /** Small eyebrow label above the field. */
  label?: string;
  className?: string;
}

export function TypingInstruction({
  phrases,
  label = 'Your instruction',
  className,
}: TypingInstructionProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('pointer');
  const fieldRef = useRef<HTMLDivElement>(null);

  const phrase = phrases[phraseIndex] ?? '';
  const typed = reducedMotion ? phrase : phrase.slice(0, charCount);
  // The field only looks "focused" while the pointer is in and characters are landing.
  const isFocused = !reducedMotion && (phase === 'pointer' || phase === 'typing');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Pause the loop while the hero preview is scrolled out of view.
  useEffect(() => {
    const node = fieldRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;

    if (phase === 'pointer') {
      const timer = setTimeout(() => setPhase('typing'), POINTER_DELAY);
      return () => clearTimeout(timer);
    }

    if (phase === 'typing') {
      if (charCount < phrase.length) {
        const timer = setTimeout(
          () => setCharCount((count) => count + 1),
          TYPE_DELAY_MIN + Math.random() * TYPE_DELAY_JITTER,
        );
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase('hold'), 120);
      return () => clearTimeout(timer);
    }

    if (phase === 'hold') {
      const timer = setTimeout(() => setPhase('clear'), HOLD_DELAY);
      return () => clearTimeout(timer);
    }

    if (charCount > 0) {
      const timer = setTimeout(() => setCharCount((count) => count - 1), DELETE_DELAY);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setPhraseIndex((index) => (index + 1) % phrases.length);
      setPhase('pointer');
    }, NEXT_PHRASE_DELAY);
    return () => clearTimeout(timer);
  }, [charCount, inView, phase, phrase, phrases.length, reducedMotion]);

  return (
    <div
      ref={fieldRef}
      className={cn(
        'relative transition-[background-color,border-color] duration-500',
        marketingTheme.surface.inset,
        'px-3 py-2.5',
        isFocused &&
          'border-violet-300/80 bg-violet-50/50 dark:border-violet-400/30 dark:bg-violet-500/5',
        className,
      )}
    >
      <p className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Wand2 className="h-3 w-3" aria-hidden="true" />
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'text-[9px] font-medium normal-case tracking-normal text-violet-600 transition-opacity duration-300 dark:text-violet-300',
            phase === 'typing' && !reducedMotion ? 'opacity-100' : 'opacity-0',
          )}
        >
          typing…
        </span>
      </p>

      <p className="mt-1 flex min-h-[2.5rem] items-start text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">
          &ldquo;
        </span>
        <span className="relative min-w-0">
          {typed}
          {isFocused && (
            <span
              aria-hidden="true"
              className="instruction-caret ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.16em] rounded-full bg-violet-500 align-baseline dark:bg-violet-400"
            />
          )}
          {/* Simulated pointer that glides in and "clicks" before typing starts.
              Sits outside the caret so the caret's blink does not fade it out. */}
          {phase === 'pointer' && !reducedMotion && (
            <span
              aria-hidden="true"
              className="instruction-pointer pointer-events-none absolute left-0 top-[0.1em] block h-4 w-4"
            >
              <MousePointer2
                className="h-4 w-4 fill-slate-900 stroke-white dark:fill-slate-100 dark:stroke-slate-900"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
          )}
        </span>
        <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">
          &rdquo;
        </span>
      </p>
    </div>
  );
}

export default TypingInstruction;
