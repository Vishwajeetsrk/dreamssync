import { supabase } from './supabase';

export const handleGoogleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error('Google Sign-in error:', err);
    throw err;
  }
};
