'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';
import { CustomAccordion } from './CustomAccordion';

interface ExplanationAccordionProps {
  explanations: string;
  className?: string;
  triggerTitle?: string;
  triggerSubtitle?: string;
}

export const ExplanationAccordion: React.FC<ExplanationAccordionProps> = ({
  explanations,
  className,
  triggerTitle = 'View Detailed Explanation',
  triggerSubtitle = 'Click to see the reasoning behind the correct answer',
}) => {
  if (!explanations || explanations.trim().length === 0) {
    return null;
  }

  const accordionItems = [
    {
      id: 'explanation',
      icon: (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-25 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-800/30 transition-colors">
          <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      ),
      trigger: (
        <div className="flex-1">
          <span className="text-base font-medium text-blue-700 dark:text-blue-200">
            {triggerTitle}
          </span>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{triggerSubtitle}</p>
        </div>
      ),
      content: (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-blue-100 dark:border-blue-700/50">
          <div className="space-y-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {explanations
              .split('\n')
              .filter((paragraph) => paragraph.trim() !== '')
              .map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <CustomAccordion
      items={accordionItems}
      type="single"
      collapsible={true}
      variant="explanation"
      className={className}
    />
  );
};

export default ExplanationAccordion;
