'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Link2, Sparkles, LayoutDashboard, User, Zap, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { name: 'IKIGAI FINDER', href: '/ikigai', icon: Brain, color: 'bg-black text-white', desc: 'Discover your true purpose & ideal path.', premium: true },
  { name: 'RESUME BUILDER', href: '/resume-builder', icon: FileText, color: 'bg-green-100 text-green-700', desc: 'Craft a new ATS-friendly blueprint.' },
  { name: 'ATS CHECKER', href: '/ats-check', icon: CheckCircle, color: 'bg-purple-100 text-purple-700', desc: 'Scan existing resumes for optimization.' },
  { name: 'PORTFOLIO GEN', href: '/portfolio', icon: Sparkles, color: 'bg-pink-100 text-pink-700', desc: 'Auto-generate a personal site.' },
  { name: 'CAREER ROADMAP', href: '/roadmap', icon: Briefcase, color: 'bg-amber-100 text-amber-700', desc: 'Plan your learning timeline.' },
  { name: 'DOCS & SKILLS', href: '/documents', icon: BookOpen, color: 'bg-blue-100 text-blue-700', desc: 'Sovereign guides & free resources.' },
  { name: 'LINKEDIN PRO', href: '/linkedin', icon: Link2, color: 'bg-[#0A66C2]/10 text-blue-600', desc: 'AI headlines & keyword optimization.' },
  { name: 'CAREER AGENT', href: '/career-agent', icon: Brain, color: 'bg-violet-100 text-violet-700', desc: 'AI guidance & real-time jobs.' },
  { name: 'MENTAL WELLNESS', href: '/mental-health', icon: HeartHandshake, color: 'bg-rose-100 text-rose-700', desc: 'Support & emotional equilibrium.' },
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
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-12">
         <div className="neo-box bg-white p-10 flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-8 border-black border-t-[#FACC15] animate-spin shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
            <span className="font-black uppercase tracking-widest text-black">Initializing Node...</span>
         </div>
      </div>
    );
  }

  const userName = userData?.name?.split(' ')[0] || user.email?.split('@')[0] || "Dreamer";

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-40 pb-20 px-6 md:px-12 text-black selection:bg-[#FACC15]/40">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Dashboard Architecture (Audit Recap State) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b-8 border-black pb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black text-white shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.4em] text-black/40">Command Center v4.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-[#111827] uppercase">
              Welcome, <br /> <span className="text-[#2563EB] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] italic">{userName}_</span>
            </h1>
          </div>
          
          <div className="neo-box bg-[#FFFFFF] px-8 py-4 flex items-center gap-4">
             <div className="w-3 h-3 bg-green-500 animate-pulse border-2 border-black" />
             <span className="text-xs font-black uppercase tracking-widest">Global Protocol: Operational</span>
          </div>
        </div>

        {/* Intelligence Matrix Grid */}
        <section className="space-y-16">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-black uppercase tracking-[0.3em] text-black">Active User Node Toolsets</h2>
             <div className="h-2 flex-grow mx-8 bg-black/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="neo-box p-12 relative overflow-hidden group hover:bg-black hover:text-white transition-all duration-300"
              >
                <div className={`p-6 border-4 border-black ${tool.color} inline-block mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white group-hover:text-black transition-colors`}>
                  <tool.icon className="w-10 h-10" strokeWidth={3} />
                </div>
                
                <div className="space-y-4 mb-12">
                   <h3 className="text-3xl font-black uppercase tracking-tight flex items-center justify-between">
                      {tool.name}
                      {tool.premium && <span className="text-[10px] font-black bg-[#FACC15] text-black px-4 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-auto">SOVEREIGN</span>}
                   </h3>
                   <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 leading-relaxed uppercase">
                      {tool.desc}
                   </p>
                </div>
                
                <Link href={tool.href} className="flex items-center justify-between py-6 border-t-4 border-black/10 group-hover:border-white/20 text-xs font-black uppercase tracking-[0.2em] transition-all">
                  INITIALIZE ACCESS <ArrowRight className="w-6 h-6 text-[#2563EB] group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Security Footer Indicator */}
        <div className="mt-40 pt-20 border-t-8 border-black flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 grayscale">
           <p className="text-xs font-black uppercase tracking-[0.5em] text-black">DreamSync Auth ID: {user.uid.slice(0, 8)}</p>
           <div className="flex items-center gap-12">
              <ShieldCheck className="w-8 h-8" />
              <Zap className="w-8 h-8" />
              <Globe className="w-8 h-8" />
           </div>
        </div>
      </div>
    </div>
  );
}
