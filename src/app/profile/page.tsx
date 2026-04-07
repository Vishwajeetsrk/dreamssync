'use client';

import { useState, useEffect, Suspense } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, deleteUser, signOut } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
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
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function ProfileContent() {
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
  const searchParams = useSearchParams();

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

      // Handle Headless Auto-Fix
      if (searchParams.get('action') === 'fix') {
         await handleHeadlessSync(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const handleHeadlessSync = async (currentUser: any) => {
    setUploading(true);
    try {
      // Sync auth photo to DB if DB is empty
      const currentPhoto = currentUser.photoURL || '';
      if (currentPhoto) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          avatar_url: currentPhoto,
          last_sync: new Date().toISOString()
        });
        setAvatarUrl(currentPhoto);
        setMessage({ type: 'success', text: 'Identity Synchronization Complete.' });
      } else {
        setMessage({ type: 'error', text: 'No source photo found to sync. Please upload manually.' });
      }
    } catch (err) {
      console.error('Headless sync failed');
    } finally {
      setUploading(false);
    }
  };

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
      setMessage({ type: 'success', text: 'Identity record committed to stable storage.' });
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
      setMessage({ type: 'success', text: 'Identity photo synced to Cloud Storage!' });
      setUploading(false);
    } catch (err: any) {
      console.warn('Storage blocked by CORS, falling back to Base64 Database Sync...', err.message);
      
      // 2. Secondary Attempt: Base64 Sync (CORS Bypass)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        if (base64data.length > 800000) { 
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
      setMessage({ type: 'success', text: 'Security credentials hardened!' });
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
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-12 px-6 md:px-12 text-white font-sans selection:bg-[#1D4D47]">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#1D4D47]">
              <Fingerprint className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Identity Core</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Profile <br /> <span className="text-gray-600">Verification_</span>
            </h1>
          </div>
          <div className="flex bg-[#141414] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-[#1D4D47] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Identity
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-[#1D4D47] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Security
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div 
              key="profile" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Profile Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#141414] border border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1D4D47] to-transparent opacity-50" />
                  
                  <div className="relative w-44 h-44 border-4 border-white/5 rounded-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-1 group-hover:border-[#1D4D47]/40 transition-colors">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Identity" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <UserIcon className="w-20 h-20 text-[#1D4D47]/20" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-[#0A0A0A]/80 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-[#1D4D47] animate-spin" />
                      </div>
                    )}
                    <input type="file" id="avatar-upload-profile" hidden accept="image/*" onChange={handleAvatarUpload} />
                    <label htmlFor="avatar-upload-profile" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Camera className="w-10 h-10 text-white" />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight uppercase">{name || 'Strategist'}</h3>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{user?.email}</p>
                  </div>

                  <div className="w-full pt-6 border-t border-white/5 flex grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase text-gray-600 mb-1">Status</div>
                      <div className="text-[12px] font-black text-green-500 uppercase">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase text-gray-600 mb-1">Tier</div>
                      <div className="text-[12px] font-black text-[#1D4D47] uppercase">Elite</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleHeadlessSync(user)}
                  disabled={uploading}
                  className="w-full py-4 bg-[#141414] hover:bg-[#1D4D47]/10 border border-white/5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                  Manual Identity Sync
                </button>
              </div>

              {/* Edit Section */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[#141414] border border-white/10 rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                  <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Personnel Protocol
                  </h3>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[#1D4D47]">Full Legal Signature</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 text-lg font-black outline-none focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all" 
                        placeholder="ENTER NAME"
                      />
                    </div>

                    <button type="submit" className="px-10 py-5 bg-[#1D4D47] hover:bg-[#2d7a71] text-white font-black uppercase text-[12px] tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-3 active:scale-95 group">
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Commit Changes
                    </button>
                  </form>
                </div>

                <div className="p-8 bg-gradient-to-r from-[#1D4D47]/10 to-transparent border border-[#1D4D47]/20 rounded-3xl">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-[#1D4D47]" />
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest mb-2">Sync Infrastructure Notice</h4>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium">Your profile data is protected via Firebase Identity Protocol. Any changes made here are instantly synchronized across the global DreamSync architecture.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="space-y-8"
            >
              {/* Security Card */}
              <div className="bg-[#141414] border border-white/10 rounded-[32px] p-10 shadow-2xl">
                <h2 className="text-xl font-black uppercase mb-10 flex items-center gap-3 tracking-tighter">
                  <Lock className="w-7 h-7 text-[#1D4D47]" /> Security Authorization
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-8 max-w-lg">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#1D4D47]">New Security Phrase</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="••••••••"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 text-xl font-black outline-none focus:border-[#1D4D47] transition-all text-white" 
                    />
                  </div>
                  <button type="submit" className="px-10 py-5 bg-white text-black hover:bg-gray-200 font-black uppercase text-[12px] tracking-widest rounded-2xl shadow-xl transition-all flex items-center gap-3">
                    <Shield className="w-5 h-5" /> Harden Access
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-red-500">Termination Zone</h3>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest max-w-sm">DANGER: Permanent deletion of identity audit logs and session history.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSignOut}
                    className="px-8 py-4 bg-[#141414] hover:bg-[#1D4D47]/10 border border-white/5 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" /> Terminate Session
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className={`px-8 py-4 border font-black uppercase text-[11px] tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl ${confirmDelete ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'bg-transparent border-red-600/30 text-red-500'}`}
                  >
                    <Trash2 className="w-5 h-5 flex-shrink-0" /> {confirmDelete ? 'Confirm Purge?' : 'Purge Identity'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Feedback Toast */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`fixed bottom-12 right-12 p-6 rounded-3xl border border-white/10 font-bold uppercase text-[11px] tracking-widest ${message.type === 'success' ? 'bg-[#1D4D47] text-white shadow-[#1D4D47]/20' : 'bg-red-900/90 text-white shadow-red-900/20'} shadow-2xl z-50 flex items-center gap-4 backdrop-blur-xl`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <div>
                <p className="text-[13px] leading-tight mb-1">{message.text}</p>
                <p className="text-[10px] opacity-40">Sys-Log: {Date.now()}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
}
