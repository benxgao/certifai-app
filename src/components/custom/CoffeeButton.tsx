'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaCoffee } from 'react-icons/fa';

interface CoffeeButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  coffeeUrl?: string;
  text?: string;
  thankYouText?: string;
  thankYouDuration?: number;
}

export function CoffeeButton({
  size = 'sm',
  className = '',
  variant = 'outline',
  coffeeUrl = 'https://coff.ee/certestickh',
  text = 'Buy me a coffee',
  thankYouText = 'Thank you! ☕',
  thankYouDuration = 3000,
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
    <Button size={size} variant={variant} className={coffeeButtonClasses} onClick={handleClick}>
      <FaCoffee className="w-4 h-4 mr-2" />
      {showThanks ? thankYouText : text}
    </Button>
  );
}

export default CoffeeButton;
