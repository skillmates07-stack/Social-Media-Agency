'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  Users,
  Link as LinkIcon,
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Schedule Posts',
    icon: Calendar,
    href: '/dashboard/schedule',
    color: 'text-violet-500',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'text-pink-700',
  },
  {
    label: 'Social Accounts',
    icon: LinkIcon,
    href: '/dashboard/accounts',
    color: 'text-orange-700',
  },
  {
    label: 'Team',
    icon: Users,
    href: '/dashboard/team',
    color: 'text-green-700',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Agency Pro</h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all',
                pathname === route.href
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400'
              )}
            >
              <route.icon className={cn('h-5 w-5', route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
