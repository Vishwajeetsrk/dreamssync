'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Globe, ShieldAlert } from 'lucide-react';

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
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 animate-in fade-in zoom-in duration-500">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Access Hub</h1>
          <p className="text-muted-foreground font-black text-xs uppercase tracking-widest mt-2">LOGIN TO YOUR DREAMSYNC IDENTITY</p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 mb-6 text-red-900 font-bold text-xs animate-in slide-in-from-top duration-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border-4 border-black p-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-black text-xs uppercase tracking-widest text-gray-500">Security Phrase</label>
              <Link href="/forgot-password" className="text-[10px] font-black text-primary hover:underline uppercase">Forgot?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full bg-gray-50 border-4 border-black p-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'SIGN IN'} <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        <div className="text-center border-t-4 border-black border-dashed pt-6 mt-8">
          <p className="font-black text-muted-foreground text-[10px] tracking-widest uppercase">
            NEW TO THE ARCHITECTURE?{' '}
            <Link href="/signup" className="text-primary hover:underline underline-offset-4">
              CREATE IDENTITY
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse font-black uppercase text-2xl">LOADING ARCHITECTURE...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
