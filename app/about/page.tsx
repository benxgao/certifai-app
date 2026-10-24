import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Brain, Heart, Mail, Rocket, Target, Users } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { Button } from '@/src/components/ui/button';
import {
  Chip,
  CtaPanel,
  FeaturePanel,
  FeaturePanelHeader,
  IconTile,
  MarketingPageShell,
  MarketingSection,
  PageHero,
  SectionIntro,
} from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

const principles = [
  {
    icon: <Brain className="h-5 w-5" />,
    label: 'Principle 01',
    title: 'It has to actually work.',
    description:
      'The platform adapts to how you answer rather than to a fixed syllabus order. Every report changes what the next exam contains.',
  },
  {
    icon: <Target className="h-5 w-5" />,
    label: 'Principle 02',
    title: 'It has to save you time.',
    description:
      'One focused 20-question sitting on your weakest topic beats a fourth full-length run through everything you already know.',
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: 'Principle 03',
    title: 'It has to be built with feedback.',
    description:
      'Beta users report what is broken and what is missing. Those reports decide the roadmap — not a feature list written in advance.',
  },
];

const patterns = [
  {
    number: '01',
    title: 'The same questions, on repeat',
    body: 'Unlimited practice feels productive, but re-drilling familiar items mostly rehearses what you can already do.',
  },
  {
    number: '02',
    title: 'Weak topics stay invisible',
    body: 'A single accuracy score hides which domains are costing you points, so revision has no direction.',
  },
  {
    number: '03',
    title: 'Exam day is the first real signal',
    body: 'Without topic-level feedback before the exam, the first honest measurement arrives after you have already paid for it.',
  },
];

const buildFacts = [
  { label: 'Who builds it', value: 'One full-stack developer' },
  { label: 'Tracks supported', value: '100+ certifications' },
  { label: 'The loop', value: 'Scope → generate → sit → diagnose' },
  { label: 'During beta', value: 'Free · 300 credits' },
];

const heroStats = [
  { value: '300', label: 'credits on signup' },
  { value: '100+', label: 'tracks' },
  { value: '0', label: 'card required' },
];

