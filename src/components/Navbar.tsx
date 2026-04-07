'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, LayoutDashboard, User, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { handleGoogleSignIn } from '@/lib/auth-utils';

const featureLinks = [
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Career Agent', href: '/career-agent' },
  { name: 'Resume Builder', href: '/resume-builder' },
  { name: 'ATS Check', href: '/ats-check' },
  { name: 'LinkedIn Optimizer', href: '/linkedin' },
  { name: 'Portfolio Gen', href: '/portfolio' },
  { name: 'IKIGAI Finder', href: '/ikigai' },
  { name: 'Serenity AI', href: '/mental-health' },
  { name: 'Government Docs', href: '/documents' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
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

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      await handleGoogleSignIn();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black flex items-center h-16 sm:h-20 overflow-visible">
      <div className="max-w-[1440px] mx-auto px-6 w-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
             <div className="w-8 h-8 flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600 fill-blue-600 animate-pulse" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-400 rounded-full" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-gray-900 leading-none">DreamSync</span>
            <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase mt-0.5">Dreams comes together</span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative">
            <button 
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
              className="flex items-center gap-1.5 text-base font-black text-gray-900 hover:text-blue-600 transition-colors"
            >
              Features <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isFeaturesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseLeave={() => setIsFeaturesOpen(false)}
                  className="absolute top-full -left-4 w-64 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2 p-2 z-[60]"
                >
                  {featureLinks.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsFeaturesOpen(false)}
                      className="block px-4 py-3 text-xs font-black uppercase text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all tracking-wider"
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/about" className="text-base font-black text-gray-900 hover:text-blue-600 transition-colors">
            About
          </Link>
        </div>

        {/* Right Section (Buttons) */}
        <div className="flex items-center gap-3">
          <Link 
            href="/donate"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#fcc419] border-2 border-black text-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Coffee className="w-5 h-5 fill-black/10" /> Donate
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard"
                className="px-5 py-2.5 bg-white border-2 border-black text-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-gray-500 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login"
                className="hidden sm:block px-6 py-2.5 bg-white border-2 border-black text-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Login
              </Link>
              <button
                onClick={handleAuthAction}
                disabled={loading}
                className="px-6 py-2.5 bg-[#3b82f6] border-2 border-black text-white text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-75"
              >
                {loading ? 'Wait...' : 'Get Started'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
