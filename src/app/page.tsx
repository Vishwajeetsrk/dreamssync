'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Sparkles, Coffee, Map, TrendingUp, Building2, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { t } = useLanguage();
  const { user, userData } = useAuth();

  const features = [
    { title: t('ikigai_finder'), desc: t('ikigai_desc'), icon: Brain, color: "bg-black text-white", href: "/ikigai", premium: true },
    { title: t('career_agent'), desc: t('career_desc'), icon: Briefcase, color: "bg-violet-100", href: "/career-agent" },
    { title: t('resume_builder'), desc: t('resume_desc'), icon: FileText, color: "bg-green-100", href: "/resume-builder" },
    { title: t('ats_check'), desc: t('ats_desc'), icon: CheckCircle, color: "bg-purple-100", href: "/ats-check" },
    { title: t('linkedin_optimizer'), desc: t('linkedin_desc'), icon: Briefcase, color: "bg-yellow-100", href: "/linkedin" },
    { title: t('portfolio_gen'), desc: t('portfolio_desc'), icon: Sparkles, color: "bg-pink-100", href: "/portfolio" },
    { title: t('roadmap'), desc: t('roadmap_desc'), icon: Map, color: "bg-sky-100", href: "/roadmap" },
    { title: t('doc_skill'), desc: t('doc_desc'), icon: BookOpen, color: "bg-orange-100", href: "/documents" },
    { title: t('serenity_ai'), desc: t('serenity_desc'), icon: HeartHandshake, color: "bg-rose-100", href: "/mental-health" },
  ];

  return (
    <div className="flex flex-col space-y-24 py-12 px-4 sm:px-6">
      {/* Latest Updates Ticker */}
      <div className="bg-black text-white py-3 overflow-hidden border-y-4 border-black">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap gap-16 font-black text-xs uppercase tracking-widest items-center"
        >
          <Link href="/career-agent" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><TrendingUp className="w-4 h-4 text-primary" /> New: AI Career Agent live with 2026 insights</Link>
          <Link href="/ikigai" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Briefcase className="w-4 h-4 text-sky-400" /> Premium "IKIGAI" Career Finder now active</Link>
          <Link href="/resume-builder" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Sparkles className="w-4 h-4 text-violet-400" /> AI Resume Builder: 100% Free for students</Link>
          <Link href="/mental-health" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><HeartHandshake className="w-4 h-4 text-rose-400" /> Serenity AI now supports 11 Indian Languages</Link>
          <Link href="/roadmap" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Map className="w-4 h-4 text-amber-400" /> Custom AI Career Roadmaps for 2026 roles</Link>
          
          {/* Repeating for seamless loop */}
          <Link href="/career-agent" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><TrendingUp className="w-4 h-4 text-primary" /> New: AI Career Agent live with 2026 insights</Link>
          <Link href="/ikigai" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Briefcase className="w-4 h-4 text-sky-400" /> Premium "IKIGAI" Career Finder now active</Link>
          <Link href="/resume-builder" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Sparkles className="w-4 h-4 text-violet-400" /> AI Resume Builder: 100% Free for students</Link>
          <Link href="/mental-health" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><HeartHandshake className="w-4 h-4 text-rose-400" /> Serenity AI now supports 11 Indian Languages</Link>
          <Link href="/roadmap" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Map className="w-4 h-4 text-amber-400" /> Custom AI Career Roadmaps for 2026 roles</Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative text-center space-y-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user && (
            <div className="flex flex-col items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {userData?.photoURL ? (
                <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Image src={userData.photoURL} alt="Profile" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <User className="w-10 h-10 text-black" />
                </div>
              )}
              <h2 className="text-xl font-black uppercase tracking-tighter">Welcome back, {userData?.name || 'Dreamer'}!</h2>
            </div>
          )}
          
          <span className="inline-block py-1 px-3 border-2 border-black bg-accent text-accent-foreground font-bold text-sm mb-6 neo-box">
             🔥 AI-Powered Career Growth
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {t('hero_title')}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {t('hero_desc')}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold text-lg border-4 border-black neo-box hover:-translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
            {t('get_started')} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/about" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg border-4 border-black neo-box hover:-translate-y-1 active:translate-y-1 transition-all">
            {t('how_it_works')}
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12 max-w-7xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 inline-block border-b-4 border-black pb-2">{t('everything_you_need')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Link href={feature.href} key={i} className="block h-full">
            <motion.div 
              className="bg-white border-4 border-black p-6 neo-box flex flex-col items-start gap-4 cursor-pointer h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`p-3 border-2 border-black ${feature.color} inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground font-medium">{feature.desc}</p>
            </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Support / Donation */}
      <section className="max-w-3xl mx-auto w-full">
        <motion.div
          className="bg-white border-4 border-black neo-box p-10 text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Coffee className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground)' }} />
          <h2 className="text-4xl font-black">Enjoying DreamSync?</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
            DreamSync is 100% free for students. If it helped your career journey, consider buying us a chai — every rupee keeps the servers running!
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-black text-lg border-4 border-black neo-box hover:-translate-y-1 active:translate-y-1 transition-all"
          >
            ❤️ Support Us via UPI
          </Link>
          <p className="text-sm text-muted-foreground font-medium">No subscriptions. No hidden fees. Just good vibes.</p>
        </motion.div>
      </section>
    </div>
  );
}
