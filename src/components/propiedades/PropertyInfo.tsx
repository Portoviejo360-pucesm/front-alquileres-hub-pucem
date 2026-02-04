'use client';

interface PropertyInfoProps {
  descripcion: string;
  amenities: string[];
  superficie?: number;
  habitaciones?: number;
  banos?: number;
  garaje?: boolean | string | number;
}

interface Caracteristica {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const AreaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
  </svg>
);

const RoomsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const BathIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ParkingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
  </svg>
);

function formatGarajeValue(garaje: boolean | string | number): string {
  if (typeof garaje === 'boolean') return 'Sí';
  return String(garaje);
}

export default function PropertyInfo({
  descripcion,
  amenities,
  superficie,
  habitaciones,
  banos,
  garaje,
}: PropertyInfoProps) {
  const caracteristicas: Caracteristica[] = [];

  if (superficie) {
    caracteristicas.push({
      label: 'Superficie',
      value: `${superficie} m²`,
      icon: <AreaIcon />,
      color: 'blue',
    });
  }

  if (habitaciones) {
    caracteristicas.push({
      label: 'Habitaciones',
      value: habitaciones,
      icon: <RoomsIcon />,
      color: 'green',
    });
  }

  if (banos) {
    caracteristicas.push({
      label: 'Baños',
      value: banos,
      icon: <BathIcon />,
      color: 'orange',
    });
  }

  if (garaje) {
    caracteristicas.push({
      label: 'Garaje',
      value: formatGarajeValue(garaje),
      icon: <ParkingIcon />,
      color: 'purple',
    });
  }

  const hasCaracteristicas = caracteristicas.length > 0;
  const hasAmenities = amenities.length > 0;

  return (
    <div>
      {/* Descripción */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">Descripción</h2>
        <p style={{ color: '#6b7280', lineHeight: '1.6', margin: '1rem 0 0 0' }}>
          {descripcion}
        </p>
      </div>

      {/* Características */}
      {hasCaracteristicas && (
        <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Características</h2>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
            {caracteristicas.map((caracteristica) => (
              <div key={caracteristica.label} className="stat-card">
                <div className="stat-card-inner">
                  <div className="stat-content">
                    <p className="stat-label">{caracteristica.label}</p>
                    <h3 className="stat-value">{caracteristica.value}</h3>
                  </div>
                  <div className={`stat-icon ${caracteristica.color}`}>
                    {caracteristica.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenidades */}
      {hasAmenities && (
        <div className="dashboard-card">
          <h2 className="card-title">Amenidades</h2>
          <div className="amenities-grid">
            {amenities.map((amenity) => (
              <div key={amenity} className="amenity-badge">
                ✓ {amenity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
