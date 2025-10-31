'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Loader, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-600';
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#262626] px-8 py-5 backdrop-blur-sm bg-[#0a0a0a]/80">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-white">SocialHub</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create account</h1>
            <p className="text-gray-400 text-base font-normal">Join thousands of creators managing their social media</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 backdrop-blur">
                <span className="text-lg mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2.5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors size-5" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 hover:border-[#3a3a3a]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors size-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 hover:border-[#3a3a3a]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors size-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    calculateStrength(e.target.value);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-[#262626] bg-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 hover:border-[#3a3a3a]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2 mt-3">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          i < passwordStrength ? getStrengthColor() : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength: <span className="font-semibold text-blue-400">{getStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-6">
              <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                termsAccepted ? 'bg-blue-600 border-blue-600' : 'border-[#3a3a3a] group-hover:border-[#4a4a4a]'
              }`}>
                {termsAccepted && <Check size={16} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-400 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
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
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-8 group"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#0a0a0a] text-sm text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Button */}
          <Link
            href="/login"
            className="w-full py-3 border border-[#262626] bg-[#1a1a1a] text-white font-semibold rounded-xl hover:border-[#3a3a3a] hover:bg-[#242424] transition-all duration-200 text-center block"
          >
            Sign in
          </Link>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-600 mt-8">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#262626] px-8 py-5 text-center text-xs text-gray-600 bg-[#0a0a0a]/50 backdrop-blur-sm">
        © 2025 SocialHub. All rights reserved.
      </div>
    </div>
  );
}
