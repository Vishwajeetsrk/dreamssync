'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
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
    }
  }, [userData, user]);

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

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      
      // Also update Firestore immediately for consistency
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      setMessage({ type: 'success', text: 'Photo uploaded!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setUploading(false);
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
    const confirm = window.confirm("WARNING: This will permanently delete your account and all data. This action cannot be undone. Proceed?");
    if (!confirm) return;

    setLoading(true);
    try {
      const password = window.prompt("To confirm deletion, please enter your password:");
      if (!password) {
        setLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete Firestore data first
      await deleteDoc(doc(db, 'users', user.uid));
      // Delete user account
      await deleteUser(user);
      
      router.push('/');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Deletion failed. Check your password.' });
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-black uppercase">Unauthorized Access</h2>
        <p className="text-gray-500 font-bold">Please log in to manage your profile.</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-blue-600 border-4 border-black text-white font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-black flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Security Profile Settings</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Manage your identity and synchronization</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 border-4 border-black mb-10 flex items-center gap-3 font-black uppercase text-sm ${
          message.type === 'success' ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white border-8 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="relative w-full aspect-square bg-[#f3f4f6] border-4 border-black flex items-center justify-center overflow-hidden mb-6">
              {photoURL ? (
                <Image src={photoURL} alt="Profile" fill className="object-cover" />
              ) : (
                <User className="w-24 h-24 text-gray-300" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-white border-4 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Change Photo
            </button>
          </div>

          <div className="bg-[#fff9db] border-4 border-black p-6 space-y-4">
            <h3 className="font-black uppercase text-sm border-b-2 border-black pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Account Privacy
            </h3>
            <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase">
              Your profile data is encrypted and stored securely across the DreamSync architecture.
            </p>
          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="md:col-span-2 space-y-10">
          {/* General Information */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">General Identity</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f9fa] border-4 border-black p-4 font-black uppercase text-lg focus:bg-white transition-colors outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  value={user.email || ''} 
                  disabled
                  className="w-full bg-gray-100 border-4 border-black p-4 font-black uppercase text-lg opacity-50 cursor-not-allowed"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-[#3b82f6] border-4 border-black text-white font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} Save Identity
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">Security Credentials</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#f8f9fa] border-4 border-black p-4 pl-12 font-black uppercase focus:bg-white transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Secret Phrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#f8f9fa] border-4 border-black p-4 pl-12 font-black uppercase focus:bg-white transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading || !newPassword}
                className="px-10 py-4 bg-black border-4 border-black text-white font-black uppercase shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Shield className="w-5 h-5" />} Update Security
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#fff5f5] border-8 border-red-600 p-8 shadow-[12px_12px_0px_0px_rgba(224,36,36,1)]">
            <h2 className="text-xl font-black uppercase text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" /> Destructive Actions
            </h2>
            <p className="text-sm font-black uppercase text-red-900 mb-8 border-b-2 border-red-200 pb-2">
              Once you delete your profile, there is no going back. Please be certain.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="px-8 py-4 bg-red-600 border-4 border-black text-white font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Purge Account Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
