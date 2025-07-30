# Reusable Accordion Components

This document describes the new reusable accordion components that were extracted from the question explanations section and can be used throughout the application.

## Components Overview

### 1. CustomAccordion

The base reusable accordion component that provides flexible styling and behavior options.

### 2. ExplanationAccordion

A specialized accordion component for displaying question explanations with blue-themed styling.

### 3. TopicsAccordion

A specialized accordion component for displaying exam topics with violet-themed styling.

### 4. ExamTopicsDisplay (Refactored)

The existing component now supports both accordion and non-accordion display modes.

## Usage Examples

### CustomAccordion

```tsx
import { CustomAccordion } from '@/components/custom/CustomAccordion';
import { FaInfo } from 'react-icons/fa';

const accordionItems = [
  {
    id: 'item1',
    icon: <FaInfo className="w-4 h-4 text-blue-600" />,
    trigger: (
      <div>
        <span className="font-medium">Item Title</span>
        <p className="text-sm text-gray-600">Item subtitle</p>
      </div>
    ),
    content: <div>Your content here</div>,
    disabled: false,
  },
];

<CustomAccordion
  items={accordionItems}
  type="single"
  collapsible={true}
  variant="default" // or "explanation", "topics", "custom"
  className="my-4"
/>;
```

### ExplanationAccordion

```tsx
import { ExplanationAccordion } from '@/components/custom/ExplanationAccordion';

<ExplanationAccordion
  explanations="This is the detailed explanation of the answer..."
  triggerTitle="View Detailed Explanation"
  triggerSubtitle="Click to see the reasoning behind the correct answer"
  className="mt-6"
/>;
```

### TopicsAccordion

```tsx
import { TopicsAccordion } from '@/components/custom/TopicsAccordion';

const topics = [
  {
    topic_name: 'JavaScript Fundamentals',
    question_count: 5,
    question_ids: ['q1', 'q2', 'q3', 'q4', 'q5'],
  },
  // ... more topics
];

<TopicsAccordion
  topics={topics}
  totalTopics={3}
  totalQuestions={15}
  showAsAccordion={true}
  defaultExpanded={false}
  className="mb-4"
/>;
```

### ExamTopicsDisplay (Refactored)

```tsx
import { ExamTopicsDisplay } from '@/components/custom/ExamTopicsDisplay';

// Traditional card view (existing behavior)
<ExamTopicsDisplay
  topics={topics}
  totalTopics={3}
  totalQuestions={15}
  useAccordion={false}
  className="mb-4"
/>

// New accordion view
<ExamTopicsDisplay
  topics={topics}
  totalTopics={3}
  totalQuestions={15}
  useAccordion={true}
  defaultExpanded={true}
  className="mb-4"
/>
```

## Styling Variants

### Default Variant

- Clean white background with subtle borders
- Hover effects with slate colors
- Suitable for general content

### Explanation Variant

- Blue gradient theme matching question explanations
- Lightbulb icon and blue color scheme
- Optimized for educational content

### Topics Variant

- Violet gradient theme matching topic displays
- Book icon and violet color scheme
- Includes question counts and hover effects

### Custom Variant

- No default styling applied
- Fully customizable through className props
- Use when you need complete control over styling

## Component Props

### CustomAccordion Props

```typescript
interface CustomAccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  className?: string;
  accordionClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'explanation' | 'topics' | 'custom';
}
```

### ExplanationAccordion Props

```typescript
interface ExplanationAccordionProps {
  explanations: string;
  className?: string;
  triggerTitle?: string;
  triggerSubtitle?: string;
}
```

### TopicsAccordion Props

```typescript
interface TopicsAccordionProps {
  topics: Topic[];
  totalTopics: number;
  totalQuestions: number;
  isLoading?: boolean;
  className?: string;
  showAsAccordion?: boolean;
  defaultExpanded?: boolean;
}
```

## Refactoring Benefits

1. **Reusability**: The accordion functionality can now be used throughout the application
2. **Consistency**: All accordions follow the same interaction patterns and accessibility standards
3. **Maintainability**: Changes to accordion behavior can be made in one place
4. **Flexibility**: Different styling variants for different use cases
5. **Type Safety**: Full TypeScript support with proper interfaces

## Migration Guide

### From Question Card Accordion

The original inline accordion in `QuestionCard.tsx` has been replaced with:

```tsx
// Before
<Accordion type="single" collapsible className="...">
  <AccordionItem value="item-1" className="...">
    // ... accordion content
  </AccordionItem>
</Accordion>

// After
<ExplanationAccordion explanations={question.explanations} />
```

### From Topics Display

The `ExamTopicsDisplay` component now supports accordion mode:

```tsx
// Before (still works)
<ExamTopicsDisplay topics={topics} totalTopics={3} totalQuestions={15} />

// New accordion option
<ExamTopicsDisplay
  topics={topics}
  totalTopics={3}
  totalQuestions={15}
  useAccordion={true}
  defaultExpanded={false}
/>
```

## Best Practices

1. **Use the specialized components** (`ExplanationAccordion`, `TopicsAccordion`) when they match your use case
2. **Use CustomAccordion** for new, unique accordion implementations
3. **Choose appropriate variants** to maintain visual consistency
4. **Provide meaningful trigger content** that clearly indicates what the accordion contains
5. **Consider accessibility** by ensuring proper focus management and screen reader support
6. **Test with different content lengths** to ensure the accordion behaves well with various amounts of content

## Future Enhancements

- Animation customization options
- Additional pre-built variants for other common use cases
- Integration with keyboard navigation patterns
- Support for nested accordions
- Analytics tracking for accordion interactions
