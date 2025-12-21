import { useContext } from 'react';
import { PropiedadesContext } from '@/context/PropiedadesContext';

export function usePropiedades() {
  const context = useContext(PropiedadesContext);
  if (!context) {
    throw new Error('usePropiedades debe usarse dentro del Provider');
  }
  return context;
}
