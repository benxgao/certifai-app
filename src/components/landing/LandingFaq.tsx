'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

/**
 * Questions and answers mirror src/lib/schemas/expandedFaqSchema.ts exactly,
 * so the visible FAQ stays consistent with the FAQPage structured data.
 */
const faqs = [
  {
    value: 'what-is-certestic',
    question: 'What is Certestic?',
    answer:
      'Certestic is an AI-powered IT certification training platform that helps professionals prepare for and pass AWS, Azure, Google Cloud, CompTIA, Cisco, and 100+ other IT certifications. Using adaptive learning technology, the platform creates personalized study plans and generates realistic practice exams tailored to your knowledge gaps.',
  },
  {
    value: 'free',
    question: 'Is Certestic free to use?',
    answer:
      'Yes! Certestic is currently in beta and offers free unlimited access to all platform features. You get 300 free credit coins upon signup to create custom AI-generated practice exams. No credit card required to access the platform.',
  },
  {
    value: 'custom-topics',
    question: 'Can I create custom exams for specific topics?',
    answer:
      'Yes! You can tell the AI to generate exams focused on specific topics, concepts, services, or technologies. Specify your learning goals (e.g., "AWS EC2 and Lambda" or "Azure networking"), and the AI creates targeted practice questions to test mastery in those specific areas.',
  },
  {
    value: 'weak-areas',
    question: "Does Certestic tell me what I'm weak in?",
    answer:
      'Absolutely. Certestic provides detailed analytics showing your performance across different topics and certification domains. The platform identifies your knowledge gaps, shows areas where you need improvement, and recommends focused study paths to strengthen weak areas.',
  },
  {
    value: 'exam-simulation',
    question: 'Can I simulate actual certification exams?',
    answer:
      'Yes! Certestic offers full-length practice exams that simulate the format, timing, and difficulty of actual certification tests. You can take timed exams under realistic test conditions to assess your readiness and build exam confidence.',
  },
  {
    value: 'how-ai',
    question: 'How does Certestic use AI to improve certification training?',
    answer:
      'Certestic uses AI to analyze your strengths and weaknesses across certification domains. The platform generates adaptive practice questions, identifies knowledge gaps, creates personalized study paths, and simulates realistic exam conditions. Our machine learning algorithms continuously improve question relevance based on your performance and feedback.',
  },
];

export default function LandingFaq() {
  return (
    <div id="faq" className="scroll-mt-24">
      <MarketingSection className="relative border-t border-slate-200/60 dark:border-slate-800">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-md">
            <p className={marketingTheme.copy.eyebrow}>FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
              The questions people actually ask.
            </h2>
            <p className={cn(marketingTheme.copy.body, 'mt-4')}>
              Anything else, send it over — real replies from the people building it.
            </p>
            <Link
              href="/contact"
              className={cn(
                'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
                marketingTheme.focusRing,
              )}
            >
              Talk to us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                className="rounded-2xl border-slate-200/70 bg-white/70 shadow-none backdrop-blur-sm transition-colors hover:border-violet-300/70 hover:shadow-none dark:border-slate-700/60 dark:bg-slate-900/40 dark:hover:border-violet-500/40"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:no-underline dark:text-slate-100 sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </MarketingSection>
    </div>
  );
}
