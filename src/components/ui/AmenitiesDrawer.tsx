'use client';

import React from 'react';
import SideDrawer from '@/components/ui/SideDrawer';

export type AmenityKey =
  | 'internet'
  | 'agua_potable'
  | 'luz_electrica'
  | 'bano_privado'
  | 'cocina_compartida'
  | 'garaje'
  | 'aire_acondicionado'
  | 'zona_lavanderia';

const AMENITIES: { key: AmenityKey; label: string; icon: string }[] = [
  { key: 'internet', label: 'Internet/Wifi', icon: '📶' },
  { key: 'agua_potable', label: 'Agua Potable', icon: '💧' },
  { key: 'luz_electrica', label: 'Luz Eléctrica', icon: '💡' },
  { key: 'bano_privado', label: 'Baño Privado', icon: '🚿' },
  { key: 'cocina_compartida', label: 'Cocina Compartida', icon: '🍳' },
  { key: 'garaje', label: 'Garaje', icon: '🚗' },
  { key: 'aire_acondicionado', label: 'Aire Acondicionado', icon: '❄️' },
  { key: 'zona_lavanderia', label: 'Zona Lavandería', icon: '🧺' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  value: AmenityKey[];
  onChange: (next: AmenityKey[]) => void;
  onClear?: () => void;
};

export default function AmenitiesDrawer({ open, onClose, value, onChange, onClear }: Props) {
  const toggle = (k: AmenityKey) => {
    const set = new Set(value);
    set.has(k) ? set.delete(k) : set.add(k);
    onChange(Array.from(set));
  };

  return (
    <SideDrawer open={open} onClose={onClose} title="Filtrar por Servicios">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Selecciona los servicios requeridos
          </p>

          {value.length > 0 && (
            <button
              onClick={() => {
                onClear?.();
                onChange([]);
              }}
              className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              Limpiar todo
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {AMENITIES.map(a => {
            const isSelected = value.includes(a.key);
            return (
              <label
                key={a.key}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(a.key)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: '#2E5E4E' }}
                />
                <span className="text-base">{a.icon}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-emerald-800' : 'text-gray-700'}`}>
                  {a.label}
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-white font-semibold transition-colors"
            style={{ backgroundColor: '#2E5E4E' }}
          >
            Aplicar ({value.length} seleccionado{value.length !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </SideDrawer>
  );
}
