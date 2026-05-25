# Consent Workflow

> **Source of truth**: `src/lib/consent.ts`, `src/components/custom/ConsentBanner.tsx`, `src/components/analytics/ConsentAwareAnalytics.tsx`, `src/components/custom/CookiePreferencesLink.tsx`, `app/layout.tsx`, `src/components/custom/NotificationBar.tsx`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the user-facing consent flows in `certifai-app`, with a primary focus on the site-wide cookie/analytics consent banner. It also clarifies the scope boundary between cookie consent and the separate demo-credentials consent modal so assistants do not conflate the two.

## Key Concepts

- **Cookie consent**: the site-wide accept/decline decision stored in browser `localStorage` and used to gate analytics.
- **Consent banner**: the fixed bottom banner that appears when the user has not yet recorded a consent choice.
- **Consent update event**: the `certestic:consent-updated` DOM event used to notify listeners that consent changed.
- **Cookie preferences reset**: explicit clearing of saved consent so the banner reappears.
- **Demo credentials consent**: a separate modal confirmation flow used for demo login disclosure, not part of the analytics cookie system.

## Scope Boundary

This workflow doc covers two related but distinct consent mechanisms:

1. **Site-wide analytics cookie consent** — implemented by `src/lib/consent.ts`, `ConsentBanner`, `ConsentAwareAnalytics`, and `CookiePreferencesLink`.
2. **Demo credentials disclosure consent** — implemented inside `NotificationBar` and controlled by `DEMO_CREDENTIALS_CONSENT_ENABLED`.

Only the first flow persists to `CONSENT_KEY` in local storage and controls whether Google Analytics loads.

## Current Consent Model

The current implementation is intentionally simple.

| Consent area | Current behavior |
| ------------ | ---------------- |
| Required / functional site behavior | always available; not user-toggleable through the banner |
| Analytics | gated by explicit user choice (`accepted` vs `declined`) |
| Marketing cookies | no separate category in the current implementation |

So while the banner is commonly described as “cookie consent,” the active technical effect today is **analytics enable/disable**, not a multi-category preference center.

## Persistence Model

`src/lib/consent.ts` defines the persistence layer.

### Stored key

- `CONSENT_KEY = 'certestic_cookie_consent'`

### Stored values

- `accepted`
- `declined`
- `null` / missing value = no choice has been made yet

### Public API

| Helper | Purpose |
| ------ | ------- |
| `getConsent()` | returns current saved choice or `null` |
| `setConsent(value)` | stores `accepted` or `declined` |
| `hasAnalyticsConsent()` | convenience helper for analytics gating |
| `clearConsent()` | removes saved choice so the banner shows again |

All helpers are safe around server rendering; they no-op or return `null` when `window` is unavailable.

## Global Mounting Points

The consent flow is mounted globally in `app/layout.tsx`.

### Relevant layout behavior

- `ConsentAwareAnalytics` is rendered in the body only if `NEXT_PUBLIC_GA_TRACKING_ID` exists.
- `ConsentBanner` is rendered globally near the bottom of the layout.
- `ConditionalFooter` keeps the marketing footer off `/main/*` routes, but the consent banner itself remains globally available.

## Cookie Consent Flow

```mermaid
graph TD
    A[User loads page] --> B[ConsentBanner mounts]
    B --> C{Saved consent exists?}
    C -->|No| D[Show banner]
    C -->|Yes| E[Hide banner]

    D --> F{User choice}
    F -->|Accept| G[setConsent('accepted')]
    F -->|Decline| H[setConsent('declined')]

    G --> I[Dispatch certestic:consent-updated]
    H --> I
    I --> J[Hide banner]
    J --> K[ConsentAwareAnalytics re-checks consent]
    K -->|accepted| L[Render GoogleAnalytics]
    K -->|declined| M[Do not render GoogleAnalytics]
```

## Banner Trigger Conditions

`ConsentBanner` shows only when:

- it is running on the client, and
- `getConsent()` returns `null`.

It does **not** re-open automatically once a choice is stored unless consent is explicitly cleared.

## Accept / Decline Behavior

### Accept

When the user accepts:

1. `setConsent('accepted')` stores the choice.
2. The app dispatches `certestic:consent-updated`.
3. The banner hides.
4. `ConsentAwareAnalytics` re-checks consent and renders Google Analytics if a GA measurement id is configured.

### Decline

When the user declines:

1. `setConsent('declined')` stores the choice.
2. The app dispatches `certestic:consent-updated`.
3. The banner hides.
4. `ConsentAwareAnalytics` re-checks consent and continues rendering nothing.

## Analytics Gating

`src/components/analytics/ConsentAwareAnalytics.tsx` is the runtime analytics gate.

### Behavior

- On mount, it calls `hasAnalyticsConsent()`.
- It subscribes to the `certestic:consent-updated` DOM event.
- It renders `<GoogleAnalytics />` only when consent is currently accepted.

This means analytics activation is reactive: the user can accept cookies and analytics begins without a full route transition.

## Cookie Preferences Reset Flow

The footer exposes `CookiePreferencesLink`.

### What it does

1. calls `clearConsent()` to remove the saved value,
2. dispatches `certestic:consent-updated`,
3. reloads the page.

The reload guarantees the banner is visible again on the next render pass.

## Demo Credentials Consent Flow

This is **not** part of the analytics cookie system, but it is a second consent-like UX in the app.

### Where it lives

- `src/components/custom/NotificationBar.tsx`
- gated by `DEMO_CREDENTIALS_CONSENT_ENABLED`

### What it does

- opens a modal before revealing demo login details,
- requires the user to review and check a confirmation box,
- may run an async `onConsentAccept()` callback,
- does not write to `CONSENT_KEY` and does not affect analytics.

Document it here so future work does not accidentally route demo-credentials consent through the cookie-consent storage model.

## Practical Rules

- Use `src/lib/consent.ts` as the only storage API for analytics cookie consent.
- Dispatch `certestic:consent-updated` whenever the stored cookie-consent value changes.
- Gate Google Analytics through `ConsentAwareAnalytics`, not inline conditional snippets scattered across pages.
- Keep demo-credentials consent separate from cookie consent unless product requirements explicitly merge them.

## Dangerous Areas / Anti-patterns

- Do not assume the app currently supports category-by-category consent preferences; it is a binary analytics consent model today.
- Do not read/write `localStorage` consent keys ad hoc outside `src/lib/consent.ts`.
- Do not load Google Analytics directly in layout or page components without going through `ConsentAwareAnalytics`.
- Do not confuse demo-credentials consent with the site-wide cookie banner.

## Related Docs

- [Security: Auth Patterns](../security/auth-patterns.md)
- [Signin Workflow](signin-workflow.md)
- [Feature Flags](../architecture/feature-flags.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
