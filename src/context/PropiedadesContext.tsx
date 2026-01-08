'use client';

import { createContext, useState, useMemo } from 'react';

export type Propiedad = {
  id: number;
  estado: string;
  [key: string]: any;
};

type ContextType = {
  propiedades: Propiedad[];
  setPropiedades: React.Dispatch<React.SetStateAction<Propiedad[]>>;
};

export const PropiedadesContext = createContext<ContextType | null>(null);

export function PropiedadesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  const value = useMemo(
    () => ({ propiedades, setPropiedades }),
    [propiedades]
  );

  return (
    <PropiedadesContext.Provider value={value}>
      {children}
    </PropiedadesContext.Provider>
  );
}
