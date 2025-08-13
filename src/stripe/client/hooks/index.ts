/**
 * Index file for Stripe client hooks
 */

export {
  useStripeCallback,
  useSubscriptionGate,
  usePlanComparison,
  useSubscriptionInsights,
} from './useStripeHooks';

export { useCheckoutFlow } from './useCheckoutFlow';
export { useEnhancedCheckoutFlow } from './useEnhancedCheckoutFlow';
export {
  useUnifiedAccountData, // Use when you need: 1) Raw SWR response (data, error, isLoading, mutate), 2) Custom error handling, 3) Direct access to SWR cache
  useAccountStatus, // Recommended for most use cases - provides pre-destructured account properties and computed flags
  type UnifiedAccountData,
} from './useUnifiedAccountData';
