'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="space-y-16 max-w-5xl mx-auto py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          About <span className="text-primary underline decoration-8 underline-offset-4">DreamSync</span>
        </h1>
        <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
          We are a care-experienced community dedicated to leveling the playing field for Indian students entering the workforce.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-accent border-4 border-black p-8 md:p-12 neo-box transform -rotate-1">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 p-6 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Target className="w-16 h-16 text-accent" style={{ color: 'var(--foreground)' }} />
          </div>
          <div>
            <h2 className="text-4xl font-black mb-4">Our Mission</h2>
            <p className="text-xl font-medium leading-relaxed">
              To provide every student with AI-powered tools, clear roadmaps, and the essential documents guidance they need to succeed—regardless of their background or network.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <h2 className="text-4xl font-black text-center mb-12 border-b-4 border-black pb-4 inline-block mx-auto flex justify-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Accessibility", desc: "Top-tier career guidance should be affordable and accessible to everyone.", icon: Globe, color: "bg-blue-100" },
            { title: "AI-Driven", desc: "We leverage the latest AI to give you personalized, actionable feedback.", icon: Zap, color: "bg-yellow-100" },
            { title: "Community First", desc: "Built by care-experienced individuals, for the Indian youth community.", icon: Heart, color: "bg-pink-100" },
          ].map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-4 border-black p-8 text-center neo-box relative"
            >
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 p-4 border-4 border-black rounded-full ${value.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mt-6 mb-2">{value.title}</h3>
              <p className="text-muted-foreground font-medium">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-black mb-6">Ready to sync your dreams?</h2>
        <Link href="/dashboard" className="inline-block px-12 py-4 bg-primary text-white font-black text-2xl border-4 border-black neo-box hover:-translate-y-2 hover:shadow-neo-hover transition-all">
          Join the Platform Today
        </Link>
      </section>
    </div>
  );
}
