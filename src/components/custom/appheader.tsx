'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/firebase/firebaseWebConfig';
import { useProfileData } from '@/src/hooks/useProfileData';
import { useShouldShowBuyMeACoffee } from '@/src/hooks/useUserExamStats';
import Link from 'next/link';
import { LogOut, UserCircle, Home, Award, ChevronDown, Coffee } from 'lucide-react';

const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, displayName, email } = useProfileData();
  const { shouldShow: showBuyMeACoffee } = useShouldShowBuyMeACoffee();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
      });

      await auth.signOut();

      router.push('/signin');
    } catch (error) {}
  };

  const handleBuyMeACoffee = () => {
    // Replace with your actual Buy Me a Coffee URL
    window.open('https://coff.ee/certestickh', '_blank');
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/main', icon: Home },
    { label: 'Certifications', href: '/main/certifications', icon: Award },
    // { label: 'AI Assistant', href: '/main/ai' },
  ] as const;

  // Helper function to determine if a nav item is active
  const isActiveRoute = (href: string) => {
    if (href === '/main') {
      return pathname === '/main';
    }
    return pathname.startsWith(href);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (displayName && displayName !== 'User') {
      return displayName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/main" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-violet-700 dark:text-violet-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                Certestic
              </span>
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
                  className={`text-sm font-normal transition-colors duration-200 relative group ${
                    isActive
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-200 ${
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
                  className="relative h-10 w-auto px-2 rounded-full border-2 border-transparent transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-blue-600 text-white font-normal text-sm shadow-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex items-center space-x-2">
                      <div className="text-left">
                        <p className="text-sm font-normal leading-none text-slate-700 dark:text-slate-300">
                          {displayName}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 p-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl"
                align="end"
                forceMount
              >
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-br from-violet-50/80 via-violet-50/40 to-transparent dark:from-violet-950/20 dark:via-violet-950/10 dark:to-transparent border-b border-slate-200/60 dark:border-slate-700/60 mb-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-violet-200/60 dark:border-violet-700/60 shadow-sm">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-blue-600 text-white font-normal text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal leading-none truncate text-slate-900 dark:text-slate-50">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                        {email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Mobile Navigation */}
                <div className="md:hidden p-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="px-2 py-1 text-xs font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Navigation
                  </div>
                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = isActiveRoute(item.href);
                      const IconComponent = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          onSelect={() => router.push(item.href)}
                          className={`cursor-pointer rounded-lg p-3 transition-all duration-200 ${
                            isActive
                              ? 'bg-violet-50/80 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 font-normal border border-violet-200/60 dark:border-violet-700/60 shadow-sm'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-sm'
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 mr-3 ${
                              isActive
                                ? 'text-violet-600 dark:text-violet-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          />
                          <span>{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full shadow-sm"></div>
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="p-2">
                  <div className="space-y-1">
                    <DropdownMenuItem
                      onSelect={() => router.push('/main/profile')}
                      className={`cursor-pointer rounded-lg p-3 transition-all duration-200 group ${
                        pathname === '/main/profile'
                          ? 'bg-violet-50/80 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 font-normal border border-violet-200/60 dark:border-violet-700/60 shadow-sm'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-sm'
                      }`}
                    >
                      <UserCircle
                        className={`h-4 w-4 mr-3 transition-colors ${
                          pathname === '/main/profile'
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span>View Profile</span>
                      {pathname === '/main/profile' && (
                        <div className="ml-auto w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full shadow-sm"></div>
                      )}
                    </DropdownMenuItem>

                    {/* Buy Me a Coffee - Only show if user has created more than 2 exams */}
                    {showBuyMeACoffee && (
                      <DropdownMenuItem
                        onSelect={handleBuyMeACoffee}
                        className="cursor-pointer rounded-lg p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:shadow-sm transition-all duration-200 group"
                      >
                        <Coffee className="h-4 w-4 mr-3 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
                        <span className="text-orange-800 dark:text-orange-200 group-hover:text-orange-900 dark:group-hover:text-orange-100">
                          Love the app? Buy Me a Coffee
                        </span>
                      </DropdownMenuItem>
                    )}
                  </div>

                  <div className="border-t border-slate-200/60 dark:border-slate-700/60 mt-2 pt-2">
                    {/* Logout */}
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="cursor-pointer rounded-lg p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 hover:shadow-sm transition-all duration-200 font-normal group"
                    >
                      <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-0.5 transition-transform" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
