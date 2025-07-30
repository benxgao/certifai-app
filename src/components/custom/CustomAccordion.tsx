'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/src/lib/utils';

interface AccordionItemData {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface CustomAccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  className?: string;
  accordionClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'explanation' | 'topics' | 'custom';
}

const getVariantStyles = (variant: CustomAccordionProps['variant']) => {
  switch (variant) {
    case 'explanation':
      return {
        accordion:
          'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/50 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm',
        item: 'border-none',
        trigger:
          'px-6 py-5 hover:bg-blue-50/70 dark:hover:bg-blue-900/30 transition-all duration-300 group hover:no-underline cursor-pointer',
        content: 'px-6 pb-6 pt-2',
      };
    case 'topics':
      return {
        accordion:
          'bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-blue-50/80 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border border-violet-200/60 dark:border-violet-800/50 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm',
        item: 'border-none',
        trigger:
          'px-6 py-5 hover:bg-violet-50/70 dark:hover:bg-violet-900/30 transition-all duration-300 group hover:no-underline cursor-pointer',
        content: 'px-6 pb-6 pt-2',
      };
    case 'custom':
      return {
        accordion: '',
        item: '',
        trigger: '',
        content: '',
      };
    default:
      return {
        accordion:
          'bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-lg backdrop-blur-md',
        item: 'border-b border-slate-200/60 dark:border-slate-700/60 last:border-b-0',
        trigger:
          'px-6 py-5 hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-300 group hover:no-underline cursor-pointer',
        content: 'px-6 pb-6 pt-2',
      };
  }
};

export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  items,
  type = 'single',
  collapsible = true,
  defaultValue,
  className,
  accordionClassName,
  itemClassName,
  triggerClassName,
  contentClassName,
  variant = 'default',
}) => {
  const variantStyles = getVariantStyles(variant);

  const accordionProps =
    type === 'single'
      ? {
          type: 'single' as const,
          collapsible,
          defaultValue: defaultValue as string | undefined,
        }
      : {
          type: 'multiple' as const,
          defaultValue: defaultValue as string[] | undefined,
        };

  return (
    <div className={className}>
      <Accordion
        {...accordionProps}
        className={cn('w-full', variantStyles.accordion, accordionClassName)}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={cn(variantStyles.item, itemClassName)}
            disabled={item.disabled}
          >
            <AccordionTrigger
              className={cn(
                variantStyles.trigger,
                triggerClassName,
                // Override the default icon styles for better positioning
                '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-slate-600 dark:[&>svg]:text-slate-400 [&>svg]:transition-transform [&>svg]:duration-300 [&[data-state=open]>svg]:rotate-180',
              )}
            >
              <div className="flex items-center space-x-3 w-full pr-2">
                {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
                <div className="flex-1 text-left">{item.trigger}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn(variantStyles.content, contentClassName)}>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CustomAccordion;
