'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, UserPlus, Mail, Lock, User, Sparkles, ShieldCheck } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (process.env.NODE_ENV === 'production' && !turnstileToken) {
      setError('Please complete the security check to continue.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for security.');
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), { 
        name, 
        email, 
        plan: "free",
        createdAt: new Date(),
        authMethod: 'email',
        lastLogin: new Date()
      });
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignupBtn = async () => {
    setError('');
    setLoading(true);
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#fafafa]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white border-[6px] border-black p-8 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-1 bg-black text-white text-[10px] uppercase font-black tracking-widest mb-6"
            >
              <Sparkles className="w-3 h-3 text-primary" /> 2026 Production Ready
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight">DreamSync.</h1>
            <p className="text-muted-foreground font-bold italic tracking-wide uppercase text-xs">Start your career journey today</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-4 border-red-500 p-4 mb-8 text-red-950 font-black text-xs uppercase tracking-tight flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Signup */}
          <div className="space-y-4 mb-10">
            <button
              onClick={handleGoogleSignupBtn}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black text-sm uppercase items-center justify-center border-4 border-black hover:bg-gray-50 hover:-translate-y-1 active:translate-y-0 transition-all flex gap-3 disabled:opacity-50 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-black/5"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-black uppercase text-gray-400 tracking-widest">or use email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-primary" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:ring-0 focus:border-primary transition-all font-bold placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:ring-0 focus:border-primary transition-all font-bold placeholder:text-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" /> Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:ring-0 focus:border-primary transition-all font-bold placeholder:text-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Turnstile Container */}
            <div className="py-2">
               <div className="flex flex-col gap-2">
                 <Turnstile 
                   siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                   onSuccess={(token) => setTurnstileToken(token)}
                   className="mx-auto"
                 />
                 <div className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase text-gray-400">
                   <ShieldCheck className="w-3 h-3" /> Secure Auth Environment
                 </div>
               </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="group w-full py-5 bg-primary text-black font-black text-lg uppercase tracking-tight border-[6px] border-black hover:-translate-y-1 active:translate-y-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  Create Account <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t-4 border-black/5 pt-8">
            <p className="font-bold text-sm tracking-tight">
              Already a community member?{' '}
              <Link href="/login" className="text-primary font-black underline underline-offset-4 hover:bg-primary/10 transition-colors px-1">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">
          <p>© 2026 DreamSync AI platform</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
