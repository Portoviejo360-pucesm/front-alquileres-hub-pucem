'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [-0.9536, -80.7371]; // Portoviejo
const DEFAULT_ZOOM = 13;

const Map = ({ properties = [] }) => {
  // 🔒 Filtrar SOLO propiedades con coordenadas válidas
  const validProperties = properties.filter(p =>
    p.lat !== undefined &&
    p.lng !== undefined &&
    !isNaN(Number(p.lat)) &&
    !isNaN(Number(p.lng))
  );

  // 🎯 Centro del mapa
  const center =
    validProperties.length > 0
      ? [Number(validProperties[0].lat), Number(validProperties[0].lng)]
      : DEFAULT_CENTER;

  // 🎨 Icono personalizado
  const createCustomIcon = (price) =>
    L.divIcon({
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
        <div class="marker-pin flex flex-col items-center cursor-pointer">
          <div class="marker-price bg-[#FBFBF8] text-[#2E5E4E] font-bold px-3 py-1 rounded-full shadow-md border-2 border-[#2E5E4E] text-sm">
            ${price}
          </div>
          <div style="border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #2E5E4E;"></div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 40],
      popupAnchor: [0, -40],
    });

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full outline-none"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {validProperties.map((property) => (
        <Marker
          key={property.id} // 🔑 ID real
          position={[Number(property.lat), Number(property.lng)]}
          icon={createCustomIcon(property.price)}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-[#2E5E4E]">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600">
                {property.location}
              </p>
              <p className="font-bold mt-1">
                {property.price}/mes
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
