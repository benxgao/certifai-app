# Profile and Certifications Request Cancellation Fix

## Problem Description

The main page was experiencing issues where profile and certifications requests were being cancelled during initial load, causing data to not load properly and leaving users with empty dashboards.

## Root Causes Identified

1. **Aggressive Request Timeouts**: The `optimizedFetch` function was using a 5-second timeout, which was too short for some API operations during initial load.

2. **Race Conditions During Auth Setup**: Multiple SWR requests were being initiated simultaneously before the `apiUserId` was properly established, leading to cancelled requests.

3. **Poor Abort Signal Handling**: The fetch configuration wasn't properly distinguishing between timeout aborts and component cleanup aborts.

4. **Context Provider Timing Issues**: The `UserProfileProvider` and `UserCertificationsProvider` were making requests immediately, even when authentication was still in progress.

5. **Insufficient Error Retry Logic**: SWR wasn't properly configured to retry on recoverable errors like timeouts.

## Solutions Implemented

### 1. Enhanced Fetch Configuration (`src/lib/fetch-config.ts`)

- **Increased Default Timeout**: Changed from 5 seconds to 10 seconds for better reliability
- **Improved Abort Signal Handling**: Added logic to distinguish between timeout aborts and external aborts (component cleanup)
- **Better Error Classification**: Created specific error types (`CancelledError`, `TimeoutError`, `NetworkError`)

```typescript
// Enhanced error handling for different abort scenarios
if (error.name === 'AbortError') {
  if (existingSignal?.aborted) {
    // External abort (component unmounted, navigation, etc.)
    const cancelError = new Error('Request was cancelled');
    cancelError.name = 'CancelledError';
    throw cancelError;
  } else {
    // Timeout abort
    const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
    timeoutError.name = 'TimeoutError';
    throw timeoutError;
  }
}
```

### 2. Improved SWR Configuration (`src/swr/useAuthSWR.ts`)

- **Enhanced Error Handling**: Added specific handling for cancellation errors to prevent unnecessary retries
- **Increased Deduplication Time**: Changed from 2 seconds to 5 seconds to prevent duplicate requests
- **Better Throttling**: Increased focus throttle from 5 seconds to 10 seconds
- **Improved Retry Logic**: Added smart retry logic that handles different error types appropriately

```typescript
shouldRetryOnError: (error) => {
  // Don't retry on cancellation errors (component unmounted, navigation, etc.)
  if ((error as any)?.name === 'CancelledError') {
    console.log('Request was cancelled, not retrying');
    return false;
  }
  // ... other retry logic
};
```

### 3. Context Provider Optimization

#### UserProfileContext (`src/context/UserProfileContext.tsx`)

- **Conditional Fetching**: Only fetch profile data when `apiUserId` is available and auth is complete
- **Loading State Management**: Properly combine auth loading state with profile loading state

```typescript
// Only fetch profile data when we have apiUserId and auth is not loading
const shouldFetch = !authLoading && !!apiUserId;
const {
  data: profileResponse,
  error,
  isLoading,
  mutate,
} = useUserProfile(shouldFetch ? apiUserId : null);
```

#### UserCertificationsContext (`src/context/UserCertificationsContext.tsx`)

- **Same Conditional Logic**: Applied the same conditional fetching pattern
- **Combined Loading States**: Merged auth loading with certifications loading

### 4. Enhanced SWR Hook Configuration

#### Profile Hook (`src/swr/profile.ts`)

- **Increased Cache Time**: Extended deduplication interval from 15 seconds to 20 seconds
- **Added Retry Configuration**: Configured specific retry behavior for timeout and network errors
- **Smart Error Handling**: Only retry on recoverable errors

#### Certifications Hook (`src/swr/certifications.ts`)

- **Applied Same Optimizations**: Used consistent configuration across all data fetching hooks
- **Prevented Redundant Requests**: Increased cache times and throttling

### 5. AuthGuard Improvements (`src/components/custom/AuthGuard.tsx`)

- **Extended API Timeout**: Increased from 3 seconds to 5 seconds for better stability
- **Added Timeout Reset Logic**: Reset timeout when `apiUserId` becomes available
- **Better State Management**: Improved handling of various authentication states

### 6. Component Cleanup (`app/main/page.tsx`)

- **Added Cleanup Effect**: Implemented proper component unmounting cleanup to prevent memory leaks
- **State Reset**: Clear local state when component unmounts to prevent stale state issues

## Expected Improvements

1. **Reduced Request Cancellations**: Longer timeouts and better abort handling should significantly reduce cancelled requests
2. **Faster Initial Load**: Conditional fetching prevents unnecessary requests during auth setup
3. **Better User Experience**: Users should see data load consistently on the main page
4. **Improved Error Recovery**: Smart retry logic handles temporary network issues gracefully
5. **Reduced Server Load**: Increased caching and deduplication reduces redundant API calls

## Monitoring and Validation

To verify these fixes are working:

1. **Check Browser Network Tab**: Should see fewer cancelled requests during initial page load
2. **Monitor Console Logs**: Look for reduced "signal is aborted" errors
3. **Profile/Certifications Loading**: Data should load consistently on page refresh
4. **Performance**: Initial page load should be faster due to reduced request overhead

## Future Considerations

1. **Request Prioritization**: Consider implementing request priority levels for critical vs. non-critical data
2. **Offline Support**: Add proper offline handling for better resilience
3. **Progressive Loading**: Implement skeleton loading that adapts based on data availability
4. **Request Deduplication**: Consider implementing global request deduplication across components

This fix addresses the core issues causing request cancellations and should provide a much more stable and reliable user experience on the main dashboard page.
