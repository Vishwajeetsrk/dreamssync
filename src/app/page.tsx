'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Sparkles, Coffee, Map, TrendingUp, Building2, User, Globe, ShieldCheck, Zap, Activity, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { t } = useLanguage();
  const { user, userData } = useAuth();

  const features = [
    { title: 'AI Career Agent', desc: 'Predictive modeling for your professional trajectory.', icon: Brain, href: "/career-agent", glow: "hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]" },
    { title: 'Resume Architect', desc: 'Sovereign document construction with real-time optimization.', icon: FileText, href: "/resume-builder", glow: "hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]" },
    { title: 'ATS Sync Protocol', desc: 'Automated compatibility analysis across enterprise nodes.', icon: ShieldCheck, href: "/ats-check", glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]" },
    { title: 'Graph Roadmap', href: "/roadmap", desc: 'Strategic skill-acquisition mapping with AI foresight.', icon: Activity, glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]" },
    { title: 'Portfolio Hub', desc: 'Autonomous generation of high-fidelity personal nodes.', icon: Sparkles, href: "/portfolio", glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]" },
    { title: 'Serenity AI', desc: 'Empathetic intelligence for professional mental well-being.', icon: HeartHandshake, href: "/mental-health", glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]" },
  ];

  return (
    <div className="flex flex-col space-y-32 bg-[#0B0F19] selection:bg-[#2563EB]/40 relative overflow-hidden">
      
      {/* Premium Background Radiants */}
      <div className="absolute top-0 left-0 w-full h-[1000px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* 🚀 LATEST PROTOCOL TICKER */}
      <div className="w-full bg-white/5 border-y border-white/5 py-3 backdrop-blur-md overflow-hidden relative z-10 mt-24">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-white/30 items-center"
        >
          <div className="flex items-center gap-3"><Zap className="w-3.5 h-3.5 text-[#2563EB]" /> Core Protocol Updated: v4.0 Active</div>
          <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-[#7C3AED]" /> Global Nodes Synced: 11 Languages Deployed</div>
          <div className="flex items-center gap-3"><ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" /> Security: Quantum Identity Encryption Live</div>
          <div className="flex items-center gap-3"><Sparkles className="w-3.5 h-3.5 text-white/60" /> New: AI Persona Calibration v2.4</div>
          
          {/* Loop duplicates */}
          <div className="flex items-center gap-3"><Zap className="w-3.5 h-3.5 text-[#2563EB]" /> Core Protocol Updated: v4.0 Active</div>
          <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-[#7C3AED]" /> Global Nodes Synced: 11 Languages Deployed</div>
        </motion.div>
      </div>

      {/* 🔮 HERO SECTION: PREMIUM AI SAAS */}
      <section className="relative pt-20 text-center space-y-12 max-w-6xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Now Powering 10k+ Sovereign Careers</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white">
             The Architecture of <br /> 
             <span className="gradient-text italic">Professional Destiny_</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#9CA3AF] font-medium leading-relaxed px-4">
             Engineering high-fidelity professional identities with autonomous AI intelligence. Synchronize your career with the next generation of professional excellence.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto px-10 py-5 text-sm uppercase tracking-widest flex items-center justify-center gap-3">
             Initialize Entry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="btn-secondary w-full sm:w-auto px-10 py-5 text-sm uppercase tracking-widest">
             Core Specifications
          </Link>
        </motion.div>

        {user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-12 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]"
          >
             Active Node: <span className="text-[#2563EB]">{userData?.name || user.email}</span> // Sovereignty Confirmed
          </motion.div>
        )}
      </section>

      {/* 🧬 CORE INFRASTRUCTURE MATRIX */}
      <section className="space-y-16 max-w-7xl mx-auto w-full px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
           <h2 className="text-4xl font-bold tracking-tight text-white uppercase">Technological Verticals_</h2>
           <p className="max-w-xs text-[#4B5563] text-xs font-bold leading-relaxed uppercase tracking-widest">A multi-model AI ecosystem engineered for full-stack professional optimization.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link href={feature.href} key={i}>
              <motion.div 
                className={`glass-card p-10 group relative overflow-hidden h-full flex flex-col items-start gap-8 transition-all duration-500 cursor-pointer ${feature.glow}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#2563EB]/50 transition-all duration-700" />
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-[#2563EB]/10 transition-all duration-500 shadow-xl">
                  <feature.icon className="w-8 h-8 text-white group-hover:text-[#2563EB] transition-colors" />
                </div>
                
                <div className="space-y-4">
                   <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-between group-hover:text-[#2563EB] transition-colors">
                      {feature.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                   </h3>
                   <p className="text-sm font-medium text-[#4B5563] leading-relaxed group-hover:text-[#9CA3AF] transition-colors">
                      {feature.desc}
                   </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💎 SUSTAINABILITY UNIT */}
      <section className="max-w-5xl mx-auto w-full pt-12 pb-32 px-6">
        <motion.div
          className="glass-card rounded-[3rem] p-16 md:p-24 text-center space-y-12 relative overflow-hidden backdrop-blur-3xl"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/10 blur-[80px] pointer-events-none" />
          
          <div className="space-y-8 relative z-10">
            <div className="inline-flex p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl mx-auto">
               <Coffee className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">Sovereign Support_</h2>
            <p className="text-lg text-[#9CA3AF] font-medium max-w-xl mx-auto leading-relaxed">
              DreamSync is an autonomous node free for students. Sustain the infrastructure via sovereign contributions.
            </p>
            <div className="pt-6">
              <Link
                href="/donate"
                className="btn-primary px-12 py-5 text-sm uppercase tracking-[0.2em] shadow-2xl inline-flex items-center gap-3"
              >
                Authorize Protocol Contribution <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4B5563]">Zero Subscriptions // No Venture Capital // Community Synced</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
