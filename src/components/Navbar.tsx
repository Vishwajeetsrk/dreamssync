'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, LayoutDashboard, Zap } from 'lucide-react';
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
    { name: t('roadmap'), href: '/roadmap', icon: <Zap className="w-4 h-4" /> },
    { name: t('career_agent'), href: '/career-agent', icon: <Sparkles className="w-4 h-4" /> },
    { name: t('resume_builder'), href: '/resume-builder', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: t('ats_check'), href: '/ats-check', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: t('linkedin_optimizer'), href: '/linkedin', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <nav className="nav-blur h-20 transition-all duration-500 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 w-full h-full flex items-center justify-between gap-8">
        
        {/* Branding */}
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center py-2 group">
            <div className="relative h-9 w-40 flex items-center">
              <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left dark:brightness-110 group-hover:opacity-80 transition-opacity"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="relative">
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className={`flex items-center gap-1.5 text-[14px] font-bold tracking-tight transition-colors group ${isFeaturesOpen ? 'text-[#2563EB]' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                {t('features')} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                    className="absolute top-full -left-12 w-[480px] bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/10 shadow-2xl mt-4 p-4 z-[60] rounded-[24px] grid grid-cols-2 gap-2"
                  >
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsFeaturesOpen(false)}
                        className={`group flex items-start gap-4 p-4 rounded-[16px] transition-all ${pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20 text-[#2563EB]' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        <div className={`p-2.5 rounded-xl border transition-colors ${pathname === item.href ? 'bg-white dark:bg-[#1E293B] border-blue-200 dark:border-blue-500/30 text-[#2563EB]' : 'bg-gray-100 dark:bg-white/5 border-transparent text-[#64748B] group-hover:text-[#2563EB]'}`}>
                          {item.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-[13.5px] font-bold tracking-tight ${pathname === item.href ? 'text-[#2563EB]' : 'text-[#0F172A] dark:text-white'}`}>{item.name}</span>
                          <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-normal">AI-powered analytics and deep career insights.</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/about" className={`text-[14px] font-bold tracking-tight transition-colors ${pathname === '/about' ? 'text-[#2563EB]' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'}`}>
              {t('about')}
            </Link>
            <Link href="/team" className={`text-[14px] font-bold tracking-tight transition-colors ${pathname === '/team' ? 'text-[#2563EB]' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'}`}>
              {t('team')}
            </Link>
          </div>
        </div>

        {/* Actions Context High-Fidelity */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-2.5 px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 text-[#0F172A] dark:text-white text-[13px] font-bold tracking-tight rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <Coffee className="w-4 h-4 text-[#2563EB]" /> <span>{t('donate')}</span>
          </Link>

          {!user ? (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-[13px] font-bold tracking-tight text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white transition-all"
              >
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-bold tracking-tight rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
              >
                {t('signup')}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile Context */}
              <div className="relative group">
                <button className="flex items-center gap-2.5 p-1.5 pl-4 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/10 rounded-full focus:outline-none hover:shadow-lg transition-all group">
                  <span className="hidden md:block text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#2563EB]">{userData?.name?.split(' ')[0] || 'User'}</span>
                  {userData?.avatar_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-gray-100 dark:border-white/10 shadow-sm">
                      <img src={userData.avatar_url} alt="U" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-sm">
                      <UserIcon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  )}
                </button>

                {/* Identity Popover (Fintech Standard) */}
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-6 rounded-[24px]">
                  <div className="flex items-center gap-4 mb-6">
                    {userData?.avatar_url ? (
                       <div className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative shadow-md">
                         <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                       </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-md">
                        <UserIcon className="w-6 h-6 text-[#2563EB]" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden text-left gap-0.5">
                      <span className="font-bold text-[15px] tracking-tight truncate text-[#0F172A] dark:text-white leading-tight">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate font-medium leading-tight">{user?.email}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-50 dark:bg-white/5 mb-4" />

                  <div className="space-y-1">
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-[#64748B] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all rounded-xl">
                      <ShieldCheck className="w-4 h-4" /> Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl"
                    >
                      <LogOut className="w-4 h-4" /> Terminate Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Trigger Context */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-[#0F172A] dark:text-white focus:outline-none transition-all active:scale-[0.9]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* High-Fidelity Mobile Context Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-white dark:bg-[#0F172A] z-40 lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            <div className="space-y-10">
              {/* Profile in Mobile Stack */}
              {user && (
                <div className="p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px] flex items-center gap-5 mb-4 shadow-sm">
                  <div className="w-16 h-16 rounded-[18px] border border-gray-100 dark:border-white/10 overflow-hidden relative shadow-md">
                    {userData?.avatar_url ? (
                      <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/40">
                        <UserIcon className="w-8 h-8 text-[#2563EB]" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xl tracking-tight text-[#0F172A] dark:text-white">{userData?.name || 'DreamSync User'}</span>
                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-tight">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-5 border rounded-[20px] font-bold text-[14px] tracking-tight transition-all active:scale-[0.98] ${pathname === link.href ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-500/20 text-[#2563EB]' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-[#0F172A] dark:text-white'}`}
                  >
                    <div className={`p-2 rounded-lg ${pathname === link.href ? 'bg-white dark:bg-[#1E293B] text-[#2563EB]' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>{link.icon}</div>
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-4 pt-12 pb-24 border-t border-gray-100 dark:border-white/5 mt-auto">
                {user ? (
                   <>
                    <Link
                       href="/profile"
                       onClick={() => setIsMenuOpen(false)}
                       className="w-full py-5 bg-[#F8FAFC] dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[#0F172A] dark:text-white font-bold text-[14px] rounded-[20px] flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#2563EB]" /> Account Settings
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full py-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 text-red-500 font-bold text-[14px] rounded-[20px] flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                   </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-[#F8FAFC] dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[#0F172A] dark:text-white text-center font-bold text-[14px] rounded-[20px]"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-[#2563EB] text-white text-center font-bold text-[14px] rounded-[20px] shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    >
                      Create Account
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
