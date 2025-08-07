# Feature Flags Implementation

This document describes the feature flag system implemented to hide token-related displays and improve the overall UI/UX.

## Overview

The feature flag system allows for granular control over which features are displayed to users. This is particularly useful for:

- Hiding token-related displays during development or different business phases
- A/B testing different UI variations
- Gradual feature rollouts
- Improved user experience customization

## Configuration

The feature flags are defined in `/src/config/featureFlags.ts`:

```typescript
export const FeatureFlags = {
  // Token display related flags
  SHOW_TOKENS: false, // Hide token displays when false
  SHOW_TOKEN_PURCHASE: false, // Hide token purchase options when false
  SHOW_TOKEN_HISTORY: false, // Hide token history when false
  SHOW_TOKEN_BALANCE: false, // Hide token balance displays when false

  // UI/UX related flags
  SHOW_PRICING_TOKENS: false, // Hide token references in pricing when false
  SHOW_DASHBOARD_TOKENS: false, // Hide token displays in dashboard when false
  SHOW_PROFILE_TOKENS_TAB: false, // Hide tokens tab in profile when false

  // Subscription related flags
  SHOW_SUBSCRIPTION_FEATURES: true, // Show subscription features
  SHOW_PAYMENT_OPTIONS: true, // Show payment options

  // Stripe integration flags
  is_stripe_enabled: true, // Enable Stripe checkout in billing tab
} as const;
```

## Usage

### Basic Usage

```typescript
import { isFeatureEnabled } from '@/src/config/featureFlags';

// Conditionally render components
{
  isFeatureEnabled('SHOW_TOKEN_BALANCE') && <TokenBalanceComponent />;
}

// Conditional logic
const message = isFeatureEnabled('SHOW_DASHBOARD_TOKENS')
  ? 'You have tokens available'
  : 'Ready to continue your journey';

// Stripe billing example
{
  isFeatureEnabled('is_stripe_enabled') ? (
    <PricingPlansGrid />
  ) : (
    <div>Billing features are currently unavailable. Please contact support.</div>
  );
}
```

### In Components

The feature flags are integrated into the following components:

#### 1. Main Dashboard (`/app/main/page.tsx`)

- `SHOW_DASHBOARD_TOKENS`: Controls token display in welcome section and sidebar

#### 2. Profile Page (`/app/main/profile/client.tsx`)

- `SHOW_PROFILE_TOKENS_TAB`: Controls visibility of the entire tokens tab
- `SHOW_TOKEN_BALANCE`: Controls token balance displays in profile header

#### 3. ProfileQuickView (`/src/components/custom/ProfileQuickView.tsx`)

- `SHOW_TOKEN_BALANCE`: Controls token information in quick view component

#### 4. ProfileSettings (`/src/components/custom/ProfileSettings.tsx`)

- `SHOW_TOKEN_BALANCE`: Controls total tokens badge display

#### 5. Pricing Page (`/app/pricing/page.tsx`)

- `SHOW_PRICING_TOKENS`: Controls credit coins references in pricing plans
- Also affects FAQ sections and page descriptions

#### 6. Pricing Metadata (`/app/pricing/metadata.ts`)

- `SHOW_PRICING_TOKENS`: Controls SEO metadata descriptions and keywords

#### 7. Profile Billing Tab (`/app/main/profile/client.tsx`)

- `is_stripe_enabled`: Controls visibility of Stripe checkout components in the billing tab
  - When enabled: Shows full billing functionality including subscription status, management, and pricing plans
  - When disabled: Shows a fallback message with support contact information

## UI/UX Improvements

When tokens are hidden, the system provides improved user experience through:

### 1. Enhanced Welcome Messages

Instead of showing token counts, the dashboard shows:

- Progress-based messages for users with certifications
- Motivational messages for new users
- Action-oriented guidance

### 2. Progress Indicators

When token displays are hidden, the dashboard shows:

- Number of active certifications
- Number of completed certifications
- Visual progress indicators

### 3. Better Empty States

- Clear call-to-action messages for new users
- Helpful guidance on next steps
- Focus on learning journey rather than token economy

### 4. Improved Pricing Page

- Cleaner pricing plans without token confusion
- Focus on features and value rather than token mechanics
- Better onboarding flow for new users

## Benefits

### 1. Cleaner User Interface

- Removes potentially confusing token economy elements
- Focuses on core learning and certification features
- Reduces cognitive load for new users

### 2. Flexible Business Model

- Easy to switch between token-based and subscription-based models
- Can test different monetization strategies
- Gradual feature rollouts

### 3. Better User Onboarding

- Simpler initial experience for new users
- Focus on value proposition rather than mechanics
- Progressive disclosure of advanced features

### 4. A/B Testing Ready

- Easy to test different UI variations
- Data-driven decision making
- User preference optimization

## Implementation Details

### Profile Tab Hiding

When `SHOW_PROFILE_TOKENS_TAB` is false:

- The tokens tab is completely hidden from the profile page
- Tab navigation automatically adjusts
- No broken links or empty states

### Dashboard Token Displays

When `SHOW_DASHBOARD_TOKENS` is false:

- Welcome message focuses on progress and motivation
- Token counters are hidden
- Progress indicators replace token displays where appropriate

### Pricing Page Adaptations

When `SHOW_PRICING_TOKENS` is false:

- Credit coin references are removed from plan features
- FAQ sections about tokens are hidden
- Descriptions focus on features rather than token economics

## Future Enhancements

1. **Environment-Based Flags**: Different flag configurations for development, staging, and production
2. **User-Based Flags**: Different flags for different user types or segments
3. **Dynamic Flags**: Runtime configuration through admin interface
4. **Analytics Integration**: Track usage patterns for different flag configurations
5. **Gradual Rollouts**: Percentage-based feature releases

## Troubleshooting

### Common Issues

1. **Lint Errors**: When hiding features, unused imports may cause lint errors. Clean up imports after hiding features.

2. **Empty States**: Ensure alternative content is provided when features are hidden.

3. **Navigation Issues**: Update navigation and routing when hiding major sections like tabs.

### Best Practices

1. **Always Provide Alternatives**: When hiding features, ensure users have alternative paths to achieve their goals.

2. **Test All Combinations**: Test your application with different flag combinations to ensure no broken states.

3. **Document Changes**: Update documentation when modifying flag behavior.

4. **Performance**: Feature flags are evaluated at runtime, so keep complex logic minimal.

## Maintenance

To modify feature flags:

1. Update the `FeatureFlags` object in `/src/config/featureFlags.ts`
2. Test the application with the new configuration
3. Update this documentation if needed
4. Deploy and monitor for any issues

The feature flag system provides a robust foundation for managing the display of token-related features and improving the overall user experience of the Certestic platform.
