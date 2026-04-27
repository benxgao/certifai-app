'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';

interface CertificationSearchControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  controls?: React.ReactNode;
  showSearchIcon?: boolean;
}

export default function CertificationSearchControls({
  searchValue,
  onSearchChange,
  placeholder = 'Search certifications or providers...',
  controls,
  showSearchIcon = true,
}: CertificationSearchControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search Input - Full Width */}
      <div className="relative w-full">
        {showSearchIcon && (
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${showSearchIcon ? 'pl-9 sm:pl-12' : 'pl-4'} pr-4 h-12 text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300 rounded-xl shadow-sm w-full`}
        />
      </div>

      {/* Controls Row - Full Width, Horizontal Layout */}
      {controls && <div className="w-full">{controls}</div>}
    </div>
  );
}
