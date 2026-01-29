'use client';

interface Arrendador {
  nombre: string;
  telefono: string;
  email: string;
}

interface PropertyContactProps {
  priceLabel: string;
  arrendador: Arrendador;
}

const PriceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

export default function PropertyContact({ priceLabel, arrendador }: PropertyContactProps) {
  return (
    <div>
      {/* Precio */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-inner">
            <div className="stat-content">
              <p className="stat-label">Precio Mensual</p>
              <h3 className="stat-value">{priceLabel}</h3>
              <p className="stat-change positive">Disponible para arriendo</p>
            </div>
            <div className="stat-icon purple">
              <PriceIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="dashboard-card">
        <h2 className="card-title">Información de contacto</h2>
        <div style={{ marginTop: '1rem' }}>
          <div className="activity-item">
            <div className="activity-icon success">
              <UserIcon />
            </div>
            <div className="activity-content">
              <h3 className="activity-title">{arrendador.nombre}</h3>
              <p className="activity-description">Arrendador</p>
            </div>
          </div>

          {arrendador.telefono && (
            <a
              href={`tel:${arrendador.telefono}`}
              className="quick-action-btn secondary"
              style={{ width: '100%', marginTop: '1rem', textDecoration: 'none' }}
            >
              <PhoneIcon />
              {arrendador.telefono}
            </a>
          )}

          {arrendador.email && (
            <a
              href={`mailto:${arrendador.email}`}
              className="quick-action-btn secondary"
              style={{ width: '100%', marginTop: '0.75rem', textDecoration: 'none' }}
            >
              <EmailIcon />
              {arrendador.email}
            </a>
          )}

          <button className="quick-action-btn" style={{ width: '100%', marginTop: '1rem' }}>
            Contactar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
