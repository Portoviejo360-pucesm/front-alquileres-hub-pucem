'use client';

type PriceSliderProps = {
  value: number;
  min?: number;
  max: number;
  step?: number;
  active?: boolean;
  onChange: (value: number) => void;
};

export default function PriceSlider({
  value,
  min = 0,
  max,
  step = 1,
  active = false,
  onChange,
}: PriceSliderProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1000;
  const safeValue = Math.min(Math.max(value ?? min, min), safeMax);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>${min}</span>
        <span>${safeMax}</span>
      </div>

      <input
        type="range"
        min={min}
        max={safeMax}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-600"
      />

      {/* ✅ Si NO está activo, no muestres “Máx seleccionado: $0” */}
      {active ? (
        <div className="mt-1 text-sm font-semibold text-gray-700">
          Máx seleccionado: ${safeValue}
        </div>
      ) : (
        <div className="mt-1 text-sm text-gray-500">
          Sin filtro de precio (mueve la barra para aplicar)
        </div>
      )}
    </div>
  );
}
