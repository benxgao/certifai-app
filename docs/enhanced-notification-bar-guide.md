# Enhanced NotificationBar Component Guide

## Overview

The `NotificationBar` component has been significantly improved to align with the Certifai Design System and Style Guide. It now features glass-morphism styling, enhanced visual hierarchy, better accessibility, and improved user experience.

## Key Improvements

### 🎨 Design System Integration

- **Glass-morphism Effects**: Enhanced backdrop blur with `backdrop-blur-sm` for modern aesthetics
- **Gradient Backgrounds**: Proper violet/blue/purple gradients matching the style guide
- **Enhanced Shadows**: Improved depth with `shadow-sm hover:shadow-md` transitions
- **Consistent Typography**: Responsive text sizing with proper font weights

### 🚀 New Features

1. **Variant Icons**: Each variant now has a meaningful icon (Info, CheckCircle, AlertTriangle, etc.)
2. **Enhanced Mode**: Optional glass-morphism styling with decorative gradient orbs
3. **Custom Icons**: Support for custom icons to override defaults
4. **Improved Animations**: Smooth transitions and hover effects
5. **Better Accessibility**: Enhanced focus indicators and ARIA labels
6. **Responsive Design**: Better mobile experience with proper spacing

### 📱 New Variants

- `info` - General information (blue theme with Info icon)
- `success` - Positive actions (emerald theme with CheckCircle icon)
- `warning` - Important alerts (amber theme with AlertTriangle icon)
- `promo` - Marketing offers (violet theme with Sparkles icon)
- `announcement` - System updates (blue theme with Megaphone icon)
- `beta` - New features (indigo/pink theme with Sparkles icon)

## Usage

### Basic Usage

```tsx
import EnhancedNotificationBar from '@/src/components/custom/EnhancedNotificationBar';

<EnhancedNotificationBar
  message="Your action was successful!"
  variant="success"
  ctaText="View Details"
  ctaLink="/details"
  dismissible
  onDismiss={() => setShowNotification(false)}
  showIcon
  enhanced={false} // Disable enhanced styling for basic appearance
/>;
```

### Enhanced Mode

````tsx
import EnhancedNotificationBar from '@/src/components/custom/EnhancedNotificationBar';
// OR
import NotificationBar from '@/src/components/custom/NotificationBar';

### Enhanced Mode (Default)

```tsx
import EnhancedNotificationBar from '@/src/components/custom/EnhancedNotificationBar';

<EnhancedNotificationBar
  message="🎉 Welcome to the new dashboard experience!"
  variant="promo"
  ctaText="Take Tour"
  ctaLink="/tour"
  showIcon
/>;

// Or use the enhanced wrapper
<EnhancedNotificationBar
  message="🎉 Welcome to the new dashboard experience!"
  variant="promo"
  ctaText="Take Tour"
  ctaLink="/tour"
  showIcon
/>
````

### Custom Icon

```tsx
import { Star } from 'lucide-react';

<NotificationBar
  message="Beta feature available!"
  variant="beta"
  customIcon={<Star className="h-5 w-5" />}
  enhanced={true}
/>;
```

## Props

### NotificationBarProps

| Prop          | Type                                                                      | Default  | Description                               |
| ------------- | ------------------------------------------------------------------------- | -------- | ----------------------------------------- |
| `message`     | `string`                                                                  | -        | **Required.** The main message to display |
| `ctaText`     | `string`                                                                  | -        | Optional call-to-action text              |
| `ctaLink`     | `string`                                                                  | -        | Optional CTA link                         |
| `variant`     | `'info' \| 'success' \| 'warning' \| 'promo' \| 'announcement' \| 'beta'` | `'info'` | Color variant                             |
| `dismissible` | `boolean`                                                                 | `false`  | Whether the notification can be dismissed |
| `onDismiss`   | `() => void`                                                              | -        | Callback when notification is dismissed   |
| `className`   | `string`                                                                  | -        | Additional CSS classes                    |
| `show`        | `boolean`                                                                 | `true`   | Whether to show the notification          |
| `showIcon`    | `boolean`                                                                 | `true`   | Whether to show the variant icon          |
| `customIcon`  | `React.ReactNode`                                                         | -        | Custom icon to override the default       |
| `enhanced`    | `boolean`                                                                 | `false`  | Whether to enable glass-morphism styling  |

## Styling Guide

### Color System

The component follows the Certifai color system with proper contrast ratios:

```css
/* Example: Success variant */
--bg-gradient: from-emerald-50/95 via-green-50/90 to-emerald-50/95
--border-color: border-emerald-200/60 dark:border-emerald-700/60
--text-color: text-emerald-900 dark:text-emerald-100
--icon-color: text-emerald-600 dark:text-emerald-400
```

### Enhanced Mode Features

When `enhanced={true}`:

1. **Decorative Gradient Orbs**: Subtle background elements for depth
2. **Enhanced Backdrop Blur**: `backdrop-blur-sm` for glass-morphism
3. **Animation Line**: Subtle gradient line at the bottom
4. **Improved Shadows**: Enhanced depth with hover effects

### Dark Mode Support

All variants include proper dark mode support:

- Semi-transparent backgrounds with proper opacity
- Appropriate contrast ratios for accessibility
- Consistent color schemes across light/dark themes

## Implementation Examples

### Marketing Page Header

```tsx
<NotificationBar
  message="🚀 Try our platform instantly with demo account - username/password: demo@certestic.com"
  variant="promo"
  enhanced={true}
  showIcon={true}
