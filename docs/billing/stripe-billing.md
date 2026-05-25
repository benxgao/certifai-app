# Stripe Billing

> **Source of truth**: `src/context/AccountContext.tsx`, `src/stripe/client/hooks/useUnifiedAccountData.ts`, `src/stripe/client/hooks/useCheckoutFlow.ts`, `src/stripe/client/hooks/useEnhancedCheckoutFlow.ts`, `src/stripe/client/hooks/useStripeHooks.tsx`, `src/stripe/client/swr.ts`, `src/components/billing/BillingComponents.tsx`, `app/main/billing/client.tsx`, `app/main/stripe/callback/client.tsx`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the frontend billing domain for authenticated users: unified account state, checkout/session creation, subscription management, and the Stripe checkout callback flow. This is the canonical doc for how billing UI should read subscription data and trigger Stripe-related actions.

## Key Concepts

- **AccountContext**: app-level context that exposes normalized account and subscription state to billing-aware components.
- **Unified account data**: authenticated response from `/api/stripe/account` containing account identity, Stripe customer state, subscription state, plan details, invoice fields, and timestamps.
- **Checkout session**: Stripe Checkout session created through `/api/stripe/checkout/create-session` and opened via the returned `checkout_url`.
- **Billing portal session**: Stripe-hosted self-service portal created through `/api/stripe/portal/create-session`.
- **Callback route**: `/main/stripe/callback`, which handles success/cancel query params after Stripe redirects the user back.

## Domain Boundary

This doc covers the **frontend billing surface** in `certifai-app`.

It includes:

- account/subscription state consumption in React,
- checkout and portal session creation,
- subscription cancellation/resumption UX,
- billing page and callback route behavior.

It does **not** document backend Stripe webhook handling or backend billing persistence rules. For frontend work, treat the `src/stripe/client/` layer and `AccountContext` as the stable integration boundary.

## Critical Invariants

- **Never call Stripe API endpoints directly from presentational components.** Components should consume `AccountContext` helpers or Stripe SWR/hooks instead of ad hoc `fetch()` calls.
- **Prefer `AccountContext` for page/component reads.** `AccountContext` is the stable source for authenticated billing state across dashboard routes.
- **Use `useAccountStatus()` for hook-level account logic.** It provides the normalized subscription booleans used by billing hooks and keeps components out of raw response-envelope handling.
- **Pricing and account status are separate concerns.** Pricing plans may be fetched independently, but account/subscription status is authenticated and should be derived from `/api/stripe/account`.
- **The callback route must refresh account state before assuming activation.** `useStripeCallback()` polls and refreshes because subscription state may lag behind the Checkout redirect by a few seconds.
- **Feature-flag billing UI at the page level.** `app/main/billing/client.tsx` gates the Stripe experience behind `isFeatureEnabled('STRIPE_INTEGRATION')`.

## Architecture Overview

