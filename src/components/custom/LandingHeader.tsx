'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function LandingHeader() {
  const [navOpen, setNavOpen] = React.useState(false);
  const pathname = usePathname();

  // Define navigation items in consistent order
  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  // Helper function to determine if a nav item is active
  const isActiveRoute = (href: string) => {
    if (href.startsWith('/#')) {
      return false; // Anchor links don't match pathname
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Certestic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 relative group px-3 py-2 rounded-lg ${
                    isActive
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-violet-600 dark:bg-violet-400 rounded-full"></span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/signin"
              className={`text-sm font-medium transition-all duration-200 relative group px-3 py-2 rounded-lg ${
                pathname === '/signin'
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Sign In
              {pathname === '/signin' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-violet-600 dark:bg-violet-400 rounded-full"></span>
              )}
            </Link>
            <Link href="/signup">
              <Button
                variant="default"
                size="sm"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-6"
              >
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={navOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'}
              />
            </svg>
          </Button>

          {/* Mobile Dropdown */}
          {navOpen && (
            <div className="absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 md:hidden shadow-lg">
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                          : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/signin"
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    pathname === '/signin'
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  Sign In
                </Link>
                <div className="pt-2">
                  <Link href="/signup" className="block w-full" onClick={() => setNavOpen(false)}>
                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      size="sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
