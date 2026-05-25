# Feature Flags

> **Source of truth**: `src/config/featureFlags.ts`, `app/main/billing/client.tsx`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the small but important feature-flag surface used by `certifai-app` to gate incomplete or environment-dependent functionality. This doc is the canonical reference for which flags exist, what type each flag has, and how components should consume them.

## Key Concepts

- **Feature flag**: a runtime constant that turns a capability on or off without changing the component tree structure everywhere.
- **Boolean feature flag**: a flag that can be read with `isFeatureEnabled()`.
- **Variant flag**: a non-boolean flag whose value selects between implementation modes.

## Current Flags

| Flag | Type | Current value | Purpose |
| ---- | ---- | ------------- | ------- |
| `STRIPE_INTEGRATION` | boolean | `false` | Enables the Stripe billing experience in authenticated billing routes |
| `DEMO_CREDENTIALS_CONSENT_ENABLED` | boolean | `true` | Controls whether demo credentials are behind an explicit consent gate |
| `DEMO_CREDENTIALS_SOURCE` | `'hardcoded' \| 'api'` | `'hardcoded'` | Chooses where demo credentials are sourced from |

## Public API

### `FeatureFlags`

`FeatureFlags` is the single source of truth object for all frontend flags.

### `FeatureFlagKey`

Represents every key in `FeatureFlags`.

### `BooleanFeatureFlagKey`

Narrows the key space to boolean-only flags so `isFeatureEnabled()` cannot be used on variant flags.

### `isFeatureEnabled(flag)`

Use this helper for boolean flags only.

```typescript
isFeatureEnabled('STRIPE_INTEGRATION')
```

### `getAllFeatureFlags()`

Returns the entire flag object and is the correct choice when code needs the non-boolean `DEMO_CREDENTIALS_SOURCE` variant.

## Usage Rules

- Use `isFeatureEnabled()` for boolean gating in components.
- Read `DEMO_CREDENTIALS_SOURCE` directly from `getAllFeatureFlags()` or `FeatureFlags` when variant behavior matters.
- Keep flag checks close to feature entry points instead of scattering duplicate conditionals across leaf components.
- Treat flags as temporary control points, not as substitutes for permissions or authentication checks.

## Known Consumers

| Consumer | Flag | Behavior |
| -------- | ---- | -------- |
| `app/main/billing/client.tsx` | `STRIPE_INTEGRATION` | Shows full billing/subscription UI when enabled; otherwise renders a temporary-unavailable fallback |
| Demo credentials UX | `DEMO_CREDENTIALS_CONSENT_ENABLED` | Determines whether the reveal flow requires explicit consent |
| Demo credentials data loading | `DEMO_CREDENTIALS_SOURCE` | Switches between hardcoded and API-backed credential sources |

## Invariants

- `isFeatureEnabled()` must only receive boolean flags.
- Variant flags such as `DEMO_CREDENTIALS_SOURCE` should never be coerced into booleans for convenience.
- Feature flags gate UX, not security boundaries. Protected routes still require normal auth and middleware enforcement.
- New flags belong in `src/config/featureFlags.ts`; do not invent ad hoc constants inside components.

## Adaptive Learning Note

Adaptive Learning is currently documented as a glossary / flag-adjacent concept only. It does not yet warrant a dedicated domain doc, so any rollout toggles for that area should be captured here first if they are added.

## Dangerous Areas / Anti-patterns

- Do not use string literals like `'STRIPE_INTEGRATION'` outside the typed flag helpers when avoidable.
- Do not mix variant flags into boolean-only helper code.
- Do not assume a disabled feature means the surrounding route can skip its normal loading or auth checks.
- Do not add environment-specific logic in multiple components when a single top-level flag gate will do.

## Related Docs

- [Stripe Billing](../billing/stripe-billing.md)
- [Client State](../state/client-state.md)
- [Product Glossary](../product/glossary.md)
- [Architecture: Next.js Conventions](nextjs-conventions.md)
