'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/propiedades/PropertyCard';
import MapWrapper from '@/components/MapWrapper';
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import {
  parsePrice,
  getPropertyId,
  getPropertyTitle,
  getPropertyLocation,
  getPropertyImage,
  getPropertyStatus,
  getPropertyPriceLabel,
  getPropertyAmenities,
  normalizeAmenityKey,
} from '@/lib/utils/propertyHelpers';
import type { AmenityKey } from '@/components/ui/AmenitiesDrawer';
import type { PriceRange } from '@/components/ui/PriceSlider';
import type { Propiedad } from '@/types/propiedad';

const MAX_PRICE_LIMIT = 5000;

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export default function MapaPage() {
  const router = useRouter();
  const { propiedades, loading, error } = usePropiedades();

  // Conectar socket para actualizaciones en tiempo real
  usePropiedadesSocket();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const propiedadesFiltradas = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    const selectedAmenities = amenities.map(normalizeAmenityKey);

    let filtered = (propiedades as Propiedad[]).filter((propiedad) => {
      // Filtro de búsqueda por texto
      const title = getPropertyTitle(propiedad);
      const location = getPropertyLocation(propiedad);
      const matchText = !searchQuery ||
        `${title} ${location}`.toLowerCase().includes(searchQuery);

      // Filtro de precio
      const rawPrice = propiedad.precio ?? propiedad.precioMensual ?? propiedad.price;
      const numericPrice = parsePrice(rawPrice);

      let matchPrice = true;
      if (priceRange) {
        const min = Math.max(0, priceRange.min);
        const max = Math.min(MAX_PRICE_LIMIT, priceRange.max);
        const openEnded = max >= MAX_PRICE_LIMIT;

        matchPrice = !numericPrice ||
          (openEnded ? numericPrice >= min : numericPrice >= min && numericPrice <= max);
      }

      // Filtro de amenidades
      const propAmenities = getPropertyAmenities(propiedad);
      const matchAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(amenity => propAmenities.includes(amenity));

      return matchText && matchPrice && matchAmenities;
    });

    // Filtro por bounds del mapa
    if (mapBounds) {
      filtered = filtered.filter((propiedad) => {
        const lat = Number(propiedad.lat);
        const lng = Number(propiedad.lng);

        if (isNaN(lat) || isNaN(lng)) return false;

        return (
          lat >= mapBounds.south &&
          lat <= mapBounds.north &&
          lng >= mapBounds.west &&
          lng <= mapBounds.east
        );
      });
    }

    return filtered;
  }, [propiedades, search, priceRange, amenities, mapBounds]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setPriceRange(null);
    setAmenities([]);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/propiedades/${id}/detalles`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--brand-bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: 'var(--brand-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Cargando propiedades...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="quick-action-btn"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <PropertyFilters
        search={search}
        onSearchChange={setSearch}
        priceRange={priceRange}
        maxPriceLimit={MAX_PRICE_LIMIT}
        onPriceRangeChange={setPriceRange}
        amenities={amenities}
        onAmenitiesChange={setAmenities}
        onClearFilters={handleClearFilters}
      />

      <main className="properties-main-container">
        <div className="properties-layout">
          {/* Listado de propiedades */}
          <section className={`properties-grid-section ${showMapMobile ? 'mobile-hidden' : ''}`}>
            <div className="properties-header">
              <h2 className="properties-header-title">
                {propiedadesFiltradas.length}{' '}
                {propiedadesFiltradas.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
                {mapBounds && ' en esta área'}
              </h2>
              <p className="properties-header-subtitle">
                Mostrando {propiedadesFiltradas.length} de {propiedades.length} • Portoviejo, Manabí
              </p>
            </div>

            {propiedadesFiltradas.length > 0 ? (
              <div className="properties-grid">
                {propiedadesFiltradas.map((propiedad, index) => {
                  const id = getPropertyId(propiedad, index);
                  return (
                    <PropertyCard
                      key={id}
                      id={id}
                      title={getPropertyTitle(propiedad)}
                      location={getPropertyLocation(propiedad)}
                      image={getPropertyImage(propiedad)}
                      estado={getPropertyStatus(propiedad)}
                      price={getPropertyPriceLabel(propiedad)}
                      isFavorite={favorites.has(id)}
                      onToggleFavorite={handleToggleFavorite}
                      onViewDetails={handleViewDetails}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  No se encontraron propiedades que coincidan con tus criterios de búsqueda.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="quick-action-btn"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </section>

          {/* Mapa */}
          <section className={`map-section ${showMapMobile ? 'mobile-visible' : ''}`}>
            <MapWrapper
              properties={propiedadesFiltradas as Propiedad[]}
              onBoundsChange={setMapBounds}
            />
          </section>

          {/* Botón toggle móvil */}
          <button
            onClick={() => setShowMapMobile(!showMapMobile)}
            className="mobile-toggle-btn"
            aria-label={showMapMobile ? 'Ver lista' : 'Ver mapa'}
          >
            {showMapMobile ? '📋 Ver Lista' : '🗺️ Ver Mapa'}
          </button>
        </div>
      </main>
    </>
  );
}
