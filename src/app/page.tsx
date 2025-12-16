'use client';

import { useState } from 'react';
import MapWrapper from "@/components/MapWrapper";
import Navbar from "@/components/Navbar";

// Datos simulados - Listos para reemplazar con datos de Supabase
const mockProperties = [
  { 
    id: 1, 
    lat: -0.9536, 
    lng: -80.7371, 
    price: '$120', 
    title: 'Departamento Céntrico', 
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Centro',
    beds: 2,
    baths: 1,
    area: 65,
    rating: 4.8
  },
  { 
    id: 2, 
    lat: -0.9500, 
    lng: -80.7400, 
    price: '$85', 
    title: 'Casa Moderna', 
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Norte',
    beds: 3,
    baths: 2,
    area: 110,
    rating: 4.9
  },
  { 
    id: 3, 
    lat: -0.9580, 
    lng: -80.7350, 
    price: '$150', 
    title: 'Penthouse con Vista', 
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Sur',
    beds: 3,
    baths: 2,
    area: 130,
    rating: 5.0
  },
  { 
    id: 4, 
    lat: -0.9520, 
    lng: -80.7320, 
    price: '$95', 
    title: 'Apartamento Amoblado', 
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Centro',
    beds: 2,
    baths: 1,
    area: 70,
    rating: 4.7
  },
  { 
    id: 5, 
    lat: -0.9560, 
    lng: -80.7380, 
    price: '$110', 
    title: 'Suite Ejecutiva', 
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Norte',
    beds: 1,
    baths: 1,
    area: 45,
    rating: 4.6
  },
  { 
    id: 6, 
    lat: -0.9545, 
    lng: -80.7355, 
    price: '$130', 
    title: 'Loft Industrial', 
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    location: 'Portoviejo, Centro',
    beds: 2,
    baths: 2,
    area: 95,
    rating: 4.8
  },
];

export default function Home() {
  const [favorites, setFavorites] = useState(new Set());
  const [showMapMobile, setShowMapMobile] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Navbar Global */}
      <Navbar />
      
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-89px)] md:h-[calc(100vh-89px)] w-full overflow-hidden">
        
        {/* SECCIÓN IZQUIERDA: LISTADO */}
        <section className={`w-full md:w-[60%] lg:w-[55%] flex flex-col bg-white md:border-r-2 border-brand-dark/10 md:shadow-xl ${showMapMobile ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Filtros con scroll horizontal en móvil */}
          <div className="px-4 md:px-6 py-3 md:py-4 flex gap-2 bg-white z-10 border-b border-brand-dark/10 shadow-sm overflow-x-auto scrollbar-hide">
            <button className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold border-2 border-gray-300 rounded-full text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-1.5 md:gap-2 hover:scale-105 shadow-sm whitespace-nowrap">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Fechas
            </button>
            <button className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold border-2 border-gray-300 rounded-full text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-1.5 md:gap-2 hover:scale-105 shadow-sm whitespace-nowrap">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Filtros
            </button>
            <button className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold border-2 border-gray-300 rounded-full text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-1.5 md:gap-2 hover:scale-105 shadow-sm whitespace-nowrap">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
              Ordenar
            </button>
          </div>

          {/* Barra de info responsive */}
          <div className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-brand-cream/40 via-brand-mint/10 to-brand-cream/40 border-b-2 border-brand-dark/5">
              <p className="text-xs md:text-sm font-semibold text-gray-800 flex flex-wrap items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-black text-brand-dark drop-shadow-sm">{mockProperties.length}</span> 
                <span className="text-gray-700">propiedades disponibles en</span>
                <span className="font-black text-brand-brown">Portoviejo</span>
              </p>
          </div>

        {/* Lista de propiedades con grid responsivo */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {mockProperties.map((prop) => (
              <div key={prop.id} className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                
                {/* Imagen con efectos premium responsive */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 mb-2 md:mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-500 ring-1 ring-gray-200 group-hover:ring-2 group-hover:ring-brand-mint/30">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Rating badge responsive */}
                  <div className="absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center gap-1 md:gap-1.5 ring-1 ring-brand-mint/20">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-brand-mint fill-current drop-shadow-sm" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-black text-brand-dark">{prop.rating}</span>
                  </div>

                  {/* Botón Favorito responsive */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id);
                    }}
                    className="absolute top-2 md:top-3 right-2 md:right-3 p-2 md:p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-125 transition-all duration-300 ring-1 ring-white/50"
                  >
                     <svg 
                       className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                         favorites.has(prop.id) 
                           ? 'fill-brand-brown stroke-brand-brown scale-110' 
                           : 'fill-none stroke-gray-900 hover:stroke-brand-brown'
                       }`} 
                       viewBox="0 0 24 24" 
                       strokeWidth="2.5"
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                  </button>

                  {/* Info rápida con animación - solo desktop */}
                  <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 items-end p-4">
                    <div className="flex flex-wrap gap-2 md:gap-3 text-brand-light text-xs md:text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="flex items-center gap-1 md:gap-1.5 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        {prop.beds}
                      </span>
                      <span className="flex items-center gap-1 md:gap-1.5 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                        {prop.baths}
                      </span>
                      <span className="flex items-center gap-1 md:gap-1.5 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        {prop.area}m²
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalles de la propiedad responsive */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm md:text-base font-black text-gray-900 leading-tight group-hover:text-brand-dark transition-colors duration-300">{prop.title}</h3>
                    <span className="text-sm md:text-base font-black text-brand-brown whitespace-nowrap">{prop.price}<span className="text-[10px] md:text-xs font-semibold text-gray-600">/noche</span></span>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-500">{prop.location}</p>
                  
                  {/* Info móvil - visible solo en pantallas pequeñas */}
                  <div className="flex md:hidden gap-3 pt-2 text-xs text-gray-600 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      {prop.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                      {prop.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                      {prop.area}m²
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </section>

      {/* SECCIÓN DERECHA: MAPA - Desktop siempre visible */}
      <section className="hidden md:block md:flex-1 relative">
        <MapWrapper properties={mockProperties} />
      </section>

      {/* Botón flotante para ver mapa - Solo Móvil */}
      <button
        onClick={() => setShowMapMobile(!showMapMobile)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl flex items-center gap-2 font-semibold text-sm hover:scale-105 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        {showMapMobile ? 'Ver Lista' : 'Ver Mapa'}
      </button>

      {/* Mapa Móvil en Modal/Fullscreen */}
      {showMapMobile && (
        <div className="md:hidden fixed inset-0 z-40 bg-white" style={{ top: '89px' }}>
          <MapWrapper properties={mockProperties} />
        </div>
      )}

    </main>
    </div>
  );
}
