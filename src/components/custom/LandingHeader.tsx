'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface LandingHeaderProps {
  showFeaturesLink?: boolean;
}

export default function LandingHeader({ showFeaturesLink = true }: LandingHeaderProps) {
  const [navOpen, setNavOpen] = React.useState(false);
  const pathname = usePathname();

  // Define navigation items in consistent order
  const navigationItems = [
    ...(showFeaturesLink ? [{ href: '/#features', label: 'Features' }] : []),
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  // Helper function to determine if a nav item is active
  const isActiveRoute = (href: string) => {
    if (href.startsWith('/#')) {
      return false; // Anchor links don't match pathname
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-foreground">CertifAI</span>
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
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-primary transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
            <Link
              href="/signin"
              className={`text-sm font-medium transition-colors duration-200 relative group ${
                pathname === '/signin' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Sign In
              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-primary transition-all duration-200 ${
                  pathname === '/signin' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link href="/signup">
              <Button variant="default" size="sm" className="rounded-lg">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
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
            <div className="absolute top-full left-0 w-full bg-background border-b border-border md:hidden">
              <div className="px-4 py-2 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-primary bg-accent'
                          : 'text-muted-foreground hover:text-primary hover:bg-accent'
                      }`}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/signin"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === '/signin'
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent'
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setNavOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
