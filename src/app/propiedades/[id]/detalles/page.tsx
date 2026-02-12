'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  getPropertyImage,
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Normalizar datos
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

        if (!data) {
          throw new Error('Propiedad no encontrada');
        }

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
        <div className="dashboard-container">
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>
              Cargando detalles de la propiedad...
            </p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error || !propiedad) {
    const errorContent = (
      <div className="dashboard-container">
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 className="card-title" style={{ color: '#ef4444', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error || 'Propiedad no encontrada'}</p>
          <button onClick={() => router.push('/')} className="quick-action-btn">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );

    if (isAuthenticated) {
      return (
        <AppShell>
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
            {errorContent}
          </div>
        </AppShell>
      );
    }

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
        <PublicTopBar />
        {errorContent}
      </div>
    );
  }

  const title = getPropertyTitle(propiedad);
  const location = getPropertyLocation(propiedad);
  const mainImage = getPropertyImage(propiedad);
  const estado = getPropertyStatus(propiedad);
  const priceLabel = getPropertyPriceLabel(propiedad);
  const amenities = getPropertyAmenities(propiedad);

  // Verificar si tiene coordenadas
  const hasCoordinates = !!(
    propiedad.lat &&
    propiedad.lng &&
    !isNaN(Number(propiedad.lat)) &&
    !isNaN(Number(propiedad.lng))
  );

  // Componente para badge de estado
  const EstadoBadge = ({ estado }: { estado: string }) => (
    <span className={`badge ${estado.toLowerCase()}`}>
      {estado}
    </span>
  );

  // Obtener todas las imágenes si existen
  const images = propiedad.imagenes || propiedad.images || [mainImage];
  const selectedImage = images[selectedImageIndex] || mainImage;

  // Información adicional
  const descripcion = propiedad.descripcion || propiedad.description ||
    'Esta es una propiedad disponible para arriendo en excelente ubicación.';

  const superficie = propiedad.superficie || propiedad.area || propiedad.metros_cuadrados;
  const habitaciones = propiedad.habitaciones || propiedad.bedrooms || propiedad.rooms;
  const banos = propiedad.banos || propiedad.bathrooms || propiedad.banios;
  const garaje = propiedad.garaje || propiedad.parking || propiedad.estacionamiento;

  // Contacto del arrendador
  const arrendadorNombre = propiedad.arrendador?.nombre ||
    propiedad.arrendador?.name ||
    'Arrendador disponible';

  const arrendadorTelefono = propiedad.arrendador?.telefono ||
    propiedad.arrendador?.phone ||
    propiedad.arrendador?.celular;

  const arrendadorEmail = propiedad.arrendador?.email ||
    propiedad.arrendador?.correo;

  const pageContent = (
    <div className="dashboard-container">
      {/* Header con botón volver */}
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => router.back()}
          className="quick-action-btn secondary"
          style={{ marginBottom: '1rem' }}
        >
          ← Volver
        </button>
        <h1 className="dashboard-title">{title}</h1>
        <p className="dashboard-subtitle">📍 {location}</p>
      </div>

      {/* Galería de imágenes */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="property-gallery">
          <div className="gallery-main">
            <Image
              src={selectedImage}
              alt={title}
              fill
              className="gallery-main-image"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="gallery-badge">
              <EstadoBadge estado={estado} />
            </div>
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`gallery-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                >
                  <Image
                    src={img}
                    alt={`${title} - Imagen ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de 2 columnas: Info principal + Precio/Características */}
      <div className="dashboard-content" style={{ marginBottom: '1.5rem' }}>
        {/* Columna Izquierda: Descripción y Amenidades */}
        <div>
          {/* Precio destacado */}
          <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-content">
                  <p className="stat-label">Precio Mensual</p>
                  <h3 className="stat-value">{priceLabel}</h3>
                  <p className="stat-change positive">Disponible para arriendo</p>
                </div>
                <div className="stat-icon purple">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Galería */}
        <PropertyGallery
          images={propiedad.images || []}
          title={propiedad.title || 'Propiedad'}
          estado={typeof propiedad.estado === 'string' ? propiedad.estado : 'DISPONIBLE'}
        />

        {/* Layout responsive: Desktop side-by-side, Mobile stacked */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Columna principal - Información */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <PropertyInfo
              descripcion={propiedad.descripcion || 'Sin descripción disponible.'}
              amenities={propiedad.amenities || []}
              superficie={propiedad.superficie}
              habitaciones={propiedad.habitaciones}
              banos={propiedad.banos}
              garaje={propiedad.garaje}
            />

            {/* Información adicional */}
            {(propiedad.esAmoblado !== undefined || propiedad.createdAt) && (
              <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
                <h2 className="card-title">Información adicional</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  {propiedad.esAmoblado !== undefined && (
                    <div className="activity-item" style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="activity-icon blue" style={{ flexShrink: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="activity-title" style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                            {propiedad.esAmoblado ? '✓ Amoblada' : 'Sin amoblar'}
                          </h3>
                          <p className="activity-description" style={{ fontSize: '0.85rem' }}>
                            {propiedad.esAmoblado ? 'Incluye muebles' : 'No incluye muebles'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {propiedad.createdAt && (
                    <div className="activity-item" style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="activity-icon green" style={{ flexShrink: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="activity-title" style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                            Publicado
                          </h3>
                          <p className="activity-description" style={{ fontSize: '0.85rem' }}>
                            {new Date(propiedad.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contacto (sticky en desktop) */}
          <div style={{
            position: 'sticky',
            top: '2rem',
            alignSelf: 'flex-start',
            minWidth: '280px'
          }}>
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
          </div>
        </div>

        {/* Mapa con pin fijo */}
        {hasCoordinates ? (
          <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="#2d5a4c">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h2 className="card-title" style={{ margin: 0 }}>Ubicación exacta</h2>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {propiedad.location}
            </p>
            <div style={{
              height: '500px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <MapDetail
                lat={Number(propiedad.lat)}
                lng={Number(propiedad.lng)}
                title={propiedad.title || 'Propiedad'}
                address={propiedad.location || ''}
              />
            </div>
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#16a34a">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p style={{ color: '#16a34a', margin: 0, fontSize: '0.9rem' }}>
                <strong>Tip:</strong> Puedes hacer zoom para ver mejor la zona. El pin marca la ubicación exacta.
              </p>
            </div>
          </div>
        ) : (
          <div className="dashboard-card" style={{
            border: '2px solid #fbbf24',
            backgroundColor: '#fffbeb',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="28" height="28" viewBox="0 0 20 20" fill="#f59e0b">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p style={{ color: '#92400e', margin: 0, fontWeight: 600 }}>
                  Ubicación no disponible
                </p>
                <p style={{ color: '#92400e', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                  Las coordenadas de esta propiedad no están registradas en el sistema.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <LayoutWrapper isAuthenticated={isAuthenticated}>
      {pageContent}
    </LayoutWrapper>
  );
}

// Layout wrapper component
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
