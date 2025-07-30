# ExamCard Badge Layout Update

## Changes Made

### Layout Modification

- **Split combined status/score badge into separate badges**
- **Changed from grid layout to flexible layout** for better control over badge sizing

### Badge Arrangement

1. **Questions Badge**: Takes flexible space (flex-1)
2. **Status Badge**: Takes flexible space (flex-1)
3. **Score Badge**: Fixed square size (w-24 h-24), positioned to the right

### Score Badge Design

- **Shape**: Square (24x24 = 96px x 96px)
- **Layout**: Centered content with flex layout
- **Colors**: Emerald-to-blue gradient (different from status badge)
- **Positioning**: Only appears when score exists (`hasScore` condition)
- **Content**: "Score" label at top, percentage value centered below

### Visual Improvements

- **Better spacing**: Flex layout with gap-4 provides consistent spacing
- **Distinct colors**: Each badge has its own color scheme
  - Questions: Blue gradient
  - Status: Amber gradient
  - Score: Emerald-to-blue gradient
- **Responsive**: Score badge maintains square aspect ratio
- **Conditional display**: Score badge only shows when exam has been completed

### Layout Behavior

- When no score: Questions and Status badges take equal space
- When score exists: Questions and Status share available space, Score badge takes fixed square space on the right
- Maintains hover effects and transitions from original design

## Benefits

- **Clear separation** of different types of information
- **Square score badge** stands out as requested
- **Responsive design** works on different screen sizes
- **Consistent with design system** gradients and styling
