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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({ email: '', password: '' });

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

  const handleInputFocus = (index: number) => {
    if (inputRefs.current[index]) {
      gsap.to(inputRefs.current[index], { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)', duration: 0.3 });
    }
  };

  const handleInputBlur = (index: number) => {
    if (inputRefs.current[index]) {
      gsap.to(inputRefs.current[index], { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', duration: 0.3 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    gsap.to('.submit-button', { scale: 0.95, duration: 0.2 });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

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
      setError('Network error');
    } finally {
      setLoading(false);
      gsap.to('.submit-button', { scale: 1, duration: 0.2 });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-20" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float ${5 + Math.random() * 10}s ease-in-out infinite` }} />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="logo-text flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SocialHub</h1>
            </div>
            <p className="text-gray-400 text-sm">Manage all social media in one place</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

                <div className="form-input space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input ref={(el) => { inputRefs.current[0] = el; }} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={() => handleInputFocus(0)} onBlur={() => handleInputBlur(0)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all duration-300 backdrop-blur" required />
                  </div>
                </div>

                <div className="form-input space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input ref={(el) => { inputRefs.current[1] = el; }} type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onFocus={() => handleInputFocus(1)} onBlur={() => handleInputBlur(1)} placeholder="••••••••" className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all duration-300 backdrop-blur" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-indigo-400">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-button w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader size={20} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
                </button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Create one</Link></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); opacity: 0.2; } 50% { transform: translateY(-20px); opacity: 0.5; } }
        .gradient-bg { background-size: 200% 200%; }
      `}</style>
    </div>
  );
}
