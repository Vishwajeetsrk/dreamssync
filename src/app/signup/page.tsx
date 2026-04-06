'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, UserPlus, Mail, Lock, User, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (process.env.NODE_ENV === 'production' && !turnstileToken) {
      setError('Please complete the security check.');
      return;
    }

    if (password.length < 8) {
      setError('Minimum 8 characters required.');
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      
      await setDoc(doc(db, "users", userCred.user.uid), { 
        name, email, plan: "free", createdAt: new Date(), authMethod: 'email', lastLogin: new Date()
      });
      
      setSuccess(true);
      setTimeout(() => router.push('/login?verification=sent'), 5000);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please whitelist localhost/vercel in Firebase Console.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Account already exists. Try signing in!');
      } else {
        setError(err.message || 'Something went wrong.');
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
      if (err.code === 'auth/unauthorized-domain') {
        setError('Please whitelist "localhost" in Firebase Console > Authentication > Settings > Authorized Domains.');
      } else {
        setError(err.message || 'Google Sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      
      {/* Background Decorative */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,_#4f46e508,_#ffffff00_30%),radial-gradient(circle_at_bottom_left,_#4f46e508,_#ffffff00_30%)]" />

      {/* Brand Logo */}
      <Link href="/" className="mb-12 flex items-center gap-2 group">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black text-slate-900">DreamSync.</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white rounded-[32px] shadow-[0px_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-12 text-center">
          
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Create an account for free</h1>
          
          {/* Social Proof Placeholder */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                   <div className="w-full h-full bg-indigo-400 opacity-20" />
                </div>
              ))}
            </div>
            <p className="text-[13px] font-bold text-slate-400">Join over 700,000+ learners</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-50 border border-rose-100 text-rose-600 p-4 mb-8 rounded-2xl text-xs font-black uppercase text-left flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12"
              >
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Verification Sent!</h3>
                <p className="text-slate-500 font-bold mb-6 text-sm max-w-xs mx-auto">Please check your email inbox to verify your account and begin your journey.</p>
                <Link href="/login" className="text-indigo-600 font-extrabold text-sm underline underline-offset-4">Sign in now</Link>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={handleGoogleSignupBtn}
                  disabled={loading}
                  className="w-full flex items-center group overflow-hidden bg-[#4285F4] text-white rounded-xl shadow-lg hover:bg-[#357ae8] transition-all h-16 active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="bg-white m-1 rounded-lg w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-95 transition-transform">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-6 h-6 " />
                  </div>
                  <span className="flex-grow text-[15px] font-black tracking-tight pr-4">Sign up with Google</span>
                </button>

                <div className="mt-8 mb-8 relative">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <span className="relative px-6 bg-white text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] italic">Or continue with email</span>
                </div>

                <form onSubmit={handleSignup} className="space-y-4 text-left">
                  <div className="group relative">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 transition-all text-slate-800 font-bold placeholder:text-slate-400 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="group relative">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 transition-all text-slate-800 font-bold placeholder:text-slate-400 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="group relative">
                    <input
                      type="password"
                      required
                      placeholder="Password (Min. 8 chars)"
                      className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 transition-all text-slate-800 font-bold placeholder:text-slate-400 outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="py-4 flex flex-col items-center gap-4">
                     <Turnstile 
                       siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                       onSuccess={(token) => setTurnstileToken(token)}
                       className="grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all"
                     />
                     <div className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Secure AI Protection Layer
                     </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-indigo-600 text-white font-black text-[15px] uppercase rounded-2xl shadow-[0px_10px_30px_rgba(79,70,229,0.3)] hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                       <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-xs font-bold text-slate-400 px-4">
                  By signing up, you agree to our <Link href="/terms" className="text-indigo-600">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600">Privacy Policy</Link>.
                </p>

                <div className="mt-12 text-center">
                  <p className="font-bold text-sm text-slate-500">
                    Already have an account? <Link href="/login" className="text-indigo-600 font-black ml-1">Sign in</Link>
                  </p>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
