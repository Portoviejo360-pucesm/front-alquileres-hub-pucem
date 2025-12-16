'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ properties = [] }) => {
  // Coordenadas por defecto
  const defaultCenter = [-0.9536, -80.7371]; // Portoviejo, Ecuador
  const defaultZoom = 13;

  // Crear icono personalizado estilo Airbnb con paleta de marca
  const createCustomIcon = (price) => {
    return L.divIcon({
      className: 'custom-marker-container',
      html: `
        <style>
          .marker-pin:hover .marker-price {
            background-color: #2E5E4E !important;
            color: #FBFBF8 !important;
            transform: scale(1.1);
          }
          .marker-pin:hover .marker-arrow {
            border-top-color: #2E5E4E !important;
          }
        </style>
        <div class="marker-pin relative flex flex-col items-center justify-center cursor-pointer" style="transform-origin: center bottom;">
          <div class="marker-price bg-[#FBFBF8] text-[#2E5E4E] font-bold px-3 py-1 rounded-full shadow-md border-2 border-[#2E5E4E] whitespace-nowrap text-sm z-10 transition-all duration-200">
            ${price}
          </div>
          <div class="marker-arrow w-0 h-0" style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #2E5E4E; margin-top: -1px; transition: all 0.2s;"></div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 40],
      popupAnchor: [0, -40],
    });
  };

  // Si no hay propiedades, usar coordenadas por defecto
  const center = properties.length > 0 
    ? [properties[0].lat, properties[0].lng] 
    : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={defaultZoom} 
      scrollWheelZoom={true}
      className="h-full w-full z-0 outline-none"
    >
      {/* Mapa base limpio estilo Airbnb (CartoDB Voyager) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={createCustomIcon(property.price)}
        >
          <Popup className="custom-popup">
            <div className="text-center">
              <h3 className="font-bold text-[#2E5E4E]">{property.title}</h3>
              {property.location && (
                <p className="text-gray-600 text-xs mt-1">{property.location}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
