import Link from 'next/link';

interface EmptyStateProps {
  tipo: 'arriendos' | 'documentos';
}

export default function EmptyState({ tipo }: EmptyStateProps) {
  const config = {
    arriendos: {
      icon: (
        <svg className="text-gray-400" width="40" height="40" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      titulo: 'No tienes arriendos activos',
      descripcion: 'Explora propiedades disponibles y encuentra tu hogar ideal',
      boton: {
        texto: 'Buscar Propiedades',
        href: '/propiedades',
        icon: (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        )
      }
    },
    documentos: {
      icon: (
        <svg className="text-gray-400" width="40" height="40" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      titulo: 'No tienes documentos',
      descripcion: 'Tus contratos y documentos aparecerán aquí',
      boton: null
    }
  };

  const { icon, titulo, descripcion, boton } = config[tipo];
  const padding = tipo === 'arriendos' ? '4rem 2rem' : '3rem 2rem';

  return (
    <div className="dashboard-card" style={{ 
      textAlign: 'center', 
      padding,
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
        background: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{titulo}</h3>
      <p className="text-gray-600 mb-6">{descripcion}</p>
      {boton && (
        <Link href={boton.href} className="quick-action-btn" style={{ display: 'inline-flex' }}>
          {boton.icon}
          {boton.texto}
        </Link>
      )}
    </div>
  );
}
