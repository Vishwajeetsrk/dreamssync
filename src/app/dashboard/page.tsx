'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Link2, Sparkles, LayoutDashboard, User, Zap, Globe, ShieldCheck, Activity, Fingerprint } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { name: 'IKIGAI Finder', href: '/ikigai', icon: Brain, color: 'text-[#2563EB]', desc: 'Discover your true purpose & ideal path.', premium: true },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText, color: 'text-emerald-400', desc: 'Craft a new ATS-friendly resume.' },
  { name: 'ATS Checker', href: '/ats-check', icon: CheckCircle, color: 'text-purple-400', desc: 'Scan existing resume for score.' },
  { name: 'Portfolio Gen', href: '/portfolio', icon: Sparkles, color: 'text-pink-400', desc: 'Auto-generate a personal site.' },
  { name: 'Career Roadmap', href: '/roadmap', icon: Briefcase, color: 'text-amber-400', desc: 'Plan your learning timeline.' },
  { name: 'Doc & Skill', href: '/documents', icon: BookOpen, color: 'text-sky-400', desc: 'Step-by-step guides & free resources.' },
  { name: 'LinkedIn Optimizer', href: '/linkedin', icon: Link2, color: 'text-blue-400', desc: 'AI headlines, about & keywords.' },
  { name: 'AI Career Agent', href: '/career-agent', icon: Brain, color: 'text-violet-400', desc: 'AI guidance, roles & real jobs.' },
  { name: 'Mental Health', href: '/mental-health', icon: HeartHandshake, color: 'text-rose-400', desc: 'Emotional support & wellness.' },
];

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
         <div className="relative">
            <div className="w-20 h-20 border-2 border-white/5 border-t-[#2563EB] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 border-2 border-white/5 border-b-[#7C3AED] rounded-full animate-spin-slow" />
            </div>
         </div>
      </div>
    );
  }

  const userName = userData?.name?.split(' ')[0] || user.email?.split('@')[0] || "Dreamer";

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-32 pb-12 px-6 md:px-12 text-white selection:bg-[#2563EB]/40 relative overflow-hidden">
      
      {/* Premium Background Radiants */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_0%_100%,rgba(124,58,237,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header Architecture */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#2563EB]">
              <div className="p-2 bg-[#2563EB]/10 rounded-lg border border-[#2563EB]/20">
                <LayoutDashboard className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Command Center v4.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-white">
              Welcome, <br /> <span className="gradient-text italic">{userName}_</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-2xl">
            <div className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center gap-3">
               <Zap className="w-3 h-3 animate-pulse text-[#2563EB]" /> Protocol: Active
            </div>
          </div>
        </div>

        {/* Intelligence Matrix Grid */}
        <section className="space-y-16">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,1)]" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                 Active Node Toolsets
               </h2>
             </div>
             <div className="h-px flex-grow mx-8 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="glass-card p-10 relative overflow-hidden group hover:border-[#2563EB]/30 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#2563EB]/50 transition-all duration-700" />
                
                <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${tool.color} inline-block mb-10 shadow-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                  <tool.icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-4 mb-10">
                   <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
                      {tool.name}
                      {tool.premium && (
                         <div className="flex items-center gap-1 px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full">
                            <Sparkles className="w-3 h-3 text-[#2563EB]" />
                            <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest">Sovereign</span>
                         </div>
                      )}
                   </h3>
                   <p className="text-sm font-medium text-[#4B5563] leading-relaxed group-hover:text-[#9CA3AF] transition-colors">
                      {tool.desc}
                   </p>
                </div>
                
                <Link href={tool.href} className="flex items-center justify-between py-5 mt-auto border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-[#4B5563] group-hover:text-white transition-all">
                  Initialize Access <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* System Meta */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-30">
           <div className="flex items-center gap-4">
              <Fingerprint className="w-5 h-5 text-[#2563EB]" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">DreamSync Node ID: {user.uid.slice(0, 8)}</p>
           </div>
           <div className="flex items-center gap-12 text-[#4B5563]">
              <ShieldCheck className="w-5 h-5 hover:text-white transition-colors" />
              <Activity className="w-5 h-5 hover:text-white transition-colors" />
              <Globe className="w-5 h-5 hover:text-white transition-colors" />
           </div>
        </div>
      </div>
    </div>
  );
}
