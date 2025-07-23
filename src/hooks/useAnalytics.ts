'use client';

import { useCallback } from 'react';

// Google Analytics 4 event types
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Predefined event types for better tracking
export const GA_EVENTS = {
  // User engagement
  SIGN_UP: { action: 'sign_up', category: 'engagement' },
  LOGIN: { action: 'login', category: 'engagement' },
  LOGOUT: { action: 'logout', category: 'engagement' },

  // Certification actions
  START_CERTIFICATION: { action: 'start_certification', category: 'certification' },
  COMPLETE_CERTIFICATION: { action: 'complete_certification', category: 'certification' },
  VIEW_CERTIFICATION: { action: 'view_certification', category: 'certification' },

  // Navigation
  PAGE_VIEW: { action: 'page_view', category: 'navigation' },
  SEARCH: { action: 'search', category: 'navigation' },

  // Business actions
  CONTACT_FORM: { action: 'contact_form_submit', category: 'business' },
  PRICING_VIEW: { action: 'view_pricing', category: 'business' },

  // AI interactions
  AI_QUESTION_GENERATED: { action: 'ai_question_generated', category: 'ai' },
  AI_STUDY_RECOMMENDATION: { action: 'ai_study_recommendation', category: 'ai' },
} as const;

export const useAnalytics = () => {
  const trackEvent = useCallback((event: GAEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const { action, category, label, value, custom_parameters } = event;

      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...custom_parameters,
      });
    }
  }, []);

  // Convenience methods for common events
  const trackPageView = useCallback((page_title: string, page_location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID || '', {
        page_title,
        page_location,
      });
    }
  }, []);

  const trackUserSignup = useCallback(
    (method: string = 'email') => {
      trackEvent({
        ...GA_EVENTS.SIGN_UP,
        custom_parameters: { method },
      });
    },
    [trackEvent],
  );

  const trackCertificationStart = useCallback(
    (certificationId: string, firmCode: string) => {
      trackEvent({
        ...GA_EVENTS.START_CERTIFICATION,
        label: `${firmCode}_${certificationId}`,
        custom_parameters: {
          certification_id: certificationId,
          firm_code: firmCode,
        },
      });
    },
    [trackEvent],
  );

  const trackSearch = useCallback(
    (searchTerm: string, resultsCount: number = 0) => {
      trackEvent({
        ...GA_EVENTS.SEARCH,
        label: searchTerm,
        value: resultsCount,
        custom_parameters: {
          search_term: searchTerm,
          results_count: resultsCount,
        },
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackPageView,
    trackUserSignup,
    trackCertificationStart,
    trackSearch,
  };
};
