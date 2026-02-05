// app/(protected)/alquileres/page.tsx

'use client';
import '@/styles/components/alquileres.css';

import { useEffect, useState } from 'react';
import { reservasApi } from '@/lib/api/reservas.api';
import ReservaCard from '@/components/alquileres/ReservaCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Reserva } from '@/types/reserva';

export default function AlquileresPage() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarReservas = async () => {
            try {
                setLoading(true);
                const data = await reservasApi.misReservas();
                setReservas(data);
            } catch (err) {
                // Si es error de conexión, mostrar mensaje más amigable
                const errorMessage = err instanceof Error ? err.message : 'Error al cargar reservas';
                if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                    setError('No se pudo conectar al servidor. Verifica que el backend esté activo.');
                } else {
                    setError(errorMessage);
                }
                console.error('Error al cargar reservas:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarReservas();
    }, []);

    return (
        <div className="alquileres-container">
            {/* Header */}
            <div className="alquileres-header">
                <h1 className="alquileres-title">Historial de Arriendos</h1>
                <p className="alquileres-subtitle">
                    Visualiza y gestiona todos tus arriendos
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="reservas-list">
                    <Skeleton style={{ height: '140px', borderRadius: '16px' }} />
                    <Skeleton style={{ height: '140px', borderRadius: '16px' }} />
                    <Skeleton style={{ height: '140px', borderRadius: '16px' }} />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="empty-state">
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
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="empty-state-title">Error al cargar reservas</h3>
                    <p className="empty-state-description">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && reservas.length === 0 && (
                <div className="empty-state">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="empty-state-title">No tienes reservas</h3>
                    <p className="empty-state-description">
                        Explora propiedades disponibles y haz tu primera reserva
                    </p>
                </div>
            )}

            {/* Reservas List */}
            {!loading && !error && reservas.length > 0 && (
                <div className="reservas-list">
                    {reservas.map((reserva) => (
                        <ReservaCard key={reserva.id} reserva={reserva} />
                    ))}
                </div>
            )}
        </div>
    );
}
