'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, ChevronDown, FileText, CheckSquare, Map,
  Layout, Link2, Brain, Heart, BookOpen, Coffee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { handleGoogleSignIn } from '@/lib/auth-utils';

// ── Features dropdown items ───────────────────────────────────────
const features = [
  { label: 'Resume Builder',    href: '/resume-builder', icon: FileText,    color: 'text-blue-600',   desc: 'AI-generated resume content' },
  { label: 'ATS Check',         href: '/ats-check',    icon: CheckSquare,  color: 'text-green-600',  desc: 'Score your resume instantly' },
  { label: 'Career Roadmap',    href: '/roadmap',        icon: Map,          color: 'text-violet-600', desc: 'Personalized learning path' },
  { label: 'Portfolio Gen',     href: '/portfolio',      icon: Layout,       color: 'text-orange-600', desc: 'One-click portfolio builder' },
  { label: 'LinkedIn Optimizer',href: '/linkedin',       icon: Link2,        color: 'text-sky-600',    desc: 'Optimize your profile & score' },
  { label: 'AI Career Agent',   href: '/career-agent',   icon: Brain,        color: 'text-pink-600',   desc: 'India-focused career guidance' },
  { label: 'Mental Health',     href: '/mental-health',  icon: Heart,        color: 'text-rose-600',   desc: 'Serenity — your calm companion' },
  { label: 'Docs & Roadmaps',   href: '/documents',      icon: BookOpen,     color: 'text-amber-600',  desc: 'Skill guides + Gov documents' },
];

// ── Features Dropdown ─────────────────────────────────────────────
function FeaturesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 font-bold hover:text-primary transition-colors"
      >
        Features
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b-2 border-black bg-black">
              <p className="text-white text-xs font-black uppercase tracking-widest">All Features</p>
            </div>

            {/* Grid of features */}
            <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-black">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.href}
                    href={f.href}
                    onClick={() => setOpen(false)}
                    className={`p-3 flex items-start gap-2.5 hover:bg-gray-50 transition-colors group ${
                      // Add top border for rows after first
                      i >= 2 ? '' : ''
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${f.color}`} />
                    <div>
                      <p className="text-xs font-black leading-tight group-hover:text-primary transition-colors">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight mt-0.5">{f.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="border-t-2 border-black p-3 bg-gray-50">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white text-xs font-black uppercase tracking-wider border-2 border-black hover:bg-primary/90 transition-colors neo-box"
              >
                Open Dashboard → All Tools
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile Menu ───────────────────────────────────────────────────
function MobileMenu({ user, userData, onLogout, onGoogleSignIn }: {
  user: ReturnType<typeof useAuth>['user'];
  userData: ReturnType<typeof useAuth>['userData'];
  onLogout: () => void;
  onGoogleSignIn: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button onClick={() => setOpen(o => !o)} className="p-1">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-white border-b-4 border-black z-40 overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {/* Features list (mobile) */}
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Features</p>
              {features.map(f => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.href}
                    href={f.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm hover:bg-gray-100 rounded-sm transition-colors"
                  >
                    <Icon className={`w-4 h-4 ${f.color}`} />
                    {f.label}
                  </Link>
                );
              })}
              <div className="border-t-2 border-black pt-3 mt-2 space-y-2">
                <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-2 font-bold text-sm hover:bg-gray-100">About</Link>
                <Link href="/donate" onClick={() => setOpen(false)} className="block px-3 py-2 font-bold text-sm hover:bg-gray-100 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600" /> Donate
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 bg-black text-white font-black text-sm text-center">Dashboard</Link>
                    <button onClick={onLogout} className="w-full px-3 py-2 border-2 border-black font-bold text-sm text-center hover:bg-gray-100">Sign Out</button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { onGoogleSignIn(); setOpen(false); }} 
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-black font-bold text-sm bg-white hover:bg-gray-50 mb-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google Login
                    </button>
                    <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 border-2 border-black font-bold text-sm text-center hover:bg-gray-100">Login</Link>
                    <Link href="/signup" onClick={() => setOpen(false)} className="block px-3 py-2 bg-primary text-white font-black text-sm text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────
export default function Navbar() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const onGoogleSignIn = async () => {
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/DreamSynclogo.png" alt="DreamSync" className="h-10 object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-6 items-center font-bold">
            <FeaturesDropdown />
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/donate" className="flex items-center gap-1.5 px-3 py-1.5 bg-accent border-2 border-black font-black hover:-translate-y-0.5 transition-all neo-box text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Coffee className="w-3.5 h-3.5" /> Donate
            </Link>

             {user ? (
              <div className="flex items-center gap-4 border-l-2 border-black pl-6">
                <span className="font-bold">Hi, {userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'There'}</span>
                <Link href="/dashboard" className="px-4 py-2 border-2 border-black hover:bg-gray-100 transition-colors neo-box">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors neo-box">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onGoogleSignIn}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black font-black border-2 border-black hover:-translate-y-0.5 transition-all neo-box text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  G-Login
                </button>
                <Link href="/login" className="px-4 py-2 border-2 border-black hover:bg-gray-100 transition-colors neo-box text-sm">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-primary text-white border-2 border-black hover:bg-primary/90 transition-colors neo-box text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <MobileMenu user={user} userData={userData} onLogout={handleLogout} onGoogleSignIn={onGoogleSignIn} />
        </div>
      </div>
    </nav>
  );
}
