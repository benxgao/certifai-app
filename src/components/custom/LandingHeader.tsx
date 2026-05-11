'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { marketingTheme } from '@/src/config/marketing-theme';

export default function LandingHeader() {
  const [navOpen, setNavOpen] = React.useState(false);
  const pathname = usePathname();

  // Define navigation items in consistent order
  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Helper function to determine if a nav item is active
  const isActiveRoute = (href: string) => {
    if (href.startsWith('/#')) {
      return false; // Anchor links don't match pathname
    }
    // Exact match or starts with the href for nested routes (e.g., /certifications/*)
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={marketingTheme.header.shell}>
      <div className="container mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className={marketingTheme.header.logoBadge}>
                <span className="text-white font-normal text-sm">C</span>
              </div>
              <span className={`${marketingTheme.header.brandWordmark} md:hidden lg:inline`}>
                Certestic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${marketingTheme.header.navLink} ${
                    isActive
                      ? marketingTheme.header.navActive
                      : marketingTheme.header.navInactive
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/signin"
              className={`${marketingTheme.header.navLink} ${
                pathname === '/signin'
                  ? marketingTheme.header.navActive
                  : marketingTheme.header.navInactive
              }`}
            >
              Sign In
            </Link>
            {pathname !== '/signup' && (
              <Link href="/signup">
                <Button
                  variant="default"
                  size="sm"
                  className={marketingTheme.header.ctaButton}
                >
                  Start Practicing
                </Button>
              </Link>
            )}
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
            <div className="absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 md:hidden shadow-lg">
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 text-sm font-normal rounded-lg transition-all duration-200 ${
                        isActive
                          ? marketingTheme.header.navActive
                          : marketingTheme.header.navInactive
                      }`}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/signin"
                  className={`block px-4 py-3 text-sm font-normal rounded-lg transition-all duration-200 ${
                    pathname === '/signin'
                      ? marketingTheme.header.navActive
                      : marketingTheme.header.navInactive
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  Sign In
                </Link>
                {pathname !== '/signup' && (
                  <div className="pt-2">
                    <Link href="/signup" className="block w-full" onClick={() => setNavOpen(false)}>
                      <Button
                        className={`w-full ${marketingTheme.header.ctaButton}`}
                        size="sm"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
