import { useCallback, useEffect, useRef, useState } from 'react';

interface UseOptimizedScrollOptions {
  threshold?: number;
  debounceMs?: number;
  enableVirtualization?: boolean;
}

interface ScrollState {
  scrollY: number;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | null;
  isNearTop: boolean;
  isNearBottom: boolean;
}

interface ScrollActions {
  scrollToElement: (elementId: string, offset?: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

/**
 * Optimized scroll hook for better performance and smooth scrolling
 * Features:
 * - Debounced scroll events to prevent excessive re-renders
 * - Scroll direction detection
 * - Passive event listeners for better performance
 * - Utility functions for smooth scrolling
 */
export function useOptimizedScroll({
  threshold = 100,
  debounceMs = 16, // ~60fps
  enableVirtualization = false,
}: UseOptimizedScrollOptions = {}): ScrollState & ScrollActions {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine scroll direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }

    lastScrollY.current = currentScrollY;
    setScrollY(currentScrollY);
    setIsScrolling(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set scrolling to false after debounce period
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    // Initialize scroll position
    setScrollY(window.scrollY);
    lastScrollY.current = window.scrollY;

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Smooth scroll to element
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, []);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  // Calculate derived states
  const isNearTop = scrollY < threshold;
  const isNearBottom =
    scrollY > document.documentElement.scrollHeight - window.innerHeight - threshold;

  return {
    scrollY,
    isScrolling,
    scrollDirection,
    isNearTop,
    isNearBottom,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
  };
}

/**
 * Hook for intersection observer-based scroll optimization
 * Useful for triggering animations or lazy loading when elements come into view
 */
export function useScrollIntersection(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold: 0.1, ...options },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}
