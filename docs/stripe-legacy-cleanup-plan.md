# Stripe Integration Legacy Cleanup - Action Plan

## Analysis Summary

After analyzing the codebase, I've identified the following components and functions that need to be refactored or removed:

## 🔍 **Current Usage Analysis**

### **Components Currently Being Used:**

1. `/app/main/billing/client.tsx` - Using legacy components:
   - `PricingPlansGrid`
   - `SubscriptionStatusCard`
   - `SubscriptionManagementCard`
   - `SubscriptionHistoryCard`
   - `useSubscriptionState`

### **Legacy Components to Replace/Remove:**

1. **PricingComponents.tsx** - Legacy pricing components
2. **SubscriptionComponents.tsx** - Legacy subscription components
3. **Legacy SWR hooks** - Replaced by unified account data

### **Enhanced Components (Keep):**

1. **EnhancedPricingComponents.tsx** - New unified components
2. **UnifiedAccountComponents.tsx** - New account dashboard
3. **useUnifiedAccountData** - New unified hook
4. **useEnhancedCheckoutFlow** - New checkout flow

## 🚀 **Refactoring Strategy**

### **Phase 1: Update Active Usage**

- [x] Replace legacy components in `/app/main/billing/client.tsx`
- [x] Update imports to use enhanced components
- [x] Test functionality after replacement

### **Phase 2: Remove Legacy Code**

- [x] Remove legacy SWR hooks that are no longer used
- [x] Remove legacy component files
- [x] Remove legacy utility functions
- [x] Clean up exports in index files

### **Phase 3: Clean Up Backend**

- [x] Mark backend legacy methods as deprecated
- [x] Add migration warnings where appropriate
- [x] Keep backward compatibility for transition period

## 📋 **Detailed Action Items**

### **1. Legacy SWR Hooks to Remove:**

```typescript
// REMOVE from src/stripe/client/swr.ts
export function useSubscriptionStatus(); // Replaced by useUnifiedAccountData
export function useSubscriptionHistory(); // Replaced by useUnifiedAccountData
export function useSubscriptionState(); // Replaced by useUnifiedAccountData
```

### **2. Legacy Components to Remove:**

```typescript
// REMOVE src/stripe/client/components/PricingComponents.tsx
export function PricingCard(); // Replaced by EnhancedPricingCard
export function PricingPlansGrid(); // Replaced by PricingSection
export function SubscriptionStatusCard(); // Replaced by SubscriptionStatus

// REMOVE src/stripe/client/components/SubscriptionComponents.tsx
export function SubscriptionManagementCard(); // Replaced by enhanced components
export function SubscriptionHistoryCard(); // Replaced by unified account data
```

### **3. Legacy Utility Functions to Remove:**

```typescript
// REMOVE from src/stripe/db.ts
export function formatSubscriptionForDisplay(); // No longer used
export function formatPricingPlanForDisplay(); // No longer used
export function getSubscriptionStatusInfo(); // No longer used
```

## 🔄 **Migration Steps**

### **Step 1: Update Billing Client**

Replace legacy components with enhanced versions in billing page.

### **Step 2: Remove Legacy Files**

- Delete `PricingComponents.tsx`
- Delete `SubscriptionComponents.tsx`
- Remove legacy functions from `db.ts`

### **Step 3: Clean SWR Hooks**

Remove legacy hooks that are no longer used anywhere in the codebase.

### **Step 4: Update Exports**

Update index files to export only the enhanced components.

### **Step 5: Update Documentation**

Update all documentation to reference only the new enhanced components.

## ✅ **Benefits After Cleanup**

### **Bundle Size Reduction:**

- Removed ~500+ lines of legacy code
- Eliminated duplicate functionality
- Simplified component tree

### **Maintenance Benefits:**

- Single source of truth for Stripe data
- Consistent API patterns
- Simplified debugging

### **Developer Experience:**

- Clearer component hierarchy
- Better TypeScript support
- Unified data access patterns

## 🚨 **Breaking Changes**

### **Components Removed:**

- `PricingCard` → Use `EnhancedPricingCard`
- `PricingPlansGrid` → Use `PricingSection`
- `SubscriptionStatusCard` → Use `SubscriptionStatus`
- `SubscriptionManagementCard` → Use enhanced checkout flow
- `SubscriptionHistoryCard` → Use `UnifiedAccountDashboard`

### **Hooks Removed:**

- `useSubscriptionStatus` → Use `useUnifiedAccountData`
- `useSubscriptionHistory` → Use `useUnifiedAccountData`
- `useSubscriptionState` → Use `useUnifiedAccountData`

### **Utility Functions Removed:**

- `formatSubscriptionForDisplay` → Use built-in formatting in components
- `formatPricingPlanForDisplay` → Use built-in formatting in components
- `getSubscriptionStatusInfo` → Use unified account data status

## 📖 **Migration Guide for Developers**

### **Before (Legacy):**

```tsx
import {
  PricingPlansGrid,
  SubscriptionStatusCard,
  useSubscriptionState,
} from '@/src/stripe/client/components';

function BillingPage() {
  const { hasActiveSubscription } = useSubscriptionState();

  return (
    <div>
      <SubscriptionStatusCard />
      <PricingPlansGrid />
    </div>
  );
}
```

### **After (Enhanced):**

```tsx
import {
  PricingSection,
  SubscriptionStatus,
  useUnifiedAccountData,
} from '@/src/stripe/client/components';

function BillingPage() {
  const { hasActiveSubscription } = useUnifiedAccountData();

  return (
    <div>
      <SubscriptionStatus />
      <PricingSection />
    </div>
  );
}
```

## 🎯 **Success Criteria**

- [x] All legacy components replaced with enhanced versions
- [x] No broken imports or missing dependencies
- [x] Billing page functionality maintained
- [x] Bundle size reduced
- [x] Type safety maintained
- [x] Documentation updated
- [x] Migration guide provided

This cleanup will result in a cleaner, more maintainable codebase with unified Stripe integration patterns.
