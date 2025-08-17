// Re-export commonly used optimized components and hooks for convenience
export {
  LoadingSpinner,
  LoadingSpinner as OptimizedSpinner,
  PageLoadingSpinner,
  InlineSpinner,
} from './ui/loading-spinner';
export {
  PageWrapper,
  PageWrapper as OptimizedPageWrapper,
  ScrollContainer,
  ScrollContainer as OptimizedScrollContainer,
} from './ui/page-wrapper';
export { ExamNavigation, ExamNavigation as OptimizedExamNavigation } from './custom/ExamNavigation';

// Export performance hooks
export { useOptimizedScroll, useScrollIntersection } from '../hooks/useOptimizedScroll';
