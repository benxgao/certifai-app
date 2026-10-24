import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Cloud, Layers, Network, ShieldCheck } from 'lucide-react';

import Breadcrumb from '@/src/components/custom/Breadcrumb';
import CertificationsOverviewClient from '@/src/components/custom/CertificationsOverviewClient';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { Button } from '@/src/components/ui/button';
import {
  CtaPanel,
  FaqAccordion,
  FeaturePanel,
  FeaturePanelHeader,
  MarketingPageShell,
  MarketingSection,
  PageHero,
  SectionIntro,
  StepList,
} from '@/src/components/marketing';
import { PreviewWindow } from '@/src/components/marketing/visuals';
import { marketingTheme } from '@/src/config/marketing-theme';
import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';
import { cn } from '@/src/lib/utils';
import { metadata as certificationsMetadata } from './metadata';

/**
 * The long-form SEO metadata for this route lives in `./metadata.ts`.
 * Re-declared as a local const so Next's static analysis picks it up.
 */
export const metadata = certificationsMetadata;

/** Focus areas that already have a dedicated landing page. */
const focusAreas = [
  {
    href: '/certifications/categories/cloud',
    label: 'Cloud',
    title: 'AWS, Azure and Google Cloud',
    description:
      'Architecture, administration and data tracks from the three platforms that appear most in job listings.',
    cta: 'Browse cloud tracks',
    icon: <Cloud className="h-5 w-5" aria-hidden="true" />,
  },
  {
    href: '/certifications/categories/security',
    label: 'Security',
    title: 'Fundamentals to architecture',
    description:
      'Vendor-neutral and vendor-specific security tracks, from entry certifications to architect-level exams.',
    cta: 'Browse security tracks',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    href: '/certifications/categories/networking',
    label: 'Networking',
    title: 'Routing, switching and design',
    description:
      'Engineer and architect tracks for people moving from operating networks to designing them.',
    cta: 'Browse networking tracks',
    icon: <Network className="h-5 w-5" aria-hidden="true" />,
  },
];

const steps = [
  {
    title: 'Find the track',
    body: 'Search by name or filter by vendor. Every card shows the vendor’s published question range.',
  },
  {
    title: 'Scope the exam',
    body: 'Set the question count and describe what you want tested in your own words — then trim topics you already know.',
  },
  {
    title: 'Sit it and read the report',
    body: 'A timed sitting with a navigator and review flags, followed by a topic-by-topic diagnosis.',
  },
];

/** Visible FAQ — mirrored into the FAQPage structured data below. */
const faqs = [
  {
    value: 'official-exams',
    question: 'Are these the official vendor exams?',
    answer:
      'No. Every exam is a practice simulation written from the public outline of that certification. We are not affiliated with, endorsed by or sponsored by any of the vendors listed in the catalog.',
  },
  {
    value: 'account-needed',
    question: 'Do I need an account just to browse?',
    answer:
      'No. The catalog is open — search it, filter by vendor and open any track. An account is only needed when you generate or sit an exam.',
  },
  {
    value: 'cost',
    question: 'What does an exam cost?',
    answer:
      'During beta every account starts with 300 credits and no card is stored. Credits are spent when an exam is generated, never for browsing the catalog.',
  },
  {
    value: 'scope',
    question: 'Can I control what the exam covers?',
    answer:
      'Yes. Pick the track, choose a question count inside the vendor’s published range, then describe the scope in your own words. Topics can be included or excluded before the exam is written.',
  },
  {
    value: 'length',
    question: 'How many questions and how long is the sitting?',
    answer:
      'The question count is bounded by each track’s published range, shown on every card in the catalog. The sitting runs on a countdown with a question navigator and flags for review — no feedback until you submit.',
  },
  {
    value: 'missing-track',
    question: 'A certification I need is missing. Can you add it?',
    answer:
      'Email info@certestic.com with the vendor and certification name. During beta the catalog grows from requests rather than a fixed roadmap.',
  },
];

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

const itemListSchema = (names: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Certestic certification catalog',
  numberOfItems: names.length,
  itemListElement: names.map((name, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    url: 'https://certestic.com/certifications',
  })),
});

