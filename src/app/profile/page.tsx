'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { auth, db, storage } from '@/lib/firebase';
import { updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Camera, 
  Settings, 
  Shield, 
  Trash2, 
  Save, 
  Lock, 
  Loader2, 
  AlertCircle,
  LogOut
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, userData } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'security' | 'settings'>('security');
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [lang, setLang] = useState('en');
  const [timezone, setTimezone] = useState('IST');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhotoURL(userData.photoURL || user?.photoURL || '');
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
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        photoURL,
        updatedAt: new Date()
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validation: Type (PNG, GIF, JPEG)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
    const isAllowedExt = ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension);

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setMessage({ type: 'error', text: 'Invalid format. Use PNG, GIF, or JPEG.' });
      return;
    }

    // Validation: Size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File too large. Max size is 5MB.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      setMessage({ type: 'success', text: 'Identity photo updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Upload failed. Try again.' });
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
      await updateDoc(doc(db, 'users', user.uid), {
        language: lang,
        timezone,
        updatedAt: new Date()
      });
      setLanguage(lang as 'en' | 'hi');
      setMessage({ type: 'success', text: 'System settings synchronized!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Settings update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentPassword || !newPassword) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Re-authentication failed. Check current password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirm = window.confirm("WARNING: This will permanently delete your account and all data. Proceed?");
    if (!confirm) return;
    setLoading(true);
    try {
      const password = window.prompt("To confirm deletion, please enter your password:");
      if (!password) { setLoading(false); return; }
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      router.push('/');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Deletion failed. Check your password.' });
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-10 min-h-screen animate-in fade-in duration-500">
      {/* Tab Navigation matching provided design */}
      <div className="flex items-center gap-10 border-b border-gray-200 mb-12">
        <button 
          onClick={() => setActiveTab('security')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'security' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {t('security')}
          {activeTab === 'security' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-black" />}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'settings' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {t('settings')}
          {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-black" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'security' ? (
          <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* Identity & Avatar Section */}
            <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-40 h-40 rounded-full border-8 border-black overflow-hidden bg-gray-50 flex items-center justify-center group">
                  {photoURL ? <Image src={photoURL} alt="Profile" fill className="object-cover" /> : <User className="w-16 h-16 text-gray-300" />}
                  {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}
                  <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept=".png,.jpg,.jpeg,.gif" onChange={handleFileUpload} />
                <div className="text-center">
                  <h3 className="font-black text-xl uppercase">{userData?.name || 'DreamSync User'}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wider">{user.email}</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" /> {t('account_identity')}
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">{t('full_name')}</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none focus:bg-white transition-colors" 
                    />
                  </div>
                  <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 border-4 border-black text-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t('save_identity')}
                  </button>
                </form>
              </div>
            </section>

            {/* Password Security Section */}
            <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-8">
                <Lock className="w-5 h-5 text-amber-500" /> Security Credentials
              </h2>
              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-gray-50 border-4 border-black p-3 font-black outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">New Secret Phrase</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50 border-4 border-black p-3 font-black outline-none" />
                </div>
                <button type="submit" disabled={loading || !newPassword} className="px-8 py-3 bg-black border-4 border-black text-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Reset Credentials
                </button>
              </form>
            </section>

          </motion.div>
        ) : (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* System Settings matching provided design */}
            <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">{t('system_settings')}</h2>
              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">{t('language')}</label>
                    <select 
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-3 font-black outline-none appearance-none cursor-pointer"
                    >
                      <option value="en">English (India)</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">{t('timezone')}</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-3 font-black outline-none appearance-none cursor-pointer"
                    >
                      <option value="IST">IST (UTC+5:30)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-black border-4 border-black text-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t('save_settings')}
                </button>
              </form>
            </section>

            {/* Account Preferences matching provided design */}
            <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black uppercase text-red-600 mb-1">{t('delete_account')}</h2>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-tight max-w-md">
                  Permanently remove all your data from DreamSync architecture. This action cannot be undone.
                </p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="px-10 py-4 bg-red-600 border-4 border-black text-white font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> {t('purge_account')}
              </button>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {message.text && (
        <div className={`fixed bottom-10 right-10 p-5 border-4 border-black font-black uppercase text-sm animate-in slide-in-from-right duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
