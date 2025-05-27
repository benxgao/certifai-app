'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useExamsForCertification, ExamListItem } from '@/swr/exams';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

// Define a generic type for the SWR mutate function if not already exported from swr/exams
// This is a common signature: a function that revalidates and returns a promise with the data.
export type MutateExams = (data?: any, opts?: boolean | any) => Promise<ExamListItem[] | undefined>;

interface ExamsContextType {
  exams: ExamListItem[] | undefined;
  isLoadingExams: boolean;
  isExamsError: any;
  mutateExams: MutateExams;
}

const ExamsContext = createContext<ExamsContextType | undefined>(undefined);

interface ExamsProviderProps {
  children: ReactNode;
  certId: number | null;
}

export const ExamsProvider = ({ children, certId }: ExamsProviderProps) => {
  const { apiUserId } = useFirebaseAuth();
  const { exams, isExamsError, isLoadingExams, mutateExams } = useExamsForCertification(
    apiUserId,
    certId,
  );

  const contextValue = useMemo(
    () => ({
      exams,
      isLoadingExams,
      isExamsError,
      mutateExams: mutateExams as MutateExams, // Cast if necessary, ensure mutateExams matches MutateExams type
    }),
    [exams, isLoadingExams, isExamsError, mutateExams],
  );

  return <ExamsContext.Provider value={contextValue}>{children}</ExamsContext.Provider>;
};

export const useExamsContext = (): ExamsContextType => {
  const context = useContext(ExamsContext);
  if (context === undefined) {
    throw new Error('useExamsContext must be used within an ExamsProvider');
  }
  return context;
};
