'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Orbit } from 'lucide-react';
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
    { name: t('roadmap'), href: '/roadmap' },
    { name: t('career_agent'), href: '/career-agent' },
    { name: t('resume_builder'), href: '/resume-builder' },
    { name: t('ats_check'), href: '/ats-check' },
    { name: t('linkedin_optimizer'), href: '/linkedin' },
    { name: t('portfolio_gen'), href: '/portfolio' },
    { name: t('ikigai_finder'), href: '/ikigai' },
    { name: t('serenity_ai'), href: '/mental-health' },
    { name: t('doc_skill'), href: '/documents' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F1A]/60 backdrop-blur-2xl border-b border-white/5 flex items-center h-20 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 w-full flex items-center justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center py-2 group">
            <div className="relative h-10 w-44 flex items-center">
              <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left brightness-125 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all"
                priority
              />
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="relative">
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center gap-2 text-[13px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-[#22D3EE] transition-all group"
              >
                {t('features')} <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                    className="absolute top-full -left-4 w-72 glass-card mt-4 p-3 z-[60] rounded-2xl border-white/10"
                  >
                    <div className="grid gap-1">
                      {featureLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsFeaturesOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${pathname === item.href ? 'bg-[#4F46E5]/20 text-[#22D3EE] border border-[#22D3EE]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {item.name}
                          {pathname === item.href && <div className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/about" className="text-[13px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-[#22D3EE] transition-all">
              {t('about')}
            </Link>
            <Link href="/team" className="text-[13px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-[#22D3EE] transition-all">
              {t('team')}
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-3 px-6 py-2.5 bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#A78BFA] text-[11px] font-black tracking-[0.2em] uppercase rounded-xl hover:bg-[#4F46E5]/20 hover:border-[#4F46E5]/50 transition-all shadow-[0_0_15px_rgba(79,70,229,0.1)]"
          >
            <Coffee className="w-4 h-4" /> <span>{t('donate')}</span>
          </Link>

          {!user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all"
              >
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3 bg-[#4F46E5] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#5a50ef] transition-all shadow-lg shadow-[#4F46E5]/20 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {t('signup')}
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 transition-all"
              >
                Terminal
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 bg-[#0B0F1A] border border-white/10 rounded-full focus:outline-none hover:border-[#22D3EE] transition-all">
                  {userData?.avatar_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <img src={userData.avatar_url} alt="U" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#4F46E5]/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#22D3EE]" />
                    </div>
                  )}
                </button>

                {/* Identity Popover */}
                <div className="absolute right-0 mt-3 w-72 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-5 rounded-[24px]">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
                    {userData?.avatar_url ? (
                       <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform">
                         <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                       </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/20 border border-white/10 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-[#22D3EE]" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="font-black text-[13px] tracking-tight truncate uppercase text-white">{userData?.name || 'DreamSync_User'}</span>
                      <span className="text-[10px] text-gray-500 truncate lowercase font-medium tracking-widest">{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#22D3EE] hover:bg-[#4F46E5]/10 transition-all rounded-xl">
                      <ShieldCheck className="w-4 h-4" /> Personnel Hub
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl"
                    >
                      <LogOut className="w-4 h-4" /> De-authorize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 glass-card rounded-xl text-gray-400 focus:outline-none transition-all active:scale-90"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-[#22D3EE]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-[#0B0F1A]/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            <div className="space-y-8">
              {/* Profile in Mobile */}
              {user && (
                <div className="p-6 glass-card rounded-[32px] flex items-center gap-5 mb-8 shadow-neon-primary">
                  <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden relative bg-[#4F46E5]/10">
                    {userData?.avatar_url ? (
                      <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-[#22D3EE]" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl uppercase tracking-tighter text-white">{userData?.name || 'DreamSync_User'}</span>
                    <span className="text-[11px] text-gray-500 font-bold tracking-widest lowercase">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-5 glass-card rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] text-gray-400 hover:text-[#22D3EE] active:scale-[0.98] transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5 my-4" />

              <div className="mt-auto space-y-4 pt-12 pb-24">
                {user ? (
                   <>
                    <Link
                       href="/profile"
                       onClick={() => setIsMenuOpen(false)}
                       className="w-full py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3"
                    >
                      Personnel Hub <ShieldCheck className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full py-5 bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3"
                    >
                      Termiante Session <LogOut className="w-5 h-5" />
                    </button>
                   </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-white/5 border border-white/10 text-white text-center font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl"
                    >
                      Access Core
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-[#4F46E5] text-white text-center font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl shadow-lg shadow-[#4F46E5]/20"
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
    </nav>
  );
}
