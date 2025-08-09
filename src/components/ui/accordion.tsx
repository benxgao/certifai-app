import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('w-full space-y-6', className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300',
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-4 px-6 py-5 text-left transition-all outline-none hover:no-underline disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60 [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        <div className="flex items-center justify-center self-center">
          <ChevronDownIcon className="text-slate-600 dark:text-slate-400 cursor-pointer w-5 h-5 shrink-0 transition-transform duration-300" />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
      {...props}
    >
      <div
        className={cn(
          'px-6 pb-6 space-y-6 text-base leading-relaxed text-slate-600 dark:text-slate-300',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
