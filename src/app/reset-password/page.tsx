'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 border-4 border-black rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Email Sent!</h2>
              <p className="text-gray-500 font-bold text-sm">
                Check your inbox for the reset link sent to <br />
                <span className="text-black">{email}</span>
              </p>
            </div>
            <Link 
              href="/login" 
              className="block w-full py-4 bg-black text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Reset Password</h2>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-tighter">Enter your email and we'll send you a recovery link.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Recovery Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-4 border-black p-4 pl-12 font-black outline-none focus:bg-white transition-colors"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-black text-red-600 text-xs font-black uppercase">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                Send Recovery Link
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
