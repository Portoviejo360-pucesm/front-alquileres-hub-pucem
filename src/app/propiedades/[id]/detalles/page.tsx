'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PublicTopBar from '@/components/layout/PublicTopBar';
import AppShell from '@/components/layout/AppShell';
import MapDetail from '@/components/MapDetail';
import PropertyGallery from '@/components/propiedades/PropertyGallery';
import PropertyInfo from '@/components/propiedades/PropertyInfo';
import PropertyContact from '@/components/propiedades/PropertyContact';
import { useAuthStore } from '@/store/auth.store';
import { propiedadesApi } from '@/lib/api/propiedades.api';
import {
  sanitizeProperty,
  getPropertyTitle,
  getPropertyLocation,
  getPropertyStatus,
  getPropertyPriceLabel,
  getPropertyAmenities
} from '@/lib/utils/propertyHelpers';
import type { Propiedad } from '@/types/propiedad';

export default function PropiedadDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();

  const [rawPropiedad, setRawPropiedad] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const propiedad = useMemo(() => {
    return rawPropiedad ? sanitizeProperty(rawPropiedad) : null;
  }, [rawPropiedad]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const fetchPropiedad = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await propiedadesApi.obtenerPorId(params.id as string);
        if (!data) throw new Error('Propiedad no encontrada');
        setRawPropiedad(data);
      } catch (err) {
        console.error('Error fetching propiedad:', err);
        setError('No se pudo cargar la propiedad. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedad();
  }, [params.id]);

  if (loading) {
    return (
      <LayoutWrapper isAuthenticated={isAuthenticated}>
        <div className="detail-page">
          <div className="detail-loading">
            <div className="spinner" />
            <p>Cargando detalles...</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error || !propiedad) {
    return (
      <LayoutWrapper isAuthenticated={isAuthenticated}>
        <div className="detail-page">
          <div className="detail-error">
            <p className="detail-error-text">{error || 'Propiedad no encontrada'}</p>
            <button onClick={() => router.push('/')} className="detail-btn-back">
              Volver al inicio
            </button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const title = getPropertyTitle(propiedad);
  const location = getPropertyLocation(propiedad);
  const estado = getPropertyStatus(propiedad);
  const amenities = getPropertyAmenities(propiedad);

  const hasCoordinates = !!(
    propiedad.lat && propiedad.lng &&
    !isNaN(Number(propiedad.lat)) && !isNaN(Number(propiedad.lng))
  );

  const pageContent = (
    <div className="detail-page">
      {/* Back + Title */}
      <div className="detail-header">
        <button onClick={() => router.back()} className="detail-btn-back">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </button>
        <div>
          <h1 className="detail-title">{title}</h1>
          <p className="detail-location">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#2E5E4E">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {location}
          </p>
        </div>
      </div>

      {/* Carousel */}
      <PropertyGallery
        images={propiedad.images || []}
        title={title}
        estado={estado}
      />

      {/* 2-column layout: Info + Contact/Map */}
      <div className="detail-grid">
        {/* Left column: Price + Description + Amenities + Extra */}
        <div className="detail-main">
          {/* Price banner */}
          <div className="detail-card detail-price-banner">
            <div className="detail-price-row">
              <div>
                <span className="detail-price-label">Precio Mensual</span>
                <span className="detail-price-value">{propiedad.priceLabel || '$0.00'}</span>
              </div>
              <span className="detail-price-badge">
                {estado === 'DISPONIBLE' ? 'Disponible' : estado}
              </span>
            </div>
          </div>

          <PropertyInfo
            descripcion={propiedad.descripcion || 'Sin descripcion disponible.'}
            amenities={propiedad.amenities || []}
            superficie={propiedad.superficie}
            habitaciones={propiedad.habitaciones}
            banos={propiedad.banos}
            garaje={propiedad.garaje}
          />

          {/* Additional info */}
          {(propiedad.esAmoblado !== undefined || propiedad.createdAt) && (
            <div className="detail-card" style={{ marginTop: '1rem' }}>
              <h3 className="detail-section-title">Informacion adicional</h3>
              <div className="detail-extra-grid">
                {propiedad.esAmoblado !== undefined && (
                  <div className="detail-extra-item">
                    <span className="detail-extra-icon">
                      {propiedad.esAmoblado ? '🛋️' : '📦'}
                    </span>
                    <div>
                      <strong>{propiedad.esAmoblado ? 'Amoblada' : 'Sin amoblar'}</strong>
                      <p>{propiedad.esAmoblado ? 'Incluye muebles' : 'No incluye muebles'}</p>
                    </div>
                  </div>
                )}
                {propiedad.createdAt && (
                  <div className="detail-extra-item">
                    <span className="detail-extra-icon">📅</span>
                    <div>
                      <strong>Publicado</strong>
                      <p>{new Date(propiedad.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Contact + Map */}
        <div className="detail-sidebar">
          <PropertyContact
            propiedadId={Number(propiedad.id)}
            propiedadTitulo={title}
            priceLabel={propiedad.priceLabel || '$0.00'}
            arrendador={{
              nombre: propiedad.arrendador?.nombre || 'Arrendador disponible',
              telefono: propiedad.arrendador?.telefono || '',
              email: propiedad.arrendador?.email || '',
            }}
          />

          {/* Map */}
          {hasCoordinates && (
            <div className="detail-card detail-map-card">
              <h3 className="detail-section-title">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="#2E5E4E">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Ubicacion
              </h3>
              <p className="detail-map-address">{propiedad.location}</p>
              <div className="detail-map-container">
                <MapDetail
                  lat={Number(propiedad.lat)}
                  lng={Number(propiedad.lng)}
                  title={title}
                  address={propiedad.location || ''}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <LayoutWrapper isAuthenticated={isAuthenticated}>
      {pageContent}
    </LayoutWrapper>
  );
}

function LayoutWrapper({
  children,
  isAuthenticated
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const content = (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
      {!isAuthenticated && <PublicTopBar />}
      {children}
    </div>
  );

  return isAuthenticated ? <AppShell>{content}</AppShell> : content;
}
