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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black flex items-center h-20 overflow-visible">
      <div className="max-w-[1440px] mx-auto px-10 w-full flex items-center justify-between gap-4">

        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center py-2">
            <div className="relative h-12 w-48 flex items-center">
              <Image
                src="/DreamSynclogo.png"
                alt="DreamSync Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10 mt-1">
            <div className="relative">
              <button
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center gap-1.5 text-lg font-black text-gray-900 hover:text-blue-600 transition-colors group uppercase tracking-tight"
              >
                {t('features')} <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                    className="absolute top-full -left-4 w-72 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-4 p-2 z-[60]"
                  >
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsFeaturesOpen(false)}
                        className="block px-4 py-3 text-[13px] font-black uppercase text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-all border-b-2 border-transparent hover:border-black last:border-none"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/about" className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-tight">
              {t('about')}
            </Link>
            <Link href="/team" className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-tight">
              {t('team')}
            </Link>
            <Link href="/contact" className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-tight">
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#fcc419] border-2 border-black text-black text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
          >
            <Coffee className="w-5 h-5" /> <span>{t('donate')}</span>
          </Link>

          {!user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-black text-black hover:text-blue-600 transition-colors uppercase tracking-tight"
              >
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-black text-white border-2 border-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
              >
                {t('signup')}
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-white border-2 border-black text-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
              >
                {t('dashboard')}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 p-1 focus:outline-none">
                  {userData?.avatar_url ? (
                    <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden relative shadow-[2px_2px_0px_1px_rgba(0,0,0,1)]">
                      <Image src={userData.avatar_url} alt={userData.name || 'User'} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_1px_rgba(0,0,0,1)]">
                      <UserIcon className="w-5 h-5 text-black" />
                    </div>
                  )}
                </button>

                <div className="absolute right-0 mt-2 w-72 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="p-4 border-b-2 border-black flex items-center gap-3 bg-gray-50">
                    {userData?.avatar_url ? (
                      <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden relative">
                        <Image src={userData.avatar_url} alt="P" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-200 border-2 border-black flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-black text-sm truncate uppercase">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[10px] text-gray-500 truncate lowercase font-bold tracking-tight">{user?.email}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2.5 text-sm font-black uppercase text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> {t('my_account')}
                    </Link>
                    <div className="h-[2px] bg-black mx-2 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-black uppercase text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
              className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-1px] translate-y-[-1px] transition-all"
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
            className="fixed inset-0 top-20 bg-white z-40 lg:hidden flex flex-col p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Profile Info in Menu */}
              {user && (
                <div className="p-4 bg-gray-50 border-4 border-black flex items-center gap-4 mb-8">
                  {userData?.avatar_url ? (
                    <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden relative">
                      <Image src={userData.avatar_url} alt="P" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center">
                      <UserIcon className="w-7 h-7 text-black" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-black text-lg uppercase truncate">{userData?.name || 'DreamSync User'}</span>
                    <span className="text-xs text-gray-500 font-bold truncate lowercase">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-4 border-4 border-black font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-[4px] bg-black my-4" />

              <div className="flex flex-col gap-4">
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-black uppercase text-gray-500 hover:text-black transition-colors"
                >
                  {t('about')}
                </Link>
                <Link
                  href="/team"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-black uppercase text-gray-500 hover:text-black transition-colors"
                >
                  {t('team')}
                </Link>
              </div>

              <div className="mt-auto space-y-4 pt-12 pb-20">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full py-4 bg-red-600 text-white font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
                  >
                    <LogOut className="w-6 h-6" /> {t('sign_out')}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-4 bg-white border-4 border-black text-center font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-4 bg-black text-white border-4 border-black text-center font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
