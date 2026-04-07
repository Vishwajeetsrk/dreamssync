'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, UserPlus, Globe } from 'lucide-react';

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
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (signupError) throw signupError;

      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: name, 
              email: email, 
              plan: 'free',
              created_at: new Date().toISOString(),
              auth_method: 'email',
              avatar_url: '' 
            }
          ]);
        
        if (profileError) console.error("Profile creation error:", profileError.message);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
      setError(err.message || 'Google signup failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-accent flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <UserPlus className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Create Account</h1>
          <p className="text-muted-foreground font-black text-sm uppercase tracking-tight mt-2">JOIN THE FUTURE OF CAREER GUIDANCE</p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-3 mb-6 text-red-900 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-gray-50 border-4 border-black p-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arjun Sharma"
            />
          </div>

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
            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full bg-gray-50 border-4 border-black p-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 6 characters"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-accent text-black font-black text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        <div className="text-center border-t-4 border-black border-dashed pt-6 mt-8">
          <p className="font-black text-muted-foreground text-[10px] tracking-widest uppercase">
            ALREADY HAVE AN ACCOUNT?{' '}
            <Link href="/login" className="text-primary hover:underline underline-offset-4">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
