'use client';

import PriceSlider from '@/components/ui/PriceSlider';

interface PropertyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  maxPrice: number | null;
  maxPriceLimit: number;

  onPriceChange: (value: number | null) => void; // ✅
  onClearFilters: () => void;
}

export default function PropertyFilters({
  search,
  onSearchChange,
  maxPrice,
  maxPriceLimit,
  onPriceChange,
  onClearFilters,
}: PropertyFiltersProps) {
  const priceRanges = [
    { label: '$0-200', value: 200 },
    { label: '$200-400', value: 400 },
    { label: '$400-600', value: 600 },
    { label: '$600-800', value: 800 },
    { label: '$800+', value: maxPriceLimit },
  ];

  const isPriceActive = maxPrice !== null;

  // ✅ visualmente: si NO hay filtro, que se vea en 0
  const sliderValue = maxPrice ?? 0;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm" style={{ marginTop: '70px' }}>
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

              <button
                onClick={onClearFilters}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>

            {/* Botones rápidos */}
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => onPriceChange(range.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isPriceActive && maxPrice === range.value
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* ✅ Slider desde 0, pero “sin filtro” cuando está en 0 */}
            <div className="pt-2">
              <PriceSlider
                min={0}
                max={maxPriceLimit}
                value={sliderValue}
                active={isPriceActive}
                onChange={(v) => onPriceChange(v === 0 ? null : v)} // ✅ 0 => sin filtro
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
