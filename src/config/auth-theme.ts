/**
 * Central theme contract for the authentication flows (`/signin`, `/signup`,
 * `/forgot-password`).
 *
 * Auth screens sit between marketing and the signed-in app: they share the
 * marketing visual language (neutral surfaces, one violet accent, ambient grid,
 * minimal motion) but use app-grade form density. Keeping the class strings here
 * means a branding tweak touches one file instead of every auth page, and the
 * signin/signup pair can never drift apart again.
 *
 * Values must stay static Tailwind-friendly string literals.
 */

import { marketingTheme } from './marketing-theme';

/**
 * Page-level shell for auth routes: background, ambient decoration, container
 * width, and the responsive two-column grid (aside + form card).
 */
export const authPage = {
  /**
   * `overflow-x-clip`, NOT `overflow-x-hidden`: `hidden` turns this element into
   * a scroll container, which silently disables `position: sticky` for every
   * descendant (the aside stops tracking the viewport). `clip` trims the ambient
   * orbs horizontally without that side effect.
   */
  shell: 'relative min-h-screen overflow-x-clip bg-slate-50 dark:bg-slate-900',
  /** Absolutely positioned ambient layer; always mark it `aria-hidden`. */
  backdrop: 'pointer-events-none absolute inset-0 overflow-hidden',
  gridOverlay:
    'absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)]',
  orbViolet:
    'absolute -right-24 -top-32 h-[24rem] w-[24rem] rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-600/15',
  orbIndigo:
    'absolute -left-32 top-24 h-[20rem] w-[20rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/15',
  container: 'container relative mx-auto px-4 sm:px-6 lg:px-8',
  /**
   * Two-column shell: copy on the left, form card on the right.
   *
   * `items-start` is deliberate — do NOT go back to `items-center`. The aside is
   * a fixed-height block while the card grows with the form, so centring the row
   * floats the shorter side down by half the difference: 26px on /signin but
   * 209px on the much taller /signup form. That uneven "shoulder" (and the way
   * it changes per page) is exactly what top alignment removes.
   */
  grid: 'grid items-start gap-10 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:py-16',
  /**
   * Track for the aside. It must stretch to the full row height (overriding the
   * grid's `items-start`) so the sticky child below has somewhere to travel —
   * otherwise a short aside leaves a dead 266px hole next to the long signup
   * form. Hidden with the aside itself below `lg`.
   */
  asideColumn: 'hidden lg:block lg:self-stretch',
  /** Pins the aside just under the 65px sticky site header while the form scrolls. */
  asideSticky: 'lg:sticky lg:top-24',
  /** Form column. `min-w-0` lets long inputs shrink inside the fixed track. */
  column: 'w-full min-w-0',
} as const;

/**
 * The form card. Deliberately one notch denser than a marketing card:
 * `rounded-2xl`, a hairline border, and a single layered shadow.
 */
export const authCard = {
  shell: 'relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80',
  /** Thin violet rule that ties the card to the brand accent. */
  accentRule: 'absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-violet-500 via-violet-500 to-indigo-500',
  header: 'border-b border-slate-200/70 px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8 dark:border-slate-700/60',
  body: 'px-6 py-6 sm:px-8 sm:py-7',
  footer:
    'border-t border-slate-200/70 bg-slate-50/70 px-6 py-4 text-center text-sm text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/30 dark:text-slate-400 sm:px-8',
} as const;

/**
 * Heading block inside a card header: eyebrow → h1 → supporting copy.
 */
export const authHeading = {
  eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300',
  title: 'mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[1.75rem]',
  subtitle: 'mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base',
} as const;

/**
 * Form field tokens used by `AuthField` / `PasswordField`.
 * Height is fixed at 44px so stacked fields line up regardless of icon usage.
 */
export const authField = {
  group: 'space-y-1.5',
  labelRow: 'flex items-baseline justify-between gap-3',
  label: 'gap-1 text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-200',
  requiredMark: 'font-normal text-rose-500',
  wrapper: 'relative',
  input:
    'h-11 w-full rounded-xl border-slate-200 bg-white py-0 pl-3.5 pr-3.5 text-[15px] text-slate-900 shadow-xs transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/15 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600',
  inputWithIcon: 'pl-10',
  inputWithTrailing: 'pr-11',
  icon: 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500',
  /** Icon colour shifts when the field is focused (via peer-focus on the input). */
  iconActive: 'peer-focus:text-violet-500',
  trailing: 'absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center',
  trailingButton:
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300',
  hint: 'text-xs leading-relaxed text-slate-500 dark:text-slate-400',
  /** Label/trigger overrides for `CertificationSelector` inside auth forms. */
  selectLabel: 'gap-1 text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-200',
  selectTrigger:
    'h-11 w-full rounded-xl border-slate-200 bg-white pl-3.5 pr-3 text-[15px] text-slate-900 shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/15 data-[size=default]:h-11 data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-slate-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:border-slate-600',
} as const;

/**
 * Buttons. Primary is the violet CTA shared by both forms; the loading state is
 * handled by `ButtonLoadingText`, so these tokens only cover resting/hover.
 */
export const authButton = {
  primary:
    'h-11 w-full rounded-xl bg-violet-600 px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(109,40,217,0.75)] transition-colors duration-200 hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500/30 disabled:shadow-none',
  outline:
    'h-10 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 shadow-xs transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
} as const;

/**
 * Text links and inline affordances (forgot password, terms, footer switch).
 */
export const authLink = {
  inline:
    'text-[13px] font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
  footer:
    'font-semibold text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200',
  subtle:
    'font-medium text-slate-600 underline-offset-2 transition-colors hover:text-violet-700 hover:underline dark:text-slate-300 dark:hover:text-violet-300',
} as const;

/**
 * Reassurance note rendered under a submit button.
 */
export const authNote = {
  secure: 'flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400',
} as const;

/**
 * Aside panel (left column) tokens used by `AuthLeftSection`.
 *
 * The aside deliberately speaks the homepage's hero vocabulary — badge →
 * display title with exactly one gradient clause → light body → product
 * preview → trust row — so signing in reads as a continuation of `/` rather
 * than a separate product. The type step-down (2.5rem vs the homepage's 3.35rem)
 * keeps the form card the focal point of the page.
 *
 * Surfaces and gradients are inherited from `marketingTheme`; only the sizes
 * that differ for a narrower column are owned here.
 */
export const authAside = {
  shell: 'relative hidden lg:block',
  badge: marketingTheme.badge.default,
  title:
    'mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-[2.5rem]',
  /** The single emphasised clause of the title. */
  titleAccent: marketingTheme.copy.gradient,
  body: 'mt-5 max-w-xl text-base font-light leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg',
  /** Decorative product preview; mirrors the homepage hero / analysis windows. */
  preview: 'relative mt-8',
  previewGlow:
    'absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-violet-500/10 via-transparent to-indigo-500/10 blur-2xl',
  /** Micro labels inside the preview windows (10px — keep slate-500 minimum). */
  microLabel:
    'text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400',
  trustList: 'mt-7 flex flex-wrap items-center gap-x-5 gap-y-2',
  trustItem: 'flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400',
  trustIcon: 'h-3.5 w-3.5 text-violet-600 dark:text-violet-400',
} as const;

export const authTheme = {
  authPage,
  authCard,
  authHeading,
  authField,
  authButton,
  authLink,
  authNote,
  authAside,
} as const;

export type AuthTheme = typeof authTheme;
