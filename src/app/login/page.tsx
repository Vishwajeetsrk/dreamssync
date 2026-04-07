'use client';

import { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, ShieldAlert } from 'lucide-react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'too-many-attempts') {
      setError('SECURITY ALERT: Too many login attempts. Access is restricted for 15 minutes.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white selection:bg-[#1D4D47]">
      <div className="w-full max-w-[440px] px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 text-left">
          <h1 className="text-[32px] font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-[15px]">Access your professional dashboard and resume analytics.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 mb-6 rounded-lg text-red-400 text-sm flex items-start gap-3 animate-in shake duration-300">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-[14px] font-medium text-gray-200">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1D4D47] transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-[#141414] border border-[#222] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-medium text-gray-200">Security Phrase</label>
              <Link href="/forgot-password" size="sm" className="text-[12px] text-gray-400 hover:text-white transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1D4D47] transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-[#141414] border border-[#222] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1D4D47] hover:bg-[#265e57] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[#1D4D47]/10"
          >
            {loading ? 'Verifying Access...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#222] text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-white hover:text-[#2d7a71] font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1D4D47] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
