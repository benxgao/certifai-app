import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bug,
  Check,
  Mail,
  MessageCircle,
  Sparkles,
  Users,
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
  IconTile,
  MarketingPageShell,
  MarketingSection,
  PageHero,
  SectionIntro,
  StepList,
} from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

const CONTACT_EMAIL = 'info@certestic.com';

const beforeYouWrite = [
  {
    icon: <Bug className="h-4 w-4" />,
    title: 'Found a bug?',
    body: 'Include the exam or certification, what you clicked, and what happened instead.',
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: 'Missing a feature?',
    body: 'Describe the study problem first. The implementation is usually the easy part.',
  },
  {
    icon: <Mail className="h-4 w-4" />,
    title: 'Something about your account?',
    body: 'Write from the address you signed up with, so nothing needs to be verified twice.',
  },
];

const channels = [
  {
    icon: <MessageCircle className="h-5 w-5" />,
    label: 'Product',
    title: 'Support & feedback',
    description:
      'Bugs, confusing reports, exam generation that missed the mark — anything about using the product belongs here.',
    subject: 'Support request',
    tags: ['Product issues', 'Feedback', 'Bug reports'],
    accent: true,
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: 'General',
    title: 'Everything else',
    description:
      'Partnerships, press, or a question that does not fit the product — the same inbox, routed by subject line.',
    subject: 'General enquiry',
    tags: ['Partnerships', 'Press'],
    accent: false,
  },
];

const reportSteps = [
  {
    title: 'What you did',
    body: 'The certification, the scope you set, and the buttons you pressed. A link to the exam helps most.',
  },
  {
    title: 'What you expected',
    body: 'One sentence is fine. "A 40-question exam with no identity questions" is already actionable.',
  },
  {
    title: 'What happened',
    body: 'The exact error text, or a screenshot description if the layout broke. Rough is fine — complete is better.',
  },
];

const faqs = [
  {
    value: 'what-is-certestic',
    question: 'What is Certestic?',
    answer:
      'An AI-powered certification training platform. It generates practice exams for 100+ IT tracks, maps every answer to a topic, and turns the result into a study direction.',
  },
  {
    value: 'which-certifications',
    question: 'Which certifications are available?',
    answer:
      'Cloud, networking, security, containers, and infrastructure-as-code tracks, with new ones added as users ask for them. The full list lives in the certification catalog.',
  },
  {
    value: 'help-improve',
    question: 'How can I help improve the platform?',
    answer:
      'Report what is broken, describe what is missing, or tell us which exam felt wrong. During beta those messages go straight into the build queue.',
  },
  {
    value: 'response-time',
    question: 'How quickly do you reply?',
    answer:
      'It is a one-person inbox during beta, so expect a couple of days rather than minutes. Reports with clear reproduction steps tend to get looked at first.',
  },
  {
    value: 'email-instead',
    question: 'Can I just email instead of using a form?',
    answer:
      'Yes — there is no form. Every button on this page opens your mail client with the subject prefilled.',
  },
];

const heroStats = [
  { value: '100+', label: 'tracks in the catalog' },
  { value: '1', label: 'person reading it' },
  { value: '0', label: 'ticket bots' },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Certestic',
  url: 'https://certestic.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Certestic',
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT_EMAIL,
        availableLanguage: ['en'],
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
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
              <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact', current: true }]} />
            }
            eyebrow={
              <>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>We&apos;d love to hear from you</span>
              </>
            }
            title="Tell us what's"
            highlight="getting in the way."
            description="A bug, a missing feature, or a question about how credits work — write it in plain language and it lands with the developer who builds the product. No ticket queue, no bot."
            actions={
              <>
                <Button
                  asChild
                  size="lg"
                  className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-12 w-full gap-2 px-7 py-0 sm:w-auto`}
                >
                  <a href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20a%20Certestic%20user`}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email us
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${marketingTheme.button.secondary} ${marketingTheme.focusRing} h-12 w-full px-7 py-0 sm:w-auto`}
                >
                  <Link href="/documentation">Browse documentation</Link>
                </Button>
              </>
            }
            aside={
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl" />
                <FeaturePanel interactive={false}>
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Sparkles className="h-5 w-5" />
                    </IconTile>
                    <span className={marketingTheme.copy.eyebrow}>Before you write</span>
                  </div>
                  <ul className="mt-5 space-y-4">
                    {beforeYouWrite.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <IconTile variant="soft" size="sm" className="mt-0.5">
                          {item.icon}
                        </IconTile>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-900 transition-colors hover:text-violet-700 dark:text-slate-100 dark:hover:text-violet-300"
                    >
                      {CONTACT_EMAIL}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </FeaturePanel>
              </div>
            }
          />

          {/* Channels */}
          <MarketingSection className={marketingTheme.section.band}>
            <SectionIntro
              eyebrow="Ways to reach us"
              title="Two inboxes, same person."
              description="Both buttons open your mail client with a subject line prefilled, so nothing gets lost between product issues and everything else."
            />
            <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
              {channels.map((channel) => (
                <FeaturePanel key={channel.title}>
                  <FeaturePanelHeader
                    icon={channel.icon}
                    label={channel.label}
                    title={channel.title}
                    description={channel.description}
                    variant={channel.accent ? 'accent' : 'soft'}
                  />
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {channel.tags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      `${channel.subject} — Certestic`,
                    )}`}
                    className={cn(
                      marketingTheme.copy.link,
                      'mt-auto justify-between border-t border-slate-200/70 pt-4 dark:border-slate-700/60',
                      marketingTheme.focusRing,
                    )}
                  >
                    Write to {CONTACT_EMAIL}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </FeaturePanel>
              ))}
            </div>
          </MarketingSection>

          {/* What to include */}
          <MarketingSection>
            <SectionIntro
              eyebrow="Bug reports"
              title="Three lines that make a fix possible."
              description="You do not need a template. These three things just happen to be what gets a problem reproduced on the first try."
              action={
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  No forms, no fields
                </span>
              }
            />
            <StepList steps={reportSteps} columns={3} />
          </MarketingSection>

          {/* FAQ */}
          <MarketingSection className="border-t border-slate-200/60 dark:border-slate-800">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="max-w-md">
                <SectionIntro
                  eyebrow="FAQ"
                  title="Questions that arrive before the email."
                  description="If the answer is here, you save yourself the wait. If it is not, that is worth telling us too."
                />
                <Link
                  href="/pricing"
                  className={cn(marketingTheme.copy.link, 'mt-5', marketingTheme.focusRing)}
                >
                  See what the beta includes
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <div className={cn(marketingTheme.surface.callout, 'mt-6')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                    Also useful
                  </p>
                  <Link
                    href="/documentation"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-violet-700 dark:text-slate-300 dark:hover:text-violet-300"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Product documentation
                  </Link>
                </div>
              </div>

              <FaqAccordion items={faqs} />
            </div>
          </MarketingSection>

          <MarketingSection>
            <CtaPanel
              eyebrow="One more thing"
              title="The fastest way to help is to try it."
              body="Generate one exam, sit it, and tell us which questions felt wrong. That feedback is more useful than any survey."
              stats={heroStats}
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
                    <a href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20a%20Certestic%20user`}>
                      Send a message
                    </a>
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
