'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/firebase/firebaseWebConfig';
import Link from 'next/link';
import { User } from 'lucide-react';

const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
      });

      await auth.signOut();

      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/main' },
    { label: 'Certifications', href: '/main/certifications' },
    // { label: 'AI Assistant', href: '/main/ai' },
  ];

  // Helper function to determine if a nav item is active
  const isActiveRoute = (href: string) => {
    if (href === '/main') {
      return pathname === '/main';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/main" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-foreground">Certestic</span>
            </Link>
          </div>

          {/* Navigation */}
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
          </nav>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-sm">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Small indicator to show it's interactive */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Your Name</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      your.email@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {navigationItems.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <DropdownMenuItem
                        key={item.href}
                        onSelect={() => router.push(item.href)}
                        className={`cursor-pointer ${
                          isActive ? 'bg-accent text-accent-foreground font-medium' : ''
                        }`}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem
                  onSelect={() => router.push('/main/profile')}
                  className={`cursor-pointer ${
                    pathname === '/main/profile'
                      ? 'bg-accent text-accent-foreground font-medium'
                      : ''
                  }`}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
