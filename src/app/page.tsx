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
    { title: 'IKIGAI FINDER', desc: 'Discover your true purpose & ideal path.', icon: Brain, color: "bg-black text-white", href: "/ikigai", premium: true },
    { title: 'AI CAREER AGENT', desc: 'AI guidance, roles & real-time jobs.', icon: Briefcase, color: "bg-[#2563EB]/10 text-[#2563EB]", href: "/career-agent" },
    { title: 'RESUME BUILDER', desc: 'Craft a new ATS-friendly blueprint.', icon: FileText, color: "bg-green-100 text-green-700", href: "/resume-builder" },
    { title: 'ATS CHECKER', desc: 'Scan existing resumes for optimization.', icon: CheckCircle, color: "bg-purple-100 text-purple-700", href: "/ats-check" },
    { title: 'PORTFOLIO GEN', desc: 'Auto-generate a personal site.', icon: Sparkles, color: "bg-pink-100 text-pink-700", href: "/portfolio" },
    { title: 'ROADMAP PROTOCOL', desc: 'Plan your professional timeline.', icon: Map, color: "bg-sky-100 text-sky-700", href: "/roadmap" },
    { title: 'LINKEDIN OPTIMIZER', desc: 'AI headlines & keyword optimization.', icon: Zap, color: "bg-blue-100 text-blue-700", href: "/linkedin" },
    { title: 'SERENITY AI', desc: 'Emotional support & wellness.', icon: HeartHandshake, color: "bg-rose-100 text-rose-700", href: "/mental-health" },
    { title: 'DOCS & SKILLS', desc: 'Sovereign guides & free resources.', icon: BookOpen, color: "bg-blue-100 text-blue-700", href: "/documents" },
  ];

  return (
    <div className="flex flex-col bg-[#F3F4F6] selection:bg-[#FACC15]/40 min-h-screen">
      
      {/* 🚀 BLACK MARQUEE TICKER (Audit Recap State) */}
      <div className="marquee-neo mt-[88px]">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 font-black text-xs uppercase tracking-[0.3em] items-center"
        >
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-[#2563EB]" /> NEW: AI CAREER AGENT LIVE WITH 2026 INSIGHTS</div>
          <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-[#FACC15]" /> PREMIUM "IKIGAI" CAREER FINDER NOW ACTIVE</div>
          <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-emerald-400" /> AI RESUME BUILDER: 100% FREE FOR STUDENTS</div>
          <div className="flex items-center gap-3"><HeartHandshake className="w-5 h-5 text-rose-400" /> SERENITY AI SUPPORTS 11 INDIAN LANGUAGES</div>
          
          {/* Duplicates for smooth loop */}
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-[#2563EB]" /> NEW: AI CAREER AGENT LIVE WITH 2026 INSIGHTS</div>
          <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-[#FACC15]" /> PREMIUM "IKIGAI" CAREER FINDER NOW ACTIVE</div>
        </motion.div>
      </div>

      {/* 🔮 HERO SECTION (Audit Recap State) */}
      <section className="relative text-center space-y-12 py-32 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-10 py-3 border-4 border-black bg-white/50 backdrop-blur-md text-black font-black text-xs mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.4em]">
             ✨ AI-Powered Career Growth
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.8] text-[#111827] uppercase">
             Your Dream <br /> 
             <span className="text-[#2563EB] drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">Career, Synced</span> <br /> 
             Perfectly.
          </h1>

          <p className="mt-16 text-xl md:text-2xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed border-t-4 border-black pt-10">
             The all-in-one AI ecosystem for career growth and mental well-being in the Indian professional landscape.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/dashboard" className="neo-btn-primary w-full sm:w-auto px-16 py-6 text-xl">
             INITIALIZE HUB <ArrowRight className="w-6 h-6 ml-4 inline-block" />
          </Link>
          <Link href="/about" className="neo-btn-secondary bg-[#FFFFFF] w-full sm:w-auto px-16 py-6 text-xl">
             PLATFORM RECAP
          </Link>
        </motion.div>
      </section>

      {/* 🧪 FEATURE MATRIX */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((tool, i) => (
              <Link href={tool.href} key={i}>
                <motion.div 
                  className="neo-box p-12 h-full flex flex-col items-start gap-8 group cursor-pointer hover:bg-black hover:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                   <div className={`p-6 border-4 border-black ${tool.color} group-hover:bg-white group-hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors`}>
                      <tool.icon className="w-10 h-10" strokeWidth={3} />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">{tool.title}</h3>
                   <p className="text-gray-500 font-bold leading-relaxed group-hover:text-gray-300">{tool.desc}</p>
                   
                   <div className="mt-auto pt-6 flex items-center justify-between w-full border-t-4 border-black/10 group-hover:border-white/20">
                      <span className="text-xs font-black tracking-[0.2em]">ACCESS PROTOCOL</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                   </div>
                </motion.div>
              </Link>
            ))}
         </div>
      </section>

      {/* 💎 DONATE UNIT (Audit Recap State) */}
      <section className="px-6 pb-40">
        <motion.div
           className="max-w-4xl mx-auto neo-box p-20 bg-white text-center space-y-12"
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
           <Coffee className="w-20 h-20 mx-auto text-black" strokeWidth={3} />
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Support <span className="text-[#2563EB]">DreamSync_</span></h2>
           <p className="text-xl text-gray-500 font-bold leading-relaxed max-w-xl mx-auto uppercase">
              DreamSync is 100% free for students. Every contribution keeps the sovereign AI nodes running.
           </p>
           <Link href="/donate" className="neo-btn-secondary inline-block px-16 py-6 text-xl">
              BUY US A CHAI
           </Link>
        </motion.div>
      </section>
    </div>
  );
}