// Enhanced WebPage Schema for About page
const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Certestic - AI-Powered Certification Training Platform',
  description:
    'Learn about Certestic, an AI-powered platform for IT certification training designed to be effective and accessible.',
  url: 'https://certestic.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Certestic',
    description: 'AI-powered certification training platform',
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'Certestic',
    url: 'https://certestic.com',
  },
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Ben Gao',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://certestic.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://certestic.com/about' },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <MarketingPageShell>
        <LandingHeader />

        <main>
          <PageHero
            breadcrumb={
              <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About', current: true }]} />
            }
            eyebrow={
              <>
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>Built for real people</span>
              </>
            }
            title="A study tool that watches"
            highlight="where your time goes."
            description="Certestic started as one developer's frustration: endless practice questions, and no idea which ones were worth answering. It is now a small, focused platform that reads how you answer and points at the gaps."
            actions={
              <>
                <Button
                  asChild
                  size="lg"
                  className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-12 w-full gap-2 px-7 py-0 sm:w-auto`}
                >
                  <Link href="/signup">
                    Try Certestic
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${marketingTheme.button.secondary} ${marketingTheme.focusRing} h-12 w-full px-7 py-0 sm:w-auto`}
                >
                  <Link href="/contact">Share feedback</Link>
                </Button>
              </>
            }
            aside={
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />
                <FeaturePanel interactive={false}>
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Rocket className="h-5 w-5" />
                    </IconTile>
                    <span className={marketingTheme.copy.eyebrow}>The build</span>
                  </div>
                  <dl className="mt-5 divide-y divide-slate-200/70 dark:divide-slate-700/60">
                    {buildFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                      >
                        <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {fact.label}
                        </dt>
                        <dd className="text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
                    <Chip>AI generation</Chip>
                    <Chip>Topic-level reports</Chip>
                    <Chip variant="accent">Free beta</Chip>
                  </div>
                </FeaturePanel>
              </div>
            }
          />

          {/* Why this exists */}
          <MarketingSection className={marketingTheme.section.band}>
            <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="max-w-xl">
                <SectionIntro
                  eyebrow="Why this exists"
                  title="Too many questions. Not enough signal."
                  description="Certification prep usually looks like a volume problem. Too many resources, too many topics, never enough time — so most people drill the same questions repeatedly and skip the areas that actually need work."
                />
                <div className="mt-6 space-y-4 text-base font-light leading-relaxed text-slate-600 dark:text-slate-300">
                  <p>
                    Certestic is built on a narrow idea: watch how you answer, work out which topics
                    are costing you points, and spend your next hour there instead of everywhere.
                  </p>
                  <p>
                    It is not trying to replace courses or the official documentation. Read those.
                    Then use this to find out whether the material actually stuck.
                  </p>
                </div>
                <Link
                  href="/#analysis"
                  className={cn(marketingTheme.copy.link, 'mt-6', marketingTheme.focusRing)}
                >
                  See what a report looks like
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <FeaturePanel interactive={false}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    The pattern we kept hitting
                  </p>
                  <Chip variant="accent">Before Certestic</Chip>
                </div>
                <ol className="mt-4 space-y-4">
                  {patterns.map((pattern) => (
                    <li key={pattern.number} className="flex gap-3">
                      <span className="mt-0.5 font-mono text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                        {pattern.number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {pattern.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {pattern.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className={cn(marketingTheme.surface.inset, 'mt-4 p-3')}>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                    One sitting, mapped to topics, is enough to replace all three guesses with a
                    direction.
                  </p>
                </div>
              </FeaturePanel>
            </div>
          </MarketingSection>

          {/* Principles */}
          <MarketingSection>
            <SectionIntro
              eyebrow="Principles"
              title="Three things it is not allowed to get wrong."
              description="These are the constraints behind every feature decision — including the ones that never shipped."
            />
            <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
              {principles.map((principle) => (
                <FeaturePanel key={principle.label}>
                  <FeaturePanelHeader {...principle} variant="soft" />
                </FeaturePanel>
              ))}
            </div>
          </MarketingSection>

          {/* The developer */}
          <MarketingSection className={marketingTheme.section.band}>
            <div className="grid items-start gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
              <div className="max-w-2xl">
                <p className={marketingTheme.copy.eyebrow}>The developer</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
                  Built by someone who sat the exams.
                </h2>
                <div className="mt-6 space-y-4 text-base font-light leading-relaxed text-slate-600 dark:text-slate-300">

                  <p>
                    The premise is simple — the software should do the
                    noticing, so your evenings go to the two topics that matter rather than the nine
                    you already know.
                  </p>
                  <p>
                    Most of the work now goes into the generation and analysis pipeline: mapping
                    questions to real objectives, and making the report say something you can act on
                    the same evening.
                  </p>
                </div>
              </div>

              <FeaturePanel>
                <div className="flex items-center gap-3">
                  <IconTile variant="soft">
                    <Mail className="h-5 w-5" />
                  </IconTile>
                  <span className={marketingTheme.copy.eyebrow}>Direct line</span>
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Feedback goes to the person who builds it.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  No support tier, no ticket queue. During beta, replies come from the developer.
                </p>
                <a
                  href="mailto:info@certestic.com?subject=Feedback%20on%20Certestic"
                  className={cn(
                    marketingTheme.copy.link,
                    'mt-5 justify-between border-t border-slate-200/70 pt-4 dark:border-slate-700/60',
                    marketingTheme.focusRing,
                  )}
                >
                  info@certestic.com
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>

              </FeaturePanel>
            </div>
          </MarketingSection>

          <MarketingSection>
            <CtaPanel
              eyebrow="Try it"
              title="See if smarter studying holds up for you."
              body="Sign up, generate one exam on the topic you keep avoiding, and read the report. That is usually enough to tell."
              stats={heroStats}
              actions={
                <>
                  <Button
                    asChild
                    size="lg"
                    className={`${marketingTheme.button.onDark} ${marketingTheme.focusRing}`}
                  >
                    <Link href="/signup">
                      Get started free
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className={`${marketingTheme.button.onDarkOutline} ${marketingTheme.focusRing}`}
                  >
                    <Link href="/contact">Say hello</Link>
                  </Button>
                </>
              }
            />
          </MarketingSection>
        </main>
      </MarketingPageShell>
    </>
  );
}
