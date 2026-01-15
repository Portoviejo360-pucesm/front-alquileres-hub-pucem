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
    <SideDrawer open={open} onClose={onClose} title="Servicios (Filtros)">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Selecciona los servicios que debe tener la propiedad.
          </p>

          <button
            onClick={() => {
              onClear?.();
              onChange([]);
            }}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Limpiar
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {AMENITIES.map(a => (
            <label
              key={a.key}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(a.key)}
                onChange={() => toggle(a.key)}
                className="h-4 w-4 accent-red-600"
              />
              <span className="text-sm font-medium text-gray-900">{a.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </SideDrawer>
  );
}
