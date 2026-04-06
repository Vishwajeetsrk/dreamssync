'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      // Friendly errors for common cases
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Check for typos or sign up!');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-green-400 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black">Check Your Email!</h1>
            <p className="text-muted-foreground font-medium mt-4">
              We've sent a password reset link to <span className="font-bold text-black">{email}</span>.
            </p>
            <p className="text-sm mt-4 italic"> (Don't forget to check your spam folder) </p>
          </div>
          
          <Link 
            href="/login" 
            className="w-full py-4 bg-primary text-white font-bold text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black text-center">Reset Password</h1>
          <p className="text-muted-foreground font-medium text-center">We'll send you a link to get back into your account.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-6 text-red-900 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border-2 border-black p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-all font-medium"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-black text-white font-bold text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'} 
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-dashed border-gray-300 pt-6">
          <Link href="/login" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
