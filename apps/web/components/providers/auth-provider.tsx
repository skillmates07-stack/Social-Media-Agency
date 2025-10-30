'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

// Routes that DON'T require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy'];

// Routes that REQUIRE authentication
const protectedRoutes = ['/dashboard', '/posts', '/schedule', '/analytics', '/accounts', '/team', '/settings'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading) {
      // Check if current route is protected
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      const isPublicRoute = publicRoutes.includes(pathname);

      // If user is NOT authenticated and trying to access protected route
      if (!isAuthenticated && isProtectedRoute) {
        router.push('/login');
      }
      
      // If user IS authenticated and on login/register page, redirect to dashboard
      if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
