'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { syncUserToFirestore } from '@/lib/auth-utils';

interface AuthContextType {
  user: any | null; // Supabase user object
  userData: any | null; // Firestore user document
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    // Supabase Auth Listener (The New Source of Truth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Sync new/existing Supabase user into Firestore (for consistency)
        await syncUserToFirestore(currentUser);

        // Real-time listener for user data in Firestore
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.id), (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          }
        }, (error) => {
          console.error("Firestore sync error:", error);
        });
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Initial check for existing session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await syncUserToFirestore(session.user);
      }
      setLoading(false);
    };
    
    getInitialSession();

    return () => {
      subscription.unsubscribe();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
