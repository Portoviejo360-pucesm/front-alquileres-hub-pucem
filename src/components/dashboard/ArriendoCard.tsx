import Link from 'next/link';
import { Arriendo } from '@/types/dashboard';
import { getEstadoBadgeClass, formatFecha } from '@/utils/dashboardHelpers';

interface ArriendoCardProps {
  arriendo: Arriendo;
}

export default function ArriendoCard({ arriendo }: ArriendoCardProps) {
  return (
    <div className="dashboard-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ flex: 1 }}>
          <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
            {arriendo.propiedad.titulo}
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {arriendo.propiedad.direccion}
          </p>
        </div>
        <span className={`badge ${getEstadoBadgeClass(arriendo.estado)}`} style={{ flexShrink: 0 }}>
          {arriendo.estado}
        </span>
      </div>

      {/* Info */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div className="info-box">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div style={{ fontSize: '0.875rem' }}>
            <span className="info-label">Período</span>
            <span className="info-value">
              {formatFecha(arriendo.fechaInicio)} - {formatFecha(arriendo.fechaFin)}
            </span>
          </div>
        </div>

        <div className="info-box">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <div style={{ fontSize: '0.875rem' }}>
            <span className="info-label">Arrendador</span>
            <span className="info-value">{arriendo.arrendador.nombre}</span>
          </div>
        </div>

        <div className="info-box-precio">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          </svg>
          <div style={{ fontSize: '0.875rem' }}>
            <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Renta mensual</span>
            <span style={{ color: '#166534', fontWeight: '700', fontSize: '1.125rem' }}>
              ${Number(arriendo.precioMensual || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link 
          href={`/alquileres/${arriendo.id}/contrato`}
          className="quick-action-btn secondary"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem'
          }}
        >
          <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          Contrato
        </Link>
        <Link 
          href={`/propiedades/${arriendo.propiedad.id}/detalles`}
          className="quick-action-btn"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem'
          }}
        >
          <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}
