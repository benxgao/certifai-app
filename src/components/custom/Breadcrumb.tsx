import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`mb-6 ${className}`} aria-label="Breadcrumb">
      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
        {items.map((item, index) => (
          <Fragment key={index}>
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  item.current
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : 'text-slate-600 dark:text-slate-400'
                }
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-slate-400 dark:text-slate-600">/</span>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
