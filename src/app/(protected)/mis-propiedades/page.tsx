// app/(protected)/mis-propiedades/page.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { VerificationGuard } from '@/components/guards/VerificationGuard';

export default function MisPropiedadesPage() {
    return (
        <VerificationGuard>
            <div className="mis-propiedades-container">
                {/* Header */}
                <div className="property-management-header">
                    <div>
                        <h1 className="alquileres-title">Mis Propiedades</h1>
                        <p className="alquileres-subtitle">
                            Gestiona tus propiedades en alquiler
                        </p>
                    </div>
                    <Link href="/propiedades/new">
                        <Button variant="primary" size="md">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{ marginRight: '6px' }}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Registrar Nueva Propiedad
                        </Button>
                    </Link>
                </div>

                {/* Estado Vacío - Backend Requerido */}
                <div className="empty-state" style={{ marginTop: '60px' }}>
                    <svg
                        className="empty-state-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    <h3 className="empty-state-title">Backend Requerido</h3>
                    <p className="empty-state-description">
                        Esta vista requiere conexión con el backend para listar tus propiedades.
                    </p>
                    <p className="empty-state-description" style={{ marginTop: '16px' }}>
                        <strong>Endpoints requeridos:</strong>
                    </p>
                    <ul style={{ textAlign: 'left', margin: '12px auto', maxWidth: '400px', color: '#6b7280', fontSize: '14px' }}>
                        <li>• <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>GET /propiedades/mis-propiedades</code></li>
                        <li>• <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>PUT /propiedades/:id</code> (actualizar)</li>
                        <li>• <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>DELETE /propiedades/:id</code> (eliminar)</li>
                    </ul>
                </div>
            </div>
        </VerificationGuard>
    );
}

