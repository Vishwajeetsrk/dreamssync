'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Link2, Sparkles, LayoutDashboard, User, Zap, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { name: 'IKIGAI Finder', href: '/ikigai', icon: Brain, color: 'bg-black text-white', desc: 'Discover your true purpose & ideal path.', premium: true },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText, color: 'bg-green-100/10 text-green-400', desc: 'Craft a new ATS-friendly resume.' },
  { name: 'ATS Checker', href: '/ats-check', icon: CheckCircle, color: 'bg-purple-100/10 text-purple-400', desc: 'Scan existing resume for score.' },
  { name: 'Portfolio Gen', href: '/portfolio', icon: Sparkles, color: 'bg-pink-100/10 text-pink-400', desc: 'Auto-generate a personal site.' },
  { name: 'Career Roadmap', href: '/roadmap', icon: Briefcase, color: 'bg-amber-100/10 text-amber-400', desc: 'Plan your learning timeline.' },
  { name: 'Doc & Skill', href: '/documents', icon: BookOpen, color: 'bg-blue-100/10 text-blue-400', desc: 'Step-by-step guides & free resources.' },
  { name: 'LinkedIn Optimizer', href: '/linkedin', icon: Link2, color: 'bg-[#0A66C2]/10 text-blue-400', desc: 'AI headlines, about & keywords.' },
  { name: 'AI Career Agent', href: '/career-agent', icon: Brain, color: 'bg-violet-100/10 text-violet-400', desc: 'AI guidance, roles & real jobs.' },
  { name: 'Mental Health', href: '/mental-health', icon: HeartHandshake, color: 'bg-rose-100/10 text-rose-400', desc: 'Emotional support & wellness.' },
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
         <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
      </div>
    );
  }

  const userName = userData?.name?.split(' ')[0] || user.email?.split('@')[0] || "Dreamer";

  return (
    <div className="min-h-screen bg-[#0F172A] pt-32 pb-12 px-6 md:px-12 text-white selection:bg-[#3B82F6]/40 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1E3A8A] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e11d48] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header Infrastructure */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#3B82F6]">
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Command Center v4.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-white">
              Welcome, <br /> <span className="text-gradient-hero italic">{userName}_</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center gap-3">
               <Zap className="w-3 h-3 animate-pulse" /> Protocol: Active
            </div>
          </div>
        </div>

        {/* Intelligence Matrix Grid */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
             <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
               <Globe className="w-5 h-5 text-[#3B82F6]" /> Active Node Toolsets
             </h2>
             <div className="h-[1px] flex-grow mx-8 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-10 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                
                <div className={`p-4 rounded-2xl border border-white/10 ${tool.color} inline-block mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <tool.icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-4 mb-10">
                   <h3 className="text-2xl font-bold uppercase tracking-tight text-white group-hover:text-[#3B82F6] transition-colors flex items-center justify-between">
                      {tool.name}
                      {tool.premium && <span className="text-[9px] font-black bg-[#3B82F6] text-white px-3 py-1 rounded-full ml-auto">Sovereign</span>}
                   </h3>
                   <p className="text-[13px] font-medium text-white/30 lowercase tracking-wide group-hover:text-white/50 transition-colors leading-relaxed">
                      {tool.desc}
                   </p>
                </div>
                
                <Link href={tool.href} className="flex items-center justify-between py-4 border-t border-white/5 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-all text-white/20">
                  Initialize Access <ArrowRight className="w-4 h-4 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Security Footer Indicator */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">DreamSync Node ID: {user.uid.slice(0, 8)}</p>
           <div className="flex items-center gap-8">
              <ShieldCheck className="w-5 h-5" />
              <Zap className="w-5 h-5" />
              <Globe className="w-5 h-5" />
           </div>
        </div>
      </div>
    </div>
  );
}