```text
Pricing or billing action
  ↓
Stripe client hooks / Stripe SWR hooks
  ↓
AccountContext (for shared account state) + `/api/stripe/*` routes
  ↓
Billing page or callback UI reacts to normalized account status
```

### Main entry points

| Surface | Role |
| ------ | ---- |
| `app/main/billing/page.tsx` + `client.tsx` | Main authenticated billing and subscriptions page |
| `app/main/stripe/callback/page.tsx` + `client.tsx` | Handles Checkout success/cancel redirects |
| `src/context/AccountContext.tsx` | Shared account/subscription state for dashboard routes |
| `src/components/billing/BillingComponents.tsx` | Subscription overview and mutation UI |
| `src/stripe/client/hooks/` | High-level billing hooks |
| `src/stripe/client/swr.ts` | Stripe-specific SWR + mutation hooks |

## Shared Account State

### `AccountContextType`

`AccountContext` wraps authenticated routes and exposes a normalized billing view assembled from Firebase auth state plus `useAccountStatus()`.

#### Account and auth fields

- `account`
- `isLoading`
- `error`
- `isAuthenticated`
- `firebaseUserId`
- `apiUserId`
- `userEmail`

#### Derived billing flags

- `hasAccount`
- `hasStripeCustomer`
- `hasSubscription`
- `hasActiveSubscription`
- `isTrialing`
- `isCanceled`
- `subscriptionStatus`

#### Plan and billing fields

- `planId`
- `planName`
- `planAmount`
- `planCurrency`
- `currentPeriodStart`
- `currentPeriodEnd`
- `trialEnd`
- `cancelAtPeriodEnd`

#### Actions

- `refreshAccount()`

### Convenience hooks exposed by the context

| Hook | Use when | Returns |
| ---- | -------- | ------- |
| `useAccount()` | a component needs the full account context | the full `AccountContextType` |
| `useSubscriptionStatus()` | a component only cares about subscription booleans | `hasSubscription`, `hasActiveSubscription`, `isTrialing`, `isCanceled`, `subscriptionStatus` |
| `usePlanInfo()` | a component is rendering plan or billing dates | plan identifiers, amount/currency, current period, trial/cancel state |
| `useAccountInfo()` | a component needs identity/account metadata | account object, auth ids, email, `refreshAccount()` |

## Hook Inventory

### Core account hooks

| Hook | Purpose | Use when |
| ---- | ------- | -------- |
| `useUnifiedAccountData()` | Raw SWR hook for `/api/stripe/account` | You need raw SWR primitives such as `data`, `error`, `isLoading`, or `mutate` |
| `useAccountStatus()` | Recommended derived hook | You need pre-destructured booleans and plan/billing fields |
| `useSubscriptionStateUnified()` | Compatibility wrapper | Legacy subscription-state consumers still expect a subscription-shaped object |

### Checkout and flow hooks

| Hook | Purpose | Notes |
| ---- | ------- | ----- |
| `useCheckoutFlow()` | Creates checkout sessions and handles auth-required redirects | Validates `price_` IDs, prevents duplicate active subscriptions, redirects to `/signin` when needed |
| `useEnhancedCheckoutFlow()` | Wraps `useCheckoutFlow()` with more subscription-aware gating | Allows reactivation when canceled and exposes `subscriptionInfo`, navigation helpers, and composite loading state |
| `useStripeCallback()` | Handles Checkout redirect success/cancel processing | Polls account refresh up to 5 times at 2-second intervals before deciding success vs. delayed processing |

### Utility hooks

| Hook | Purpose |
| ---- | ------- |
| `useSubscriptionGate(requiredPlan?)` | Feature gating based on active subscription and optional plan id |
| `usePlanComparison()` | Local selection/comparison state for plan-picking UI |
| `useSubscriptionInsights()` | Derived renewal/value insight fields for billing-aware UI |

## Stripe SWR Layer

`src/stripe/client/swr.ts` owns the Stripe-specific client fetch and mutation hooks.

| Hook | Endpoint | Purpose |
| ---- | -------- | ------- |
| `usePricingPlans()` | `/api/stripe/pricing-plans` | Reads available pricing plans |
| `useCreateCheckoutSession()` | `/api/stripe/checkout/create-session` | Creates Stripe Checkout sessions |
| `useCreatePortalSession()` | `/api/stripe/portal/create-session` | Opens the Stripe billing portal |
| `useCancelSubscription()` | `/api/stripe/subscription/cancel` | Marks a subscription to cancel at period end |
| `useResumeSubscription()` | `/api/stripe/subscription/resume` | Re-enables renewal before period end |
| `useReactivateSubscription()` | `/api/stripe/subscription/reactivate` | Reactivates a previously ended subscription |
| `useUpdateSubscriptionPlan()` | `/api/stripe/subscription/update-plan` | Changes the current Stripe price |

### Important separation of concerns

- `src/stripe/client/swr.ts` handles direct API requests and mutations.
- `src/stripe/client/hooks/` adds billing-aware orchestration on top of those primitives.
- `src/context/AccountContext.tsx` is the preferred read interface for route/component trees.

## Checkout Flow

### Normal subscription start

1. A pricing UI triggers `useCheckoutFlow()` or `useEnhancedCheckoutFlow()`.
2. The hook validates the `price_id` format (`price_*`).
3. If the user is unauthenticated, the hook redirects to `/signin` with a `redirect` query back to pricing.
4. If the user already has an active subscription, the hook routes them to `/main/billing` instead of creating a duplicate Checkout session.
5. `useCreateCheckoutSession()` posts the selected price and URLs to `/api/stripe/checkout/create-session`.
6. On success, the browser is redirected to the returned Stripe Checkout URL.

### Reactivation / existing-subscription behavior

- `useEnhancedCheckoutFlow()` blocks new checkout for users with an active, non-canceled subscription.
- If the current subscription is canceled-but-still-active, the enhanced hook allows reactivation flow instead of treating the user as fully locked out.
- Components that only need “go manage billing” behavior can use `SubscriptionManagementCard`, which routes users to `/main/billing`.

## Billing Page Behavior

`app/main/billing/client.tsx` is the canonical billing route.

### What it renders

- **Subscription Status** accordion section using `ModernSubscriptionCard`
- **Subscription Actions** using `SubscriptionActionsCard` when the user has an active subscription
- **Available Plans** using `PricingPlansGrid`
- **Billing History** placeholder/invoice guidance area

### Important page rules

- The page uses `AccountContext` and its convenience hooks instead of hitting billing endpoints directly.
- The entire experience is gated behind `STRIPE_INTEGRATION`.
- The default open accordion section depends on whether the user already has an active subscription.

## Subscription Management UI

### `ModernSubscriptionCard`

This component reads from `AccountContext` and renders:

- current plan name and price,
- user email,
- status badge (free / active / trial / canceled),
- renewal, trial-end, or cancel-on date messaging.

### `SubscriptionActionsCard`

This component uses Stripe mutation hooks for lifecycle actions:

- `useCancelSubscription()` for cancel-at-period-end behavior
- `useResumeSubscription()` for resuming before the end date
- `refreshAccount()` after webhook-processing delay so the UI reflects the updated backend state

The current implementation intentionally waits briefly before refreshing after cancel/resume because webhook-driven state may not be visible instantly.

## Callback Flow

The callback route is `app/main/stripe/callback/`.

### Success path

1. Stripe redirects back with `session_id`.
2. `StripeCallbackClient` calls `useStripeCallback().handleCheckoutSuccess(sessionId)`.
3. The callback hook refreshes account data and polls `/api/stripe/account` up to 5 times, waiting 2 seconds between attempts.
4. If `is_active_subscription` becomes true, the user is sent to `/main` with a success toast.
5. If state is still lagging, the user is sent to `/main/billing` with a warning rather than a false failure.

### Cancel path

- Stripe redirects back with `canceled=true`.
- `handleCheckoutCancel()` shows a cancel toast and returns the user to `/main/billing`.

### Invalid callback path

- If neither `session_id` nor `canceled` is present, the client redirects to `/main/billing`.

## Server Utilities in This Domain

`src/stripe/server/index.ts` provides server-side helpers for authenticated Stripe-related requests.

| Function | Purpose |
| -------- | ------- |
| `serverFetchWithAuth()` | Builds authenticated server-side requests to Stripe-backed API endpoints |
| `handleAuthenticatedRequest()` | Wraps auth-required route logic with normalized success/error results |
| `getServerSubscriptionStatus()` | Reads subscription status on the server without throwing on unauthenticated users |
| `getServerPricingPlans()` | Fetches public pricing plans on the server |

These helpers are part of the billing architecture, but frontend components should still consume them through route/page abstractions rather than importing server utilities into client code.

## Dangerous Areas / Anti-patterns

- Do not call `/api/stripe/*` directly from presentational components when a billing hook or context helper already exists.
- Do not bypass `AccountContext` for repeated account reads across dashboard pages.
- Do not assume the Checkout redirect means subscription state is immediately updated; use the callback polling flow.
- Do not expose billing UI when `STRIPE_INTEGRATION` is disabled.
- Do not treat pricing plans and authenticated account status as the same data source.

## Related Docs

- [State: Client State](../state/client-state.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [API Connection](../api/api-connection.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
