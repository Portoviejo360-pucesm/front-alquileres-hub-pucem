'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { getColorByEstado } from '@/utils/getColorByEstado';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [-0.9536, -80.7371]; // Portoviejo
const DEFAULT_ZOOM = 13;

// Componente para manejar eventos del mapa
function MapBoundsHandler({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
    zoomend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  return null;
}

const Map = ({ properties = [], onBoundsChange, zoom = DEFAULT_ZOOM, showPopup = true }) => {
  const [userLocation, setUserLocation] = useState(null);

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
        // OJO!! HAY QUE IMPLEMENTAR QUE TOME LA UBICACIÓN REAL SI EL USUARIO DA PERMISO
        //Silenciar el error de geolocalización - es esperado si el usuario niega el permiso
        // El mapa seguirá funcionando con las coordenadas por defecto
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
      }
    );
  }, []);

  const validProperties = properties.filter(
    (p) =>
      p.lat !== undefined &&
      p.lng !== undefined &&
      !isNaN(Number(p.lat)) &&
      !isNaN(Number(p.lng))
  );

  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : validProperties.length > 0
    ? [Number(validProperties[0].lat), Number(validProperties[0].lng)]
    : DEFAULT_CENTER;

  const createCustomIcon = (price) => {
    return L.divIcon({
      className: 'custom-marker-container',
      html: `
        <style>
          .marker-pin:hover .marker-price {
            background-color: #111827 !important;
            color: white !important;
            transform: scale(1.08);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          }
        </style>
        <div class="marker-pin flex flex-col items-center cursor-pointer">
          <div class="marker-price bg-white text-gray-900 font-semibold px-3 py-1.5 rounded-lg shadow-md border border-gray-200 text-sm transition-all duration-200">
            ${price}
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid white;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
          "></div>
        </div>
      `,
      iconSize: [70, 45],
      iconAnchor: [35, 45],
      popupAnchor: [0, -45],
    });
  };

  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width:16px;
        height:16px;
        background:#3b82f6;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 12px rgba(59,130,246,0.8), 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full outline-none"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {onBoundsChange && <MapBoundsHandler onBoundsChange={onBoundsChange} />}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>
            <div className="text-center text-sm font-medium">
              📍 Tu ubicación actual
            </div>
          </Popup>
        </Marker>
      )}

      {validProperties.map((property) => {
        const popupContent = `
          <div class="property-map-popup">
            <div class="popup-image-container">
              <img
                src="${property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}"
                alt="${property.title || 'Propiedad'}"
                class="popup-image"
              />
              <span class="popup-badge ${getColorByEstado(property.estado || 'DISPONIBLE')}">
                ${property.estado || 'DISPONIBLE'}
              </span>
            </div>
            <div class="popup-content">
              <h3 class="popup-title">${property.title || 'Propiedad'}</h3>
              <div class="popup-location">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>${property.location || 'Portoviejo'}</span>
              </div>
              <div class="popup-footer">
                <div class="popup-price-container">
                  <span class="popup-price">${property.price || '$0'}</span>
                  <span class="popup-price-period">/mes</span>
                </div>
                <a href="/propiedades/${property.id}/detalles" class="popup-btn">
                  Ver detalles
                </a>
              </div>
            </div>
          </div>
        `;

        return (
          <Marker
            key={property.id}
            position={[Number(property.lat), Number(property.lng)]}
            icon={createCustomIcon(property.price)}
          >
            {showPopup && (
              <Popup maxWidth={320} minWidth={280}>
                <div dangerouslySetInnerHTML={{ __html: popupContent }} />
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
