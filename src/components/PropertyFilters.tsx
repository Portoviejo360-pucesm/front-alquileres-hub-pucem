'use client';

import { useMemo, useState } from 'react';
import type { PriceRange } from '@/components/ui/PriceSlider';
import '@/styles/components/layout.css';

export type AmenityKey =
  | 'internet'
  | 'agua_potable'
  | 'luz_electrica'
  | 'bano_privado'
  | 'cocina_compartida'
  | 'garaje'
  | 'aire_acondicionado'
  | 'zona_lavanderia';

const AMENITIES: { key: AmenityKey; label: string }[] = [
  { key: 'internet', label: 'Internet/Wifi' },
  { key: 'agua_potable', label: 'Agua Potable' },
  { key: 'luz_electrica', label: 'Luz Eléctrica' },
  { key: 'bano_privado', label: 'Baño Privado' },
  { key: 'cocina_compartida', label: 'Cocina Compartida' },
  { key: 'garaje', label: 'Garaje' },
  { key: 'aire_acondicionado', label: 'Aire Acondicionado' },
  { key: 'zona_lavanderia', label: 'Zona Lavandería' },
];

interface PropertyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priceRange: PriceRange | null;
  maxPriceLimit: number;
  onPriceRangeChange: (value: PriceRange | null) => void;
  amenities: AmenityKey[];
  onAmenitiesChange: (value: AmenityKey[]) => void;
  onClearFilters: () => void;
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function money(n: number) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
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
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const defaultRange = useMemo<PriceRange>(
    () => ({ min: 0, max: maxPriceLimit }),
    [maxPriceLimit]
  );

  const isPriceActive = priceRange !== null;
  const sliderRange = priceRange ?? defaultRange;
  const safeMin = clamp(sliderRange.min, 0, maxPriceLimit);
  const safeMax = clamp(sliderRange.max, 0, maxPriceLimit);
  const showMore = safeMax >= maxPriceLimit;
  const rangeText = `${money(safeMin)} – ${money(safeMax)}${showMore ? ' y mas' : ''}`;

  const minPercent = ((safeMin) / maxPriceLimit) * 100;
  const maxPercent = ((safeMax) / maxPriceLimit) * 100;

  const quickRanges = [
    { label: 'Hasta $200', min: 0, max: 200 },
    { label: '$200 a $400', min: 200, max: 400 },
    { label: '$400 a $600', min: 400, max: 600 },
    { label: '$600 a $800', min: 600, max: 800 },
    { label: '$800 y Mas', min: 800, max: maxPriceLimit },
  ];

  const setRange = (r: PriceRange) => {
    if (r.min <= 0 && r.max >= maxPriceLimit) onPriceRangeChange(null);
    else onPriceRangeChange(r);
  };

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = clamp(Number(e.target.value), 0, safeMax);
    setRange({ min: nextMin, max: safeMax });
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = clamp(Number(e.target.value), safeMin, maxPriceLimit);
    setRange({ min: safeMin, max: nextMax });
  };

  const toggleAmenity = (k: AmenityKey) => {
    const set = new Set(amenities);
    set.has(k) ? set.delete(k) : set.add(k);
    onAmenitiesChange(Array.from(set));
  };

  const visibleAmenities = showAllAmenities ? AMENITIES : AMENITIES.slice(0, 5);
  const activeCount = (isPriceActive ? 1 : 0) + amenities.length + (search.trim() ? 1 : 0);

  const accentColor = '#2E5E4E';

  return (
    <aside className="amazon-sidebar">
      {/* Busqueda */}
      <div className="sidebar-section">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar propiedad..."
            className="sidebar-search"
          />
        </div>
      </div>

      {/* Precio */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Precio</h4>
        <p className="sidebar-range-text">
          {isPriceActive ? rangeText : `$0 – ${money(maxPriceLimit)} y mas`}
        </p>

        {/* Dual range slider */}
        <div className="sidebar-slider-container">
          <div className="sidebar-slider-track" />
          <div
            className="sidebar-slider-fill"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
              backgroundColor: accentColor,
            }}
          />
          <input
            type="range" min={0} max={maxPriceLimit} step={50}
            value={safeMin} onChange={handleMin}
            className="sidebar-slider-thumb"
            aria-label="Precio minimo"
          />
          <input
            type="range" min={0} max={maxPriceLimit} step={50}
            value={safeMax} onChange={handleMax}
            className="sidebar-slider-thumb"
            aria-label="Precio maximo"
          />
        </div>

        {/* Quick ranges como links estilo Amazon */}
        <div className="sidebar-links">
          {quickRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => onPriceRangeChange({ min: r.min, max: r.max })}
              className={`sidebar-link ${
                isPriceActive && priceRange?.min === r.min && priceRange?.max === r.max
                  ? 'sidebar-link-active'
                  : ''
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Servicios */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Servicios</h4>
        <div className="sidebar-checkboxes">
          {visibleAmenities.map((a) => (
            <label key={a.key} className="sidebar-checkbox-label">
              <input
                type="checkbox"
                checked={amenities.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
                className="sidebar-checkbox"
                style={{ accentColor }}
              />
              <span>{a.label}</span>
            </label>
          ))}
        </div>
        {AMENITIES.length > 5 && (
          <button
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="sidebar-link sidebar-toggle"
          >
            {showAllAmenities ? '▲ Ver menos' : '▼ Ver mas'}
          </button>
        )}
      </div>

      {/* Limpiar */}
      {activeCount > 0 && (
        <div className="sidebar-section">
          <button onClick={onClearFilters} className="sidebar-clear-btn">
            Limpiar todos los filtros
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-slider-thumb::-webkit-slider-runnable-track {
          background: transparent;
          height: 6px;
        }
        .sidebar-slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${accentColor};
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          margin-top: -7px;
        }
        .sidebar-slider-thumb::-moz-range-track {
          background: transparent;
          height: 6px;
        }
        .sidebar-slider-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${accentColor};
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        }
      `}} />
    </aside>
  );
}
