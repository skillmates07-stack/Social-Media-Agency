'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Posts',
    icon: FileText,
    href: '/posts',
  },
  {
    title: 'Schedule',
    icon: Calendar,
    href: '/schedule',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
  },
  {
    title: 'Accounts',
    icon: Share2,
    href: '/accounts',
  },
  {
    title: 'Team',
    icon: Users,
    href: '/team',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col border-r border-slate-800 bg-slate-950"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SocialHub</h1>
                <p className="text-xs text-gray-500">Agency Dashboard</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mx-auto"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white shadow-lg shadow-blue-500/10'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-600"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800/50 group-hover:bg-slate-700'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge (optional) */}
                  {item.title === 'Posts' && !collapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white"
                    >
                      3
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-800 p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800/50 px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
