/**
 * Central semantic theme contract for marketing pages.
 *
 * This file is the single source of truth for marketing visual tokens.
 * Keep values static and Tailwind-friendly (plain string literals).
 */
export const brand = {
  name: 'Certestic',
  wordmark: 'Certestic',
  accent: 'violet',
  usesGradients: true,
  tone: 'neutral-first with a violet accent',
} as const;

/**
 * Page-level shell tokens used by `MarketingPageShell`.
 * Controls global page background and overflow behavior.
 */
export const pageShell = {
  base: 'min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden',
  background: 'bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br',
  overflow: 'overflow-x-hidden',
} as const;

/**
 * Standard section layout tokens used by `MarketingSection`.
 * Keep vertical rhythm and responsive container width consistent.
 */
export const section = {
  standard: 'relative py-16 sm:py-20 lg:py-24 overflow-hidden',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto',
  wide: 'max-w-6xl mx-auto',
} as const;

/**
 * Eyebrow/badge visual treatments used by `MarketingBadge`.
 * `default` is branded; `subtle` is neutral/supporting.
 */
export const badge = {
  default:
    'inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium',
  subtle:
    'inline-flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium',
} as const;

/**
 * Typography tokens used by `MarketingHeading` and section copy.
 * Includes hero, section, card heading, and body text semantics.
 */
export const heading = {
  hero: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight',
  section: 'text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight',
  card: 'text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight',
  body: 'text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light',
} as const;

/**
 * Surface style tokens for cards and CTA containers.
 * Variants should stay semantic (purpose-driven), not page-specific.
 */
export const surface = {
  card: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl',
  cardInteractive:
    'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300',
  cta: 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-violet-200/70 dark:border-violet-800/40 shadow-md rounded-3xl hover:shadow-md hover:border-violet-300/70 dark:hover:border-violet-700/50 transition-colors duration-300',
} as const;

/**
 * Canonical button style tokens used across marketing CTAs.
 * Edit here for global button branding updates.
 */
export const button = {
  primary:
    'rounded-lg px-8 py-4 text-base font-semibold shadow-sm hover:shadow-sm transition-colors duration-200 bg-violet-600 hover:bg-violet-700 text-white',
  secondary:
    'rounded-lg px-8 py-4 text-base font-semibold border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 transition-colors duration-200',
} as const;

/**
 * Canonical motion tokens for consistent interaction behavior.
 * Marketing interactions should remain minimal and non-distracting.
 */
export const motion = {
  subtle: 'transition-colors duration-200',
  card: 'transition-colors duration-300',
  hoverShadow: 'hover:shadow-sm',
} as const;

/**
 * Canonical shape token for common rounded corners.
 * Keep single-source to avoid route-level radius drift.
 */
export const shape = 'rounded-lg' as const;

/**
 * Header-specific tokens used by `LandingHeader`.
 * Encapsulates nav surface, logo badge, nav links, and primary CTA styling.
 */
export const header = {
  shell:
    'sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm',
  logoBadge:
    'w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-sm transition-colors duration-200',
  brandWordmark:
    'font-bold text-xl text-violet-700 dark:text-violet-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors',
  navLink:
    'text-sm font-normal transition-all duration-200 relative group px-2 md:px-3 py-2 rounded-lg',
  navActive: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
  navInactive:
    'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50',
  ctaButton:
    'rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-normal shadow-sm hover:shadow-sm transition-colors duration-200 px-3 md:px-4 lg:px-6',
} as const;

/**
 * Footer-specific tokens used by `MarketingFooter`.
 * Encapsulates footer surface, typography, link, and divider styles.
 */
export const footer = {
  shell: 'mt-auto bg-linear-to-br from-slate-900 to-slate-800 border-t border-slate-700',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12',
  heading: 'text-white font-semibold text-sm uppercase tracking-wider',
  body: 'text-slate-400 text-sm leading-relaxed',
  link: 'text-slate-400 hover:text-white transition-colors duration-200',
  bottomBorder: 'border-t border-slate-700',
} as const;

/**
 * Aggregate marketing theme export for ergonomic imports.
 */
export const marketingTheme = {
  brand,
  pageShell,
  section,
  badge,
  heading,
  surface,
  button,
  motion,
  shape,
  header,
  footer,
} as const;

/**
 * Type helper for strict consumer typing.
 */
export type MarketingTheme = typeof marketingTheme;
