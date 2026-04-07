'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleGoogleSync = async () => {
    setLoading(true);
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-center">Welcome Back.</h1>
          <p className="text-muted-foreground font-medium text-center">Login to continue to DreamSync.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-6 text-red-900 font-bold text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <button
            onClick={handleGoogleSync}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black/10"></div></div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase text-gray-400 tracking-widest italic shrink-0">Standard Identity Sync</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border-2 border-black p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              className="w-full bg-gray-50 border-2 border-black p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-dashed border-gray-300 pt-6">
          <p className="font-medium text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create one for free!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
