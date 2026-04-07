'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 flex items-center h-20 overflow-visible transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-10 w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center py-2">
            <div className="relative h-12 w-48 flex items-center">
              <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left brightness-110"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div className="relative">
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-400 hover:text-white transition-colors group uppercase tracking-tight"
              >
                {t('features')} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                    className="absolute top-full -left-4 w-72 bg-[#141414] border border-white/10 shadow-2xl mt-4 p-2 z-[60]"
                  >
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsFeaturesOpen(false)}
                        className="block px-4 py-3 text-[13px] font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all rounded-lg"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/about" className="text-[15px] font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-tight">
              {t('about')}
            </Link>
            <Link href="/team" className="text-[15px] font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-tight">
              {t('team')}
            </Link>
            <Link href="/contact" className="text-[15px] font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-tight">
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#1D4D47] text-white text-[13px] font-semibold rounded-xl hover:bg-[#2d7a71] transition-all shadow-lg shadow-[#1D4D47]/10"
          >
            <Coffee className="w-5 h-5 text-gray-100" /> <span>{t('donate')}</span>
          </Link>

          {!user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-tight"
              >
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all uppercase"
              >
                {t('signup')}
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all uppercase"
              >
                {t('dashboard')}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 p-1 focus:outline-none">
                  {userData?.avatar_url ? (
                    <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden relative shadow-lg">
                      <img src={userData.avatar_url} alt={userData.name || 'User'} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1D4D47] border border-white/20 flex items-center justify-center shadow-lg">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>

                <div className="absolute right-0 mt-2 w-72 bg-[#141414] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    {userData?.avatar_url ? (
                      <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden relative">
                        <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1D4D47] border border-white/20 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="font-bold text-sm truncate uppercase text-white">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[10px] text-gray-500 truncate lowercase font-medium">{user?.email}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 mb-2" />

                  <div className="space-y-1">
                    <Link href="/profile" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg">
                      <UserIcon className="w-4 h-4" /> {t('my_account')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> {t('sign_out')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 shrink-0 lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 top-20 bg-[#0A0A0A] z-40 lg:hidden flex flex-col p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Profile Info in Menu */}
              {user && (
                <div className="p-5 bg-[#141414] border border-white/10 rounded-2xl flex items-center gap-4 mb-8 shadow-xl">
                  {userData?.avatar_url ? (
                    <div className="w-14 h-14 rounded-full border border-white/20 overflow-hidden relative">
                      <img src={userData.avatar_url} alt="P" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1D4D47] border border-white/10 flex items-center justify-center">
                      <UserIcon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-lg uppercase truncate text-white">{userData?.name || 'DreamSync User'}</span>
                    <span className="text-xs text-gray-500 font-bold truncate lowercase">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-5 bg-[#141414] border border-white/5 rounded-2xl font-bold uppercase text-sm text-gray-300 hover:bg-[#1D4D47]/20 hover:text-white transition-all active:scale-95"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-[1px] bg-white/5 my-4" />

              <div className="flex flex-col gap-4">
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-bold uppercase text-gray-500 hover:text-white transition-colors px-2"
                >
                  {t('about')}
                </Link>
                <Link
                  href="/team"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-bold uppercase text-gray-500 hover:text-white transition-colors px-2"
                >
                  {t('team')}
                </Link>
              </div>

              <div className="mt-auto space-y-4 pt-12 pb-20">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full py-5 bg-red-600/10 border border-red-500/20 text-red-500 font-bold uppercase text-sm rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    <LogOut className="w-5 h-5" /> {t('sign_out')}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-white/5 border border-white/10 text-white text-center font-bold uppercase text-sm rounded-2xl"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-5 bg-white text-black text-center font-bold uppercase text-sm rounded-2xl"
                    >
                      {t('signup')}
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
