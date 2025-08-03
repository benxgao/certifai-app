import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <div>
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors"
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-slate-300 dark:text-slate-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item.current ? (
                <span
                  className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="ml-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to generate certification breadcrumbs
export function generateCertificationBreadcrumbs(
  firmCode: string,
  certificationName: string,
  currentPage?: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Certifications', href: '/certifications' },
    { name: firmCode.toUpperCase(), href: `/certifications/${firmCode}` },
  ];

  if (currentPage) {
    items.push(
      { name: certificationName, href: `/certifications/${firmCode}` },
      { name: currentPage, current: true },
    );
  } else {
    items.push({ name: certificationName, current: true });
  }

  return items;
}

// Helper function to generate firm breadcrumbs
export function generateFirmBreadcrumbs(firmCode: string): BreadcrumbItem[] {
  return [
    { name: 'Certifications', href: '/certifications' },
    { name: `${firmCode.toUpperCase()} Certifications`, current: true },
  ];
}
