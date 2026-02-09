'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useVerification } from '@/lib/hooks/useVerification';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const { isVerified } = useVerification();

  useEffect(() => {
    // Cargar usuario si está autenticado
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // Redirigir según el estado del usuario
    if (!isAuthenticated) {
      // Usuario no autenticado → Mapa público
      router.replace('/mapa');
    } else if (isVerified) {
      // Usuario verificado (arrendador) → Dashboard
      router.replace('/dashboard');
    } else {
      // Usuario autenticado pero no verificado (inquilino) → Mapa
      router.replace('/mapa');
    }
  }, [isAuthenticated, isVerified, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--brand-bg)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: 'var(--brand-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Cargando...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
