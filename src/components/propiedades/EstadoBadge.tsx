import React from 'react';

export type EstadoType =
    | 'DISPONIBLE'
    | 'OCUPADO'
    | 'MANTENIMIENTO'
    | 'PENDIENTE'
    | 'CONFIRMADA'
    | 'FINALIZADA'
    | 'CANCELADA'
    | 'Disponible'
    | 'Ocupado';

interface EstadoBadgeProps {
    estado: string;
    className?: string;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, className = '' }) => {
    const getEstilos = () => {
        const estadoUpper = estado.toUpperCase();

        const estilosBase: React.CSSProperties = {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize',
        };

        // Estilos según el estado
        const estilosPorEstado: Record<string, React.CSSProperties> = {
            DISPONIBLE: {
                backgroundColor: '#d1fae5',
                color: '#059669',
            },
            OCUPADO: {
                backgroundColor: '#fef3c7',
                color: '#d97706',
            },
            MANTENIMIENTO: {
                backgroundColor: '#fee2e2',
                color: '#dc2626',
            },
            PENDIENTE: {
                backgroundColor: '#fef3c7',
                color: '#d97706',
            },
            CONFIRMADA: {
                backgroundColor: '#d1fae5',
                color: '#059669',
            },
            FINALIZADA: {
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
            },
            CANCELADA: {
                backgroundColor: '#fee2e2',
                color: '#dc2626',
            },
        };

        return {
            ...estilosBase,
            ...(estilosPorEstado[estadoUpper] || estilosPorEstado.DISPONIBLE),
        };
    };

    return (
        <span style={getEstilos()} className={className}>
            {estado}
        </span>
    );
};

export default EstadoBadge;
