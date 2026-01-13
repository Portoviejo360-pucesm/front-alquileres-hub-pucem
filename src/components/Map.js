'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [-0.9536, -80.7371]; // Portoviejo
const DEFAULT_ZOOM = 13;

const Map = ({ properties = [] }) => {
  // 📍 Estado de ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);

  // 🔐 Pedir permiso de ubicación al cargar
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Permiso de ubicación denegado', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  // 🔒 Filtrar SOLO propiedades con coordenadas válidas
  const validProperties = properties.filter(
    (p) =>
      p.lat !== undefined &&
      p.lng !== undefined &&
      !isNaN(Number(p.lat)) &&
      !isNaN(Number(p.lng))
  );

  // 🎯 Centro del mapa
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : validProperties.length > 0
    ? [Number(validProperties[0].lat), Number(validProperties[0].lng)]
    : DEFAULT_CENTER;

  // 🎨 Icono personalizado de propiedades
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

  // 📍 Icono del usuario
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width:14px;
        height:14px;
        background:#2563eb;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 10px rgba(37,99,235,0.8);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full outline-none"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* 📍 Ubicación del usuario */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}

      {/* 🏠 Propiedades */}
      {validProperties.map((property) => (
        <Marker
          key={property.id}
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
