'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Link2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { name: 'IKIGAI Finder', href: '/ikigai', icon: Brain, color: 'bg-black text-white', desc: 'Discover your true purpose & ideal path.' },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText, color: 'bg-green-100', desc: 'Craft a new ATS-friendly resume.' },
  { name: 'ATS Checker', href: '/ats-check', icon: CheckCircle, color: 'bg-purple-100', desc: 'Scan existing resume for score.' },
  { name: 'Portfolio Gen', href: '/portfolio', icon: Sparkles, color: 'bg-pink-100', desc: 'Auto-generate a personal site.' },
  { name: 'Career Roadmap', href: '/roadmap', icon: Briefcase, color: 'bg-amber-100', desc: 'Plan your learning timeline.' },
  { name: 'Skill Roadmaps', href: '/documents', icon: BookOpen, color: 'bg-blue-100', desc: 'Step-by-step guides & free resources.' },
  { name: 'LinkedIn Optimizer', href: '/linkedin', icon: Link2, color: 'bg-[#0A66C2]/10', desc: 'AI headlines, about & keywords.' },
  { name: 'AI Career Agent', href: '/career-agent', icon: Brain, color: 'bg-violet-100', desc: 'AI guidance, roles & real jobs.' },
  { name: 'Mental Health', href: '/mental-health', icon: HeartHandshake, color: 'bg-rose-100', desc: 'Emotional support & wellness.' },
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
      <div className="space-y-12">
        <header className="border-b-4 border-black pb-8">
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-8 w-1/4" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border-4 border-black p-6 bg-white neo-box">
              <Skeleton className="h-12 w-12 mb-4 bg-gray-200" />
              <Skeleton className="h-8 w-3/4 mb-3 bg-gray-200" />
              <Skeleton className="h-4 w-full mb-6 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userName = userData?.name?.split(' ')[0] || user.email?.split('@')[0] || "Student";

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Welcome back, {userName}! 👋</h1>
            <p className="text-xl text-muted-foreground font-medium">Ready to take the next step in your career journey?</p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-black mb-6">Your Toolkit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-4 border-black p-6 neo-box flex flex-col group"
            >
              <div className={`p-3 border-2 border-black ${tool.color} inline-block mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground font-medium mb-6 flex-1">{tool.desc}</p>
              
              <Link href={tool.href} className="flex items-center justify-between p-3 border-2 border-black font-bold group-hover:bg-black group-hover:text-white transition-colors">
                Open Tool <ArrowRight className="w-5 h-5 text-current" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
