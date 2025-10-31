'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { Mail, Lock, User, Loader, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.gradient-bg', {
        backgroundPosition: ['0% 0%', '100% 100%'],
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.fromTo('.logo-text', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, ease: 'back.out' });
      gsap.fromTo('.form-card', { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1, delay: 0.2, ease: 'back.out' });
      gsap.fromTo('.form-input', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, delay: 0.4, ease: 'power2.out' });
      gsap.fromTo('.submit-button', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'back.out' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Calculate password strength
  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handleInputFocus = (index: number) => {
    if (inputRefs.current[index]) {
      gsap.to(inputRefs.current[index], { boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)', duration: 0.3 });
    }
  };

  const handleInputBlur = (index: number) => {
    if (inputRefs.current[index]) {
      gsap.to(inputRefs.current[index], { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', duration: 0.3 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    gsap.to('.submit-button', { scale: 0.95, duration: 0.2 });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        gsap.to('.submit-button', { scale: 1, duration: 0.2 });
        return;
      }

      gsap.to('.form-card', {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: 'back.in',
        onComplete: () => {
          router.push('/login?registered=true');
        },
      });
    } catch (err) {
      setError('Network error. Please try again.');
      gsap.to('.submit-button', { scale: 1, duration: 0.2 });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-500';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return 'Very weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                SocialHub
              </h1>
            </div>
            <p className="text-gray-400 text-sm font-medium">Join millions of creators</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <div className="form-card relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50">
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Account</h2>
                  <p className="text-gray-400 text-sm mt-1">Start managing your social media today</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Full Name Field */}
                <div className="form-input space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      ref={(el) => {
                        inputRefs.current[0] = el;
                      }}
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => handleInputFocus(0)}
                      onBlur={() => handleInputBlur(0)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 backdrop-blur"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-input space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      ref={(el) => {
                        inputRefs.current[1] = el;
                      }}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => handleInputFocus(1)}
                      onBlur={() => handleInputBlur(1)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 backdrop-blur"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-input space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      ref={(el) => {
                        inputRefs.current[2] = el;
                      }}
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        calculateStrength(e.target.value);
                      }}
                      onFocus={() => handleInputFocus(2)}
                      onBlur={() => handleInputBlur(2)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 backdrop-blur"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-500 hover:text-purple-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all ${
                              i < passwordStrength ? getStrengthColor() : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Password strength: <span className={`font-semibold ${
                          passwordStrength === 1 ? 'text-red-400' :
                          passwordStrength === 2 ? 'text-yellow-400' :
                          passwordStrength === 3 ? 'text-blue-400' :
                          passwordStrength === 4 ? 'text-green-400' :
                          'text-gray-400'
                        }`}>{getStrengthText()}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      termsAccepted
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-slate-600 group-hover:border-purple-500'
                    }`}
                  >
                    {termsAccepted && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="hidden"
                  />
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !termsAccepted}
                  className="submit-button w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-xs space-y-2">
            <p>🔒 Your data is secure and encrypted</p>
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

        .gradient-bg {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
