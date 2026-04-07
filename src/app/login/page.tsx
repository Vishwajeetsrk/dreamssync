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
          <p className="text-muted-foreground font-medium text-center">Login to continue.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-6 text-red-900 font-bold text-sm">
            {error}
          </div>
        )}

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
