'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MapWrapper from '@/components/MapWrapper';
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { getColorByEstado } from '@/utils/getColorByEstado';

// ===============================
// MOCK SOLO PARA VISUAL (SIN LÓGICA)
// ===============================
const mockProperties = [
  {
    id: 1,
    lat: -0.9536,
    lng: -80.7371,
    price: '$120',
    title: 'Departamento Céntrico',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    location: 'Portoviejo, Centro',
    beds: 2,
    baths: 1,
    area: 65,
    rating: 4.8,
  },
  {
    id: 2,
    lat: -0.95,
    lng: -80.74,
    price: '$85',
    title: 'Casa Moderna',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    location: 'Portoviejo, Norte',
    beds: 3,
    baths: 2,
    area: 110,
    rating: 4.9,
  },
  {
    id: 3,
    lat: -0.958,
    lng: -80.735,
    price: '$150',
    title: 'Penthouse con Vista',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    location: 'Portoviejo, Sur',
    beds: 3,
    baths: 2,
    area: 130,
    rating: 5,
  },
];

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function Home() {
  const { propiedades, setPropiedades } = usePropiedades();

  // 🔌 SOLO ESCUCHA Y SINCRONIZA (NO DEVUELVE DATA)
  usePropiedadesSocket();

  // 🟡 Fallback solo si el backend aún no responde
  useEffect(() => {
    if (propiedades.length === 0) {
      setPropiedades(
        mockProperties.map(p => ({
          ...p,
          estado: 'DISPONIBLE', // estado inicial neutro
        }))
      );
    }
  }, [propiedades.length, setPropiedades]);

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="flex flex-col md:flex-row h-[calc(100vh-89px)] overflow-hidden">

        {/* LISTADO */}
        <section
          className={`w-full md:w-[55%] bg-white ${
            showMapMobile ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="p-4 font-bold">
            {propiedades.length} propiedades disponibles en Portoviejo
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto">
            {propiedades.map(prop => (
              <div
                key={prop.id}
                className="relative rounded-xl shadow hover:shadow-lg overflow-hidden"
              >
                {/* BADGE DE ESTADO (100% DINÁMICO) */}
                <span
                  className={`absolute top-2 left-2 px-3 py-1 text-xs text-white rounded-full font-bold ${getColorByEstado(
                    prop.estado
                  )}`}
                >
                  {prop.estado}
                </span>

                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3">
                  <h3 className="font-bold">{prop.title}</h3>
                  <p className="text-sm text-gray-500">{prop.location}</p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">
                      {prop.price}/noche
                    </span>

                    <button onClick={() => toggleFavorite(prop.id)}>
                      {favorites.has(prop.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAPA */}
        <section className="hidden md:block flex-1">
          <MapWrapper properties={propiedades} />
        </section>

        {/* BOTÓN MAPA MÓVIL */}
        <button
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full"
        >
          {showMapMobile ? 'Ver Lista' : 'Ver Mapa'}
        </button>

        {showMapMobile && (
          <div className="md:hidden fixed inset-0 bg-white z-40 pt-[89px]">
            <MapWrapper properties={propiedades} />
          </div>
        )}
      </main>
    </div>
  );
}
