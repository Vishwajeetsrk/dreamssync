'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Orbit, Zap, LayoutDashboard, Fingerprint, Activity } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const featureLinks = [
    { name: 'Roadmap', href: '/roadmap', icon: <Activity className="w-4 h-4 text-[#2563EB]" /> },
    { name: 'AI Agent', href: '/career-agent', icon: <Sparkles className="w-4 h-4 text-[#7C3AED]" /> },
    { name: 'Resume', href: '/resume-builder', icon: <Fingerprint className="w-4 h-4 text-[#06B6D4]" /> },
    { name: 'ATS Scan', href: '/ats-check', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
      <nav className={`max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4 transition-all duration-500 border border-white/5 rounded-2xl mx-6 md:mx-auto ${scrolled ? 'bg-[#0B0F19]/80 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
        
        {/* Branding */}
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center group">
            <div className="relative h-8 w-36 overflow-hidden">
               <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left dark:brightness-125 group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="relative" onMouseLeave={() => setIsFeaturesOpen(false)}>
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF] hover:text-white transition-all py-2"
              >
                Features <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full -left-4 w-64 bg-[#111827] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-2 p-3 rounded-2xl backdrop-blur-3xl overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
                    <div className="grid gap-1 mt-1">
                      {featureLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsFeaturesOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname === item.href ? 'bg-white/5 text-white' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'}`}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/about" className="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors">About</Link>
            <Link href="/team" className="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors">Engineers</Link>
          </div>
        </div>

        {/* Global Action & Identity */}
        <div className="flex items-center gap-4 shrink-0">
          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-[#9CA3AF] hover:text-white transition-all px-4"
              >
                Access
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm px-6 py-2.5 h-auto rounded-full font-semibold"
              >
                Establish Node
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2563EB] hover:text-[#06B6D4] transition-colors bg-[#2563EB]/5 px-4 py-2 rounded-full border border-[#2563EB]/10">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Matrix
               </Link>

               {/* Identity Capsule */}
              <div className="relative group">
                <button className="flex items-center gap-3 p-1 bg-white/5 border border-white/10 rounded-full focus:outline-none hover:border-[#2563EB] transition-all">
                  {userData?.avatar_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-lg">
                      <img src={userData.avatar_url} alt="U" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  )}
                  <div className="pr-2 hidden md:block">
                      <span className="text-xs font-semibold text-white/50">{userData?.name?.split(' ')[0] || 'Member'}</span>
                  </div>
                </button>

                {/* Identity Dropdown */}
                <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-4 overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
                  
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="font-bold text-sm text-white truncate">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[10px] text-[#4B5563] truncate uppercase tracking-widest">{user?.email?.split('@')[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all rounded-lg">
                      <Fingerprint className="w-4 h-4 text-[#2563EB]" /> Profile Hub
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/5 transition-all rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> De-authorize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#9CA3AF] hover:text-white transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="fixed inset-x-6 top-24 bg-[#0B0F19]/90 backdrop-blur-3xl border border-white/5 z-40 lg:hidden flex flex-col p-8 rounded-3xl shadow-2xl overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-3">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-4 bg-white/5 rounded-2xl font-bold text-sm tracking-tight text-[#9CA3AF] hover:text-white flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-3">{link.icon} {link.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              <div className="space-y-4">
                {user ? (
                   <div className="grid grid-cols-1 gap-3">
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="py-4 bg-white/5 text-white text-center font-bold text-sm rounded-2xl border border-white/5"
                      >
                         Profile Hub
                      </Link>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-4 bg-white/5 text-white text-center font-bold text-sm rounded-2xl border border-white/5"
                    >
                      Login Node
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-4 btn-primary text-white text-center font-bold text-sm rounded-2xl"
                    >
                      Establish Identity
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
