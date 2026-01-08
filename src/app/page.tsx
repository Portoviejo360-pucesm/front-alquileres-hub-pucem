'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import MapWrapper from '@/components/MapWrapper';
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { getColorByEstado } from '@/utils/getColorByEstado';

function parsePrice(value: any): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  // "$180.00/mes" -> "180.00" -> 180
  const cleaned = String(value).replace(/[^\d.]/g, '');
  const num = cleaned ? Number(cleaned) : NaN;
  return Number.isFinite(num) ? num : null;
}

function getId(p: any, index: number) {
  return p.id ?? p.uuid ?? p._id ?? p.propiedad_id ?? p.codigo ?? index;
}

function getTitle(p: any) {
  return p.title ?? p.nombre ?? p.titulo ?? 'Propiedad';
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
  return p.estado ?? p.status ?? p.estado_propiedad ?? 'DISPONIBLE';
}

function getPriceLabel(p: any) {
  const raw = p.price ?? p.precio ?? p.precio_mensual ?? p.precioMes ?? p.valor;
  const n = parsePrice(raw);
  if (n != null) return `$${n.toFixed(2)}`;
  return raw != null ? String(raw) : '$0.00';
}

export default function Home() {
  const { propiedades } = usePropiedades();
  usePropiedadesSocket();

  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const maxPriceLimit = useMemo(() => {
    const nums = (propiedades as any[])
      .map(p => parsePrice(p.price ?? p.precio ?? p.precio_mensual ?? p.precioMes ?? p.valor))
      .filter((n): n is number => typeof n === 'number' && Number.isFinite(n));
    return nums.length ? Math.ceil(Math.max(...nums)) : 1000;
  }, [propiedades]);

  useEffect(() => {
    // Inicializa el slider sin romper el layout
    if (maxPrice === null) setMaxPrice(maxPriceLimit);
    else if (maxPrice > maxPriceLimit) setMaxPrice(maxPriceLimit);
  }, [maxPrice, maxPriceLimit]);

  const propiedadesFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    const max = maxPrice ?? maxPriceLimit;

    return (propiedades as any[]).filter(p => {
      const text = `${getTitle(p)} ${getLocation(p)}`.toLowerCase();

      const matchText = q === '' || text.includes(q);

      const n = parsePrice(p.price ?? p.precio ?? p.precio_mensual ?? p.precioMes ?? p.valor);
      const matchPrice = n == null || n <= max;

      return matchText && matchPrice;
    });
  }, [propiedades, search, maxPrice, maxPriceLimit]);

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setMaxPrice(maxPriceLimit);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-gray-900">
      <Navbar />

      {/* ✅ BARRA DE FILTROS (debajo del navbar, NO lo deforma) */}
      <div className="w-full bg-white/95 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            {/* Buscar */}
            <div className="w-full lg:max-w-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Precio */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Máx: ${Number(maxPrice ?? maxPriceLimit).toFixed(0)}
              </span>

              <input
                type="range"
                min={0}
                max={maxPriceLimit || 1000}
                value={Number(maxPrice ?? maxPriceLimit)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full max-w-xs"
              />

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline whitespace-nowrap"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MAIN sin calc: ya no se aplasta la grilla */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LISTADO */}
        <section
          className={`w-full md:w-[55%] bg-white flex flex-col ${
            showMapMobile ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 font-bold text-gray-900 shrink-0">
            {propiedadesFiltradas.length} propiedades disponibles en Portoviejo
          </div>

          {/* Scroll SOLO aquí */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 flex-1 overflow-y-auto">
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
                  className="relative rounded-xl shadow hover:shadow-lg overflow-hidden bg-white"
                >
                  <span
                    className={`absolute top-2 left-2 px-3 py-1 text-xs text-white rounded-full font-bold ${getColorByEstado(
                      estado
                    )}`}
                  >
                    {estado}
                  </span>

                  <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover block"
                  />

                  <div className="p-3">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-700">{location}</p>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-900">{priceLabel}/mes</span>

                      <button onClick={() => toggleFavorite(id)}>
                        {favorites.has(id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MAPA */}
        <section className={`${showMapMobile ? 'block' : 'hidden'} md:block flex-1`}>
          <MapWrapper properties={propiedadesFiltradas as any} />
        </section>

        {/* BOTÓN MAPA MÓVIL */}
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
