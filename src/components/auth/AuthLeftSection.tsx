'use client';

import React, { memo } from 'react';
import { Check, PlayCircle, Sparkles } from 'lucide-react';

import AuthAsidePreview from './AuthAsidePreview';
import { authAside } from '@/src/config/auth-theme';

interface AuthLeftSectionProps {
  mode: 'signin' | 'signup';
}

interface AuthAsideCopy {
  badge: string;
  /** Leading clause of the display title. */
  titleLead: string;
  /** Trailing clause, rendered with the marketing gradient. */
  titleAccent: string;
  body: string;
  trustPoints: string[];
}

const COPY: Record<AuthLeftSectionProps['mode'], AuthAsideCopy> = {
  signup: {
    badge: '300 free credits on signup',
    titleLead: 'Your next certification',
    titleAccent: 'starts with one exam.',
    body: 'Pick a certification, describe the scope in your own words, and AI writes a fresh practice exam in minutes. Every report, strength, and study plan lands in this account.',
    trustPoints: ['No credit card required', '100+ certification tracks', 'Personalised study plans'],
  },
  signin: {
    badge: 'Welcome back',
    titleLead: 'Pick up exactly',
    titleAccent: 'where you stopped.',
    body: 'Your generated exams, topic-level reports, and study plan are still here. Sign in to run the next one.',
    trustPoints: ['Progress saved automatically', 'Topic-level analytics', 'Real exam conditions'],
  },
};

/**
 * Left-hand marketing panel for the auth screens.
 *
 * Follows the homepage hero composition — `MarketingBadge` pill, display title
 * with one gradient clause, light body copy, a product preview, then a quiet
 * trust row — so `/signin` and `/signup` open like the rest of the site. The
 * preview is decorative (`aria-hidden` inside `AuthAsidePreview`); every claim
 * it illustrates is repeated in the copy.
 *
 * Tokens live in `authAside`; the surfacing/badge/gradient come from
 * `marketing-theme`, so a branding tweak never has to touch this file twice.
 */
const AuthLeftSection: React.FC<AuthLeftSectionProps> = memo(({ mode }) => {
  const content = COPY[mode];
  const BadgeIcon = mode === 'signup' ? Sparkles : PlayCircle;

  return (
    <aside className={authAside.shell} aria-label="Product highlights">
      <div className={authAside.badge}>
        <BadgeIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{content.badge}</span>
      </div>

      <h2 className={authAside.title}>
        {content.titleLead}{' '}
        <span className={authAside.titleAccent}>{content.titleAccent}</span>
      </h2>

      <p className={authAside.body}>{content.body}</p>

      <AuthAsidePreview mode={mode} />

      <ul className={authAside.trustList}>
        {content.trustPoints.map((point) => (
          <li key={point} className={authAside.trustItem}>
            <Check className={authAside.trustIcon} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </aside>
  );
});

AuthLeftSection.displayName = 'AuthLeftSection';

export default AuthLeftSection;
