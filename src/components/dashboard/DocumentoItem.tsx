import { Documento } from '@/types/dashboard';
import { formatFechaCompleta } from '@/utils/dashboardHelpers';
import { getDocumentoIcon } from './icons';

interface DocumentoItemProps {
  documento: Documento;
  index: number;
}

export default function DocumentoItem({ documento, index }: DocumentoItemProps) {
  const colorClass = documento.tipo === 'Contrato' ? 'blue' : documento.tipo === 'Pago' ? 'green' : 'purple';

  const handleDescargar = () => {
    if (documento.url) {
      window.open(documento.url, '_blank');
    }
  };

  return (
    <div 
      className="activity-item"
      style={{
        padding: '1rem',
        background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #f3f4f6'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={`activity-icon ${colorClass}`}>
            {getDocumentoIcon(documento.tipo)}
          </div>
          <div>
            <h3 className="activity-title" style={{ marginBottom: '0.25rem' }}>
              {documento.nombre}
            </h3>
            {(documento.arrendadorNombre || documento.propiedadDireccion) && (
              <p className="activity-description" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {documento.arrendadorNombre && `Arrendador: ${documento.arrendadorNombre}`}
                {documento.propiedadDireccion && ` • ${documento.propiedadDireccion}`}
              </p>
            )}
            <p className="activity-time" style={{ fontSize: '0.75rem' }}>
              {formatFechaCompleta(documento.fecha)}
            </p>
          </div>
        </div>
        <button 
          className="quick-action-btn secondary"
          onClick={handleDescargar}
          disabled={!documento.url}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            opacity: documento.url ? 1 : 0.5,
            cursor: documento.url ? 'pointer' : 'not-allowed'
          }}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Descargar
        </button>
      </div>
    </div>
  );
}
