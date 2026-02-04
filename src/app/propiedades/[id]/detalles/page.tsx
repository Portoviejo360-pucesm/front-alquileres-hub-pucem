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
import { sanitizeProperty } from '@/lib/utils/propertyHelpers';
import type { Propiedad } from '@/types/propiedad';

export default function PropiedadDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();

  const [rawPropiedad, setRawPropiedad] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return (
      <LayoutWrapper isAuthenticated={isAuthenticated}>
        <div className="dashboard-container">
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 className="card-title" style={{ color: '#ef4444', marginBottom: '1rem' }}>
              Error
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error || 'Propiedad no encontrada'}
            </p>
            <button onClick={() => router.push('/')} className="quick-action-btn">
              ← Volver al inicio
            </button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const hasCoordinates = propiedad.lat && propiedad.lng && 
    !isNaN(Number(propiedad.lat)) && !isNaN(Number(propiedad.lng));

  return (
    <LayoutWrapper isAuthenticated={isAuthenticated}>
      <div className="dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header mejorado con breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => router.back()} 
            className="quick-action-btn secondary" 
            style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            gap: '1rem', 
            flexWrap: 'wrap' 
          }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h1 className="dashboard-title" style={{ marginBottom: '0.5rem' }}>
                {propiedad.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="dashboard-subtitle" style={{ margin: 0 }}>{propiedad.location}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button 
                className="quick-action-btn secondary" 
                title="Compartir"
                style={{ width: '44px', height: '44px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button 
                className="quick-action-btn secondary" 
                title="Guardar"
                style={{ width: '44px', height: '44px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
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
