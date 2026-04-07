'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Camera, 
  Loader2, 
  Save, 
  Globe,
  Smartphone,
  Clock,
  Fingerprint
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      await updateDoc(doc(db, 'users', user.uid), { avatar_url: url });
      setMessage({ type: 'success', text: 'Avatar updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-10 min-h-screen animate-in fade-in duration-500">
      <div className="flex items-center gap-10 border-b-4 border-black mb-12">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'profile' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          PROFILE & SECURITY
          {activeTab === 'profile' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />}
        </button>
      </div>

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
            <input 
              type="file" 
              id="avatar-upload" 
              hidden 
              accept="image/*" 
              onChange={handleAvatarUpload} 
            />
            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
              <Camera className="w-8 h-8" />
            </label>
          </div>
          <div className="text-center">
            <h3 className="font-black text-2xl uppercase tracking-tighter">{name || 'ARCHITECT'}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-[0.2em]">{user.email}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2"> <Fingerprint className="w-5 h-5" /> Personal Information</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Legal Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-gray-50 border-4 border-black p-4 font-black outline-none focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-8 py-4 bg-primary text-white font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> UPDATE PROFILE
            </button>
          </form>
        </div>
      </section>
      
      {message && (
        <div className={`mt-8 p-4 border-4 border-black font-black uppercase text-xs ${message.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
