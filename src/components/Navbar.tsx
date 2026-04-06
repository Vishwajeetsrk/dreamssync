'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { handleGoogleSignIn } from '@/lib/auth-utils';

const navLinks = [
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Career Agent', href: '/career-agent' },
  { name: 'Resume Builder', href: '/resume-builder' },
  { name: 'ATS Check', href: '/ats-check' },
  { name: 'More', href: '#', 
    dropdown: [
      { name: 'LinkedIn Optimizer', href: '/linkedin' },
      { name: 'Portfolio Gen', href: '/portfolio' },
      { name: 'IKIGAI Finder', href: '/ikigai' },
      { name: 'Serenity AI', href: '/mental-health' },
      { name: 'Government Docs', href: '/documents' },
    ] 
  },
];

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDirectGoogleLogin = async () => {
    setLoading(true);
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Direct Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b-[6px] border-black h-16 sm:h-20 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary border-4 border-black flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-black">DreamSync.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              {link.dropdown ? (
                <button 
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  className="px-4 py-2 text-sm font-black text-gray-700 hover:text-primary flex items-center gap-1 transition-colors uppercase tracking-tight"
                >
                  {link.name} <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <Link 
                  href={link.href}
                  className={`px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight ${
                    pathname === link.href ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              )}

              {/* Dropdown Menu */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 w-64 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 mt-2"
                    >
                      {link.dropdown.map((item) => (
                        <Link 
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 text-xs font-black uppercase text-gray-700 hover:bg-primary/5 hover:text-primary transition-all tracking-widest"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/donate" 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-300 border-2 border-black text-black text-[10px] uppercase font-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            Support DreamSync
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-black uppercase border-2 border-black hover:shadow-[4px_4px_0_0_var(--primary)] transition-all shadow-md tracking-widest"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Direct One-Tap Google Login */}
              <button
                onClick={handleDirectGoogleLogin}
                disabled={loading}
                className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white text-black text-[10px] font-black uppercase border-2 border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 tracking-tighter"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? 'Syncing...' : 'Quick Sync'}
              </button>

              <Link 
                href="/login"
                className="hidden sm:block text-[10px] font-black uppercase text-gray-500 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                className="px-5 py-2 bg-primary text-black text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Start Journey
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white border-l-8 border-black shadow-2xl md:hidden flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-2xl font-black text-black uppercase tracking-tighter">Menu.</span>
                <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <div className="mb-4">
                        <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">{link.name}</span>
                        <div className="grid grid-cols-1 gap-2">
                          {link.dropdown.map((item) => (
                            <Link 
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-3 text-sm font-black uppercase text-gray-600 bg-gray-50 border-2 border-black/5 hover:border-black transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link 
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-lg font-black uppercase text-black hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {!user && (
                <div className="mt-12 flex flex-col gap-4 border-t-4 border-black pt-8">
                  <button
                    onClick={handleDirectGoogleLogin}
                    className="w-full py-4 text-center text-sm font-black uppercase bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Sync
                  </button>
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-sm font-black uppercase text-black bg-gray-100 border-4 border-black"
                  >
                    Legacy Sign In
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-sm font-black uppercase text-black bg-primary border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Join DreamSync
                  </Link>
                </div>
              )}
              
              <div className="mt-auto pt-10 flex items-center justify-center gap-2 text-[8px] font-black uppercase text-gray-400">
                <ShieldCheck className="w-3 h-3" /> Secure 256-bit Syncing Active
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
