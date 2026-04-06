import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create user profile if it doesn't exist
      await setDoc(userDocRef, {
        name: user.displayName || 'Anonymous User',
        email: user.email,
        photoURL: user.photoURL || '',
        plan: "free",
        createdAt: new Date(),
        authMethod: 'google',
        lastLogin: new Date()
      });
    } else {
      // Update last login
      await setDoc(userDocRef, { 
        lastLogin: new Date(),
        photoURL: user.photoURL || userDoc.data().photoURL
      }, { merge: true });
    }
    
    return user;
  } catch (err: any) {
    console.error('Google Sign-in error:', err);
    throw err;
  }
};
