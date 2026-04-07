'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { handleGoogleSignIn } from '@/lib/auth-utils';
import Image from 'next/image';

const featureLinks = [
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Career Agent', href: '/career-agent' },
  { name: 'Resume Builder', href: '/resume-builder' },
  { name: 'ATS Check', href: '/ats-check' },
  { name: 'LinkedIn Optimizer', href: '/linkedin' },
  { name: 'Portfolio Gen', href: '/portfolio' },
  { name: 'IKIGAI Finder', href: '/ikigai' },
  { name: 'Serenity AI', href: '/mental-health' },
  { name: 'Doc & Skill', href: '/documents' },
];

export default function Navbar() {
  const { user, userData } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black flex items-center h-20 overflow-visible">
      <div className="max-w-[1440px] mx-auto px-10 w-full flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-12 shrink-0">
          {/* Official Logo PNG */}
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
                Features <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
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
                        key={item.name}
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
              About
            </Link>
            <Link href="/team" className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-tight">
              Team
            </Link>
            <Link href="/contact" className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-tight">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link 
            href="/donate"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#fcc419] border-2 border-black text-black text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
          >
            <Coffee className="w-5 h-5" /> <span>Donate</span>
          </Link>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/login"
                className="px-6 py-2.5 text-sm font-black text-black hover:text-blue-600 transition-colors uppercase tracking-tight"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="px-6 py-2.5 bg-black text-white border-2 border-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="px-6 py-2.5 bg-white border-2 border-black text-black text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all outline-none uppercase"
              >
                Dashboard
              </Link>
              
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 focus:outline-none">
                  {userData?.photoURL ? (
                    <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden relative shadow-[2px_2px_0px_1px_rgba(0,0,0,1)]">
                      <Image src={userData.photoURL} alt={userData.name || 'User'} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_1px_rgba(0,0,0,1)]">
                      <UserIcon className="w-5 h-5 text-black" />
                    </div>
                  )}
                </button>

                {/* Refined Dropdown matching requested design */}
                <div className="absolute right-0 mt-2 w-72 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="p-4 border-b-2 border-black flex items-center gap-3 bg-gray-50">
                    {userData?.photoURL ? (
                      <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden relative">
                        <Image src={userData.photoURL} alt="P" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-200 border-2 border-black flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-black text-sm truncate uppercase">{userData?.name || 'DreamSync User'}</span>
                      <span className="text-[10px] text-gray-500 truncate lowercase font-bold tracking-tight">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2.5 text-sm font-black uppercase text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> My Account
                    </Link>
                    <div className="h-[2px] bg-black mx-2 my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-black uppercase text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
