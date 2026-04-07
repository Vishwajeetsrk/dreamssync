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
      setError('SECURITY THREAT: Multiple unauthorized access attempts detected. Terminal locked.');
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
      setError(err.message || 'Access Denied: Infrastructure synchronization failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F1A] text-white selection:bg-[#4F46E5]/40 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#22D3EE]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[460px] px-8 py-12 z-10"
      >
        <div className="glass-card p-10 rounded-[40px] relative transition-none">
          {/* Top Decorative Orbit */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-2xl border border-[#4F46E5]/20 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <Orbit className="w-8 h-8 text-[#22D3EE] animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-[34px] font-black tracking-tighter mb-3 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent uppercase">
              Initialize_
            </h1>
            <p className="text-gray-400 text-[13px] font-medium tracking-wide">
              Establish a secure career uplink to the <span className="text-[#22D3EE]">DreamSync</span> core.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 mb-8 rounded-2xl text-red-400 text-[12px] font-bold flex items-start gap-3 backdrop-blur-sm"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/80 px-1">Access Protocol</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/80">Security Phrase</label>
                <Link href="/forgot-password" title="Standardized Security Recovery" className="text-[10px] text-gray-500 hover:text-[#22D3EE] font-black uppercase tracking-widest transition-colors">Leak Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#4F46E5] hover:bg-[#5a50ef] text-white font-black uppercase text-[12px] tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[#4F46E5]/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <>
                  <Orbit className="w-5 h-5 animate-spin" /> 
                  <span className="animate-pulse">Syncing...</span>
                </>
              ) : (
                <>
                   Initialize Core <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
               New Entity Detection Case_
            </p>
            <Link 
               href="/signup" 
               className="inline-flex items-center gap-2 text-[#22D3EE] hover:text-[#22D3EE]/80 font-black uppercase text-[12px] tracking-[0.1em] transition-all group"
            >
              Construct Account <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] opacity-40"> DreamSync // AI Infrastructure </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
