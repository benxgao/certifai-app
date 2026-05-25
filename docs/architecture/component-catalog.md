# Component Catalog

> **Source of truth**: `src/components/`, `src/components/optimized.ts`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the component folder taxonomy used across `certifai-app`, when a new component belongs in each folder, and how to use the limited convenience barrel in `src/components/optimized.ts`.

## Key Concepts

- **Primitive component**: reusable UI building block with no business logic (`ui/`).
- **Domain component**: app-specific component that knows about certifications, exams, profile, or billing state (`custom/`, `billing/`, `auth/`).
- **Marketing primitive**: reusable public-site presentation layer component styled via the marketing theme (`marketing/`).
- **Optimized barrel**: a small export surface for a few performance-focused components and hooks, not a general import shortcut.

## Folder Catalog

| Folder | Purpose | Typical contents | Representative files |
| ----- | ------- | ---------------- | -------------------- |
| `src/components/ui/` | Base design-system primitives and layout helpers | Buttons, inputs, dialogs, cards, badges, loading states, wrappers | `button.tsx`, `card.tsx`, `loading-spinner.tsx`, `page-wrapper.tsx` |
| `src/components/custom/` | Main app-specific product components | Certification cards, exam views, dashboard sections, profile widgets | `CertificationGrid.tsx`, `ExamNavigation.tsx`, `ProfileSettings.tsx`, `DashboardStats.tsx` |
| `src/components/auth/` | Authentication and session flow components | Auth wrappers, verification, password reset, auth-specific layouts | `ServerAuthWrapper.tsx`, `EmailVerification.tsx`, `PasswordReset.tsx` |
| `src/components/billing/` | Subscription and billing UI | Subscription cards, billing actions, plan displays | `BillingComponents.tsx` |
| `src/components/navigation/` | Navigation-specific UI | Breadcrumbs and route-orientation helpers | `Breadcrumbs.tsx` |
| `src/components/landing/` | Landing-page-only compositions | Hero/supporting sections, landing-specific showcases | `LandingPageContent.tsx`, `PopularCertifications.tsx`, `ScreenshotSlideshow.tsx` |
| `src/components/marketing/` | Reusable marketing presentation layer | Page shells, section wrappers, badges, headings, themed cards | `MarketingPageShell.tsx`, `MarketingSection.tsx`, `MarketingCard.tsx` |
| `src/components/analytics/` | Analytics and consent-aware tracking components | GA bootstrap, page view tracking, consent-aware analytics | `GoogleAnalytics.tsx`, `ConsentAwareAnalytics.tsx`, `PageViewTracker.tsx` |
| `src/components/seo/` | SEO and structured-data components | JSON-LD, related-content blocks, SEO-oriented content sections | `JsonLd.tsx`, `CertificationSEO.tsx`, `SEOContentBlock.tsx` |
| `src/components/system/` | System-wide infrastructure messaging | Global error/status notifications | `SystemErrorNotificationBar.tsx` |
| `src/components/demo/` | Demo and example components | Notification examples, toast demos, showcase-only components | `NotificationBarDemo.tsx`, `ToastDemo.tsx`, `HideableNotificationExample.tsx` |
| `src/components/account/` | Account-focused examples and helpers | Example/demo account experiences, not the main billing domain | `AccountExamples.tsx` |

## Location Rules

- Put **generic, reusable primitives** in `ui/`. If the component can ship in another route without knowing certifai business objects, it probably belongs here.
- Put **public-site themed primitives** in `marketing/` when the main value is shared marketing presentation rather than product logic.
- Put **app-specific composed UI** in `custom/` when it depends on domain data, screen flow, or app-specific state.
- Put **auth journey UI** in `auth/` when the component is tightly coupled to sign-in, sign-up, password reset, or verification behavior.
- Put **subscription management UI** in `billing/` when the component renders plan, checkout, or account billing state.
- Put **routing/orientation helpers** in `navigation/`.
- Put **tracking/bootstrap components** in `analytics/` and **search/structured-data components** in `seo/`.
- Put **system-level notification surfaces** in `system/`.
- Put **examples and demo-only artifacts** in `demo/` or `account/`; do not place production workflow components there.
- If a component is business-specific but does not fit a narrower domain folder, default to `custom/`.

## `optimized.ts` Barrel

`src/components/optimized.ts` is intentionally tiny. It re-exports:

- `LoadingSpinner`, `PageLoadingSpinner`, `InlineSpinner` from `ui/loading-spinner`
- `PageWrapper`, `ScrollContainer` from `ui/page-wrapper`
- `ExamNavigation` from `custom/ExamNavigation`
- `useOptimizedScroll`, `useScrollIntersection` from `src/hooks/useOptimizedScroll`

### Rule for using the barrel

- Use `src/components/optimized.ts` only for the small set of shared, performance-focused exports already curated there.
- Do **not** turn it into a catch-all barrel for `src/components/`.
- Prefer direct imports from the source file when a component is folder-specific, one-off, or not explicitly part of the optimized surface.

## Extension Guidance

| If you are adding... | Preferred folder | Why |
| -------------------- | ---------------- | --- |
| A reusable button, input, dialog, or skeleton | `ui/` | Primitive/shared UI layer |
| A new exam, certification, dashboard, or profile panel | `custom/` | Product/domain-specific behavior |
| A sign-in, sign-up, reset-password, or verification surface | `auth/` | Auth workflow boundary |
| A billing card, plan status block, or subscription CTA | `billing/` | Stripe/subscription domain |
| A landing-only hero or public showcase section | `landing/` | Page-specific marketing composition |
| A reusable marketing shell/section/card | `marketing/` | Shared marketing design system |
| A tracking bootstrap or analytics opt-in dependent renderer | `analytics/` | Analytics-only concern |
| A JSON-LD/schema/meta companion component | `seo/` | Search/indexing concern |

## Dangerous Areas / Anti-patterns

- Do not put API-fetching policy into components. Data-fetching rules live in `src/swr/` and server-only helpers.
- Do not place reusable primitives in `custom/` just because it is convenient; that creates hidden duplication.
- Do not use `demo/` as a dumping ground for unfinished production code.
- Do not expand `optimized.ts` with broad wildcard exports; it should stay explicit and reviewable.

## Related Docs

- [Hooks Catalog](hooks-catalog.md)
- [Server Actions](server-actions.md)
- [Next.js Conventions](nextjs-conventions.md)
- [State: Client State](../state/client-state.md)
