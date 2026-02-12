'use client';

import { useContext, useEffect, useState } from 'react';
import { PropiedadesContext } from '@/context/PropiedadesContext';
import { getPropiedades } from '@/services/api';

export function usePropiedades() {
  const context = useContext(PropiedadesContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    throw new Error('usePropiedades debe usarse dentro de PropiedadesProvider');
  }

  const { propiedades, setPropiedades } = context;

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        const res = await getPropiedades();

        const normalizadas = res.data.map((p: any) => ({
          id: p.id || p.propiedadId, // Backend usa 'id' en /registro
          lat: Number(p.latitudMapa),
          lng: Number(p.longitudMapa),
          price: `$${p.precioMensual}`,
          precioMensual: p.precioMensual,
          title: p.tituloAnuncio,
          image: p.fotos?.[0]?.urlImagen ||
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', // Fallback
          location: p.direccionTexto,
          estado: p.estado?.nombre || p.estado,
          fotos: p.fotos || [],
        }));

        setPropiedades(normalizadas);
      } catch (err) {
        console.error('❌ Error cargando propiedades', err);
        setError('Error al cargar propiedades');
      } finally {
        setLoading(false);
      }
    }

    // Solo cargar si no hay propiedades
    if (propiedades.length === 0) {
      cargar();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  return { propiedades, setPropiedades, loading, error };
}
