'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Chrome, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar_url: user.photoURL,
          created_at: new Date().toISOString(),
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center relative overflow-hidden px-6">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-10 border border-white/5 relative overflow-hidden backdrop-blur-3xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-inner">
               <ShieldCheck className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-[#9CA3AF] text-sm">Secure authorization for your career hub.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] ml-1">Identity Mail</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required 
                  className="input-premium w-full pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] group-focus-within:text-[#2563EB] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">Secret Protocol</label>
                <Link href="/forgot-password" size="sm" className="text-xs text-[#2563EB] hover:text-[#06B6D4] transition-colors">Forgot Access?</Link>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  required 
                  className="input-premium w-full pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] group-focus-within:text-[#2563EB] transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 group h-14"
            >
              {loading ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authorize Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
            <p className="text-center text-xs font-medium text-[#4B5563] uppercase tracking-[0.2em]">External Synchronization</p>
            <button 
              onClick={handleGoogleLogin} 
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-xl transition-all"
            >
              <Chrome className="w-5 h-5" /> <span>Google Cloud Auth</span>
            </button>

            <p className="text-center text-sm text-[#9CA3AF]">
              New to the system? <Link href="/signup" className="text-[#2563EB] hover:text-[#06B6D4] font-semibold transition-colors">Create Identity</Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex justify-center items-center gap-2 opacity-30">
           <Sparkles className="w-4 h-4 text-[#2563EB]" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Sovereign Layer 4 Architecture</span>
        </div>
      </motion.div>
    </div>
  );
}
