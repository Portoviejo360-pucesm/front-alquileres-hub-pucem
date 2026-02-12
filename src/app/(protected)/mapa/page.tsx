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
import type { AmenityKey } from '@/components/PropertyFilters';
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
      const title = getPropertyTitle(propiedad);
      const location = getPropertyLocation(propiedad);
      const matchText = !searchQuery ||
        `${title} ${location}`.toLowerCase().includes(searchQuery);

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

      const propAmenities = getPropertyAmenities(propiedad);
      const matchAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(amenity => propAmenities.includes(amenity));

      return matchText && matchPrice && matchAmenities;
    });

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
      next.has(id) ? next.delete(id) : next.add(id);
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
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 rounded-full mx-auto mb-3"
            style={{ borderTopColor: '#2E5E4E' }} />
          <p className="text-sm text-gray-500">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="text-center">
          <p className="text-red-500 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#2E5E4E' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-page-layout">
      {/* Sidebar filtros estilo Amazon */}
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

      {/* Area principal: cards + mapa */}
      <main className="mapa-page-content">
        <div className="properties-layout">
          {/* Listado de propiedades */}
          <section className={`properties-grid-section ${showMapMobile ? 'mobile-hidden' : ''}`}>
            <div className="properties-header">
              <h2 className="properties-header-title">
                {propiedadesFiltradas.length}{' '}
                {propiedadesFiltradas.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
                {mapBounds && ' en esta area'}
              </h2>
              <p className="properties-header-subtitle">
                Mostrando {propiedadesFiltradas.length} de {propiedades.length} &bull; Portoviejo, Manabi
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
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <p className="text-gray-500 text-center mb-4">
                  No se encontraron propiedades con estos filtros.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#2E5E4E' }}
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

          {/* Boton toggle movil */}
          <button
            onClick={() => setShowMapMobile(!showMapMobile)}
            className="mobile-toggle-btn"
            aria-label={showMapMobile ? 'Ver lista' : 'Ver mapa'}
          >
            {showMapMobile ? 'Ver Lista' : 'Ver Mapa'}
          </button>
        </div>
      </main>
    </div>
  );
}
