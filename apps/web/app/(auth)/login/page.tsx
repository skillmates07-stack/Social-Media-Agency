'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { Mail, Lock, Loader, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // GSAP Animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background gradient animation
      gsap.to('.gradient-bg', {
        backgroundPosition: ['0% 0%', '100% 100%'],
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Logo animation
      gsap.fromTo(
        '.logo-text',
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'back.out',
        }
      );

      // Form card animation
      gsap.fromTo(
        '.form-card',
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: 'back.out',
        }
      );

      // Input fields staggered animation
      gsap.fromTo(
        '.form-input',
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.4,
          ease: 'power2.out',
        }
      );

      // Button animation
      gsap.fromTo(
        '.submit-button',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.7,
          ease: 'back.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Input focus animations
  const handleInputFocus = (index: number) => {
    gsap.to(inputRefs.current[index], {
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleInputBlur = (index: number) => {
    gsap.to(inputRefs.current[index], {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Button loading animation
    gsap.to('.submit-button', {
      scale: 0.95,
      duration: 0.2,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        gsap.to('.error-message', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out',
        });
        return;
      }

      // Success animation
      gsap.to('.form-card', {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: 'back.in',
        onComplete: () => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/dashboard');
        },
      });
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
      gsap.to('.submit-button', {
        scale: 1,
        duration: 0.2,
      });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-100" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="logo-text flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SocialHub
              </h1>
            </div>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
              Manage all your social media in one place
            </p>
          </div>

          {/* Form Card */}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-card relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity" />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                  <p className="text-gray-400 text-sm">Sign in to your account</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message opacity-0 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="form-input space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current[0] = el;
                      }}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => handleInputFocus(0)}
                      onBlur={() => handleInputBlur(0)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 backdrop-blur"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-input space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current[1] = el;
                      }}
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => handleInputFocus(1)}
                      onBlur={() => handleInputBlur(1)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 backdrop-blur"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-500 hover:text-indigo-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-slate-900/50 text-gray-400 text-xs font-medium">
                      New to SocialHub?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <Link
                  href="/register"
                  className="w-full py-3 border border-slate-600 text-gray-300 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 text-center backdrop-blur"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-xs space-y-2">
            <p>🔒 Protected by industry-standard encryption</p>
            <p className="text-gray-500">© 2025 SocialHub. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .gradient-bg {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
