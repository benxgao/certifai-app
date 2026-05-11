// marketing-theme: central semantic contract for marketing pages.
export const brand = {
  name: 'Certestic',
  wordmark: 'Certestic',
  accent: 'violet',
  usesGradients: true,
  tone: 'neutral-first with a violet accent',
} as const;

export const pageShell = {
  base: 'min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden',
  background: 'bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br',
  overflow: 'overflow-x-hidden',
} as const;

export const section = {
  standard: 'relative py-16 sm:py-20 lg:py-24 overflow-hidden',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto',
  wide: 'max-w-6xl mx-auto',
} as const;

export const badge = {
  default:
    'inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium',
  subtle:
    'inline-flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium',
} as const;

export const heading = {
  hero: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight',
  section: 'text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight',
  card: 'text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight',
  body: 'text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light',
} as const;

export const surface = {
  card: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl',
  cardInteractive:
    'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300',
  cta: 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-violet-200/70 dark:border-violet-800/40 shadow-md rounded-3xl hover:shadow-md hover:border-violet-300/70 dark:hover:border-violet-700/50 transition-colors duration-300',
} as const;

export const button = {
  primary:
    'rounded-lg px-8 py-4 text-base font-semibold shadow-sm hover:shadow-sm transition-colors duration-200 bg-violet-600 hover:bg-violet-700 text-white',
  secondary:
    'rounded-lg px-8 py-4 text-base font-semibold border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 transition-colors duration-200',
} as const;

export const motion = {
  subtle: 'transition-colors duration-200',
  card: 'transition-colors duration-300',
  hoverShadow: 'hover:shadow-sm',
} as const;

export const shape = 'rounded-lg' as const;

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

export const footer = {
  shell: 'mt-auto bg-linear-to-br from-slate-900 to-slate-800 border-t border-slate-700',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12',
  heading: 'text-white font-semibold text-sm uppercase tracking-wider',
  body: 'text-slate-400 text-sm leading-relaxed',
  link: 'text-slate-400 hover:text-white transition-colors duration-200',
  bottomBorder: 'border-t border-slate-700',
} as const;

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

export type MarketingTheme = typeof marketingTheme;
