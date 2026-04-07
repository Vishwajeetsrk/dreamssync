'use client';

import Link from 'next/link';
import { Coffee, Globe, Shield, Zap, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-8 border-black pt-32 pb-20 px-6 md:px-12 text-black font-bold uppercase relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        
        {/* Brand Historical Identity */}
        <div className="space-y-10">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform">
            <div className="relative h-10 w-44">
              <Image 
                src="/DreamSynclogo.png" 
                alt="DreamSync Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-sm font-black tracking-widest text-[#111827]/60 leading-relaxed uppercase">
            Transforming professional aspirations into reality through synthetic intelligence and sovereign career engineering.
          </p>
          <div className="flex gap-6">
             <div className="neo-box p-2 hover:bg-[#FACC15] transition-colors cursor-pointer"><Globe className="w-5 h-5" /></div>
             <div className="neo-box p-2 hover:bg-[#FACC15] transition-colors cursor-pointer"><Shield className="w-5 h-5" /></div>
             <div className="neo-box p-2 hover:bg-[#FACC15] transition-colors cursor-pointer"><Zap className="w-5 h-5" /></div>
          </div>
        </div>
        
        {/* Core Architectures */}
        <div className="space-y-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-black">ARCHITECTURE_</h4>
          <ul className="space-y-4 text-xs tracking-widest">
            <li><Link href="/resume-builder" className="hover:text-[#2563EB] transition-colors flex items-center gap-3"><ArrowRight className="w-4 h-4" /> RESUME ARCHITECT</Link></li>
            <li><Link href="/ats-check" className="hover:text-[#2563EB] transition-colors flex items-center gap-3"><ArrowRight className="w-4 h-4" /> ATS SYNC HUB</Link></li>
            <li><Link href="/roadmap" className="hover:text-[#2563EB] transition-colors flex items-center gap-3"><ArrowRight className="w-4 h-4" /> CAREER GRAPH</Link></li>
            <li><Link href="/career-agent" className="hover:text-[#2563EB] transition-colors flex items-center gap-3"><ArrowRight className="w-4 h-4" /> AI AGENT NODE</Link></li>
          </ul>
        </div>
        
        {/* Infrastructure Nodes */}
        <div className="space-y-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-black">NODES_</h4>
          <ul className="space-y-4 text-xs tracking-widest">
            <li><Link href="/about" className="hover:text-[#2563EB] transition-colors">DOCUMENTATION</Link></li>
            <li><Link href="/team" className="hover:text-[#2563EB] transition-colors">CORE ENGINEERS</Link></li>
            <li><Link href="/contact" className="hover:text-[#2563EB] transition-colors">SUPPORT CHANNEL</Link></li>
            <li>
              <Link 
                href="/donate" 
                className="inline-flex items-center gap-3 bg-[#FACC15] border-4 border-black px-4 py-2 text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all transform hover:scale-105"
              >
                <Coffee className="w-4 h-4" /> SPONSOR NODE
              </Link>
            </li>
          </ul>
        </div>

        {/* Global Access Archives */}
        <div className="space-y-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-black">ARCHIVES_</h4>
          <ul className="space-y-4 text-xs tracking-widest">
            <li><a href="https://linkedin.com" className="hover:text-[#2563EB] transition-colors underline decoration-4 decoration-black/10">LINKEDIN VAULT</a></li>
            <li><a href="https://github.com" className="hover:text-[#2563EB] transition-colors underline decoration-4 decoration-black/10">GITHUB REPOSITORIES</a></li>
            <li><a href="https://twitter.com" className="hover:text-[#2563EB] transition-colors underline decoration-4 decoration-black/10">MISSION X (TWITTER)</a></li>
            <li className="flex items-center gap-3 text-[#111827]/40 pt-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-black" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Uplink Ready</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Footer Meta Hierarchy */}
      <div className="max-w-7xl mx-auto mt-32 pt-12 border-t-8 border-black flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black tracking-[0.4em] text-black/40">
        <span>© {currentYear} DREAMSYNC. IDENTITY SYNCHRONIZED.</span>
        <div className="flex gap-12">
          <Link href="/privacy" className="hover:text-black transition-colors">PRIVACY_PROTOCOL</Link>
          <Link href="/terms" className="hover:text-black transition-colors">SERVICE_TERMS</Link>
        </div>
      </div>
    </footer>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
