/**
 * Index file for Stripe client components
 * Exports enhanced Stripe-related UI components and hooks
 */

// Enhanced components with unified account integration
export { PricingCard, PricingPlansGrid, SubscriptionStatusCard } from './EnhancedPricingComponents';
export { SubscriptionManagementCard } from './SubscriptionManagementCard';

export { UnifiedAccountDashboard } from './UnifiedAccountComponents';

// Export hooks
export { useCheckoutFlow } from '../hooks/useCheckoutFlow';
export { useEnhancedCheckoutFlow } from '../hooks/useEnhancedCheckoutFlow';
export {
  useUnifiedAccountData, // Use when you need raw SWR response (data, error, isLoading, mutate)
  useAccountStatus, // Recommended for most component use cases - provides destructured account properties
} from '../hooks/useUnifiedAccountData';
