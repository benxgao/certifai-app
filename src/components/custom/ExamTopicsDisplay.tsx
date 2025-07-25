import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

export const ExamTopicsDisplay: React.FC<ExamTopicsDisplayProps> = ({
  topics,
  totalTopics,
  totalQuestions,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card
        className={`bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-blue-950/30 ${className}`}
      >
        <CardHeader>
          <CardTitle className="text-violet-800 dark:text-violet-200">
            Topics in this page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-violet-200 dark:bg-violet-800 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-violet-100 dark:bg-violet-900 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <Card
      className={`bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800/50 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-violet-800 dark:text-violet-200">Topics For This Page</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic) => (
            <div
              key={topic.topic_name}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-violet-200/60 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between space-x-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
                    {topic.topic_name}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200 text-xs px-2 py-1 flex-shrink-0"
                >
                  {topic.question_count}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamTopicsDisplay;
