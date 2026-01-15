'use client';

import React from 'react';

export type PriceRange = { min: number; max: number };

interface PriceSliderProps {
  min: number;
  max: number;
  value: PriceRange;
  active: boolean;
  step?: number;
  onChange: (next: PriceRange) => void;
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function money(n: number) {
  // Formato simple tipo Amazon
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function PriceSlider({
  min,
  max,
  value,
  active,
  step = 50,
  onChange,
}: PriceSliderProps) {
  const safeMin = clamp(value.min, min, max);
  const safeMax = clamp(value.max, min, max);

  const minPercent = ((safeMin - min) / (max - min)) * 100;
  const maxPercent = ((safeMax - min) / (max - min)) * 100;

  const showMore = safeMax >= max;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = clamp(Number(e.target.value), min, safeMax);
    onChange({ min: nextMin, max: safeMax });
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = clamp(Number(e.target.value), safeMin, max);
    onChange({ min: safeMin, max: nextMax });
  };

  const rangeText = `${money(safeMin)} – ${money(safeMax)}${showMore ? ' y más' : ''}`;

  return (
    <div className="w-full">
      {/* Texto tipo Amazon */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-900">Precio</div>
        <div className="text-sm font-semibold text-gray-900">{rangeText}</div>
      </div>

      {/* Barra */}
      <div className="relative h-10">
        {/* Track base */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-200" />

        {/* Track activo (entre min y max) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full transition-all"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            background: active ? '#dc2626' : '#9ca3af', // rojo o gris
          }}
        />

        {/* Inputs superpuestos */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMin}
          onChange={handleMin}
          className="range-input"
          aria-label="Precio mínimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMax}
          onChange={handleMax}
          className="range-input"
          aria-label="Precio máximo"
        />

        {/* Etiquetas min / max */}
        <div className="absolute left-0 bottom-0 text-xs text-gray-500">{money(min)}</div>
        <div className="absolute right-0 bottom-0 text-xs text-gray-500">{money(max)}</div>
      </div>

      {/* Estado */}
      <div className="mt-1 text-xs text-gray-500">
        {!active ? 'Sin filtro de precio (mueve la barra para aplicar)' : 'Filtro de precio aplicado'}
      </div>

      <style jsx>{`
        .range-input {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          background: transparent;
          pointer-events: none; /* importante para doble thumb */
          -webkit-appearance: none;
          appearance: none;
          height: 2rem;
          margin: 0;
        }

        .range-input::-webkit-slider-runnable-track {
          background: transparent;
          height: 0.5rem;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all; /* el thumb sí recibe eventos */
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid ${active ? '#dc2626' : '#9ca3af'};
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }

        .range-input::-moz-range-track {
          background: transparent;
          height: 0.5rem;
        }

        .range-input::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid ${active ? '#dc2626' : '#9ca3af'};
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
