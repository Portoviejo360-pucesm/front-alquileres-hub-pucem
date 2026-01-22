// app/(protected)/propiedades/[id]/reservar/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function ReservarPropiedadPage() {
    const params = useParams();
    const propiedadId = parseInt(params.id as string);

    return (
        <div className="property-detail-container">
            <div className="empty-state" style={{ margin: '60px auto', maxWidth: '600px' }}>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                <h3 className="empty-state-title">Backend Requerido</h3>
                <p className="empty-state-description">
                    Esta vista de reserva requiere conexión al backend para cargar:
                </p>
                <ul style={{ textAlign: 'left', margin: '16px auto', maxWidth: '400px', color: '#6b7280', fontSize: '14px' }}>
                    <li>• Información de la propiedad (ID: {propiedadId})</li>
                    <li>• Galería de imágenes</li>
                    <li>• Precio y disponibilidad</li>
                    <li>• Lista de amenidades/servicios</li>
                </ul>
                <p className="empty-state-description" style={{ marginTop: '20px' }}>
                    <strong>Endpoint requerido:</strong><br />
                    <code style={{
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '4px',
                        fontSize: '13px'
                    }}>
                        GET /propiedades/{propiedadId}
                    </code>
                </p>
                <div style={{ marginTop: '24px' }}>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        ← Volver
                    </Button>
                </div>
            </div>
        </div>
    );
}
