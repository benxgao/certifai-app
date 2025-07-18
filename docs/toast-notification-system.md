# Toast Notification System

## Overview

This application uses a comprehensive toast notification system built on top of `sonner` with shadcn/ui integration. The system provides standardized, accessible, and visually consistent notifications throughout the application.

## Features

- ✅ **Consistent Design**: All toasts follow the shadcn/ui design system
- 🎨 **Rich Colors**: Support for success, error, warning, and info states
- 🌙 **Dark Mode**: Automatic theme detection and styling
- ⏳ **Promise Support**: Built-in loading states for async operations
- 🔧 **Utility Functions**: Easy dismissal and confirmation dialogs
- 📱 **Responsive**: Optimized for mobile and desktop

## Usage

### Basic Import

```typescript
import { toastHelpers } from '@/src/lib/toast';
```

### Success Notifications

```typescript
// Basic success
toastHelpers.success.examSubmitted();
toastHelpers.success.answerSaved();
toastHelpers.success.profileUpdated();

// With custom action
toastHelpers.success.examCreated('exam-123'); // Includes "Start Exam" button
```

### Error Notifications

```typescript
// Standard errors
toastHelpers.error.examSubmissionFailed('Network timeout');
toastHelpers.error.answerSaveFailed('Connection lost');
toastHelpers.error.authenticationFailed();

// Generic error with custom message
toastHelpers.error.generic('Something went wrong with your request');
```

### Info and Warning Notifications

```typescript
// Info
toastHelpers.info.examAutoSave();
toastHelpers.info.passwordRequired();
toastHelpers.info.loadingData();

// Warnings
toastHelpers.warning.unsavedChanges();
toastHelpers.warning.examTimeRemaining(15); // 15 minutes remaining
toastHelpers.warning.slowConnection();
```

### Promise-based Notifications

```typescript
// For async operations
const submitExam = async () => {
  const promise = fetch('/api/submit-exam', { method: 'POST' });
  return toastHelpers.promise.submitExam(promise);
};

// Custom promise with options
toastHelpers.promise.createExam(promise, {
  loading: 'Creating your exam...',
  success: 'Exam created successfully!',
  error: 'Failed to create exam',
});
```

### Confirmation Dialogs

```typescript
toastHelpers.confirm(
  'Are you sure you want to delete this exam?',
  () => {
    // On confirm
    deleteExam();
  },
  () => {
    // On cancel (optional)
    console.log('Delete cancelled');
  },
);
```

### Utility Functions

```typescript
// Dismiss all toasts
toastHelpers.dismissAll();

// Dismiss specific toast
const toastId = toastHelpers.loading.examSubmission();
setTimeout(() => toastHelpers.dismiss(toastId), 3000);
```

## Integration with Exam System

The toast system is fully integrated with the exam submission flow:

### Answer Submission

- ✅ Success: "Answer saved" with brief 2-second duration
- ❌ Error: "Failed to save answer" with error details and retry guidance

### Exam Submission

- ✅ Success: "🎉 Exam submitted successfully!" with celebration emoji
- ❌ Error: "Failed to submit exam" with detailed error message
- ⚠️ Missing Info: "Cannot submit exam" with guidance to refresh

### Exam Creation

- ✅ Success: "✅ Exam created successfully!" with "Start Exam" action button
- ❌ Error: "Failed to create exam" with specific error details
- ⚠️ Rate Limited: "Rate limit exceeded" with reset time information

## Configuration

### Global Toaster Setup

The Toaster component is configured in `app/main/layout.tsx`:

```typescript
<Toaster
  richColors
  position="top-right"
  toastOptions={{
    duration: 4000,
    classNames: {
      toast:
        'group-[.toaster]:bg-white/95 group-[.toaster]:dark:bg-slate-900/95 group-[.toaster]:backdrop-blur-sm',
      title: 'group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-50',
      description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-400',
    },
  }}
  expand={false}
  visibleToasts={3}
/>
```

### Customization

Default durations by type:

- **Success**: 2-5 seconds (depending on importance)
- **Error**: 4-6 seconds (longer for user to read error details)
- **Warning**: 4-5 seconds
- **Info**: 3-4 seconds
- **Loading**: Until dismissed or promise resolves

## Best Practices

1. **Use Appropriate Types**: Choose the right notification type for the context
2. **Clear Messages**: Keep titles short and descriptions informative
3. **Action Buttons**: Add actions for important notifications (like "Start Exam")
4. **Error Handling**: Always provide actionable error messages
5. **Promise Toasts**: Use for async operations to show loading states
6. **Dismissal**: Long-running operations should be dismissible

## Testing

Use the ToastDemo component (`/src/components/demo/ToastDemo.tsx`) to test all notification types:

```typescript
import ToastDemo from '@/src/components/demo/ToastDemo';

// In your development environment
<ToastDemo />;
```

## Migration from Alerts

All JavaScript `alert()` calls have been replaced with appropriate toast notifications:

```typescript
// Before ❌
alert('Failed to submit exam: ' + error.message);

// After ✅
toastHelpers.error.examSubmissionFailed(error.message);
```

## Dependencies

- `sonner`: Core toast library
- `@/src/components/ui/sonner`: shadcn/ui wrapper component
- `next-themes`: Theme detection for proper styling
