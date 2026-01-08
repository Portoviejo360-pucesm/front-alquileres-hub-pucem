'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ArrendadorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Datos mock
  const [arrendador] = useState({
    id: parseInt(id),
    nombre: 'Juan Pérez García',
    cedula: '1234567890',
    email: 'juan.perez@email.com',
    telefono: '0987654321',
    direccion: 'Av. Principal #123',
    ciudad: 'Portoviejo',
    verificado: true,
    fechaRegistro: '2024-01-15',
    observaciones: 'Arrendador confiable con buen historial.',
    propiedades: [
      { id: 1, titulo: 'Departamento Centro', estado: 'Disponible' },
      { id: 2, titulo: 'Casa en Los Tamarindos', estado: 'Ocupada' },
      { id: 3, titulo: 'Local Comercial', estado: 'Disponible' }
    ]
  });

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar este arrendador? Esta acción no se puede deshacer.')) {
      // TODO: Llamar al API para eliminar
      console.log('Eliminar arrendador:', id);
      router.push('/arrendadores');
    }
  };

  return (
    <div className="detail-container">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-section">
          <h1 className="detail-title">{arrendador.nombre}</h1>
          <p className="detail-subtitle">
            Registrado el {new Date(arrendador.fechaRegistro).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="detail-actions">
          <Link href={`/arrendadores/${id}/edit`} className="btn-editar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar
          </Link>
          <button onClick={handleDelete} className="btn-eliminar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Grid de información */}
      <div className="detail-grid">
        {/* Información Personal */}
        <div className="detail-card">
          <h3 className="detail-card-title">Información Personal</h3>
          
          <div className="detail-field">
            <div className="detail-label">Cédula</div>
            <div className="detail-value">{arrendador.cedula}</div>
          </div>

          <div className="detail-field">
            <div className="detail-label">Email</div>
            <div className="detail-value">{arrendador.email}</div>
          </div>

          <div className="detail-field">
            <div className="detail-label">Teléfono</div>
            <div className="detail-value">{arrendador.telefono}</div>
          </div>

          <div className="detail-field">
            <div className="detail-label">Estado</div>
            <div className="detail-value">
              <span className={`badge ${arrendador.verificado ? 'verificado' : 'pendiente'}`}>
                {arrendador.verificado ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="detail-card">
          <h3 className="detail-card-title">Ubicación</h3>
          
          <div className="detail-field">
            <div className="detail-label">Dirección</div>
            <div className="detail-value">{arrendador.direccion}</div>
          </div>

          <div className="detail-field">
            <div className="detail-label">Ciudad</div>
            <div className="detail-value">{arrendador.ciudad}</div>
          </div>
        </div>

        {/* Observaciones */}
        {arrendador.observaciones && (
          <div className="detail-card full">
            <h3 className="detail-card-title">Observaciones</h3>
            <div className="detail-value">{arrendador.observaciones}</div>
          </div>
        )}

        {/* Propiedades */}
        <div className="detail-card full">
          <h3 className="detail-card-title">
            Propiedades ({arrendador.propiedades.length})
          </h3>
          
          {arrendador.propiedades.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {arrendador.propiedades.map(prop => (
                <Link
                  key={prop.id}
                  href={`/propiedades/${prop.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-dark)' }}>
                    {prop.titulo}
                  </span>
                  <span className={`badge ${prop.estado === 'Disponible' ? 'verificado' : 'pendiente'}`}>
                    {prop.estado}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              No hay propiedades registradas para este arrendador.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}