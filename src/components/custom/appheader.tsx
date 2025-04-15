'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseWebConfig';

interface AppHeaderProps {
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const router = useRouter();

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

  return (
    <header id="dashboard-header" className="flex items-center justify-between mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-[150px] md:w-[200px] lg:w-[300px]"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 md:h-9 md:w-9 rounded-full cursor-pointer hover:bg-accent hover:brightness-95"
            >
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                {/* <AvatarImage src="/placeholder-user.jpg" alt="User" /> */}
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Your Name</p>
                <p className="text-xs leading-none text-muted-foreground">your.email@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => router.push('/main/profile')}
              className="cursor-pointer hover:bg-accent hover:brightness-95"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleLogout}
              className="cursor-pointer hover:bg-accent hover:brightness-95"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
