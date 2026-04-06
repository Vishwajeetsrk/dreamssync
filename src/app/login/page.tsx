'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verification') === 'sent') {
      setInfo('Verification email sent! Please check your inbox.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (process.env.NODE_ENV === 'production' && !turnstileToken) {
      setError('Please complete the security check.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized. Please add "localhost" to your Firebase Console settings.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInBtn = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add "localhost" to your Firebase Console under Authentication > Settings > Authorized Domains.');
      } else {
        setError(err.message || 'Google Sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      
      {/* Brand Logo / Link back */}
      <Link href="/" className="mb-12 flex items-center gap-2 group">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black text-slate-900">DreamSync.</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-white rounded-3xl shadow-[0px_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Sign in to continue</h1>
            <p className="text-slate-400 text-sm font-medium italic">Empowering your career with AI</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-4 mb-6 rounded-2xl text-xs font-bold flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {info && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border-2 border-emerald-100 text-emerald-700 p-4 mb-6 rounded-2xl text-xs font-bold flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{info}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Sign-in */}
          <div className="mb-8">
            <button
              onClick={handleGoogleSignInBtn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-14 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 font-extrabold text-sm hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-6 h-6" />
              Sign in with Google
            </button>

            <div className="relative mt-8 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-black uppercase text-slate-300 tracking-widest px-4 bg-white">
                Or continue with email:
              </div>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 transition-all text-slate-800 font-bold placeholder:text-slate-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 transition-all text-slate-800 font-bold placeholder:text-slate-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end p-1">
                <Link href="/forgot-password" title="Recover access" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Turnstile Verification */}
            <div className="flex flex-col items-center gap-3 pt-2">
               <Turnstile 
                 siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                 onSuccess={(token) => setTurnstileToken(token)}
                 className="opacity-90 grayscale hover:grayscale-0 transition-all"
               />
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                 <Lock className="w-3 h-3" /> Encrypted Session
               </p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-indigo-600 text-white font-black text-sm uppercase rounded-2xl shadow-[0px_10px_30px_rgba(79,70,229,0.2)] hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="font-bold text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-black ml-1">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Global Access Links */}
        <div className="mt-10 flex justify-center gap-8 text-[10px] font-black uppercase text-slate-400 tracking-widest underline underline-offset-4 decoration-slate-200">
          <Link href="/terms" className="hover:text-slate-600">Terms</Link>
          <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
          <Link href="/donate" className="hover:text-slate-600">Donate</Link>
        </div>
      </motion.div>
    </div>
  );
}
