'use client';

import Link from 'next/link';
import { Coffee, Globe, Shield, Zap, Sparkles, Fingerprint } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] border-t border-white/5 pt-24 pb-12 px-6 md:px-10 overflow-hidden relative">
      {/* Background Subtle Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-[#2563EB]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <div className="relative h-8 w-36 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image 
                  src="/DreamSynclogo.png" 
                  alt="DreamSync" 
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm font-medium text-[#9CA3AF] leading-relaxed max-w-xs">
              Engineering the future of professional identity for the next generation of Indian talent. AI-driven, sovereign-focused.
            </p>
            <div className="flex items-center gap-4 text-[#4B5563]">
               <Globe className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
               <Shield className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
               <Zap className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          
          {/* Engineering Verticals */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Technological Stack_</h4>
            <ul className="space-y-4">
              <li><Link href="/resume-builder" className="text-sm font-medium text-[#4B5563] hover:text-[#2563EB] transition-all flex items-center gap-2 underline decoration-transparent hover:decoration-[#2563EB]/30 decoration-2 underline-offset-4">Resume Architect</Link></li>
              <li><Link href="/ats-check" className="text-sm font-medium text-[#4B5563] hover:text-[#2563EB] transition-all flex items-center gap-2 underline decoration-transparent hover:decoration-[#2563EB]/30 decoration-2 underline-offset-4">ATS Sync Protocol</Link></li>
              <li><Link href="/roadmap" className="text-sm font-medium text-[#4B5563] hover:text-[#2563EB] transition-all flex items-center gap-2 underline decoration-transparent hover:decoration-[#2563EB]/30 decoration-2 underline-offset-4">Career Graph Engine</Link></li>
              <li><Link href="/career-agent" className="text-sm font-medium text-[#4B5563] hover:text-[#2563EB] transition-all flex items-center gap-2 underline decoration-transparent hover:decoration-[#2563EB]/30 decoration-2 underline-offset-4">AI Cognition Agent</Link></li>
            </ul>
          </div>
          
          {/* Community Protocols */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Infrastructure_</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">Documentation</Link></li>
              <li><Link href="/team" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">Core Engineers</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">Support Comms</Link></li>
              <li>
                <Link 
                  href="/donate" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#F59E0B] hover:text-[#FBBF24] transition-all group"
                >
                  <Coffee className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sponsor the Node
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Terminal Access_</h4>
            <ul className="space-y-4">
              <li><a href="https://linkedin.com" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">LinkedIn Archive</a></li>
              <li><a href="https://github.com" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">Git Repositories</a></li>
              <li><a href="https://twitter.com" className="text-sm font-medium text-[#4B5563] hover:text-white transition-all">Carrier X Dev</a></li>
              <li className="flex items-center gap-2 pt-2 grayscale opacity-50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Global Node Active</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5563]">
          <div className="flex items-center gap-3">
             <Fingerprint className="w-4 h-4 text-[#2563EB]" />
             <span>© {currentYear} DreamSync. Intelligence Systems Synchronized.</span>
          </div>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Service Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
