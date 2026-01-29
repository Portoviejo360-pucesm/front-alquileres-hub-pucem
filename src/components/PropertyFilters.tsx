'use client';

import { useMemo, useState } from 'react';
import PriceSlider, { PriceRange } from '@/components/ui/PriceSlider';
import AmenitiesDrawer, { AmenityKey } from '@/components/ui/AmenitiesDrawer';
import '@/styles/components/layout.css';

interface PropertyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  // Precio rango (null => sin filtro)
  priceRange: PriceRange | null;
  maxPriceLimit: number;
  onPriceRangeChange: (value: PriceRange | null) => void;

  // Servicios
  amenities: AmenityKey[];
  onAmenitiesChange: (value: AmenityKey[]) => void;

  onClearFilters: () => void;
}

export default function PropertyFilters({
  search,
  onSearchChange,
  priceRange,
  maxPriceLimit,
  onPriceRangeChange,
  amenities,
  onAmenitiesChange,
  onClearFilters,
}: PropertyFiltersProps) {
  const [openAmenities, setOpenAmenities] = useState(false);

  const defaultRange = useMemo<PriceRange>(
    () => ({ min: 0, max: maxPriceLimit }),
    [maxPriceLimit]
  );

  const isPriceActive = priceRange !== null;
  const sliderRange = priceRange ?? defaultRange;

  const quickRanges = useMemo(
    () => [
      { label: '$0-200', min: 0, max: 200 },
      { label: '$200-400', min: 200, max: 400 },
      { label: '$400-600', min: 400, max: 600 },
      { label: '$600-800', min: 600, max: 800 },
      { label: '$800+', min: 800, max: maxPriceLimit }, // open ended en page.tsx
    ],
    [maxPriceLimit]
  );

  const sameRange = (a: PriceRange | null, b: PriceRange) => {
    if (!a) return false;
    return a.min === b.min && a.max === b.max;
  };

  const setRange = (r: PriceRange) => {
    // Si vuelve al rango completo => sin filtro
    if (r.min <= 0 && r.max >= maxPriceLimit) onPriceRangeChange(null);
    else onPriceRangeChange(r);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm filters-offset">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col gap-4">

          {/* Buscar (NO se quita) */}
          <div className="w-full">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre, ubicación..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Rango de precio</span>

              <div className="flex items-center gap-3">
                {/* ✅ Servicios (texto rojo) */}
                <button
                  onClick={() => setOpenAmenities(true)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  Servicios{amenities.length ? ` (${amenities.length})` : ''}
                </button>

                <button
                  onClick={onClearFilters}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Botones rápidos */}
            <div className="flex flex-wrap gap-2">
              {quickRanges.map((r) => (
                <button
                  key={r.label}
                  onClick={() => onPriceRangeChange({ min: r.min, max: r.max })}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sameRange(priceRange, { min: r.min, max: r.max })
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Slider tipo Amazon (min/max) */}
            <div className="pt-2">
              <PriceSlider
                min={0}
                max={maxPriceLimit}
                value={sliderRange}
                active={isPriceActive}
                onChange={(next) => setRange(next)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Servicios */}
      <AmenitiesDrawer
        open={openAmenities}
        value={amenities}
        onChange={onAmenitiesChange}
        onClose={() => setOpenAmenities(false)}
      />
    </div>
  );
}
