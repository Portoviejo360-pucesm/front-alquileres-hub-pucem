'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MapWrapper from '@/components/MapWrapper';
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { getColorByEstado } from '@/utils/getColorByEstado';

export default function Home() {
  // 🔹 Propiedades YA normalizadas desde el contexto
  const { propiedades } = usePropiedades();

  // 🔌 WebSocket (solo sincroniza estado)
  usePropiedadesSocket();

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
    <div className="min-h-screen bg-brand-cream text-gray-900">
      <Navbar />

      <main className="flex flex-col md:flex-row h-[calc(100vh-89px)] overflow-hidden">

        {/* ================= LISTADO ================= */}
        <section
          className={`w-full md:w-[55%] bg-white ${
            showMapMobile ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="p-4 font-bold">
            {propiedades.length} propiedades disponibles en Portoviejo
          </div>

          {/* SCROLL INDEPENDIENTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-full">
            {propiedades.map(prop => (
              <div
                key={prop.id} // 🔑 key correcto
                className="relative rounded-xl shadow hover:shadow-lg overflow-hidden bg-white"
              >
                {/* BADGE DE ESTADO */}
                <span
                  className={`absolute top-2 left-2 px-3 py-1 text-xs text-white rounded-full font-bold ${getColorByEstado(
                    prop.estado
                  )}`}
                >
                  {prop.estado}
                </span>

                {/* IMAGEN */}
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
                      {prop.price}/mes
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

        {/* ================= MAPA ================= */}
        <section className="hidden md:block flex-1">
          <MapWrapper properties={propiedades} />
        </section>

        {/* BOTÓN MAPA MÓVIL */}
        <button
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full z-50"
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
