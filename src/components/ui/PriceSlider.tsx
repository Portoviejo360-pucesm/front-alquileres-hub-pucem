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

  const rangeText = `${money(safeMin)} – ${money(safeMax)}${showMore ? '+' : ''}`;

  const accentColor = '#2E5E4E';
  const inactiveColor = '#d1d5db';

  return (
    <div className="w-full">
      {/* Rango texto */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-500">
          {!active ? 'Sin filtro' : rangeText}
        </div>
      </div>

      {/* Barra */}
      <div className="relative h-6">
        {/* Track base */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gray-200" />

        {/* Track activo */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            background: active ? accentColor : inactiveColor,
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
          className="price-slider-input"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            background: 'transparent',
            pointerEvents: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
            height: '1.5rem',
            margin: 0,
          }}
          aria-label="Precio minimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMax}
          onChange={handleMax}
          className="price-slider-input"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            background: 'transparent',
            pointerEvents: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
            height: '1.5rem',
            margin: 0,
          }}
          aria-label="Precio maximo"
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .price-slider-input::-webkit-slider-runnable-track {
            background: transparent;
            height: 0.375rem;
          }

          .price-slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            pointer-events: all;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: #ffffff;
            border: 2.5px solid ${active ? accentColor : inactiveColor};
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }

          .price-slider-input::-moz-range-track {
            background: transparent;
            height: 0.375rem;
          }

          .price-slider-input::-moz-range-thumb {
            pointer-events: all;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: #ffffff;
            border: 2.5px solid ${active ? accentColor : inactiveColor};
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
        `
      }} />
    </div>
  );
}
