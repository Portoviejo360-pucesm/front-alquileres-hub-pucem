'use client';

import { useMemo, useState, useEffect } from 'react';
import PublicTopBar from '@/components/layout/PublicTopBar';
import AppShell from '@/components/layout/AppShell';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/propiedades/PropertyCard';
import MapWrapper from '@/components/MapWrapper';
// 🚨 TEMPORAL: Comentar estas líneas cuando el backend esté listo
// import { usePropiedades } from '@/hooks/usePropiedades';
// import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { MOCK_PROPIEDADES } from '@/lib/mockData';
// 🚨 FIN TEMPORAL
import { useAuthStore } from '@/store/auth.store';
import type { AmenityKey } from '@/components/ui/AmenitiesDrawer';
import type { PriceRange } from '@/components/ui/PriceSlider';
import type { Propiedad } from '@/types/propiedad';
import {
  parsePrice,
  getPropertyId,
  getPropertyTitle,
  getPropertyLocation,
  getPropertyImage,
  getPropertyStatus,
  getPropertyPriceLabel,
  getPropertyAmenities,
  normalizeAmenityKey
} from '@/lib/utils/propertyHelpers';

const MAX_PRICE_LIMIT = 5000;

export default function Home() {
  // 🚨 TEMPORAL: Usar datos mock en lugar del hook
  // const { propiedades } = usePropiedades();
  const propiedades = MOCK_PROPIEDADES;
  // 🚨 FIN TEMPORAL
  
  // 🚨 TEMPORAL: Comentar socket mientras se prueban datos estáticos
  // usePropiedadesSocket();
  // 🚨 FIN TEMPORAL
  
  const { isAuthenticated, loadUser } = useAuthStore();

  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);
  const [mapBounds, setMapBounds] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const propiedadesFiltradas = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    const selectedAmenities = amenities.map(normalizeAmenityKey);

    let filtered = (propiedades as Propiedad[]).filter((propiedad) => {
      // Filtro de texto
      const title = getPropertyTitle(propiedad);
      const location = getPropertyLocation(propiedad);
      const matchText = !searchQuery || 
        `${title} ${location}`.toLowerCase().includes(searchQuery);

      // Filtro de precio
      const rawPrice = propiedad.price ?? propiedad.precio ?? propiedad.precio_mensual ?? 
        propiedad.precioMensual ?? propiedad.precioMes ?? propiedad.valor;
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
        selectedAmenities.every((amenity) => propAmenities.includes(amenity));

      return matchText && matchPrice && matchAmenities;
    });

    // Filtro por bounds del mapa (estilo Airbnb)
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

  const handleMapBoundsChange = (newBounds: any) => {
    setMapBounds(newBounds);
  };

  const handleToggleFavorite = (id: string | number) => {
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

  const handleViewDetails = (id: string | number) => {
    // TODO: Navegar a página de detalles
    console.log('Ver detalles de propiedad:', id);
  };

  const pageContent = (
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
              <p className="properties-header-subtitle">Portoviejo, Manabí</p>
            </div>

            <div className="properties-grid">
              {propiedadesFiltradas.map((propiedad, index) => {
                const id = getPropertyId(propiedad, index);
                return (
                  <PropertyCard
                    key={String(id)}
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
          </section>

          {/* Mapa */}
          <section className={`map-section ${showMapMobile ? 'mobile-visible' : ''}`}>
            <MapWrapper 
              properties={propiedadesFiltradas as Propiedad[]} 
              onBoundsChange={handleMapBoundsChange}
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