/>
```

### System Maintenance Alert

```tsx
<NotificationBar
  message="Scheduled maintenance on Sunday 2AM-4AM EST. All services will be temporarily unavailable."
  variant="announcement"
  ctaText="More Info"
  ctaLink="/maintenance"
  showIcon
/>
```

### Success Confirmation

```tsx
<NotificationBar
  message="Your certification exam has been successfully completed with a score of 89%!"
  variant="success"
  ctaText="View Results"
  ctaLink="/results"
  dismissible
  onDismiss={() => setShowSuccess(false)}
/>
```

### Beta Feature Announcement

```tsx
<NotificationBar
  message="Try our new adaptive learning engine - personalized question difficulty!"
  variant="beta"
  ctaText="Join Beta"
  ctaLink="/beta"
  enhanced={true}
/>
```

## Best Practices

### 1. Choose Appropriate Variants

- `info`: General information, tips, neutral announcements
- `success`: Completed actions, achievements, positive confirmations
- `warning`: Time-sensitive alerts, important notices
- `promo`: Marketing offers, feature promotions
- `announcement`: System updates, maintenance notices
- `beta`: New features, experimental functionality

### 2. Use Enhanced Mode Strategically

- Enable `enhanced={true}` for dashboard pages and premium experiences
- Use standard mode for simple informational notifications
- Consider performance impact of backdrop blur on lower-end devices

### 3. Accessibility Considerations

- Always provide meaningful message text
- Use `dismissible` for non-critical notifications
- Ensure sufficient color contrast in custom implementations
- Test with keyboard navigation and screen readers

### 4. Responsive Design

- Messages automatically wrap on mobile devices
- CTA buttons stack appropriately on smaller screens
- Icons scale properly across breakpoints

## Integration with Existing Systems

### Toast Notifications

The NotificationBar works seamlessly with the existing toast system:

```tsx
// Show persistent notification bar
<EnhancedNotificationBar
  message="Beta feature available!"
  variant="beta"
  ctaText="Try Now"
  ctaLink="/beta"
/>;

// Trigger toast for user actions
const handleBetaSignup = () => {
  toastHelpers.success.generic('Successfully joined beta program!');
};
```

### Global State Management

For app-wide notifications:

```tsx
// Context or state management
const [notifications, setNotifications] = useState([
  {
    id: 'promo-1',
    message: '🎉 50% off premium courses!',
    variant: 'promo',
    ctaText: 'Claim Offer',
    ctaLink: '/pricing',
  },
]);

// Render notifications
{
  notifications.map((notification) => (
    <NotificationBar
      key={notification.id}
      {...notification}
      dismissible
      onDismiss={() => removeNotification(notification.id)}
    />
  ));
}
```

## Performance Considerations

### Backdrop Blur Impact

- Enhanced mode uses `backdrop-blur-sm` which can impact performance on lower-end devices
- Consider using standard mode for mobile or when performance is critical
- Test on various devices to ensure smooth animations

### Animation Optimizations

- All animations use CSS transforms for better performance
- Transitions are optimized with appropriate duration and easing
- GPU acceleration is enabled for smooth effects

## Migration from Previous Version

### Breaking Changes

1. **Variant Changes**: Added new variants (`announcement`, `beta`)
2. **Icon Support**: Icons are now shown by default (`showIcon={true}`)
3. **Enhanced Styling**: New `enhanced` prop for glass-morphism effects

### Migration Steps

1. **Update Imports**: No changes needed for basic usage
2. **Add Enhanced Mode**: Consider adding `enhanced={true}` for dashboard pages
3. **Enable Icons**: Set `showIcon={true}` for better visual hierarchy
4. **Test Variants**: Review existing variants and consider new ones

### Before/After Comparison

```tsx
// Before
<NotificationBar
  message="Update available"
  variant="info"
/>

// After (enhanced)
<NotificationBar
  message="Update available"
  variant="info"
  enhanced={true}
  showIcon={true}
  dismissible
  onDismiss={() => setShowUpdate(false)}
/>
```

## Demo and Testing

View the complete demo at `/demo` to see all variants and features in action.

The enhanced NotificationBar provides a modern, accessible, and visually consistent notification system that aligns perfectly with the Certifai Design System while maintaining excellent performance and user experience.
