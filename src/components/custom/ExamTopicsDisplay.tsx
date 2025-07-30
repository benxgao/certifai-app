import React from 'react';
import { TopicsAccordion } from './TopicsAccordion';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';

interface ExamTopicsDisplayProps {
  topics: Array<{
    topic_name: string;
    question_count: number;
    question_ids: string[];
  }>;
  totalTopics: number;
  totalQuestions: number;
  isLoading?: boolean;
  className?: string;
  useAccordion?: boolean;
  defaultExpanded?: boolean;
}

export const ExamTopicsDisplay: React.FC<ExamTopicsDisplayProps> = ({
  topics,
  totalTopics,
  totalQuestions,
  isLoading = false,
  className = '',
  useAccordion = false,
  defaultExpanded = false,
}) => {
  if (useAccordion) {
    return (
      <TopicsAccordion
        topics={topics}
        totalTopics={totalTopics}
        totalQuestions={totalQuestions}
        isLoading={isLoading}
        className={className}
        showAsAccordion={true}
        defaultExpanded={defaultExpanded}
      />
    );
  }

  if (isLoading) {
    return (
      <DashboardCard
        variant="compact"
        className={`bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800/50 ${className}`}
      >
        <DashboardCardHeader>
          <h3 className="text-violet-800 dark:text-violet-200 text-lg font-semibold">
            Topics in this page
          </h3>
        </DashboardCardHeader>
        <DashboardCardContent>
          <TopicsAccordion
            topics={[]}
            totalTopics={0}
            totalQuestions={0}
            isLoading={true}
            showAsAccordion={false}
          />
        </DashboardCardContent>
      </DashboardCard>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <DashboardCard
      variant="compact"
      className={`bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800/50 ${className}`}
    >
      <DashboardCardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-violet-800 dark:text-violet-200 text-lg font-semibold">
            Topics For This Page
          </h3>
        </div>
      </DashboardCardHeader>
      <DashboardCardContent>
        <TopicsAccordion
          topics={topics}
          totalTopics={totalTopics}
          totalQuestions={totalQuestions}
          showAsAccordion={false}
        />
      </DashboardCardContent>
    </DashboardCard>
  );
};

export default ExamTopicsDisplay;
