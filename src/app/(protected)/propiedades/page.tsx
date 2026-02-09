'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propiedadesApi } from '@/lib/api/propiedades.api';
import { VerificationGuard } from '@/components/guards/VerificationGuard';

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos',
    precioMin: '',
    precioMax: '',
    amoblado: 'todos'
  });

  // Cargar MIS propiedades al montar
  useEffect(() => {
    const cargarPropiedades = async () => {
      try {
        setLoading(true);
        // Usar misPropiedades() para obtener solo las del usuario
        const response = await propiedadesApi.misPropiedades();

        // La API puede devolver un objeto con data o directamente un array
        const data = Array.isArray(response) ? response : (response as any)?.data || [];

        setPropiedades(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar propiedades:', err);
        // Si hay error con la API, usar datos vacíos por ahora
        setPropiedades([]);
        setError(err.message || 'No se pudieron cargar las propiedades. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    cargarPropiedades();
  }, []);

  // Filtrar propiedades
  const propiedadesFiltradas = propiedades.filter(prop => {
    const matchSearch = !filters.search ||
      prop.titulo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      prop.direccion?.toLowerCase().includes(filters.search.toLowerCase());

    const matchEstado = filters.estado === 'todos' ||
      prop.estado?.nombre === filters.estado;

    const matchPrecio = (!filters.precioMin || prop.precioMensual >= Number(filters.precioMin)) &&
      (!filters.precioMax || prop.precioMensual <= Number(filters.precioMax));

    const matchAmoblado = filters.amoblado === 'todos' ||
      (filters.amoblado === 'si' ? prop.esAmoblado : !prop.esAmoblado);

    return matchSearch && matchEstado && matchPrecio && matchAmoblado;
  });

  return (
    <VerificationGuard>
      <div className="propiedades-container">
        {/* Header */}
        <div className="propiedades-header">
          <div>
            <h1 className="propiedades-title">Mis Propiedades</h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Gestiona tus propiedades publicadas
            </p>
          </div>
          <Link href="/mis-propiedades" className="btn-nuevo">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Propiedad
          </Link>
        </div>

        {/* Filtros */}
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <input
              type="text"
              placeholder="Buscar por título o dirección..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />

            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>

            <input
              type="number"
              placeholder="Precio mínimo"
              value={filters.precioMin}
              onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />

            <input
              type="number"
              placeholder="Precio máximo"
              value={filters.precioMax}
              onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />

            <select
              value={filters.amoblado}
              onChange={(e) => setFilters({ ...filters, amoblado: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="todos">Amoblado/No amoblado</option>
              <option value="si">Amoblado</option>
              <option value="no">No amoblado</option>
            </select>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#6b7280' }}>Cargando propiedades...</p>
          </div>
        ) : error ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="quick-action-btn"
            >
              Reintentar
            </button>
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ margin: '0 auto 1.5rem', color: '#9ca3af' }}
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              {propiedades.length === 0 ? 'No tienes propiedades publicadas' : 'No se encontraron propiedades'}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {propiedades.length === 0
                ? 'Comienza publicando tu primera propiedad'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
            {propiedades.length === 0 ? (
              <Link href="/mis-propiedades" className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Publicar Propiedad
              </Link>
            ) : (
              <button
                onClick={() => setFilters({ search: '', estado: 'todos', precioMin: '', precioMax: '', amoblado: 'todos' })}
                className="quick-action-btn secondary"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {propiedadesFiltradas.map((prop) => (
              <div key={prop.id} className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Imagen */}
                <div style={{
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  backgroundImage: prop.imagenes?.[0] ? `url(${prop.imagenes[0]})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: prop.estado?.nombre === 'disponible' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {prop.estado?.nombre || 'Sin estado'}
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    {prop.titulo || 'Sin título'}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                    📍 {prop.direccion || 'Sin dirección'}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brand-primary)' }}>
                      ${prop.precioMensual || 0}/mes
                    </span>
                    <Link
                      href={`/propiedades/${prop.id}/editar`}
                      className="quick-action-btn secondary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .propiedades-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .propiedades-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .propiedades-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
        }

        .btn-nuevo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--brand-primary);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-nuevo:hover {
          background: var(--brand-primary-dark);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .propiedades-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .btn-nuevo {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </VerificationGuard>
  );
}