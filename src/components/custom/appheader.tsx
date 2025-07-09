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
import { LogOut, Settings, UserCircle, Home, Award, ChevronDown, Coffee } from 'lucide-react';

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
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
                  className="relative h-10 w-auto px-2 rounded-full border-2 border-transparent hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex items-center space-x-2">
                      <div className="text-left">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 p-0 shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
                align="end"
                forceMount
              >
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent border-b border-border/50 mb-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate text-foreground">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Mobile Navigation */}
                <div className="md:hidden p-2 border-b border-border/50">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
                              ? 'bg-primary/15 text-primary font-medium border border-primary/30 shadow-sm'
                              : 'hover:bg-accent/80 hover:shadow-sm'
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 mr-3 ${
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                          <span>{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-primary rounded-full shadow-sm"></div>
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
                          ? 'bg-primary/15 text-primary font-medium border border-primary/30 shadow-sm'
                          : 'hover:bg-accent/80 hover:shadow-sm'
                      }`}
                    >
                      <UserCircle
                        className={`h-4 w-4 mr-3 transition-colors ${
                          pathname === '/main/profile'
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      <span>View Profile</span>
                      {pathname === '/main/profile' && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={() => router.push('/main/profile?tab=settings')}
                      className="cursor-pointer rounded-lg p-3 hover:bg-accent/80 hover:shadow-sm transition-all duration-200 group"
                    >
                      <Settings className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>Account Settings</span>
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

                  <div className="border-t border-border/50 mt-2 pt-2">
                    {/* Logout */}
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="cursor-pointer rounded-lg p-3 text-destructive hover:bg-destructive/10 hover:text-destructive hover:shadow-sm transition-all duration-200 font-medium group"
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
