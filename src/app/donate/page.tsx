'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, Shield, Star, Copy, Check, Coffee, Pizza, PartyPopper, Rocket, HeartHandshake, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const upiId = 'vishwajeetsrk-1@okhdfcbank';

const amounts = [
  { icon: Coffee, label: 'Buy a Chai', amount: '₹20', desc: 'A small token of love' },
  { icon: Pizza, label: 'Buy a Snack', amount: '₹50', desc: 'Fuel for the devs' },
  { icon: PartyPopper, label: 'Big Support', amount: '₹100', desc: "You're amazing!" },
  { icon: Rocket, label: 'Legend Tier', amount: '₹250', desc: 'Hall of fame material' },
];

const whyItems = [
  { title: 'AI API Costs', desc: 'Every resume, ATS scan, and portfolio uses real AI credits. Your donation keeps it free for everyone.', icon: Zap, color: 'bg-yellow-100' },
  { title: 'Server Hosting', desc: 'Vercel, Supabase, Upstash — reliable infrastructure costs money. Thanks for helping!', icon: Shield, color: 'bg-blue-100' },
  { title: 'New Features', desc: 'Mock Interviews, GitHub analyzer, Job auto-apply — all in the roadmap. With your support we build faster.', icon: Star, color: 'bg-green-100' },
];

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-8">

      {/* Hero — matches About page */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          Support <span className="text-primary underline decoration-8 underline-offset-4">DreamSync</span>
        </h1>
        <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
          DreamSync is 100% free for students. If it helped your career journey, consider buying us a chai — every rupee keeps the servers running!
        </p>
      </section>

      {/* Mission Banner — matches About mission block */}
      <section className="bg-accent border-4 border-black p-8 md:p-12 neo-box transform rotate-1">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 p-6 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Heart className="w-16 h-16" style={{ color: 'var(--foreground)' }} />
          </div>
          <div>
            <h2 className="text-4xl font-black mb-4">Why We Need You</h2>
            <p className="text-xl font-medium leading-relaxed">
              We don't charge subscriptions. We don't have investors. DreamSync runs on passion and community support.
              Every donation — big or small — directly funds the AI that powers your career growth.
            </p>
          </div>
        </div>
      </section>

      {/* QR + UPI — main donation card */}
      <section className="bg-white border-4 border-black neo-box overflow-hidden">
        <div className="bg-primary text-white p-6 text-center">
          <h2 className="text-3xl font-black">Pay via UPI</h2>
          <p className="text-primary-foreground/80 font-medium mt-1">Works with GPay · PhonePe · Paytm · BHIM</p>
        </div>

        <div className="p-8 flex flex-col md:flex-row items-center gap-10">
          {/* QR Code */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="w-52 h-52 border-4 border-black bg-white flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2">
              <img
                src="/qr-code.jpeg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=DreamSync&cu=INR`)}`;
                }}
                alt={`UPI QR Code — ${upiId}`}
                className="w-full h-full object-contain"
                width={220}
                height={220}
              />
            </div>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 justify-center"><Lock className="w-3 h-3" /> Scan to pay instantly</p>
          </div>

          {/* UPI Details */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Or pay via UPI ID</p>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <code className="text-xl font-black bg-gray-100 border-4 border-black px-4 py-3 block">
                  {upiId}
                </code>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-3 border-4 border-black font-black text-sm transition-all neo-box ${copied ? 'bg-green-400 text-black' : 'bg-white hover:bg-accent'}`}
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy ID</>}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-black text-lg">How to pay in 3 steps:</p>
              <ol className="space-y-2">
                {[
                  'Open GPay / PhonePe / Paytm or any UPI app', 
                  'Scan the QR or search the UPI ID', 
                  <span key="step3" className="flex items-center gap-1">Enter any amount and hit Pay <Sparkles className="w-4 h-4 text-yellow-500" /></span>
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-base font-medium">
                    <span className="w-7 h-7 bg-white text-black font-black text-sm flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Amounts — matches About core values grid */}
      <section className="space-y-8">
        <h2 className="text-4xl font-black text-center border-b-4 border-black pb-4 inline-block mx-auto flex justify-center">
          Suggested Amounts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {amounts.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-4 border-black p-8 text-center neo-box relative w-full transition-all group hover:bg-[#FACC15]/10"
              onClick={() => handleCopy()}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FACC15]">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black mt-6">{item.amount}</div>
              <p className="font-black text-[#2563EB] mt-1 uppercase tracking-tighter">{item.label}</p>
              <p className="text-black/40 font-black text-[10px] mt-1 uppercase tracking-widest">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Why Donate — matches About core values */}
      <section className="space-y-8">
        <h2 className="text-4xl font-black text-center border-b-4 border-black pb-4 inline-block mx-auto flex justify-center">
          Where Your Money Goes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-4 border-black p-8 text-center neo-box relative"
            >
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 p-4 border-4 border-black rounded-full ${item.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mt-6 mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA — matches About CTA */}
      <section className="text-center py-12 space-y-6">
        <div className="flex justify-center text-6xl">
          <HeartHandshake className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-black">Thank You for Being Here!</h2>
        <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-1">
          <span>Even if you can't donate, just using DreamSync and sharing it with friends means the world to us.</span>
          <span className="flex items-center gap-2 mt-2 sm:mt-0">Built with <Heart className="w-5 h-5 text-red-500 fill-current" /> for Indian students.</span>
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-12 py-4 bg-[#FACC15] text-black font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] transition-all uppercase tracking-tighter"
        >
          Back to Dashboard →
        </Link>
      </section>

    </div>
  );
}
