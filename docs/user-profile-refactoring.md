# User Profile Data Loading Refactoring

## Overview

This refactoring improves how user profile data is loaded and displayed throughout the main dashboard, providing better error handling, loading states, and user experience.

## Key Improvements

### 1. Enhanced User Profile Integration

- **Main Page**: Now properly displays user profile information including credit and energy tokens
- **Welcome Section**: Added personalized greeting with real-time token information
- **Dashboard Stats**: Enhanced to include user profile metrics (5 cards instead of 4)

### 2. Custom Hooks for Better Data Management

#### `useProfileData` Hook

```typescript
// Located: src/hooks/useProfileData.ts
const { profile, isLoading, displayName, email, isAuthenticated } = useProfileData();
```

#### `useTokenInfo` Hook

```typescript
const { creditTokens, energyTokens, formattedCreditTokens, formattedEnergyTokens } = useTokenInfo();
```

### 3. Reusable Components

#### `ProfileQuickView` Component

- **Location**: `src/components/custom/ProfileQuickView.tsx`
- **Features**:
  - Compact and full view modes
  - Token display with proper formatting
  - Error handling with retry functionality
  - Loading states

#### `DashboardLoading` Component

- **Location**: `src/components/custom/DashboardLoading.tsx`
- **Features**:
  - Comprehensive skeleton loading states
  - Configurable sections (welcome, stats, certifications)
  - Responsive design

#### `ProfileErrorState` Component

- **Location**: `src/components/custom/ProfileErrorState.tsx`
- **Features**:
  - User-friendly error messages
  - Retry functionality
  - Graceful degradation information

### 4. Enhanced Dashboard Stats

- **Updated**: `src/components/custom/DashboardStats.tsx`
- **New Features**:
  - Credit tokens display
  - Energy tokens display
  - Better error handling for profile loading failures
  - Improved loading states
  - Responsive grid layout (5 columns on large screens)

## Implementation Details

### Main Page Changes

1. **Welcome Section**: Added personalized welcome with token information
2. **Dashboard Header**: Improved layout and spacing
3. **Loading States**: Enhanced with better skeleton components
4. **Error Handling**: Added fallback states for profile loading failures

### Data Flow

```
FirebaseAuthContext → UserProfileContext → useProfileData → Components
```

### Error Handling Strategy

1. **Profile Loading Fails**: Show limited dashboard with certification data only
2. **Network Issues**: Provide retry mechanisms
3. **Authentication Issues**: Graceful fallback to basic user info

## Usage Examples

### Using Profile Data in Components

```typescript
import { useProfileData } from '@/src/hooks/useProfileData';

const MyComponent = () => {
  const { profile, isLoading, isError, displayName } = useProfileData();

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return <div>Welcome, {displayName}!</div>;
};
```

### Using Token Information

```typescript
import { useTokenInfo } from '@/src/hooks/useProfileData';

const TokenDisplay = () => {
  const { creditTokens, energyTokens, formattedCreditTokens } = useTokenInfo();

  return (
    <div>
      <span>Credits: {formattedCreditTokens}</span>
      <span>Energy: {energyTokens}</span>
    </div>
  );
};
```

### Using ProfileQuickView

```typescript
import { ProfileQuickView } from '@/src/components/custom/ProfileQuickView';

// Full view
<ProfileQuickView />

// Compact view for headers/navigation
<ProfileQuickView compact={true} />

// Without action buttons
<ProfileQuickView showActions={false} />
```

## Performance Optimizations

1. **SWR Caching**: Profile data is cached for 10 seconds
2. **Conditional Loading**: Profile only loads when user is authenticated
3. **Error Boundaries**: Prevent profile errors from breaking the entire dashboard
4. **Lazy Loading**: Components load only when needed

## Testing Considerations

### Test Scenarios

1. **Normal Loading**: Profile loads successfully
2. **Network Failure**: Profile API fails
3. **Authentication Issues**: User token expires
4. **Partial Data**: Some profile fields missing
5. **Slow Network**: Loading states display properly

### Error States to Test

- Profile API returns 401/403
- Profile API returns 500
- Network timeout
- Invalid response format

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for token updates
2. **Offline Support**: Cache profile data for offline viewing
3. **Progressive Loading**: Load critical data first, then enhance
4. **Personalization**: User preferences for dashboard layout
5. **Analytics**: Track profile loading performance

## File Structure

```
src/
├── hooks/
│   └── useProfileData.ts          # Custom hooks for profile data
├── components/custom/
│   ├── ProfileQuickView.tsx       # Reusable profile component
│   ├── DashboardLoading.tsx       # Loading states
│   ├── ProfileErrorState.tsx      # Error handling
│   └── DashboardStats.tsx         # Enhanced stats display
└── context/
    └── UserProfileContext.tsx     # Profile context provider
```

## Migration Notes

- No breaking changes to existing components
- Enhanced functionality is backward compatible
- Old components continue to work during gradual migration
- New hooks provide additional functionality without replacing existing patterns
