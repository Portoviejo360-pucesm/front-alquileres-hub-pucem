'use client';

import { useVerification } from '@/lib/hooks/useVerification';
import Link from 'next/link';

/**
 * Alerta para usuarios no verificados
 * Muestra un mensaje invitándolos a verificar su cuenta
 */
export function VerificationAlert() {
    const { isVerified, verificationPending } = useVerification();

    if (isVerified) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: verificationPending ? '#d1ecf1' : '#fff3cd',
            border: `1px solid ${verificationPending ? '#bee5eb' : '#ffc107'}`,
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>
                    {verificationPending ? '⏳' : '📋'}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        margin: '0 0 0.5rem 0',
                        color: verificationPending ? '#0c5460' : '#856404',
                        fontSize: '1.1rem'
                    }}>
                        {verificationPending ? 'Verificación en Proceso' : '¿Quieres publicar propiedades?'}
                    </h3>
                    <p style={{
                        margin: '0 0 1rem 0',
                        color: verificationPending ? '#0c5460' : '#856404'
                    }}>
                        {verificationPending
                            ? 'Tu solicitud de verificación está siendo revisada. Te notificaremos cuando sea aprobada.'
                            : 'Verifica tu cuenta para poder publicar tus propiedades y acceder a herramientas de arrendador.'
                        }
                    </p>
                    {!verificationPending && (
                        <Link
                            href="/perfil"
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            Verificar Ahora
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
