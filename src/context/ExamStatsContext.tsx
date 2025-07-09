'use client';

import React, { createContext, useContext } from 'react';
import { 
  useUserTotalExamCount as useHookUserTotalExamCount, 
  useShouldShowBuyMeACoffee as useHookShouldShowBuyMeACoffee 
} from '@/src/hooks/useUserExamStats';

// Define the context type
interface ExamStatsContextType {
  totalExamCount: number;
  certificationCount: number;
  shouldShowBuyMeACoffee: boolean;
  engagementReason: string;
  stats: {
    estimatedExams: number;
    certifications: number;
  };
}

// Create the context
const ExamStatsContext = createContext<ExamStatsContextType | undefined>(undefined);

// Provider component
export function ExamStatsProvider({ children }: { children: React.ReactNode }) {
  const { totalExamCount, certificationCount } = useHookUserTotalExamCount();
  const { shouldShow, reason, stats } = useHookShouldShowBuyMeACoffee();

  const value: ExamStatsContextType = {
    totalExamCount,
    certificationCount,
    shouldShowBuyMeACoffee: shouldShow,
    engagementReason: reason,
    stats,
  };

  return (
    <ExamStatsContext.Provider value={value}>
      {children}
    </ExamStatsContext.Provider>
  );
}

// Hook to use the context
export function useExamStats() {
  const context = useContext(ExamStatsContext);
  if (!context) {
    throw new Error('useExamStats must be used within an ExamStatsProvider');
  }
  return context;
}

// Re-export the hook for backward compatibility
export function useShouldShowBuyMeACoffee() {
  const { shouldShowBuyMeACoffee, engagementReason, stats } = useExamStats();
  return {
    shouldShow: shouldShowBuyMeACoffee,
    reason: engagementReason,
    stats,
  };
}

// Re-export other useful functions
export function useUserTotalExamCount() {
  const { totalExamCount, certificationCount } = useExamStats();
  return {
    totalExamCount,
    certificationCount,
  };
}
