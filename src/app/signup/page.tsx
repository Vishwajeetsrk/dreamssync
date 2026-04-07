'use client';

import { useState, Suspense } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Loader2, ShieldCheck, Sparkles, Orbit, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SignupContent() {
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

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
        avatar_url: null,
        bio: '',
        location: '',
        title: '',
        experience: [],
        education: [],
        skills: [],
        socials: {
          linkedin: '',
          github: '',
          portfolio: ''
        }
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Entity construction failed. Integrity check required.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white selection:bg-blue-200 dark:selection:bg-[#2563EB]/40 relative overflow-hidden">
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#2563EB] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#7C3AED] rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[520px] p-8 z-10"
      >
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 p-12 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="mb-12 text-center relative">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="inline-flex p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl mb-8 border border-purple-100 dark:border-purple-500/20 shadow-sm"
             >
                <UserPlus className="w-8 h-8 text-[#7C3AED]" />
             </motion.div>
             <h1 className="text-4xl font-bold tracking-tight mb-3 text-[#0F172A] dark:text-white text-center">
                Create Account
             </h1>
             <p className="text-[#64748B] dark:text-[#94A3B8] text-[15px] font-medium leading-relaxed max-w-[320px] mx-auto text-center">
                Initialize your professional identity on the DreamSync infrastructure.
             </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-500/20 p-4 mb-8 rounded-2xl text-red-600 dark:text-red-400 text-[13px] font-semibold flex items-center gap-3 backdrop-blur-sm"
            >
              <ShieldCheck className="w-5 h-5 shrink-0 opacity-60" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#0F172A] dark:text-gray-200 tracking-tight px-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-[#F1F5F9] dark:bg-[#0F172A] border border-transparent dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-[#0F172A] dark:text-white font-semibold placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0B0F1A] focus:ring-2 focus:ring-[#2563EB]/50 transition-all shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Architect Name"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#0F172A] dark:text-gray-200 tracking-tight px-1">Email Address</label>
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
              <label className="text-[13px] font-bold text-[#0F172A] dark:text-gray-200 tracking-tight px-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-[#F1F5F9] dark:bg-[#0F172A] border border-transparent dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-[#0F172A] dark:text-white font-semibold placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0B0F1A] focus:ring-2 focus:ring-[#2563EB]/50 transition-all shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Passcode"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] mt-4 shadow-lg shadow-blue-500/20 relative group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Building Infrastructure...</span>
                </>
              ) : (
                <>
                  Engage Deployment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[14px] font-medium mb-4">Already registered in the Nexus?</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#3B82F6] font-bold text-[15px] transition-all group"
            >
              Sign In <Orbit className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[#94A3B8] text-[11px] font-bold uppercase tracking-[0.2em] opacity-60"> Powered by DreamSync Sovereign Architecture </p>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
       </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
