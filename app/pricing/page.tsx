import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Check,
  Layers,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Wand2,
} from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { Button } from '@/src/components/ui/button';
import {
  Chip,
  CtaPanel,
  FaqAccordion,
  FeaturePanel,
  FeaturePanelHeader,
  MarketingPageShell,
  MarketingSection,
  PageHero,
  SectionIntro,
} from '@/src/components/marketing';
import { PreviewWindow, Sparkline, TopicRow } from '@/src/components/marketing/visuals';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

/** Visible FAQ — mirrored into FAQPage structured data below. */
const faqs = [
  {
    value: 'really-free',
    question: 'Is it really free?',
    answer:
      'Yes. For the whole beta the platform is free: every account starts with 300 credits, there is no subscription, and no card is stored.',
  },
  {
    value: 'what-credits-do',
    question: 'What do credits actually do?',
    answer:
      'Credits are what the generator spends when it writes an exam for you. New accounts start with 300, and you can sit as many exams as those credits cover.',
  },
  {
    value: 'card-needed',
    question: 'Do I need a card to sign up?',
    answer:
      'No. Sign up with an email address or Google, and you land in the exam studio with your credits already in place.',
  },
  {
    value: 'after-beta',
    question: 'What happens when the beta ends?',
    answer:
      'Beta accounts keep the credits they have left and get advance notice before any paid plan exists. Nothing switches on silently, and nothing charges you in the background.',
  },
  {
    value: 'multiple-certs',
    question: 'Can I use one account for several certifications?',
    answer:
      'Yes. One account covers the full catalog of 100+ tracks, and your credits work across all of them — no per-certification purchase.',
  },
  {
    value: 'feedback',
    question: 'How do I report a bug or ask for a feature?',
    answer:
      'Email info@certestic.com or use the contact page. During beta, feedback goes straight into what gets built next rather than into a backlog nobody reads.',
  },
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

const trustPoints = ['300 credits on signup', 'No credit card', 'All 100+ tracks'];

const heroFacts = [
  { value: '300', label: 'credits on signup' },
  { value: '$0', label: 'during beta' },
  { value: '0', label: 'cards stored' },
];

// Structured Data for SEO
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Certestic IT Certification Training Platform - Free Beta Access',
  description:
    'Free beta access to AI-powered IT certification training platform. Every account starts with 300 credits, no credit card required.',
  brand: {
    '@type': 'Brand',
    name: 'Certestic',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Beta Access',
      description: 'Free access to all features while the platform is in beta.',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '0',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: true,
      },
    },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Certestic - Free Beta Access | AI-Powered IT Certification Training',
  description:
    'Get free access to AI-powered IT certification training. Practice with unlimited questions and advance your career with the beta platform.',
  url: 'https://certestic.com/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'Certestic IT Certification Training Platform - Free Beta Access',
  },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <MarketingPageShell>
        <LandingHeader />

        <main>
          <PageHero
            breadcrumb={
              <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Pricing', current: true }]} />
            }
            eyebrow={
              <>
                <Star className="h-4 w-4" aria-hidden="true" />
                <span>Free beta</span>
              </>
            }
            title="Free while we're"
            highlight="still building it."
            description="Every new account starts with 300 credits and no card on file. Generate exams on any of the 100+ tracks, sit them under real conditions, and keep the report."
            actions={
              <>
                <Button
                  asChild
                  size="lg"
                  className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-12 w-full gap-2 px-7 py-0 sm:w-auto`}
                >
                  <Link href="/signup">
                    Start free
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${marketingTheme.button.secondary} ${marketingTheme.focusRing} h-12 w-full px-7 py-0 sm:w-auto`}
                >
                  <Link href="#included">See what&apos;s included</Link>
                </Button>
              </>
            }
            footnote={
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {trustPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    <Check
                      className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            }
            aside={
              <div aria-hidden="true">
                <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />
                <PreviewWindow label="Your account">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Beta access
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                          $0
                          <span className="ml-1.5 align-middle text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            for the beta
                          </span>
                        </p>
                      </div>
                      <Chip variant="accent">No card</Chip>
                    </div>

                    <div className={cn(marketingTheme.surface.inset, 'p-3.5')}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                          Credits
                        </p>
                        <p className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                          300
                          <span className="ml-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            granted
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                        <div className="h-full w-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500" />
                      </div>
                      <p className="mt-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                        Added at signup · spent only when an exam is generated
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {['All 100+ tracks', 'Timed sittings', 'Topic-level reports'].map((row) => (
                        <li
                          key={row}
                          className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300"
                        >
                          <span className="flex items-center gap-1.5">
                            <Check
                              className="h-3 w-3 text-violet-600 dark:text-violet-400"
                              aria-hidden="true"
                            />
                            {row}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">included</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </PreviewWindow>
              </div>
            }
          />

          {/* What's included */}
          <div id="included" className="scroll-mt-24">
            <MarketingSection className={marketingTheme.section.band}>
              <SectionIntro
                eyebrow="Included"
                title="One plan. Everything in it."
                description="There is no paid tier holding back the useful parts during beta. Every account gets the whole workflow — generation, sitting, and diagnosis."
                action={
                  <Link
                    href="/#how-it-works"
                    className={cn(marketingTheme.copy.link, marketingTheme.focusRing)}
                  >
                    See how the loop works
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                }
              />

              <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6">
                {/* Generation */}
                <FeaturePanel className="md:col-span-2 lg:col-span-3">
                  <FeaturePanelHeader
                    icon={<Sparkles className="h-5 w-5" />}
                    label="Generation"
                    title="Any track, any scope."
                    description="Pick from 100+ certifications, set the question count, and describe the scope in your own words. A fresh exam is written in minutes."
                  />
                  <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Certification
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          AWS Solutions Architect — Associate
                        </p>
                      </div>
                      <Chip>SAA-C03</Chip>
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/70 p-2.5 dark:border-slate-700/60 dark:bg-slate-900/40">
                      <Wand2
                        className="mt-0.5 h-3 w-3 shrink-0 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                      <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                        Focus on multi-account governance and cost control.
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['IAM', 'VPC', 'Cost control'].map((topic) => (
                        <Chip key={topic} variant="accent">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          {topic}
                        </Chip>
                      ))}
                      <Chip className="line-through">Identity</Chip>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-2.5 text-[10px] font-medium text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                      <span>40 questions · 130 min</span>
                      <span className="text-violet-600 dark:text-violet-300">Generated on demand</span>
                    </div>
                  </div>
                </FeaturePanel>

                {/* Report */}
                <FeaturePanel className="md:col-span-2 lg:col-span-3">
                  <FeaturePanelHeader
                    icon={<BarChart3 className="h-5 w-5" />}
                    label="Report"
                    title="A diagnosis, not a score."
                    description="Every answer maps to a topic. You see which domains held up, which quietly cost you points, and what to generate next."
                    variant="soft"
                  />
                  <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Exam report
                      </span>
                      <Chip variant="accent">82% overall</Chip>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <TopicRow label="Identity & access" value={94} tone="strong" />
                      <TopicRow label="Networking" value={86} tone="mid" />
                      <TopicRow label="Cost management" value={64} tone="weak" />
                    </div>
                    <div className={cn(marketingTheme.surface.callout, 'mt-3 p-2.5')}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                        AI takeaway
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                        Cost management is costing you 6 points. Generate a focused 20-question set.
                      </p>
                    </div>
                  </div>
                </FeaturePanel>

                {/* Timed sitting */}
                <FeaturePanel className="md:col-span-1 lg:col-span-2">
                  <FeaturePanelHeader
                    icon={<Timer className="h-5 w-5" />}
                    label="Exam conditions"
                    title="Sit it like the real thing."
                    description="A countdown, a navigator, and flags for review — no feedback until you submit."
                    variant="soft"
                  />
                  <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        01:24:08
                      </span>
                      <Chip>Timed</Chip>
                    </div>
                    <div className="mt-3 grid grid-cols-8 gap-1">
                      {Array.from({ length: 16 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            'flex h-3.5 w-full items-center justify-center rounded-[3px] text-[8px] font-semibold',
                            index < 11
                              ? 'bg-violet-200/90 text-violet-800 dark:bg-violet-500/30 dark:text-violet-200'
                              : 'border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
                            index === 11 && 'border-violet-500 bg-white text-violet-700 dark:bg-slate-900',
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      11 answered · 5 left
                    </p>
                  </div>
                </FeaturePanel>

                {/* Progress */}
                <FeaturePanel className="md:col-span-1 lg:col-span-2">
                  <FeaturePanelHeader
                    icon={<TrendingUp className="h-5 w-5" />}
                    label="Progress"
                    title="The bigger picture, after two exams."
                    description="Your AI Learning Journey rolls every report into one view: mastery by domain and the trend across exams."
                    variant="soft"
                  />
                  <div className={cn(marketingTheme.surface.inset, 'mt-5 p-4')} aria-hidden="true">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Average score
                      </p>
                      <Chip variant="accent">
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                        Improving
                      </Chip>
                    </div>
                    <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      78%
                      <span className="ml-1.5 align-middle text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                        +11 pts
                      </span>
                    </p>
                    <Sparkline points={[52, 58, 55, 64, 67, 66, 74, 78]} id="pricing" className="mt-1" />
                  </div>
                </FeaturePanel>

                {/* Catalog */}
                <FeaturePanel className="md:col-span-2 lg:col-span-2">
                  <FeaturePanelHeader
                    icon={<Layers className="h-5 w-5" />}
                    label="Catalog"
                    title="100+ tracks, one balance."
                    description="Cloud, networking, security, containers, infrastructure as code — your credits travel across all of them."
                  />
                  <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2" aria-hidden="true">
                    {providers.map((provider) => (
                      <span
                        key={provider}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-violet-500" />
                        <span className="truncate">{provider}</span>
                      </span>
                    ))}
                  </div>
                </FeaturePanel>
              </div>
            </MarketingSection>
          </div>

          {/* FAQ + beta promise */}
          <MarketingSection>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="max-w-md">
                <SectionIntro
                  eyebrow="FAQ"
                  title="What &ldquo;free&rdquo; actually means."
                  description="No trial clock, no auto-renew, no surprise invoice at the end of a promo period."
                />

                <div className={cn(marketingTheme.surface.callout, 'mt-6')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                    Beta promise
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Your feedback shapes what gets built next. Early accounts keep their remaining
                    credits, and get told before anything about pricing changes.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className={cn(marketingTheme.copy.link, 'mt-5', marketingTheme.focusRing)}
                >
                  Ask us anything
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <FaqAccordion items={faqs} />
            </div>
          </MarketingSection>

          <MarketingSection>
            <CtaPanel
              eyebrow="Free beta"
              title="Start with 300 credits. Keep the report."
              body="Pick a track, describe the scope, sit the exam, and read the diagnosis. Nothing to cancel later."
              stats={heroFacts}
              actions={
                <>
                  <Button
                    asChild
                    size="lg"
                    className={`${marketingTheme.button.onDark} ${marketingTheme.focusRing}`}
                  >
                    <Link href="/signup">
                      Start free
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className={`${marketingTheme.button.onDarkOutline} ${marketingTheme.focusRing}`}
                  >
                    <Link href="/contact">Talk to us first</Link>
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
