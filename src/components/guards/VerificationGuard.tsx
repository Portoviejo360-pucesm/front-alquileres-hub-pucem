'use client';

import { useVerification } from '@/lib/hooks/useVerification';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface VerificationGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

/**
 * Componente que protege rutas que requieren usuario verificado
 * Si el usuario no está verificado, muestra un mensaje o redirige
 */
export function VerificationGuard({
    children,
    fallback,
    redirectTo
}: VerificationGuardProps) {
    const { isVerified } = useVerification();
    const router = useRouter();

    useEffect(() => {
        if (!isVerified && redirectTo) {
            router.push(redirectTo);
        }
    }, [isVerified, redirectTo, router]);

    if (!isVerified) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div style={{
                maxWidth: '600px',
                margin: '4rem auto',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px'
            }}>
                <h2 style={{ color: '#856404', marginBottom: '1rem' }}>
                    🔒 Verificación Requerida
                </h2>
                <p style={{ color: '#856404', marginBottom: '1.5rem' }}>
                    Para acceder a esta funcionalidad, necesitas verificar tu cuenta como arrendador.
                </p>
                <p style={{ color: '#856404', marginBottom: '1.5rem' }}>
                    La verificación te permite:
                </p>
                <ul style={{
                    textAlign: 'left',
                    color: '#856404',
                    marginBottom: '1.5rem',
                    listStyle: 'none',
                    padding: 0
                }}>
                    <li style={{ marginBottom: '0.5rem' }}>✅ Publicar tus propiedades</li>
                    <li style={{ marginBottom: '0.5rem' }}>✅ Gestionar tus anuncios</li>
                    <li style={{ marginBottom: '0.5rem' }}>✅ Recibir solicitudes de arrendamiento</li>
                    <li style={{ marginBottom: '0.5rem' }}>✅ Acceder a herramientas de arrendador</li>
                </ul>
                <button
                    onClick={() => router.push('/perfil')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    Verificar mi Cuenta
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
