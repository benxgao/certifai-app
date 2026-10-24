'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { cn } from '@/src/lib/utils';

export interface FaqItem {
  /** Stable value, also usable as a deep-link anchor. */
  value: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * FaqAccordion renders the homepage FAQ treatment: single-open accordion,
 * soft white cards, violet hover border. Reused by pricing and contact so
 * every FAQ on the site reads the same.
 *
 * @param items - Questions/answers. Keep answers in sync with any FAQPage JSON-LD.
 * @param className - Optional additional classes
 */
export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, className = '' }) => (
  <Accordion type="single" collapsible className={cn('space-y-3', className)}>
    {items.map((item) => (
      <AccordionItem
        key={item.value}
        value={item.value}
        className="rounded-2xl border-slate-200/70 bg-white/70 shadow-none backdrop-blur-sm transition-colors hover:border-violet-300/70 hover:shadow-none dark:border-slate-700/60 dark:bg-slate-900/40 dark:hover:border-violet-500/40"
      >
        <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:no-underline dark:text-slate-100 sm:text-base">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FaqAccordion;
