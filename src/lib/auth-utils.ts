import { supabase } from './supabase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Handle Google Sign-In via Supabase OAuth
 * Syncs profile metadata to Firestore for backward compatibility
 */
export const handleGoogleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error('Supabase Google Sign-in error:', err);
    throw err;
  }
};

/**
 * Background Sync: Ensures Supabase User exists in Firestore
 * Use this in AuthContext on state change
 */
export const syncUserToFirestore = async (supabaseUser: any) => {
  if (!supabaseUser) return;
  
  try {
    const userDocRef = doc(db, "users", supabaseUser.id);
    const userDoc = await getDoc(userDocRef);
    
    const metadata = supabaseUser.user_metadata || {};
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: metadata.full_name || metadata.name || 'DreamSync User',
        email: supabaseUser.email,
        photoURL: metadata.avatar_url || metadata.picture || '',
        plan: "free",
        createdAt: new Date(),
        authMethod: 'supabase-google',
        lastLogin: new Date()
      });
    } else {
      await setDoc(userDocRef, { 
        lastLogin: new Date(),
        photoURL: metadata.avatar_url || metadata.picture || userDoc.data().photoURL
      }, { merge: true });
    }
  } catch (err) {
    console.error("Firestore sync failed for Supabase user:", err);
  }
};
