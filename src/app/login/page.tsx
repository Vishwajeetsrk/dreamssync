'use client';

import { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, ShieldAlert, Sparkles, Orbit } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'too-many-attempts') {
      setError('SECURITY RESTRICTION: Multiple unauthorized access attempts. Uplink stabilized but locked.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed. Protocol mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A] text-white selection:bg-[#3B82F6]/40 relative overflow-hidden">
      {/* Luxurious AI Glow Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1E3A8A]/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e11d48]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[500px] p-8 z-10"
      >
        <div className="glass-card p-12 relative overflow-hidden group">
          {/* Top Branding Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-8 border border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
               <Orbit className="w-8 h-8 text-[#3B82F6] animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
               Access <span className="text-gradient-blue">DreamSync</span>
            </h1>
            <p className="text-[#94A3B8] text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto">
               Synchronize your professional aspirations with our core AI infrastructure.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 mb-8 rounded-2xl text-red-500 text-[13px] font-bold flex items-start gap-4 backdrop-blur-md"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 opacity-60" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold text-white/50 tracking-widest uppercase px-1">Resource Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[12px] font-bold text-white/50 tracking-widest uppercase">Security Key</label>
                <Link href="/forgot-password" className="text-[11px] text-[#3B82F6] hover:text-[#e11d48] font-bold tracking-widest uppercase transition-colors">Lockout?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 btn-gradient text-[14px] uppercase tracking-[0.2em] relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Syncing...</span>
                </>
              ) : (
                <>
                   Authorize Entry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-white/30 text-[13px] font-medium mb-4">
               New entity detection required?
            </p>
            <Link 
               href="/signup" 
               className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#e11d48] font-bold text-[14px] uppercase tracking-widest transition-all group"
            >
              Initialize Node <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60"> DreamSync // Luxury AI Systems </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
