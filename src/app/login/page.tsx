'use client';

import { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, ShieldAlert, Sparkles, LayoutDashboard } from 'lucide-react';
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
      setError('RESTRICED ACCESS: Too many authentication attempts. Please verify your credentials later.');
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
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white selection:bg-blue-200 dark:selection:bg-[#2563EB]/40 relative overflow-hidden">
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2563EB] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#7C3AED] rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] p-8 z-10"
      >
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 p-12 rounded-[32px] shadow-2xl relative overflow-hidden group">
          {/* Top Branding Section */}
          <div className="mb-12 text-center relative">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-8 border border-blue-100 dark:border-blue-500/20"
             >
                <LayoutDashboard className="w-8 h-8 text-[#2563EB]" />
             </motion.div>
             <h1 className="text-4xl font-bold tracking-tight mb-3 text-[#0F172A] dark:text-white">
                Sign In
             </h1>
             <p className="text-[#64748B] dark:text-[#94A3B8] text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto">
                Securely manage your professional infrastructure with DreamSync AI.
             </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-500/20 p-4 mb-8 rounded-2xl text-red-600 dark:text-red-400 text-[13px] font-semibold flex items-center gap-3 backdrop-blur-sm"
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#0F172A] dark:text-gray-200 tracking-tight px-1">Professional Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-[#F1F5F9] dark:bg-[#0F172A] border border-transparent dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-[#0F172A] dark:text-white font-semibold placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0B0F1A] focus:ring-2 focus:ring-[#2563EB]/50 transition-all shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.ai"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-bold text-[#0F172A] dark:text-gray-200 tracking-tight">Security Code</label>
                <Link href="/forgot-password" className="text-[12px] text-[#2563EB] hover:text-[#3B82F6] font-bold tracking-tight transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-[#F1F5F9] dark:bg-[#0F172A] border border-transparent dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-[#0F172A] dark:text-white font-semibold placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0B0F1A] focus:ring-2 focus:ring-[#2563EB]/50 transition-all shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-500/20 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                   Authorize Entry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[14px] font-medium mb-4">
               New to our infrastructure?
            </p>
            <Link 
               href="/signup" 
               className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#3B82F6] font-bold text-[15px] transition-all group"
            >
              Create Account <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[#94A3B8] text-[11px] font-bold uppercase tracking-[0.2em] opacity-60"> Powered by DreamSync Sovereign Architecture </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
