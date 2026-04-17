'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Zap, Globe, Fingerprint, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { signIn as nextAuthSignIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      let friendlyMessage = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        friendlyMessage = "Incorrect password. Please try again or reset it.";
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No account found with this email. Please sign up.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = "Too many failed attempts. Please try again later.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setLoading(true);
    setError('');
    try {
      // Use NextAuth for social login to avoid Firebase popup issues on production
      await nextAuthSignIn(providerName, { callbackUrl: '/dashboard' });
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${providerName}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex items-center justify-center px-6 py-20 selection:bg-blue-100">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] space-y-10"
      >
        <div className="text-center space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image 
                src="/DreamSynclogo.png" 
                alt="DreamSync Logo" 
                width={160} 
                height={40} 
                className="object-contain" 
                priority 
              />
            </Link>
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Welcome back!</h1>
                <p className="text-stone-400 font-medium">Continue your journey with DreamSync.</p>
            </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-10">
          
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p>{error}</p>
                {error.includes("sign up") && (
                  <Link href="/signup" className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-black uppercase hover:bg-rose-200 transition-colors">
                    Join Today
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="input-field !pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Arjun@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] text-blue-600 font-bold hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field !pl-12 !pr-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-4 text-lg flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="space-y-6 pt-4 border-t border-stone-50">
            <p className="text-center text-[10px] font-bold text-stone-300 uppercase tracking-widest">Or continue with</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 bg-white border border-stone-100 rounded-[1.5rem] shadow-sm hover:border-blue-200 hover:bg-blue-50/50 transition-all font-bold text-stone-700 text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg> Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 bg-white border border-stone-100 rounded-[1.5rem] shadow-sm hover:border-stone-200 hover:bg-stone-50 transition-all font-bold text-stone-700 text-sm"
              >
                <svg className="w-5 h-5 text-stone-900" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg> GitHub
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm font-medium text-stone-400">
                New here? <Link href="/signup" className="text-blue-600 font-extrabold hover:underline">Create your account</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 text-stone-300">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase">Private & Secure Sanctuary</span>
          <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
