'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, User, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, {
        displayName: name
      });

      // Create profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        plan: 'free',
        created_at: new Date().toISOString(),
        avatar_url: ''
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white selection:bg-[#1D4D47]">
      <div className="w-full max-w-[440px] px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 text-left">
          <h1 className="text-[32px] font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-gray-400 text-[15px]">Enter an email and create a password, getting started is easy!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 mb-6 rounded-lg text-red-400 text-sm flex items-start gap-3 animate-in shake duration-300">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-[14px] font-medium text-gray-200">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1D4D47] transition-colors" />
              <input
                type="text"
                required
                className="w-full bg-[#141414] border border-[#222] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arjun Sharma"
              />
            </div>
          </div>

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
            <label className="text-[14px] font-medium text-gray-200">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1D4D47] transition-colors" />
              <input
                type="password"
                required
                minLength={6}
                className="w-full bg-[#141414] border border-[#222] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1D4D47] hover:bg-[#265e57] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[#1D4D47]/10"
          >
            {loading ? 'Initializing Architecture...' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#222] text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-[#2d7a71] font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
