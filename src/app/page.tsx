'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Sparkles, Coffee, Map, TrendingUp, Building2 } from 'lucide-react';

export default function Home() {
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
          <span className="inline-block py-1 px-3 border-2 border-black bg-accent text-accent-foreground font-bold text-sm mb-6 neo-box">
            🔥 AI-Powered Career Growth
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Your Dream Career, <br/>
            <span className="text-primary underline decoration-8 underline-offset-4">Synced Perfectly.</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Guidance, resumes, ATS checks, and custom roadmaps—all powered by AI. Designed explicitly for Indian students.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold text-lg border-4 border-black neo-box hover:-translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
            Get Started For Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/about" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg border-4 border-black neo-box hover:-translate-y-1 active:translate-y-1 transition-all">
            See How It Works
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12 max-w-7xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 inline-block border-b-4 border-black pb-2">Everything You Need</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {[
            { title: "IKIGAI Finder", desc: "Discover your true purpose and ideal career path using AI-powered Ikigai analysis.", icon: Brain, color: "bg-black text-white", href: "/ikigai", premium: true },
            { title: "AI Career Agent", desc: "Detailed roadmaps, salary insights, role suggestions & real job links tailored for India.", icon: Briefcase, color: "bg-violet-100", href: "/career-agent" },
            { title: "Resume Builder", desc: "Create ATS-friendly resumes that stand out to top recruiters instantly.", icon: FileText, color: "bg-green-100", href: "/resume-builder" },
            { title: "ATS Checker", desc: "Upload your PDF and get instant ATS scoring and targeted resume feedback.", icon: CheckCircle, color: "bg-purple-100", href: "/ats-check" },
            { title: "LinkedIn Optimizer", desc: "AI-generated headlines, summaries, and post ideas to boost your profile.", icon: Briefcase, color: "bg-yellow-100", href: "/linkedin" },
            { title: "Portfolio Generator", desc: "Auto-generate a beautiful, deployed portfolio site with your details.", icon: Sparkles, color: "bg-pink-100", href: "/portfolio" },
            { title: "AI Roadmap", desc: "Generate a personalized step-by-step career path based on your exact dream role.", icon: Map, color: "bg-sky-100", href: "/roadmap" },
            { title: "Skill Roadmaps & Docs", desc: "Step-by-step skill guides, free resources, and essential government docs for India.", icon: BookOpen, color: "bg-orange-100", href: "/documents" },
            { title: "Mental Health", desc: "Talk to Serenity — your empathetic AI companion for stress, anxiety & burnout.", icon: HeartHandshake, color: "bg-rose-100", href: "/mental-health" },
          ].map((feature, i) => (
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
