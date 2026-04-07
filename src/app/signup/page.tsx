'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Database, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        created_at: new Date().toISOString(),
        onboarding_complete: false,
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
          onboarding_complete: false,
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
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#06B6D4]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card rounded-[2rem] p-12 border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-[#7C3AED] to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
               <Zap className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Initialize Identity</h1>
            <p className="text-[#9CA3AF] text-sm">Synchronize with the DreamSync career grid.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] ml-1">Full Signature</label>
              <div className="relative group">
                <input 
                  type="text" 
                  required 
                  className="input-premium w-full pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] group-focus-within:text-[#7C3AED] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] ml-1">Network Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required 
                  className="input-premium w-full pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="identity@network.ai"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] group-focus-within:text-[#7C3AED] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] ml-1">Secret Access Cipher</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required 
                  className="input-premium w-full pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] group-focus-within:text-[#7C3AED] transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 group h-14 bg-gradient-to-r from-[#7C3AED] to-[#2563EB]"
            >
              {loading ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Establish Node <ArrowRight className="w-5 h-5 group-hover:translate-x- group-hover:scale-110 transition-all border border-[#7C3AED]/30 rounded-full" /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 space-y-6 text-center">
            <p className="text-xs font-medium text-[#4B5563] uppercase tracking-[0.2em]">Synchronize via Provider</p>
            <button 
              onClick={handleGoogleSignup} 
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-xl transition-all"
            >
              <Database className="w-5 h-5" /> <span>Cloud Synchronization</span>
            </button>

            <p className="text-sm text-[#9CA3AF]">
              Already integrated? <Link href="/login" className="text-[#7C3AED] hover:text-[#06B6D4] font-semibold transition-colors">Sign In Hub</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-3 opacity-20">
           <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Quantum Encryption Standard</span>
        </div>
      </motion.div>
    </div>
  );
}
