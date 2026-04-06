'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-medium">
          <div className="space-y-4">
            <img src="/DreamSynclogo.png" alt="DreamSync" className="h-10 object-contain" />
            <p className="text-muted-foreground">
              AI-powered career guidance for Indian students. Find your path, build your resume, and grow your career.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 border-b-2 border-black inline-block">Features</h4>
            <ul className="space-y-2">
              <li><Link href="/resume-builder" className="hover:underline hover:text-primary">Resume Builder</Link></li>
              <li><Link href="/ats-check" className="hover:underline hover:text-primary">ATS Check</Link></li>
              <li><Link href="/roadmap" className="hover:underline hover:text-primary">Career Roadmap</Link></li>
              <li><Link href="/portfolio" className="hover:underline hover:text-primary">Portfolio Gen</Link></li>
              <li><Link href="/linkedin" className="hover:underline hover:text-primary">LinkedIn Optimizer</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 border-b-2 border-black inline-block">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline hover:text-primary">About Us</Link></li>
              <li><Link href="/team" className="hover:underline hover:text-primary">Team</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-primary">Contact</Link></li>
              <li>
                <Link href="/donate" className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent border-2 border-black font-black text-xs hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Coffee className="w-3.5 h-3.5" /> Support Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 border-b-2 border-black inline-block">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/in/dreamsync-a-care-experienced-community-41601a2a0/" className="hover:underline hover:text-primary">LinkedIn</a></li>
              <li><a href="https://instagram.com/dream_sync_hub" className="hover:underline hover:text-primary">Instagram</a></li>
              <li><a href="https://twitter.com/ADreamsync" className="hover:underline hover:text-primary">Twitter / X</a></li>
              <li><a href="mailto:dreamsyncbangalore@gmail.com" className="hover:underline hover:text-primary">Email Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-black mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-bold">
          <p>© {new Date().getFullYear()} DreamSync. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0 items-center">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
