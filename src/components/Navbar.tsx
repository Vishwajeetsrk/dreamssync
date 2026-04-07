'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Orbit, Zap } from 'lucide-react';
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
    { name: t('roadmap'), href: '/roadmap', icon: <Zap className="w-4 h-4" /> },
    { name: t('career_agent'), href: '/career-agent', icon: <Sparkles className="w-4 h-4" /> },
    { name: t('resume_builder'), href: '/resume-builder', icon: <Orbit className="w-4 h-4" /> },
    { name: t('ats_check'), href: '/ats-check', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <nav className={`pill-nav w-full max-w-7xl flex items-center justify-between gap-4 pointer-events-auto shadow-2xl transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        
        {/* Branding */}
        <div className="flex items-center gap-10 shrink-0">
          <Link href="/" className="flex items-center group pl-2">
            <div className="relative h-8 w-36 overflow-hidden">
               <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left dark:brightness-125 group-hover:opacity-80 transition-all pointer-events-none"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="relative">
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center gap-1.5 text-[13px] font-bold tracking-tight text-white/70 hover:text-[#3B82F6] transition-all group"
              >
                {t('features')} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                    className="absolute top-full -left-4 w-64 bg-[#1E293B]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-4 p-3 z-[60] rounded-2xl"
                  >
                    <div className="grid gap-1">
                      {featureLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsFeaturesOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-[12px] font-bold tracking-tight rounded-xl transition-all ${pathname === item.href ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                        >
                          <span className={`${pathname === item.href ? 'text-[#3B82F6]' : 'text-white/30'}`}>{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/about" className="text-[13px] font-bold tracking-tight text-white/70 hover:text-[#3B82F6] transition-colors">
              {t('about')}
            </Link>
            <Link href="/team" className="text-[13px] font-bold tracking-tight text-white/70 hover:text-[#3B82F6] transition-colors">
              {t('team')}
            </Link>
          </div>
        </div>

        {/* Global CTAs & Identity */}
        <div className="flex items-center gap-3 shrink-0 pr-2">
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 text-white/60 text-[12px] font-bold rounded-full hover:bg-white/10 hover:text-white transition-all shadow-inner"
          >
            <Coffee className="w-3.5 h-3.5 text-[#e11d48]" /> <span>{t('donate')}</span>
          </Link>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2 text-[13px] font-bold text-white/70 hover:text-white transition-all"
              >
                Access
              </Link>
              <Link
                href="/signup"
                className="btn-gradient px-6 py-2 text-[13px]"
              >
                Join Core
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Identity Capsule */}
              <div className="relative group">
                <button className="flex items-center gap-2.5 p-1 bg-white/5 border border-white/10 rounded-full focus:outline-none hover:border-[#3B82F6] transition-all group backdrop-blur-md">
                   <div className="pl-3 hidden md:block">
                      <span className="text-[11px] font-black text-white/40 tracking-wider uppercase">{userData?.name?.split(' ')[0] || 'Member'}</span>
                   </div>
                  {userData?.avatar_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10">
                      <img src={userData.avatar_url} alt="U" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                  )}
                </button>

                {/* Identity Dropdown (Luxury Style) */}
                <div className="absolute right-0 mt-3 w-72 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-5">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
                    {userData?.avatar_url ? (
                       <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden relative shadow-xl">
                         <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                       </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/20 border border-white/10 flex items-center justify-center shadow-xl">
                        <UserIcon className="w-6 h-6 text-[#3B82F6]" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden text-left gap-1">
                      <span className="font-bold text-[14px] tracking-tight truncate text-white">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[11px] text-white/40 truncate font-medium">{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all rounded-xl">
                      <ShieldCheck className="w-4 h-4 text-[#3B82F6]" /> Profile Node
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-xl"
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
              className="p-2 text-white/70 hover:text-white focus:outline-none transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Luxury Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-6 top-32 bg-[#0F172A]/95 backdrop-blur-[40px] border border-white/10 z-40 lg:hidden flex flex-col p-8 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-4">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-5 bg-white/5 rounded-3xl font-bold text-[15px] tracking-tight text-white/80 flex items-center justify-between active:scale-95 transition-all"
                  >
                    {link.name} <Zap className="w-4 h-4 text-[#3B82F6]" />
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5" />

              <div className="mt-auto space-y-4 pt-4">
                {user ? (
                   <div className="grid grid-cols-1 gap-4">
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="py-5 bg-white/5 text-white text-center font-bold text-[15px] rounded-3xl"
                      >
                         Profile Node
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="py-5 bg-red-500/10 text-red-500 text-center font-bold text-[15px] rounded-3xl"
                      >
                        Sign Out
                      </button>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-white/5 text-white text-center font-bold text-[15px] rounded-3xl"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 btn-gradient text-white text-center font-bold text-[15px]"
                    >
                      Initialize Identity
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
