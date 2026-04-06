'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/Skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-12 w-64 neo-box bg-white" />
        <Skeleton className="h-8 w-48 neo-box bg-white" />
        <div className="text-xl font-black mt-4 animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
}
