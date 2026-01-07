// app/(protected)/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import AppShell from '@/components/layout/AppShell';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, loadUser } = useAuthStore();

  // 🚧 MODO DESARROLLO: Comentar este useEffect para permitir acceso sin login
  /*
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  */

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}