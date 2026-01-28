'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PublicTopBar from '@/components/layout/PublicTopBar';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/store/auth.store';
import { Propiedad } from '@/types/propiedad';
// 🚨 TEMPORAL: Comentar API y usar datos mock
import { propiedadesApi } from '@/lib/api/propiedades.api';
// import { MOCK_PROPIEDADES } from '@/lib/mockData';
// 🚨 FIN TEMPORAL
import MapWrapper from '@/components/MapWrapper';
import EstadoBadge from '@/components/propiedades/EstadoBadge';
import {
  getPropertyTitle,
  getPropertyLocation,
  getPropertyImage,
  getPropertyStatus,
  getPropertyPriceLabel,
  getPropertyAmenities,
} from '@/lib/utils/propertyHelpers';

export default function PropiedadDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🚨 TEMPORAL: Buscar en datos mock en lugar de API
        const data = await propiedadesApi.obtenerPorId(params.id as string);
        // const data = MOCK_PROPIEDADES.find(p => p.id === params.id);
        if (!data) {
          throw new Error('Propiedad no encontrada');
        }
        // 🚨 FIN TEMPORAL
        
        setPropiedad(data);
      } catch (err) {
        console.error('Error fetching propiedad:', err);
        setError('No se pudo cargar la propiedad. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPropiedad();
    }
  }, [params.id]);

  if (loading) {
    const loadingContent = (
      <div className="dashboard-container">
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Cargando propiedad...</p>
        </div>
      </div>
    );

    if (isAuthenticated) {
      return (
        <AppShell>
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
            {loadingContent}
          </div>
        </AppShell>
      );
    }

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
        <PublicTopBar />
        {loadingContent}
      </div>
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

          {/* Descripción */}
          <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">Descripción</h2>
            <p style={{ color: '#6b7280', lineHeight: '1.6', margin: '1rem 0 0 0' }}>
              {descripcion}
            </p>
          </div>

          {/* Amenidades */}
          {amenities.length > 0 && (
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

        {/* Columna Derecha: Características y Contacto */}
        <div>
          {/* Características principales */}
          <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">Características</h2>
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
              {superficie && (
                <div className="stat-card">
                  <div className="stat-card-inner">
                    <div className="stat-content">
                      <p className="stat-label">Superficie</p>
                      <h3 className="stat-value">{superficie} m²</h3>
                    </div>
                    <div className="stat-icon blue">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {habitaciones && (
                <div className="stat-card">
                  <div className="stat-card-inner">
                    <div className="stat-content">
                      <p className="stat-label">Habitaciones</p>
                      <h3 className="stat-value">{habitaciones}</h3>
                    </div>
                    <div className="stat-icon green">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {banos && (
                <div className="stat-card">
                  <div className="stat-card-inner">
                    <div className="stat-content">
                      <p className="stat-label">Baños</p>
                      <h3 className="stat-value">{banos}</h3>
                    </div>
                    <div className="stat-icon orange">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {garaje && (
                <div className="stat-card">
                  <div className="stat-card-inner">
                    <div className="stat-content">
                      <p className="stat-label">Garaje</p>
                      <h3 className="stat-value">{typeof garaje === 'boolean' ? 'Sí' : garaje}</h3>
                    </div>
                    <div className="stat-icon purple">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="dashboard-card">
            <h2 className="card-title">Información de contacto</h2>
            <div style={{ marginTop: '1rem' }}>
              <div className="activity-item">
                <div className="activity-icon success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="activity-content">
                  <h3 className="activity-title">{arrendadorNombre}</h3>
                  <p className="activity-description">Arrendador</p>
                </div>
              </div>
              
              {arrendadorTelefono && (
                <a 
                  href={`tel:${arrendadorTelefono}`} 
                  className="quick-action-btn secondary"
                  style={{ width: '100%', marginTop: '1rem', textDecoration: 'none' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {arrendadorTelefono}
                </a>
              )}
              
              {arrendadorEmail && (
                <a 
                  href={`mailto:${arrendadorEmail}`} 
                  className="quick-action-btn secondary"
                  style={{ width: '100%', marginTop: '0.75rem', textDecoration: 'none' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {arrendadorEmail}
                </a>
              )}

              <button className="quick-action-btn" style={{ width: '100%', marginTop: '1rem' }}>
                Contactar ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa de ubicación */}
      <div className="dashboard-card">
        <h2 className="card-title">Ubicación</h2>
        <div style={{ height: '400px', marginTop: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
          <MapWrapper 
            properties={[propiedad]} 
            zoom={15}
            showPopup={false}
          />
        </div>
      </div>
    </div>
  );

  // Si está autenticado, usar AppShell (TopBar con Sidebar)
  if (isAuthenticated) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
          {pageContent}
        </div>
      </AppShell>
    );
  }

  // Si no está autenticado, usar PublicTopBar
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <PublicTopBar />
      {pageContent}
    </div>
  );
}
