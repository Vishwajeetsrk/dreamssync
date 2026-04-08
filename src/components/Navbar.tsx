'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Orbit, Zap, LayoutDashboard, Fingerprint, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

export default function Navbar() {
  const { user, userData } = useAuth();
  const { t } = useLanguage();
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const featureLinks = [
    { name: 'CAREER ROADMAP', href: '/roadmap' },
    { name: 'CAREER AGENT', href: '/career-agent' },
    { name: 'RESUME BUILDER', href: '/resume-builder' },
    { name: 'ATS CHECK', href: '/ats-check' },
    { name: 'IKIGAI FINDER', href: '/ikigai' },
    { name: 'PORTFOLIO GEN', href: '/portfolio' },
    { name: 'LINKEDIN OPTIMIZER', href: '/linkedin' },
    { name: 'SERENITY AI', href: '/mental-health' },
    { name: 'DOCS & SKILLS', href: '/documents' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black px-6 md:px-12 py-5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Branding (Historical State) */}
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-black text-white shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] group-hover:bg-[#2563EB] transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black uppercase tracking-tighter text-black">DreamSync</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#2563EB]">DREAMS COMES TOGETHER</span>
            </div>
          </Link>

          {/* Desktop Navigation (Neo Typography) */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black hover:text-[#2563EB] transition-colors"
              >
                FEATURES <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-6 w-64 neo-box p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                 <div className="grid gap-1">
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 text-xs font-black uppercase tracking-widest transition-all hover:bg-[#2563EB]/10 border-2 border-transparent hover:border-black ${pathname === item.href ? 'text-[#2563EB]' : 'text-black'}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                 </div>
              </div>
            </div>
            
            <Link href="/about" className="text-sm font-black uppercase tracking-widest text-black hover:text-[#2563EB] transition-colors">ABOUT</Link>
            <Link href="/team" className="text-sm font-black uppercase tracking-widest text-black hover:text-[#2563EB] transition-colors">TEAM</Link>
            <Link href="/contact" className="text-sm font-black uppercase tracking-widest text-black hover:text-[#2563EB] transition-colors">CONTACT</Link>
          </div>
        </div>

        {/* Action Group (Historical State) */}
        <div className="flex items-center gap-4">
          <Link 
            href="/donate" 
            className="hidden sm:flex items-center gap-2 bg-[#FACC15] border-4 border-black px-5 py-2 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Coffee className="w-4 h-4 fill-current" /> DONATE
          </Link>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-black uppercase tracking-widest text-black hover:text-[#2563EB] px-4"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white border-4 border-black px-6 py-2 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-[#2563EB] transition-all"
              >
                SIGN UP
              </Link>
            </div>
          ) : (
            <div className="relative group">
               <button className="neo-box p-1 rounded-none flex items-center gap-3 pr-4">
                  {userData?.avatar_url ? (
                    <div className="w-8 h-8 rounded-none border-2 border-black overflow-hidden relative">
                      <img src={userData.avatar_url} alt="U" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#2563EB]/10 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-black hidden md:block">{userData?.name?.split(' ')[0]}</span>
               </button>

               <div className="absolute right-0 mt-4 w-64 neo-box p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-dashed border-black/10">
                     <div className="w-10 h-10 border-2 border-black overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       <img src={userData?.avatar_url || ''} alt="P" className="w-full h-full object-cover" />
                     </div>
                      <div className="flex flex-col text-left">
                        <span className="font-black text-xs uppercase tracking-tighter text-black/40">HI,</span>
                        <span className="font-black text-sm uppercase tracking-tighter text-[#2563EB] truncate w-40">{userData?.name || 'USER_NODE'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase truncate w-40">{user.email}</span>
                      </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#2563EB] hover:text-white transition-all border-2 border-black">
                      <LayoutDashboard className="w-4 h-4" /> DASHBOARD
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#E11D48] hover:bg-black hover:text-white transition-all border-2 border-black"
                    >
                      <LogOut className="w-4 h-4" /> SIGN OUT
                    </button>
                  </div>
               </div>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border-4 border-black bg-white hover:bg-gray-100 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Neo Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-6 top-32 neo-box z-40 lg:hidden flex flex-col p-8"
          >
            <div className="space-y-4">
              {featureLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-5 border-4 border-black font-black uppercase text-sm text-black hover:bg-[#2563EB] hover:text-white flex items-center justify-between transition-all"
                >
                  {link.name} <ArrowRight className="w-5 h-5" />
                </Link>
              ))}
              <div className="pt-4 space-y-4">
                <Link
                  href="/donate"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-5 bg-[#FACC15] border-4 border-black text-black text-center font-black uppercase text-sm"
                >
                  DONATE HUB
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
