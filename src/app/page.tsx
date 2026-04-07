'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Sparkles, Coffee, Map, TrendingUp, Building2, User, Globe, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { t } = useLanguage();
  const { user, userData } = useAuth();

  const features = [
    { title: t('ikigai_finder'), desc: t('ikigai_desc'), icon: Brain, gradient: "from-[#3B82F6] to-[#e11d48]", href: "/ikigai", premium: true },
    { title: t('career_agent'), desc: t('career_desc'), icon: Briefcase, gradient: "from-blue-600 to-cyan-500", href: "/career-agent" },
    { title: t('resume_builder'), desc: t('resume_desc'), icon: FileText, gradient: "from-purple-600 to-pink-500", href: "/resume-builder" },
    { title: t('ats_check'), desc: t('ats_desc'), icon: CheckCircle, gradient: "from-emerald-600 to-teal-500", href: "/ats-check" },
    { title: t('linkedin_optimizer'), desc: t('linkedin_desc'), icon: Briefcase, gradient: "from-orange-600 to-amber-500", href: "/linkedin" },
    { title: t('portfolio_gen'), desc: t('portfolio_desc'), icon: Sparkles, gradient: "from-rose-600 to-red-500", href: "/portfolio" },
    { title: t('roadmap'), desc: t('roadmap_desc'), icon: Map, gradient: "from-sky-600 to-blue-500", href: "/roadmap" },
    { title: t('serenity_ai'), desc: t('serenity_desc'), icon: HeartHandshake, gradient: "from-indigo-600 to-violet-500", href: "/mental-health" },
  ];

  return (
    <div className="flex flex-col space-y-32 py-12 px-4 sm:px-6 bg-[#0F172A] relative overflow-hidden selection:bg-[#3B82F6]/50">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#3B82F6] rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#e11d48] rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* 🚀 LATEST PROTOCOL TICKER */}
      <div className="fixed top-[4.5rem] left-0 w-full bg-black/40 backdrop-blur-md border-y border-white/5 z-40 py-2.5 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 items-center"
        >
          <div className="flex items-center gap-3"><Zap className="w-3.5 h-3.5 text-[#3B82F6]" /> Protocol Updated: Next.js 16 + React 19 Architecture</div>
          <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-[#e11d48]" /> Node Synced: 11 Indian Languages Live in Serenity</div>
          <div className="flex items-center gap-3"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Security: Sovereign Identity Encryption Active</div>
          <div className="flex items-center gap-3 text-white/60 font-bold"><Sparkles className="w-3.5 h-3.5 text-yellow-500" /> New: AI Resume Architect v4 Deployed</div>
          
          {/* Loop duplicates */}
          <div className="flex items-center gap-3"><Zap className="w-3.5 h-3.5 text-[#3B82F6]" /> Protocol Updated: Next.js 16 + React 19 Architecture</div>
          <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-[#e11d48]" /> Node Synced: 11 Indian Languages Live in Serenity</div>
        </motion.div>
      </div>

      {/* 🔮 HERO SECTION: HIGH-FIDELITY ARCHITECTURE */}
      <section className="relative pt-32 text-center space-y-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/50 leading-none">Intelligence. Sovereignty. Growth.</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] text-white">
             {t('hero_title').split(' ').map((word, i) => (
                <span key={i} className={i > 1 ? "text-gradient-hero italic" : "block md:inline"}>{word} </span>
             ))}
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/40 font-medium leading-relaxed px-4">
             {t('hero_desc')}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 btn-gradient text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_-20px_rgba(59,130,246,0.5)] active:scale-95 group">
             Initialize Entry <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-full backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95">
             Explore Node Specs
          </Link>
        </motion.div>

        {/* Identity Indicator */}
        {user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-12 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]"
          >
             Sovereign Identity Detected: <span className="text-[#3B82F6]">{userData?.name || user.email?.split('@')[0]}</span>
          </motion.div>
        )}
      </section>

      {/* 🧬 CORE INFRASTRUCTURE MATRIX */}
      <section className="space-y-20 max-w-7xl mx-auto w-full px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-12">
           <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">Platform <br /> <span className="text-white/20">Protocols_</span></h2>
           </div>
           <p className="max-w-xs text-white/30 text-xs font-bold leading-relaxed uppercase tracking-widest">A multi-model AI ecosystem engineered for full-stack professional optimization and sovereign growth.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <Link href={feature.href} key={i}>
              <motion.div 
                className="glass-card p-8 group h-full relative overflow-hidden flex flex-col items-start gap-8 hover:border-[#3B82F6]/30 hover:bg-white/10 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-3 relative z-10 flex-grow">
                   <h3 className="text-xl font-black uppercase text-white flex items-center justify-between group-hover:text-[#3B82F6] transition-colors">{feature.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /></h3>
                   <p className="text-xs font-medium text-white/40 leading-relaxed uppercase tracking-wide group-hover:text-white/60 transition-colors">{feature.desc}</p>
                </div>

                {feature.premium && (
                   <div className="absolute top-6 right-6 px-3 py-1 bg-[#3B82F6] text-[9px] font-black text-white rounded-full uppercase tracking-widest">Sovereign</div>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💎 SUSTAINABILITY UNIT */}
      <section className="max-w-4xl mx-auto w-full pt-20">
        <motion.div
          className="glass-card p-12 md:p-20 text-center space-y-10 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Subtle Decorative Orb */}
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#e11d48]/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex p-5 bg-white/5 rounded-3xl border border-white/10 shadow-2xl mx-auto">
               <Coffee className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">Sovereign <br /> <span className="text-[#e11d48]">Support_</span></h2>
            <p className="text-lg text-white/40 font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-wide text-xs">
               DreamSync infrastructure is 100% autonomous and free for students. Sustain the mission via sovereign contributions.
            </p>
            <div className="pt-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-4 px-12 py-5 btn-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 group"
              >
                Authorize Protocol Support <Zap className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]"> Zero Subscriptions // Peer-to-Peer Stability </p>
          </div>
        </motion.div>
      </section>

      {/* 🛸 CORE METRICS FOOTER */}
      <div className="text-center pt-20 pb-12">
         <p className="text-[11px] font-black text-white/10 uppercase tracking-[1em] mb-4">DreamSync AI Sovereignty // Node: 2026.01</p>
         <div className="flex justify-center gap-8 opacity-20">
            <Building2 className="w-5 h-5 text-white" />
            <Globe className="w-5 h-5 text-white" />
            <Zap className="w-5 h-5 text-white" />
         </div>
      </div>
    </div>
  );
}
