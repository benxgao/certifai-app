# InfoTooltip Component - Standardized Tooltip System

## Overview

The `InfoTooltip` component provides a standardized tooltip implementation following the Certifai design system. It replaces inconsistent tooltip patterns across the application with a unified, accessible, and visually consistent solution.

## Features

✅ **Consistent Visual Design**: Uses `HelpCircle` icon with standardized slate color scheme
✅ **Responsive Behavior**: Hover on desktop, tap on mobile
✅ **Accessibility**: Proper keyboard navigation and ARIA attributes
✅ **Design System Compliance**: Follows Certifai style guide colors and patterns
✅ **Easy Integration**: Simple API with minimal configuration

## Usage

### Basic Usage

```tsx
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';

// Simple tooltip
<InfoTooltip content="This is helpful information for users." />;
```

### Advanced Usage

```tsx
// With custom styling and positioning
<InfoTooltip
  content="Custom tooltip with different positioning"
  sideOffset={8}
  iconSize="sm"
  className="max-w-md"
/>
```

### Real Examples

#### Form Labels with Help

```tsx
<div className="flex items-center gap-2">
  <Label>Number of Questions</Label>
  <InfoTooltip content="Choose how many questions you want. Recommended: 20-50 questions." />
</div>
```

#### Complex Content

```tsx
<InfoTooltip
  content={
    <div>
      <div className="font-semibold mb-1">AI-Powered Generation</div>
      <div className="text-xs">Questions are generated in the background.</div>
    </div>
  }
/>
```

## API Reference

### Props

| Prop         | Type              | Default | Description                                         |
| ------------ | ----------------- | ------- | --------------------------------------------------- |
| `content`    | `React.ReactNode` | -       | **Required.** The content to display in the tooltip |
| `className`  | `string`          | -       | Optional CSS classes for the tooltip content        |
| `sideOffset` | `number`          | `4`     | Distance from the trigger element                   |
| `iconSize`   | `'sm' \| 'md'`    | `'md'`  | Size of the help icon                               |

### Icon Sizes

- **`sm`**: `h-3.5 w-3.5` - For compact layouts
- **`md`**: `h-4 w-4` - Standard size (default)

## Design System Integration

### Color Scheme

- **Base**: `text-slate-500 dark:text-slate-400`
- **Hover**: `text-slate-700 dark:text-slate-200`
- **Transitions**: Smooth color transitions on hover

### Icon Choice

- Uses `HelpCircle` from Lucide React for consistent visual language
- Provides clear indication that help information is available
- Better recognition than generic info icons

## Migration Guide

### Before (Old Pattern)

```tsx
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger asChild>
    <FaInfoCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
  </TooltipTrigger>
  <TooltipContent side="top">
    <p>Helpful information</p>
  </TooltipContent>
</Tooltip>;
```

### After (New Pattern)

```tsx
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';

<InfoTooltip content="Helpful information" />;
```

## Components Updated

The following components have been migrated to use `InfoTooltip`:

1. **CreateExamModal** - Question count and focus areas tooltips
2. **CertificationStatusCard** - Daily exam limit tooltip
3. **ExamStatusCard** - Exam progress tooltip

## Benefits

### For Developers

- **Reduced Boilerplate**: One line vs 8+ lines of code
- **Consistent API**: Same props across all tooltip usages
- **Better Maintainability**: Single source of truth for tooltip styling
- **Type Safety**: Full TypeScript support

### For Users

- **Visual Consistency**: All tooltips look and behave the same
- **Better Accessibility**: Proper keyboard navigation and screen reader support
- **Improved UX**: Consistent hover states and responsive behavior
- **Cleaner Interface**: Standardized icon and styling reduces visual noise

## Future Enhancements

Potential improvements for the InfoTooltip component:

- **Positioning Options**: Add `side` prop for top/bottom/left/right positioning
- **Icon Variants**: Support for different icon types (warning, success, etc.)
- **Animation Controls**: Configurable animation timing and effects
- **Theme Integration**: Better integration with theme switching

---

This standardized approach ensures all tooltips across the Certifai application provide a consistent, accessible, and professional user experience while reducing development overhead.
