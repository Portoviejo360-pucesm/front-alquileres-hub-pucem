'use client';

import { useContext, useEffect } from 'react';
import { PropiedadesContext } from '@/context/PropiedadesContext';
import { getPropiedades } from '@/services/api';

export function usePropiedades() {
  const context = useContext(PropiedadesContext);

  if (!context) {
    throw new Error('usePropiedades debe usarse dentro de PropiedadesProvider');
  }

  const { propiedades, setPropiedades } = context;

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getPropiedades();

        const normalizadas = res.data.map((p: any) => ({
          id: p.id_propiedad, // 🔑 CLAVE ÚNICA
          lat: Number(p.latitud_mapa),
          lng: Number(p.longitud_mapa),
          price: `$${p.precio_mensual}`,
          title: p.titulo_anuncio,
          image:
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          location: p.direccion_texto,
          estado: p.estado,
        }));

        setPropiedades(normalizadas);
      } catch (err) {
        console.error('❌ Error cargando propiedades', err);
      }
    }

    cargar();
  }, [setPropiedades]);

  return { propiedades, setPropiedades };
}
