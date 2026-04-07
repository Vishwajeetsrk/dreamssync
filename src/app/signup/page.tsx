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
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F1A] text-white selection:bg-[#4F46E5]/40 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#4F46E5]/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#A78BFA]/10 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] px-8 py-12 z-10"
      >
        <div className="glass-card p-10 rounded-[40px] relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-2xl border border-[#4F46E5]/20 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.25)]">
              <UserPlus className="w-8 h-8 text-[#22D3EE] animate-pulse" />
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-[34px] font-black tracking-tighter mb-3 bg-gradient-to-r from-white via-blue-100 to-gray-500 bg-clip-text text-transparent uppercase">
              Construct_Entity
            </h1>
            <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
              Initialize your structural identity on the <span className="text-[#A78BFA]">DreamSync</span> infrastructure.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-4 mb-8 rounded-2xl text-red-400 text-[12px] font-bold flex items-start gap-4"
            >
              <ShieldCheck className="w-5 h-5 shrink-0 opacity-60" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/80 px-1">Identity Label</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Architect Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/80 px-1">Resource Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.ai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/80 px-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Passcode"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#5a50ef] hover:to-[#4e45e4] text-white font-black uppercase text-[12px] tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] mt-4 shadow-xl shadow-[#4F46E5]/25 relative group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               {loading ? (
                <>
                  <Orbit className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">Building Infrastructure...</span>
                </>
              ) : (
                <>
                  Engage Deployment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.15em] mb-4">Already registered in the Nexus?</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[#22D3EE] hover:text-[#22D3EE]/80 font-black uppercase text-[12px] tracking-widest transition-all group"
            >
              Synchronize Core <Orbit className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] opacity-40"> DreamSync // Entity Management Node </p>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
       </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
