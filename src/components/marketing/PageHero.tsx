'use client';

import React from 'react';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

export interface PageHeroProps {
  /** Large page title. */
  title: React.ReactNode;
  /** Trailing words rendered in the violet gradient, e.g. "still in beta." */
  highlight?: string;
  /** Eyebrow badge content (icon + short label). */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Primary/secondary actions rendered side by side. */
  actions?: React.ReactNode;
  /** Small trust points under the actions (usually a `<ul>`). */
  footnote?: React.ReactNode;
  /** Right-hand product preview / facts panel. Omit for a single-column hero. */
  aside?: React.ReactNode;
  /** Pre-rendered breadcrumb (usually `<Breadcrumb />`). */
  breadcrumb?: React.ReactNode;
  className?: string;
}

/**
 * PageHero is the shared opening block for marketing sub-pages.
 * It mirrors the homepage hero rhythm — ambient grid, copy on the left,
 * an illustrative panel on the right — so `/pricing`, `/about` and `/contact`
 * feel like siblings of `/` rather than separate templates.
 *
 * @param title - Page heading (h1)
 * @param highlight - Optional gradient phrase appended to the title
 * @param eyebrow - Badge above the title
 * @param description - Lead paragraph
 * @param actions - CTA row
 * @param footnote - Trust points below the CTAs
 * @param aside - Right column content (decorative previews should be aria-hidden)
 * @param breadcrumb - Pre-rendered breadcrumb trail
 * @param className - Optional additional classes
 */
export const PageHero: React.FC<PageHeroProps> = ({
  title,
  highlight,
  eyebrow,
  description,
  actions,
  footnote,
  aside,
  breadcrumb,
  className = '',
}) => (
  <section className={cn(marketingTheme.pageHero.section, className)}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-600/15" />
      <div className="absolute -left-32 top-24 h-[22rem] w-[22rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/15" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)]" />
    </div>

    <div className={`${marketingTheme.section.container} relative`}>
      {breadcrumb && <div className="mb-8 sm:mb-10">{breadcrumb}</div>}

      <div className={cn(aside ? marketingTheme.pageHero.grid : 'max-w-3xl')}>
        <div className={aside ? 'max-w-2xl' : undefined}>
          {eyebrow && <div className={marketingTheme.badge.default}>{eyebrow}</div>}

          <h1 className={marketingTheme.pageHero.title}>
            {title}
            {highlight && (
              <>
                {' '}
                <span className={marketingTheme.copy.gradient}>{highlight}</span>
              </>
            )}
          </h1>

          {description && <div className={marketingTheme.pageHero.body}>{description}</div>}
          {actions && <div className={marketingTheme.pageHero.actions}>{actions}</div>}
          {footnote && <div className={marketingTheme.pageHero.footnote}>{footnote}</div>}
        </div>

        {aside && <div className={marketingTheme.pageHero.aside}>{aside}</div>}
      </div>
    </div>
  </section>
);

export default PageHero;
