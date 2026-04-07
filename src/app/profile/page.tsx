'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Camera, 
  Settings, 
  Shield, 
  Save, 
  Lock, 
  Loader2, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, userData } = useAuth() as { user: User | null; userData: any };
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'security' | 'settings'>('security');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [lang, setLang] = useState('en');
  const [timezone, setTimezone] = useState('IST');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAvatarUrl(userData.avatar_url || user?.user_metadata?.avatar_url || '');
      setLang(userData.language || language || 'en');
      setTimezone(userData.timezone || 'IST');
    }
  }, [userData, user, language]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // 1. Update Database Profile Table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update Auth Metadata for Consistency
      await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatarUrl }
      });

      setMessage({ type: 'success', text: 'Profile identity updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // VALIDATION (STEP 3)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Production requirement: Use PNG or JPG only.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File too large. Max size is 2MB.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      // CORRECT PATHING (STEP 2): userId-timestamp.ext
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // UPLOAD TO BUCKET 'avatars' (STEP 1)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        if (uploadError.message === 'Bucket not found') {
          throw new Error("Supabase Bucket 'avatars' missing. Please create it in your dashboard.");
        }
        throw uploadError;
      }

      // GET PUBLIC URL (STEP 4)
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (!publicUrl) throw new Error("Public URL generation failed.");

      setAvatarUrl(publicUrl);

      // SAVE TO DATABASE & AUTH (STEP 4)
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setMessage({ type: 'success', text: 'Identity photo synced successfully!' });
    } catch (err: any) {
      console.error('[IDENTITY SYNC ERROR]:', err);
      setMessage({ type: 'error', text: `${err.message || 'Identity sync failed. Check console.'}` });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language: lang,
          timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setLanguage(lang as 'en' | 'hi');
      setMessage({ type: 'success', text: 'System preferences synchronized!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Settings update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPassword) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Security credentials updated!' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Credential update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Sign out failed.' });
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-10 min-h-screen animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center gap-10 border-b-4 border-black mb-12">
        <button 
          onClick={() => setActiveTab('security')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'security' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          IDENTITY & SECURITY
          {activeTab === 'security' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'settings' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          GLOBAL SETTINGS
          {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'security' ? (
          <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* Identity Card (STEP 5) */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-40 h-40 border-8 border-black overflow-hidden bg-gray-50 flex items-center justify-center group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Identity" fill className="object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-300" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png,image/jpeg,image/jpg" 
                  onChange={handleFileUpload} 
                />
                <div className="text-center">
                  <h3 className="font-black text-2xl uppercase tracking-tighter">{name || 'ARCHITECT'}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-[0.2em]">{user.email}</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-8">
                <h2 className="text-xl font-black uppercase flex items-center gap-2 border-l-8 border-primary pl-4">
                  CORE IDENTITY
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" 
                      placeholder="e.g. ARJUN SHARMA"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || uploading} 
                    className="px-8 py-4 bg-primary text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />} SAVE IDENTITY
                  </button>
                </form>
              </div>
            </section>

            {/* Auth Metadata Section */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-8 border-l-8 border-amber-400 pl-4">
                SECURITY CREDENTIALS
              </h2>
              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Email Identity</label>
                  <input 
                    type="text" 
                    value={user.email} 
                    disabled 
                    className="w-full bg-gray-100 border-4 border-black p-4 font-black text-gray-500 outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">New Security Phrase</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-gray-300" 
                    placeholder="MIN. 6 CHARACTERS" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !newPassword} 
                  className="px-8 py-4 bg-black text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Shield className="w-5 h-5" /> UPDATE AUTH CREDENTIALS
                </button>
              </form>
            </section>

          </motion.div>
        ) : (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* System Preferences */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase mb-8 border-l-8 border-black pl-4">GLOBAL PREFERENCES</h2>
              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">System Language</label>
                    <select 
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none cursor-pointer hover:bg-white transition-colors uppercase"
                    >
                      <option value="en">English (INDIA)</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Timezone Architecture</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none cursor-pointer hover:bg-white transition-colors uppercase"
                    >
                      <option value="IST">IST (UTC+5:30)</option>
                      <option value="UTC">UTC (STABLE)</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-8 py-4 bg-black text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} SYNC PREFERENCES
                </button>
              </form>
            </section>

            {/* Session Management */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-black uppercase text-red-600 mb-2">END SESSION</h2>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest max-w-md">
                  Destroy current session credentials and remove local identity cache.
                </p>
              </div>
              <button 
                onClick={handleSignOut}
                disabled={loading}
                className="px-12 py-5 bg-red-600 border-4 border-black text-white font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-6 h-6" />} TERMINATE SESSION
              </button>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Alerts */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-10 right-10 p-6 border-4 border-black font-black uppercase text-xs flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            } shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50`}
          >
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
