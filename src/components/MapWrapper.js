'use client';

import dynamic from 'next/dynamic';

// Importar el componente Map sin SSR para evitar el error "window is not defined"
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Cargando mapa...</p>
    </div>
  ),
});

const MapWrapper = ({ properties }) => {
  return <Map properties={properties} />;
};

export default MapWrapper;
