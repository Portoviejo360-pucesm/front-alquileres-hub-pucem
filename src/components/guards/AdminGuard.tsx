// components/guards/AdminGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const isAdmin = user?.rolId === 1;

  useEffect(() => {
    if (!loading && !isAdmin) {
      // Redirigir al dashboard normal si no es admin
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando permisos...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
