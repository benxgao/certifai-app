'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/src/components/ui/tooltip';
import { FaCoffee } from 'react-icons/fa';

interface CoffeeButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  coffeeUrl?: string;
  text?: string;
  thankYouText?: string;
  thankYouDuration?: number;
  tooltipText?: string;
}

export function CoffeeButton({
  size = 'sm',
  className = '',
  variant = 'outline',
  coffeeUrl = 'https://buymeacoffee.com/certestickh/e/428261',
  text = 'Buy me a coffee',
  thankYouText = 'Thank you! ☕',
  thankYouDuration = 3000,
  tooltipText = 'Love this app? Support the developer with a coffee! Your support helps keep this service running and enables new features. 💕',
}: CoffeeButtonProps) {
  const [showThanks, setShowThanks] = useState(false);

  const handleClick = () => {
    window.open(coffeeUrl, '_blank');
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), thankYouDuration);
  };

  const coffeeButtonClasses = `
    ${
      variant === 'outline'
        ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800 dark:hover:border-orange-700'
        : ''
    }
    shadow-sm transition-all duration-200 ${className}
  `.trim();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size={size} variant={variant} className={coffeeButtonClasses} onClick={handleClick}>
          <FaCoffee className="w-4 h-4 mr-2" />
          {showThanks ? thankYouText : text}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={4} className="max-w-[280px]">
        <p className="text-sm">{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default CoffeeButton;
