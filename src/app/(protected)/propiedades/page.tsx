
// (protected)/propiedades/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propiedadesApi } from '@/lib/api/propiedades.api';

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

  // Cargar propiedades del usuario al montar
  useEffect(() => {
    const cargarPropiedades = async () => {
      try {
        setLoading(true);
        const data = await propiedadesApi.misPropiedades();
        setPropiedades(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar propiedades:', err);
        setError(err.message || 'Error al cargar propiedades');
      } finally {
        setLoading(false);
      }
    };

    cargarPropiedades();
  }, []);

  // Filtrar propiedades
  const propiedadesFiltradas = propiedades.filter(prop => {
    const matchSearch =
      prop.tituloAnuncio?.toLowerCase().includes(filters.search.toLowerCase()) ||
      prop.direccion?.toLowerCase().includes(filters.search.toLowerCase());

    const matchEstado =
      filters.estado === 'todos' || prop.estado?.nombre === filters.estado;

    const matchPrecioMin =
      !filters.precioMin || prop.precioMensual >= parseFloat(filters.precioMin);

    const matchPrecioMax =
      !filters.precioMax || prop.precioMensual <= parseFloat(filters.precioMax);

    const matchAmoblado =
      filters.amoblado === 'todos' ||
      (filters.amoblado === 'si' && prop.esAmoblado) ||
      (filters.amoblado === 'no' && !prop.esAmoblado);

    return matchSearch && matchEstado && matchPrecioMin && matchPrecioMax && matchAmoblado;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getEstadoBadgeText = (estado: string) => {
    const estados: Record<string, string> = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      mantenimiento: 'Mantenimiento'
    };
    return estados[estado] || estado;
  };

  if (loading) {
    return (
      <div className="propiedades-container">
        <div className="propiedades-header">
          <h1 className="propiedades-title">Propiedades</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="propiedades-container">
        <div className="propiedades-header">
          <h1 className="propiedades-title">Propiedades</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="propiedades-container">
      {/* Header */}
      <div className="propiedades-header">
        <h1 className="propiedades-title">Propiedades</h1>
        <Link href="/propiedades/new" className="btn-nuevo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva Propiedad
        </Link>
      </div>

      {/* Filtros */}
      <div className="propiedades-filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Buscar</label>
            <input
              type="text"
              name="search"
              placeholder="Título o dirección..."
              className="filter-input"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Estado</label>
            <select
              name="estado"
              className="filter-select"
              value={filters.estado}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Precio Mínimo</label>
            <input
              type="number"
              name="precioMin"
              placeholder="$0"
              className="filter-input"
              value={filters.precioMin}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Precio Máximo</label>
            <input
              type="number"
              name="precioMax"
              placeholder="$1000"
              className="filter-input"
              value={filters.precioMax}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Amoblado</label>
            <select
              name="amoblado"
              className="filter-select"
              value={filters.amoblado}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de propiedades */}
      <div className="propiedades-grid">
        {propiedadesFiltradas.length > 0 ? (
          propiedadesFiltradas.map((propiedad) => (
            <Link
              key={propiedad.id}
              href={`/propiedades/${propiedad.id}`}
              className="propiedad-card"
            >
              <div className="propiedad-image">
                SIN FOTO
                <div className="propiedad-badge-container">
                  <span className={`propiedad-badge ${propiedad.estado?.nombre}`}>
                    {getEstadoBadgeText(propiedad.estado?.nombre || '')}
                  </span>
                  {propiedad.esAmoblado && (
                    <span className="propiedad-badge amoblado">Amoblado</span>
                  )}
                </div>
              </div>

              <div className="propiedad-content">
                <h3 className="propiedad-title">{propiedad.tituloAnuncio}</h3>

                <div className="propiedad-location">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {propiedad.direccion || 'Portoviejo'}
                </div>

                <p className="propiedad-description">{propiedad.descripcion}</p>

                <div className="propiedad-footer">
                  <div>
                    <div className="propiedad-price">
                      ${propiedad.precioMensual}
                      <span className="propiedad-price-label">/mes</span>
                    </div>
                  </div>

                  <div className="propiedad-actions">
                    <button
                      className="btn-icon view"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/propiedades/${propiedad.id}`;
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon edit"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/propiedades/${propiedad.id}/edit`;
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="empty-state-title">No se encontraron propiedades</h3>
            <p className="empty-state-text">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}