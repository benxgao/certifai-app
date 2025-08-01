'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface DeleteIconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DeleteIconButton({
  onClick,
  disabled = false,
  title = 'Delete',
  className = '',
  size = 'md',
}: DeleteIconButtonProps) {
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        bg-white/95 dark:bg-slate-800/95
        hover:bg-red-50 dark:hover:bg-red-900/20
        border border-slate-200/60 dark:border-slate-600/60
        hover:border-red-200/60 dark:hover:border-red-600/40
        rounded-xl
        flex items-center justify-center
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        backdrop-blur-md
        shadow-lg hover:shadow-xl
        group/delete
        focus:ring-2 focus:ring-red-500/20 focus:border-red-500
        ${className}
      `}
      title={title}
    >
      <FaTrash
        className={`
          ${iconSizeClasses[size]}
          text-slate-500 dark:text-slate-400
          group-hover/delete:text-red-600 dark:group-hover/delete:text-red-400
          group-hover/delete:scale-110
          transition-all duration-300
        `}
      />
    </button>
  );
}
