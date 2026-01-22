// components/alquileres/ReservaCard.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import EstadoBadge from '@/components/propiedades/EstadoBadge';
import type { Reserva } from '@/types/reserva';

interface ReservaCardProps {
    reserva: Reserva;
}

export const ReservaCard: React.FC<ReservaCardProps> = ({ reserva }) => {
    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const thumbnailUrl = reserva.propiedad?.fotos?.[0];

    return (
        <div className="reserva-card">
            {/* Thumbnail */}
            <div className="reserva-thumbnail">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={reserva.propiedad?.tituloAnuncio || 'Propiedad'}
                        className="reserva-thumbnail-image"
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        SIN FOTO
                    </div>
                )}
            </div>

            {/* Información */}
            <div className="reserva-info">
                <h3 className="reserva-title">
                    {reserva.propiedad?.tituloAnuncio || 'Propiedad sin título'}
                </h3>
                <p className="reserva-dates">
                    Fecha: {formatearFecha(reserva.fechaEntrada)} - {formatearFecha(reserva.fechaSalida)}
                </p>
                <div className="reserva-footer">
                    <EstadoBadge estado={reserva.estado} />
                </div>
            </div>

            {/* Acción */}
            <div className="reserva-actions">
                {reserva.estado === 'CONFIRMADA' && (
                    <Link href={`/alquileres/${reserva.id}/contrato`}>
                        <Button variant="primary" size="sm">
                            Ver Contrato
                        </Button>
                    </Link>
                )}
                {reserva.estado === 'PENDIENTE' && (
                    <Button variant="secondary" size="sm" disabled>
                        Pendiente de Pago
                    </Button>
                )}
                {reserva.estado === 'CANCELADA' && (
                    <Button variant="ghost" size="sm" disabled>
                        Cancelada
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ReservaCard;
