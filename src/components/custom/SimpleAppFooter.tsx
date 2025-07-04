import React from 'react';
import Link from 'next/link';

export default function SimpleAppFooter() {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Brand and copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-lg bg-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-slate-100">Certestic</span>
            </div>
            <span className="text-gray-500 dark:text-slate-400 text-sm">
              © 2025 All rights reserved
            </span>
          </div>

          {/* Right side - Quick links */}
          <div className="flex items-center space-x-6">
            {/* <CoffeeButton
              size="sm"
              variant="ghost"
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
              text="Support"
            /> */}
            <Link
              href="/support"
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 text-sm transition-colors duration-200"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 text-sm transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 text-sm transition-colors duration-200"
            >
              Terms
            </Link>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-slate-400 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Beta version</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
