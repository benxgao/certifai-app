'use client';

import React, { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/src/components/ui/tooltip';

interface ResponsiveTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  sideOffset?: number;
  className?: string;
}

const ResponsiveTooltip: React.FC<ResponsiveTooltipProps> = ({
  content,
  children,
  sideOffset = 4,
  className = 'max-w-[300px]',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    // Only toggle on mobile (when touch is supported)
    if ('ontouchstart' in window) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    // Only open on hover for non-touch devices
    if (!('ontouchstart' in window)) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only close on mouse leave for non-touch devices
    if (!('ontouchstart' in window)) {
      setIsOpen(false);
    }
  };

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <span
          className="cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors touch-manipulation"
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Show tooltip"
          aria-expanded={isOpen}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={sideOffset} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default ResponsiveTooltip;
