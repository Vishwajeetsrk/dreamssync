'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createFirestoreUser = async (user: any) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        name: user.displayName || 'Dreamer',
        email: user.email,
        avatar_url: user.photoURL || '',
        created_at: new Date().toISOString(),
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createFirestoreUser(result.user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createFirestoreUser(result.user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-6 selection:bg-[#FACC15]/40 font-bold">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="neo-box p-12 bg-white space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-block p-4 bg-[#2563EB] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Welcome Back</h1>
            <p className="text-gray-500 text-sm font-semibold">Sign in to your <span className="text-[#2563EB]">Dream</span><span className="text-black">Sync</span> account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-4 border-black text-red-600 text-xs font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-2 h-12 bg-white border-4 border-black font-black text-xs text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              onClick={handleGithubLogin}
              type="button"
              className="flex items-center justify-center gap-2 h-12 bg-[#24292F] border-4 border-black font-black text-xs text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <GitHubIcon /> Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
            <span className="text-xs font-black text-gray-400 tracking-widest">OR</span>
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6 text-black">
            <div className="space-y-2">
              <label className="text-sm font-black tracking-wide">Email</label>
              <input 
                type="email" 
                required 
                className="neo-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#2563EB] font-bold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required 
                  className="neo-input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="neo-btn-primary w-full h-14 text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Log In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#2563EB] font-black hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

