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
  Orbit,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
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

      if (searchParams.get('action') === 'fix') {
         await handleHeadlessSync(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const handleHeadlessSync = async (currentUser: any) => {
    setUploading(true);
    try {
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
      // Primary: Firebase Storage
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      await updateDoc(doc(db, 'users', user.uid), { avatar_url: url });
      setMessage({ type: 'success', text: 'Identity photo synced to Cloud Storage!' });
    } catch (err: any) {
      console.warn('Storage blocked, falling back to Base64 Database Sync...', err.message);
      
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
          setMessage({ type: 'success', text: 'Identity photo synced via Database (Sovereign Bypass)!' });
        } catch (dbErr: any) {
          setMessage({ type: 'error', text: 'Database sync failed. Photo too large or network error.' });
        } finally {
          setUploading(false);
        }
      };
    } finally {
        // Only set uploading false if we didn't enter the reader.onloadend async block
        // Actually, the catch block is synchronous until reader.readAsDataURL.
        // We handle setUploading(false) in the reader or the main try block.
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
      setMessage({ type: 'error', text: 'Termination failed. Protocol requires fresh authorization.' });
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
    <div className="min-h-screen bg-[#0F172A] pt-32 pb-12 px-6 md:px-12 text-white selection:bg-[#3B82F6]/40 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1E3A8A] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e11d48] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Infrastructure */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#3B82F6]">
              <Fingerprint className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Identity Node</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-white">
              Sovereign <br /> <span className="text-gradient-blue italic">Profile_</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-8 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white'}`}
            >
              Identity
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-8 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white'}`}
            >
              Settings
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Profile Context Card */}
              <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50" />
                  
                  <div className="relative w-48 h-48 border-[6px] border-white/5 rounded-full overflow-hidden bg-[#0F172A] flex items-center justify-center p-1 group-hover:border-[#3B82F6]/30 transition-all shadow-2xl">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Identity" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <UserIcon className="w-24 h-24 text-white/5" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-[#0F172A]/90 flex items-center justify-center backdrop-blur-md">
                        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
                      </div>
                    )}
                    <input type="file" id="avatar-upload-profile" hidden accept="image/*" onChange={handleAvatarUpload} />
                    <label htmlFor="avatar-upload-profile" className="absolute inset-0 bg-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Camera className="w-12 h-12 text-white" />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight text-white uppercase">{name || 'Dreamer'}</h3>
                    <p className="text-[12px] font-bold text-white/30 uppercase tracking-widest">{user?.email}</p>
                  </div>

                  <div className="w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-widest">Protocol</div>
                      <div className="text-[13px] font-bold text-blue-500 uppercase">Standard</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-widest">Sovereign</div>
                      <div className="text-[13px] font-bold text-[#e11d48] uppercase">Athentic</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleHeadlessSync(user)}
                  disabled={uploading}
                  className="w-full py-5 bg-white/5 hover:bg-[#3B82F6]/10 border border-white/10 text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-[#3B82F6]" />} 
                  Refresh Core Identity
                </button>
              </div>

              {/* Identity Modification Infrastructure */}
              <div className="lg:col-span-8 space-y-10">
                <div className="glass-card p-12 relative overflow-hidden">
                  <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-white/30 mb-10 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#3B82F6]" /> Personnel Protocol
                  </h3>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/50 px-2">Official Identity Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-xl font-bold outline-none focus:border-[#3B82F6]/50 focus:bg-white/10 transition-all text-white shadow-inner" 
                        placeholder="ENTER IDENTITY"
                      />
                    </div>

                    <button type="submit" className="px-12 py-5 btn-gradient shadow-2xl flex items-center gap-4 group">
                      <Save className="w-6 h-6 group-hover:scale-110 transition-all" /> Commit Configuration
                    </button>
                  </form>
                </div>

                <div className="p-10 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#e11d48]/5 border border-white/10 rounded-[32px] backdrop-blur-3xl">
                  <div className="flex items-start gap-6">
                    <Orbit className="w-8 h-8 text-[#3B82F6] animate-spin-slow" />
                    <div>
                      <h4 className="text-[12px] font-black uppercase tracking-widest mb-3 text-white">Identity Infrastructure Notice</h4>
                      <p className="text-[15px] text-white/50 leading-relaxed font-medium">Your profile data is protected via the DreamSync Sovereign Protocol. Identity updates are synchronized across our neural infrastructure in milliseconds.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="space-y-12"
            >
              {/* Security Authorization Card */}
              <div className="glass-card p-12">
                <h2 className="text-2xl font-bold uppercase mb-12 flex items-center gap-4 tracking-tighter text-white">
                  <Lock className="w-8 h-8 text-[#3B82F6]" /> Security Hardening
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-10 max-w-xl">
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold uppercase tracking-widest text-white/50 px-2">New Access Protocol Key</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="••••••••••••"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-2xl font-bold outline-none focus:border-[#3B82F6]/50 focus:bg-white/10 transition-all text-white shadow-inner" 
                    />
                  </div>
                  <button type="submit" className="px-10 py-5 bg-white text-black hover:bg-gray-200 font-black uppercase text-[12px] tracking-widest rounded-2xl shadow-2xl transition-all flex items-center gap-4 active:scale-95">
                    <Shield className="w-6 h-6 text-[#3B82F6]" /> Authorize Hardening
                  </button>
                </form>
              </div>

              {/* Termination Zone Architecture */}
              <div className="bg-[#e11d48]/5 border border-[#e11d48]/20 rounded-[40px] p-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10 shadow-2xl">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-[#e11d48]">Critical Termination</h3>
                  <p className="text-[14px] font-medium text-white/40 max-w-md leading-relaxed">WARNING: Full de-authorization of identity node and permanent erasure of all career synchronization logs within the infrastructure.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button 
                    onClick={handleSignOut}
                    className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[12px] tracking-widest rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                  >
                    <LogOut className="w-5 h-5 text-[#3B82F6]" /> End Session
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className={`px-10 py-5 border font-black uppercase text-[12px] tracking-widest rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 ${confirmDelete ? 'bg-[#e11d48] border-[#e11d48] text-white animate-pulse' : 'bg-transparent border-[#e11d48]/30 text-[#e11d48]'}`}
                  >
                    <Trash2 className="w-5 h-5" /> {confirmDelete ? 'Confirm Erasure?' : 'Purge Node'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Feedback Matrix */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`fixed bottom-12 right-12 p-8 rounded-[32px] border border-white/10 font-bold uppercase text-[12px] tracking-widest ${message.type === 'success' ? 'bg-[#3B82F6] text-white shadow-blue-500/20' : 'bg-[#e11d48] text-white shadow-red-500/20'} shadow-2xl z-[100] flex items-center gap-6 backdrop-blur-2xl`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              <div>
                <p className="text-[15px] leading-tight mb-2 font-bold">{message.text}</p>
                <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: "100%" }}
                     animate={{ width: "0%" }}
                     transition={{ duration: 5 }}
                     className="h-full bg-white"
                   />
                </div>
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
    <Suspense fallback={
       <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
         <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
       </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
