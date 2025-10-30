'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: error.response?.data?.message || 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background to-primary/5" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-border">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
