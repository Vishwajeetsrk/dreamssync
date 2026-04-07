'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, deleteUser, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Camera, 
  Loader2, 
  Save, 
  LogOut,
  Trash2,
  Lock,
  Fingerprint,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      setMessage({ type: 'success', text: 'Profile identity updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Primary Attempt: Firebase Storage
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      await updateDoc(doc(db, 'users', user.uid), { avatar_url: url });
      setMessage({ type: 'success', text: 'Identity photo synced to storage!' });
      setUploading(false);
    } catch (err: any) {
      console.warn('Storage blocked by CORS/Permissions, falling back to Base64 Database Sync...', err.message);
      
      // 2. Secondary Attempt: Base64 Sync (CORS Bypass)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        if (base64data.length > 800000) { // Firestore limit check
           setMessage({ type: 'error', text: 'Identity photo too large for database sync (Max 800KB). Please compress.' });
           setUploading(false);
           return;
        }
        try {
          setAvatarUrl(base64data);
          await updateDoc(doc(db, 'users', user.uid), { avatar_url: base64data });
          setMessage({ type: 'success', text: 'Identity photo synced via Database (CORS Bypassed)!' });
        } catch (dbErr: any) {
          setMessage({ type: 'error', text: 'Database sync failed. Photo too large or network error.' });
        } finally {
          setUploading(false);
        }
      };
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    try {
      await updatePassword(auth.currentUser!, newPassword);
      setMessage({ type: 'success', text: 'Security credentials updated!' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    try {
      const uid = user.uid;
      await deleteDoc(doc(db, 'users', uid));
      await deleteUser(auth.currentUser!);
      router.push('/signup');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please re-login and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading && !user) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-10 min-h-screen animate-in fade-in duration-500">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-10 border-b-4 border-black mb-12">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'profile' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          PROFILE & IDENTITY
          {activeTab === 'profile' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'settings' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          ACCOUNT SETTINGS
          {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
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
                  <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} />
                  <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                    <Camera className="w-8 h-8" />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="font-black text-2xl uppercase tracking-tighter">{name || 'ARCHITECT'}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-[0.2em]">{user?.email}</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-8 text-black">
                <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2"> <Fingerprint className="w-5 h-5 text-primary" /> Personal Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all text-black" 
                    />
                  </div>
                  <button type="submit" className="px-8 py-4 bg-primary text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-3">
                    <Save className="w-5 h-5" /> SYNC IDENTITY
                  </button>
                </form>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* Password Reset */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase mb-8 border-l-8 border-black pl-4 text-black">SECURITY CREDENTIALS</h2>
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">New Security Phrase</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="MIN. 6 CHARACTERS"
                    className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none text-black" 
                  />
                </div>
                <button type="submit" className="px-8 py-4 bg-black text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-400" /> UPDATE PASSWORD
                </button>
              </form>
            </section>

            {/* Account Management */}
            <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="text-black">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Session Control</h3>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest max-w-sm">Terminate current login and clear identity cache.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSignOut}
                  className="px-8 py-4 bg-white border-4 border-black text-black font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> SIGN OUT
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className={`px-8 py-4 border-4 border-black font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-2 ${confirmDelete ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-red-600'}`}
                >
                  <Trash2 className="w-5 h-5" /> {confirmDelete ? 'CONFIRM PERMANENT DELETE?' : 'DELETE ACCOUNT'}
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistence Message */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className={`fixed bottom-10 right-10 p-6 border-4 border-black font-black uppercase text-xs ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex items-center gap-3`}
          >
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />} {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
