'use client';

import React from 'react';
import { FaBook, FaChevronRight } from 'react-icons/fa';
import { CustomAccordion } from './CustomAccordion';

// Simple badge component since we might not have the shadcn Badge component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'secondary';
  className?: string;
}> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

interface Topic {
  topic_name: string;
  question_count: number;
  question_ids: string[];
}

interface TopicsAccordionProps {
  topics: Topic[];
  totalTopics: number;
  totalQuestions: number;
  isLoading?: boolean;
  className?: string;
  showAsAccordion?: boolean;
  defaultExpanded?: boolean;
}

export const TopicsAccordion: React.FC<TopicsAccordionProps> = ({
  topics,
  totalTopics,
  totalQuestions,
  isLoading = false,
  className,
  showAsAccordion = true,
  defaultExpanded = false,
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse space-y-3 p-6">
          <div className="h-6 bg-violet-200 dark:bg-violet-800 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-violet-100 dark:bg-violet-900 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  const topicsContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {topics.map((topic) => (
        <div
          key={topic.topic_name}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-violet-200/60 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200 hover:shadow-md group cursor-pointer"
        >
          <div className="flex items-start justify-between space-x-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 leading-tight line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                {topic.topic_name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200 text-xs px-2 py-1 flex-shrink-0"
              >
                {topic.question_count}
              </Badge>
              <FaChevronRight className="w-3 h-3 text-violet-400 dark:text-violet-500 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!showAsAccordion) {
    return <div className={className}>{topicsContent}</div>;
  }

  const accordionItems = [
    {
      id: 'topics',
      icon: (
        <div className="flex items-center justify-center w-8 h-8 bg-violet-25 dark:bg-violet-900/20 rounded-lg group-hover:bg-violet-50 dark:group-hover:bg-violet-800/30 transition-colors">
          <FaBook className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
      ),
      trigger: (
        <div className="flex-1">
          <span className="text-base font-medium text-violet-700 dark:text-violet-200">
            Topics For This Page
          </span>
          <p className="text-sm text-violet-600 dark:text-violet-300 mt-1">
            {totalTopics} {totalTopics === 1 ? 'topic' : 'topics'} • {totalQuestions}{' '}
            {totalQuestions === 1 ? 'question' : 'questions'}
          </p>
        </div>
      ),
      content: topicsContent,
    },
  ];

  return (
    <CustomAccordion
      items={accordionItems}
      type="single"
      collapsible={true}
      variant="topics"
      defaultValue={defaultExpanded ? 'topics' : undefined}
      className={className}
    />
  );
};

export default TopicsAccordion;
