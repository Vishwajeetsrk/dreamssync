'use client';

import { useState, Suspense } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ShieldCheck, Sparkles, Orbit, ArrowRight } from 'lucide-react';
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
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A] text-white selection:bg-[#3B82F6]/40 relative overflow-hidden">
      {/* Luxurious AI Glow Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#3B82F6]/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#e11d48]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[520px] p-8 z-10"
      >
        <div className="glass-card p-12 relative overflow-hidden group">
          <div className="mb-12 text-center">
             <motion.div 
               whileHover={{ scale: 1.1, rotate: 10 }}
               className="inline-flex p-4 bg-white/5 rounded-2xl mb-8 border border-white/10 shadow-[0_0_25px_rgba(225,29,72,0.2)]"
             >
                <UserPlus className="w-8 h-8 text-[#e11d48]" />
             </motion.div>
             <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Initialize <span className="text-gradient-hero">Identity</span>
             </h1>
             <p className="text-[#94A3B8] text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto">
                Begin your journey of turning dreams into reality via our AI infrastructure.
             </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-4 mb-8 rounded-2xl text-red-500 text-[13px] font-bold flex items-center gap-3 backdrop-blur-md"
            >
              <ShieldCheck className="w-5 h-5 shrink-0 opacity-60" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold text-white/50 tracking-widest uppercase px-1">Identity Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Architect Name"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[12px] font-bold text-white/50 tracking-widest uppercase px-1">Resource Locator</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.ai"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[12px] font-bold text-white/50 tracking-widest uppercase px-1">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Passcode"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 btn-gradient text-[14px] uppercase tracking-[0.2em] relative group overflow-hidden mt-2"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
               {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Configuring...</span>
                </>
              ) : (
                <>
                  Engage Core <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-white/30 text-[13px] font-medium mb-4">Already registered in the Nexus?</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#e11d48] font-bold text-[14px] uppercase tracking-widest transition-all group"
            >
              Sign In <Orbit className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60"> DreamSync // Sovereign Infrastructure </p>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
       </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
