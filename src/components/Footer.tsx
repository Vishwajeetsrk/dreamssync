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
          <h4 className="text-xs font-black tracking-[0.3em] text-black">FEATURES_</h4>
          <ul className="space-y-4 text-[10px] tracking-widest">
            <li><Link href="/resume-builder" className="hover:text-[#2563EB] transition-colors border-b-2 border-black/5">RESUME BUILDER</Link></li>
            <li><Link href="/ats-check" className="hover:text-[#2563EB] transition-colors border-b-2 border-black/5">ATS CHECK</Link></li>
            <li><Link href="/roadmap" className="hover:text-[#2563EB] transition-colors border-b-2 border-black/5">CAREER ROADMAP</Link></li>
            <li><Link href="/portfolio" className="hover:text-[#2563EB] transition-colors border-b-2 border-black/5">PORTFOLIO GEN</Link></li>
            <li><Link href="/linkedin" className="hover:text-[#2563EB] transition-colors border-b-2 border-black/5">LINKEDIN OPTIMIZER</Link></li>
          </ul>
        </div>
        
        {/* Infrastructure Nodes */}
        <div className="space-y-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-black">COMPANY_</h4>
          <ul className="space-y-4 text-[10px] tracking-widest">
            <li><Link href="/about" className="hover:text-[#2563EB] transition-colors">ABOUT US</Link></li>
            <li><Link href="/team" className="hover:text-[#2563EB] transition-colors">TEAM</Link></li>
            <li><Link href="/contact" className="hover:text-[#2563EB] transition-colors">CONTACT</Link></li>
            <li className="pt-4">
              <Link 
                href="/donate" 
                className="inline-flex items-center gap-2 bg-[#FACC15] border-2 border-black px-4 py-2 text-[10px] font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all"
              >
                <Coffee className="w-4 h-4 fill-current" /> SUPPORT US
              </Link>
            </li>
          </ul>
        </div>

        {/* Global Access Archives */}
        <div className="space-y-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-black">CONNECT_</h4>
          <ul className="space-y-4 text-[10px] tracking-widest">
            <li><a href="https://linkedin.com" className="hover:text-[#2563EB] transition-colors">LINKEDIN</a></li>
            <li><a href="https://instagram.com" className="hover:text-[#2563EB] transition-colors">INSTAGRAM</a></li>
            <li><a href="https://twitter.com" className="hover:text-[#2563EB] transition-colors">TWITTER / X</a></li>
            <li><a href="mailto:support@dreamsync.ai" className="hover:text-[#2563EB] transition-colors">EMAIL US</a></li>
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