export default async function CertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { firms, error } = await fetchCertificationsData();

  // Get firm filter from search params
  const resolvedSearchParams = await searchParams;
  const firmFilter =
    typeof resolvedSearchParams.firm === 'string' ? resolvedSearchParams.firm : undefined;

  const vendors = firms.filter((firm) => firm.certification_count > 0);

  /** Vendors with the deepest catalog, used for the hero snapshot. */
  const deepestVendors = [...vendors]
    .sort((a, b) => b.certification_count - a.certification_count)
    .slice(0, 4);

  const heroFacts = ['300 credits on signup', 'No card required', 'Free during beta'];

  const catalogStats = [
    { value: '300', label: 'credits on signup' },
    { value: '$0', label: 'during beta' },
    { value: '0', label: 'cards stored' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema(vendors.map((firm) => firm.name))),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <MarketingPageShell className="certifications-page">
        <LandingHeader />

        <main>
          <PageHero
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Certifications', current: true },
                ]}
              />
            }
            eyebrow={
              <>
                <Layers className="h-4 w-4" aria-hidden="true" />
                <span>Certification catalog</span>
              </>
            }
            title="Every track you're studying for,"
            highlight="in one catalog."
            description="Cloud, security and networking certifications from the vendors that actually issue them. Pick a track, describe the scope you want to be tested on, and sit an AI-written exam under real conditions."
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
                  <Link href="#catalog">Browse the catalog</Link>
                </Button>
              </>
            }
            footnote={
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {heroFacts.map((fact) => (
                  <li
                    key={fact}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    <Check
                      className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400"
                      aria-hidden="true"
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            }
            aside={
              <div aria-hidden="true">
                <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />
                <PreviewWindow label="Catalog snapshot">
                  {deepestVendors.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Deepest catalogs
                        </p>
                        <p className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                          {vendors.length}
                          <span className="ml-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            vendors
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {deepestVendors.map((firm) => (
                          <div key={firm.code} className="space-y-1.5">
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                {firm.name}
                              </span>
                              <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                {firm.certification_count}
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                              <div
                                className="h-full rounded-full bg-violet-500 dark:bg-violet-400"
                                style={{
                                  width: `${Math.max(
                                    8,
                                    Math.round(
                                      (firm.certification_count /
                                        (deepestVendors[0]?.certification_count || 1)) *
                                        100,
                                    ),
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="border-t border-slate-200/70 pt-3 text-[10px] leading-relaxed text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                        Tracks per vendor, taken live from the catalog.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {focusAreas.map((area) => (
                        <p
                          key={area.href}
                          className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          <span className="h-1 w-1 rounded-full bg-violet-500" />
                          {area.title}
                        </p>
                      ))}
                      <p className="pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        Catalog data is still loading.
                      </p>
                    </div>
                  )}
                </PreviewWindow>
              </div>
            }
          />

          {/* Focus areas */}
          <MarketingSection className={marketingTheme.section.band}>
            <SectionIntro
              eyebrow="Focus areas"
              title="Or start where your gaps are."
              description="Three editorial entry points into the catalog, each with the tracks that come up most often in that area."
            />

            <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
              {focusAreas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className={cn('group block h-full', marketingTheme.focusRing)}
                >
                  <FeaturePanel className="h-full">
                    <FeaturePanelHeader
                      icon={area.icon}
                      label={area.label}
                      title={area.title}
                      description={area.description}
                      variant="soft"
                    />
                    <span className={cn(marketingTheme.copy.link, 'mt-5')}>
                      {area.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </FeaturePanel>
                </Link>
              ))}
            </div>
          </MarketingSection>

          {/* Catalog */}
          <div id="catalog" className="scroll-mt-24">
            <MarketingSection>
              <SectionIntro
                eyebrow="Full catalog"
                title="Search all vendors and certifications."
                description="Filter by vendor or search by certification name. Each card links to the track, its published question range and the practice entry point."
              />

              <div className="mt-10">
                <Suspense fallback={<CertificationsOverviewSkeleton />}>
                  <CertificationsOverviewClient
                    initialFirms={firms}
                    initialError={error}
                    defaultFirmFilter={firmFilter}
                  />
                </Suspense>
              </div>
            </MarketingSection>
          </div>

          {/* How the loop runs */}
          <MarketingSection className={marketingTheme.section.band}>
            <SectionIntro
              eyebrow="From track to report"
              title="Three steps, no scheduling."
              description="The catalog is the entry point. Everything after it is generated on demand from the track you picked."
            />
            <StepList steps={steps} columns={3} className="mt-10 lg:mt-12" />
          </MarketingSection>

          {/* FAQ */}
          <MarketingSection>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="max-w-md">
                <SectionIntro
                  eyebrow="FAQ"
                  title="Catalog questions, answered."
                  description="What these exams are, what they cost, and how much of the scope you control."
                />
                <Link
                  href="/contact"
                  className={cn(marketingTheme.copy.link, 'mt-6', marketingTheme.focusRing)}
                >
                  Ask us anything
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <FaqAccordion items={faqs} />
            </div>
          </MarketingSection>

          {/* Closing CTA */}
          <MarketingSection>
            <CtaPanel
              eyebrow="Free beta"
              title="Pick a track and sit your first exam."
              body="300 credits land with the account. Choose a certification, describe the scope, and read the diagnosis — no card, nothing to cancel later."
              stats={catalogStats}
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
                    <Link href="/pricing">See what&apos;s included</Link>
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

function CertificationsOverviewSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className={cn(marketingTheme.surface.feature, 'p-6 sm:p-7')}>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <div className="h-7 w-16 animate-pulse rounded bg-slate-200/80 dark:bg-slate-700/60" />
              <div className="h-3 w-full max-w-24 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
            </div>
          ))}
        </div>
        <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
      </div>

      {[0, 1].map((group) => (
        <div key={group} className={cn(marketingTheme.surface.feature, 'p-6 sm:p-7')}>
          <div className="h-5 w-44 animate-pulse rounded bg-slate-200/70 dark:bg-slate-700/50" />
          <div className="mt-3 h-3 w-full max-w-72 animate-pulse rounded bg-slate-200/50 dark:bg-slate-700/30" />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="h-32 animate-pulse rounded-2xl bg-slate-200/40 dark:bg-slate-700/25"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
