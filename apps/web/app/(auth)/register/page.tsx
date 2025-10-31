'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Loader, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

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
      console.error(err);
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
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
          <form onSubmit={handleSubmit} className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50 animate-fade-in-up">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <p className="text-gray-400 text-sm mt-1">Start managing your social media today</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                  ⚠️ {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      calculateStrength(e.target.value);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur"
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

                {/* Password Strength */}
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
                      Strength: <span className="font-semibold text-purple-400">{getStrengthText()}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Terms */}
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
                    Terms
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
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight size={18} />
                  </>
                )}
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
          </form>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-xs space-y-2">
            <p>🔒 Your data is secure and encrypted</p>
            <p className="text-gray-500">© 2025 SocialHub. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s backwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
