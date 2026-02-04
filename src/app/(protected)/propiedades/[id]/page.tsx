'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { propiedadesApi } from '@/lib/api/propiedades.api';
import { Propiedad } from '@/types/propiedad';
import {
  getPropertyTitle,
  getPropertyLocation,
  getPropertyStatus,
  getPropertyPriceLabel,
  getPropertyAmenities
} from '@/lib/utils/propertyHelpers';
import EstadoBadge from '@/components/propiedades/EstadoBadge';

export default function PropiedadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propiedadesApi.obtenerPorId(id);
        if (!data) {
          throw new Error('Propiedad no encontrada');
        }
        setPropiedad(data);
      } catch (err) {
        console.error('Error fetching propiedad:', err);
        setError('No se pudo cargar la propiedad. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropiedad();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      try {
        await propiedadesApi.eliminar(id);
        router.push('/propiedades');
      } catch (err) {
        console.error('Error deleting propiedad:', err);
        alert('No se pudo eliminar la propiedad.');
      }
    }
  };

  if (loading) {
    return (
      <div className="propiedad-detail-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Cargando datos de la propiedad...</p>
      </div>
    );
  }

  if (error || !propiedad) {
    return (
      <div className="propiedad-detail-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error || 'Propiedad no encontrada'}</p>
        <button onClick={() => router.push('/propiedades')} className="btn-editar" style={{ margin: '0 auto', display: 'block' }}>
          Volver a mis propiedades
        </button>
      </div>
    );
  }

  const title = getPropertyTitle(propiedad);
  const location = getPropertyLocation(propiedad);
  const priceLabel = getPropertyPriceLabel(propiedad);
  const amenities = getPropertyAmenities(propiedad);
  const estado = getPropertyStatus(propiedad);

  return (
    <div className="propiedad-detail-container">
      {/* Header */}
      <div className="propiedad-detail-header">
        <div className="detail-title-section">
          <h1 className="detail-title">{title}</h1>
          <p className="detail-subtitle">
            📍 {location}
          </p>
        </div>

        <div className="detail-actions">
          <Link href={`/propiedades/${id}/edit`} className="btn-editar">
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

      {/* Grid de contenido */}
      <div className="propiedad-detail-grid">
        {/* Columna principal */}
        <div className="propiedad-detail-main">
          {/* Descripción */}
          <div className="info-card">
            <h3 className="info-card-title">Descripción</h3>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              {propiedad.descripcion || propiedad.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Detalles */}
          <div className="info-card">
            <h3 className="info-card-title">Detalles de la Propiedad</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-label">Estado</div>
                <div className="info-item-value">
                  <EstadoBadge estado={estado} />
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Amoblado</div>
                <div className="info-item-value">
                  {propiedad.esAmoblado ? 'Sí' : 'No'}
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Superficie</div>
                <div className="info-item-value">
                  {propiedad.superficie || propiedad.area || propiedad.metros_cuadrados || '--'} m²
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Habitaciones</div>
                <div className="info-item-value">
                  {propiedad.habitaciones || propiedad.bedrooms || propiedad.rooms || '--'}
                </div>
              </div>
            </div>
          </div>

          {/* Servicios / Amenidades */}
          <div className="info-card">
            <h3 className="info-card-title">Amenidades</h3>
            <div className="servicios-list">
              {amenities.length > 0 ? (
                amenities.map((amenity, index) => (
                  <div key={index} className="servicio-badge incluido">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {amenity}
                  </div>
                ))
              ) : (
                <p style={{ color: '#6b7280' }}>No se especificaron amenidades.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="propiedad-detail-sidebar">
          {/* Precio */}
          <div className="price-card">
            <div className="price-card-amount">{priceLabel}</div>
            <div className="price-card-period">por mes</div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
              ID de Referencia: {id}
            </p>
          </div>

          {/* Información del arrendador */}
          <div className="info-card">
            <h3 className="info-card-title">Arrendador</h3>
            <div className="info-item" style={{ marginBottom: '12px' }}>
              <div className="info-item-label">Nombre</div>
              <div className="info-item-value">{propiedad.arrendador?.nombre || propiedad.arrendador?.name || 'Cargando...'}</div>
            </div>
            <div className="info-item" style={{ marginBottom: '12px' }}>
              <div className="info-item-label">Teléfono</div>
              <div className="info-item-value">{propiedad.arrendador?.telefono || propiedad.arrendador?.phone || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
