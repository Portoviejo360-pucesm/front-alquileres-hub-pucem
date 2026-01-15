'use client';

import { useMemo, useState } from 'react';
import PublicTopBar from '@/components/layout/PublicTopBar';
import PropertyFilters from '@/components/PropertyFilters';
import MapWrapper from '@/components/MapWrapper';
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { getColorByEstado } from '@/utils/getColorByEstado';
import { AmenityKey } from '@/components/ui/AmenitiesDrawer';
import type { PriceRange } from '@/components/ui/PriceSlider';

const MAX_PRICE_LIMIT = 5000;

function parsePrice(value: any): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const cleaned = String(value).replace(/[^\d.]/g, '');
  const num = cleaned ? Number(cleaned) : NaN;
  return Number.isFinite(num) ? num : null;
}

function getId(p: any, index: number) {
  return p.id ?? p.uuid ?? p._id ?? p.propiedad_id ?? p.codigo ?? index;
}

function getTitle(p: any) {
  return p.title ?? p.nombre ?? p.titulo ?? p.tituloAnuncio ?? 'Propiedad';
}

function getLocation(p: any) {
  return p.location ?? p.ubicacion ?? p.direccion ?? p.ciudad ?? '';
}

function getImage(p: any) {
  return (
    p.image ??
    p.imagen ??
    p.imagen_url ??
    p.foto ??
    (Array.isArray(p.fotos) ? p.fotos[0] : null) ??
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  );
}

function getEstado(p: any) {
  return p.estado?.nombre ?? p.estado ?? p.status ?? p.estado_propiedad ?? 'DISPONIBLE';
}

function getPriceLabel(p: any) {
  const raw = p.price ?? p.precio ?? p.precio_mensual ?? p.precioMensual ?? p.precioMes ?? p.valor;
  const n = parsePrice(raw);
  if (n != null) return `$${n.toFixed(2)}`;
  return raw != null ? String(raw) : '$0.00';
}

/* =========================
   Amenities helpers
========================= */

function normalizeAmenityKey(s: string): string {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');
}

function getAmenitiesFromProp(p: any): string[] {
  const raw =
    p.amenities ??
    p.servicios ??
    p.servicios_incluidos ??
    p.caracteristicas ??
    p.extras ??
    null;

  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((x) => normalizeAmenityKey(x));
  }

  if (typeof raw === 'object') {
    return Object.entries(raw)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => normalizeAmenityKey(k));
  }

  return String(raw)
    .split(',')
    .map((s) => normalizeAmenityKey(s.trim()))
    .filter(Boolean);
}

export default function Home() {
  const { propiedades } = usePropiedades();
  usePropiedadesSocket();

  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null); // null => sin filtro
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);

  const maxPriceLimit = MAX_PRICE_LIMIT;

  const propiedadesFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    const selectedAmenities = amenities.map((a) => normalizeAmenityKey(a));

    return (propiedades as any[]).filter((p) => {
      const text = `${getTitle(p)} ${getLocation(p)}`.toLowerCase();
      const matchText = q === '' || text.includes(q);

      const n = parsePrice(p.price ?? p.precio ?? p.precio_mensual ?? p.precioMensual ?? p.precioMes ?? p.valor);

      // Precio (rango)
      let matchPrice = true;
      if (priceRange !== null) {
        const min = Math.max(0, priceRange.min);
        const max = Math.min(maxPriceLimit, priceRange.max);

        // Si el usuario dejó el max en el tope => “y más”
        const openEnded = max >= maxPriceLimit;

        matchPrice =
          n == null ||
          (openEnded ? n >= min : n >= min && n <= max);
      }

      // Servicios
      const propAmenities = getAmenitiesFromProp(p);
      const matchAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => propAmenities.includes(a));

      return matchText && matchPrice && matchAmenities;
    });
  }, [propiedades, search, priceRange, amenities, maxPriceLimit]);

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setPriceRange(null);
    setAmenities([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicTopBar />

      <PropertyFilters
        search={search}
        onSearchChange={setSearch}
        priceRange={priceRange}
        maxPriceLimit={maxPriceLimit}
        onPriceRangeChange={setPriceRange}
        amenities={amenities}
        onAmenitiesChange={setAmenities}
        onClearFilters={clearFilters}
      />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Listado */}
        <section className={`w-full md:w-[55%] bg-white flex flex-col ${showMapMobile ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-200 bg-white sticky top-[70px] z-10">
            <h2 className="text-xl font-bold text-gray-900">
              {propiedadesFiltradas.length}{' '}
              {propiedadesFiltradas.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Portoviejo, Manabí</p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 overflow-y-auto auto-rows-max"
            style={{ maxHeight: 'calc(100vh - 240px)' }}
          >
            {propiedadesFiltradas.map((prop, idx) => {
              const id = getId(prop, idx);
              const title = getTitle(prop);
              const location = getLocation(prop);
              const image = getImage(prop);
              const estado = getEstado(prop);
              const priceLabel = getPriceLabel(prop);

              return (
                <div
                  key={String(id)}
                  className="group relative rounded-xl shadow-md hover:shadow-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1"
                >
                  <span
                    className={`absolute top-3 left-3 px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg z-10 ${getColorByEstado(
                      estado
                    )}`}
                  >
                    {estado}
                  </span>

                  <button
                    onClick={() => toggleFavorite(id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10 text-2xl"
                  >
                    {favorites.has(id) ? '❤️' : '🤍'}
                  </button>

                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{title}</h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="line-clamp-1">{location || 'Portoviejo'}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-red-600">{priceLabel}</span>
                        <span className="text-sm text-gray-500 ml-1">/mes</span>
                      </div>

                      <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mapa */}
        <section className={`${showMapMobile ? 'block' : 'hidden'} md:block md:w-[45%] md:sticky md:top-[70px] md:h-[calc(100vh-70px)]`}>
          <MapWrapper properties={propiedadesFiltradas as any} />
        </section>

        {/* Botón móvil */}
        <button
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full z-50"
        >
          {showMapMobile ? 'Ver Lista' : 'Ver Mapa'}
        </button>
      </main>
    </div>
  );
}
