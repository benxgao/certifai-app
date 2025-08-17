import React, { memo, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { useOptimizedScroll } from '@/src/hooks/useOptimizedScroll';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableScrollOptimization?: boolean;
  showScrollToTop?: boolean;
  headerOffset?: number;
}

/**
 * Optimized page wrapper that provides scroll performance enhancements
 * Features:
 * - Automatic scroll container optimization
 * - Scroll-to-top functionality
 * - GPU acceleration
 * - Performance monitoring
 */
export const PageWrapper = memo<PageWrapperProps>(
  ({
    children,
    className,
    enableScrollOptimization = true,
    showScrollToTop = true,
    headerOffset = 80,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY, isScrolling, scrollToTop } = useOptimizedScroll();

    // Apply scroll optimizations to the container
    useEffect(() => {
      if (!enableScrollOptimization || !containerRef.current) return;

      const container = containerRef.current;

      // Add scroll optimization classes
      container.classList.add('scroll-container', 'page-container');

      // Set scroll padding for fixed header
      container.style.scrollPaddingTop = `${headerOffset}px`;

      return () => {
        // Cleanup on unmount
        container.classList.remove('scroll-container', 'page-container');
      };
    }, [enableScrollOptimization, headerOffset]);

    const showScrollButton = showScrollToTop && scrollY > 400;

    return (
      <div
        ref={containerRef}
        className={cn(
          'min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30',
          'dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20',
          'transition-colors duration-300',
          enableScrollOptimization && 'gpu-accelerated',
          className,
        )}
      >
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">{children}</div>

        {/* Scroll to top button */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className={cn(
              'fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300',
              'bg-violet-600 hover:bg-violet-700 text-white',
              'hover:scale-110 hover:shadow-xl',
              'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
              'gpu-accelerated interactive-optimized',
              isScrolling ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1',
            )}
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

PageWrapper.displayName = 'PageWrapper';

/**
 * Optimized container for scrollable content
 */
export const ScrollContainer = memo<{
  children: React.ReactNode;
  className?: string;
  maxHeight?: string | number;
  enableVirtualization?: boolean;
}>(({ children, className, maxHeight = '600px', enableVirtualization = false }) => (
  <div
    className={cn(
      'scroll-container overflow-y-auto',
      'border border-slate-200/60 dark:border-slate-700/60 rounded-xl',
      'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md',
      className,
    )}
    style={{ maxHeight }}
    data-virtualized={enableVirtualization}
  >
    {children}
  </div>
));

ScrollContainer.displayName = 'ScrollContainer';

// Export optimized variants for backward compatibility
export { PageWrapper as OptimizedPageWrapper, ScrollContainer as OptimizedScrollContainer };
