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

  const userName = userData?.name?.replace(/[._-]/g, ' ').toUpperCase() || user.email?.split('@')[0].replace(/[._-]/g, ' ').toUpperCase() || "DREAMER";

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="neo-box relative overflow-hidden group bg-white hover:bg-white transition-all duration-300 flex flex-col h-full"
              >
                {/* Tool Header Bar (Restored from Image 4) */}
                <div className={`h-16 border-b-4 border-black ${tool.color} flex items-center px-6 gap-4`}>
                   <tool.icon className="w-6 h-6 stroke-[3px]" />
                   <div className="flex-grow" />
                   {tool.premium && <span className="text-[8px] font-black bg-[#FACC15] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">Sovereign</span>}
                </div>
                
                <div className="p-8 flex flex-col flex-grow space-y-4">
                   <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                      {tool.name}
                   </h3>
                   <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase">
                      {tool.desc}
                   </p>
                   
                   <div className="mt-auto pt-8">
                     <Link href={tool.href} className="flex items-center justify-between w-full px-5 py-3 bg-white border-4 border-black text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                        OPEN TOOL <ArrowRight className="w-5 h-5 text-[#2563EB]" />
                     </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
