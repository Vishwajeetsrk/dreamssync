'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSiteKeyValid, setIsSiteKeyValid] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verification') === 'sent') {
      setInfo('Verification email sent! Check your inbox to activate your account.');
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
        setError('This domain is not authorized. Please check your Firebase Console settings.');
      } else {
        setError('Invalid credentials. Please try again.');
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
        setError('Domain mismatch. Add "localhost" to your Firebase Console > Auth > Settings.');
      } else {
        setError(err.message || 'Google Auth failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 bg-[#fafafa] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="bg-white border-[6px] border-black p-8 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Brand Header */}
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 3 }}
              className="w-20 h-20 bg-primary mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex items-center justify-center transform hover:scale-105 transition-all"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back.</h1>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" /> Sync your career journey
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-black text-white p-4 mb-8 text-xs font-black uppercase tracking-wider flex items-center gap-3 border-l-8 border-red-500"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                {error}
              </motion.div>
            )}

            {info && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-green-50 border-4 border-green-600 p-4 mb-8 text-[11px] font-black uppercase text-green-900 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                {info}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified Social Gateway */}
          <div className="space-y-4 mb-10">
            <button
              onClick={handleGoogleSignInBtn}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black text-sm uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative py-2 flex items-center gap-4">
              <div className="flex-grow border-t-4 border-black/5"></div>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0 italic">Secure Email Handshake</span>
              <div className="flex-grow border-t-4 border-black/5"></div>
            </div>
          </div>

          {/* Standard Auth Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" /> Gateway ID
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:border-primary transition-all font-bold placeholder:text-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3 text-primary" /> Key Phrase
                </label>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:border-primary transition-all font-bold placeholder:text-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end p-1">
                <Link href="/forgot-password" text-primary className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-2">
                  Recover access?
                </Link>
              </div>
            </div>

            {/* Turnstile Verification Layer */}
            <div className="pt-4 flex flex-col items-center gap-3">
               <div className="min-h-[65px]">
                 <Turnstile 
                   siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                   onSuccess={(token) => {
                     setTurnstileToken(token);
                     setIsSiteKeyValid(true);
                   }}
                   onError={() => setIsSiteKeyValid(false)}
                 />
               </div>
               {!isSiteKeyValid && (
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                   Connection Error. Please refresh.
                 </p>
               )}
               <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-400">
                 <ShieldCheck className="w-3 h-3" /> 256-bit AES Authenticator
               </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-black text-white font-black text-lg uppercase tracking-tight shadow-[8px_8px_0px_0px_var(--primary)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Granting Access...
                </div>
              ) : (
                <>Sign In Now <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t-4 border-dashed border-gray-100 pt-8">
            <p className="font-bold text-sm tracking-tight">
              Awaiting identity?{' '}
              <Link href="/signup" className="text-primary font-black underline underline-offset-4 hover:bg-primary/5 transition-colors px-1">
                Establish Sync Profile
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer Access */}
        <div className="mt-8 flex justify-center gap-8 text-[10px] font-black uppercase text-gray-400 tracking-widest underline underline-offset-4 decoration-gray-200 decoration-4">
          <Link href="/" className="hover:text-black transition-colors">Home Base</Link>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          <Link href="/donate" className="hover:text-black transition-colors">Support Development</Link>
        </div>
      </motion.div>
    </div>
  );
}
