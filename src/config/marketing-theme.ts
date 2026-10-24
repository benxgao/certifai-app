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
  /**
   * Muted full-width band used to separate alternating sections.
   * Mirrors the homepage feature-grid band.
   */
  band: 'border-y border-slate-200/60 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40',
} as const;

/**
 * Sub-page hero tokens used by `PageHero`.
 * Deliberately inherits the homepage hero rhythm (copy left, preview right)
 * so marketing routes open the same way as `/`.
 */
export const pageHero = {
  section: 'relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16',
  grid: 'grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16',
  title:
    'mt-6 text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-[3.35rem]',
  body: 'mt-6 max-w-xl text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl',
  actions: 'mt-9 flex flex-col gap-3 sm:flex-row sm:items-center',
  footnote: 'mt-8 flex flex-wrap items-center gap-x-5 gap-y-2',
  aside: 'relative lg:pl-2',
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
  /**
   * Elevated product/feature surface used by the homepage bento grid.
   * Intended for cards that contain real UI previews rather than plain copy.
   */
  feature:
    'relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-700/60 bg-white/85 dark:bg-slate-900/60 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_-24px_rgba(15,23,42,0.18)]',
  featureInteractive:
    'transition-[border-color,box-shadow] duration-300 hover:border-violet-300/80 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_26px_50px_-24px_rgba(124,58,237,0.28)] dark:hover:border-violet-500/40',
  /**
   * Recessed panel used inside feature cards for previews, charts, and lists.
   */
  inset:
    'rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-950/40',
  /**
   * Violet callout for a single takeaway inside a section.
   */
  callout:
    'rounded-2xl border border-violet-200/70 bg-violet-50/70 p-4 dark:border-violet-400/20 dark:bg-violet-500/10',
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
  /**
   * Buttons that sit on the violet gradient `ctaPanel`.
   */
  onDark:
    'h-12 w-full gap-2 rounded-lg bg-white px-8 py-0 text-base font-semibold text-violet-700 shadow-sm transition-colors hover:bg-violet-50 sm:w-auto',
  onDarkOutline:
    'h-12 w-full rounded-lg border-2 border-white/40 bg-white/10 px-8 py-0 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto',
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
 * Icon container tokens. Use `accent` for primary feature markers,
 * `soft` for supporting markers, and `neutral` for quiet metadata.
 */
export const iconTile = {
  base: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11',
  /** Compact 28px tile for inline lists inside panels. */
  sizeSm: 'h-7 w-7 rounded-lg sm:h-7 sm:w-7',
  accent:
    'bg-linear-to-br from-violet-500 to-indigo-500 text-white shadow-[0_8px_20px_-8px_rgba(109,40,217,0.65)] dark:from-violet-500 dark:to-indigo-500',
  soft: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200/70 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/25',
  neutral:
    'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700/70',
} as const;

/**
 * Small inline pills for topics, providers, and states inside previews.
 */
export const chip = {
  base: 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none',
  accent:
    'border-violet-200/80 bg-violet-50/90 text-violet-700 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200',
  neutral:
    'border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300',
} as const;

/**
 * Copy tokens for recurring marketing text roles.
 */
export const copy = {
  eyebrow:
    'text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300',
  gradient:
    'bg-linear-to-r from-violet-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent',
  body: 'text-base leading-relaxed text-slate-600 dark:text-slate-300 font-light sm:text-lg',
  bodySm: 'text-sm leading-relaxed text-slate-600 dark:text-slate-400',
  meta: 'text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400',
  strong: 'font-semibold text-slate-900 dark:text-slate-50',
  /**
   * Inline text link with trailing icon (section "read more" affordances).
   */
  link: 'inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
} as const;

/**
 * Full-bleed gradient call-to-action panel.
 */
export const ctaPanel =
  'relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-700 via-violet-600 to-indigo-600 text-white shadow-[0_30px_70px_-30px_rgba(76,29,149,0.65)]';

/**
 * Canonical focus treatment for interactive marketing elements.
 */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900';

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
  pageHero,
  section,
  badge,
  heading,
  surface,
  button,
  motion,
  iconTile,
  chip,
  copy,
  ctaPanel,
  focusRing,
  shape,
  header,
  footer,
} as const;

/**
 * Type helper for strict consumer typing.
 */
export type MarketingTheme = typeof marketingTheme;
