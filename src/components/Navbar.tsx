'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navLinks = [
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Career Agent', href: '/career-agent' },
  { name: 'Resume', href: '/resume-builder' },
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
  const { user, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-gray-100 h-16 sm:h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
             <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">DreamSync.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              {link.dropdown ? (
                <button 
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                  {link.name} <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <Link 
                  href={link.href}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${
                    pathname === link.href ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
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
                      className="absolute top-full left-0 w-64 bg-white border-2 border-gray-100 shadow-xl p-2 rounded-xl mt-1"
                    >
                      {link.dropdown.map((item) => (
                        <Link 
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all"
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
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-black rounded-lg hover:bg-amber-200 transition-colors"
          >
            ☕ Support
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-black rounded-lg hover:bg-indigo-700 transition-all shadow-md"
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
            <div className="flex items-center gap-2">
              <Link 
                href="/login"
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-extrabold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                Get Started
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl md:hidden flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-black text-gray-900">Menu.</span>
                <button onClick={() => setIsOpen(false)} className="p-2"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex flex-col gap-4">
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
                              className="px-4 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl"
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
                        className="block px-4 py-4 text-mg font-black text-gray-900 hover:text-indigo-600 border-b border-gray-100"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {!user && (
                <div className="mt-10 flex flex-col gap-3">
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-sm font-black text-gray-900 bg-gray-100 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-sm font-black text-white bg-indigo-600 rounded-xl shadow-lg"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
