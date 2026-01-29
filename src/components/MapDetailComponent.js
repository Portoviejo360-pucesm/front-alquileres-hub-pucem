'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono personalizado para el pin
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapDetailComponent({ lat, lng, title, address }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Crear el mapa centrado en la ubicación
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
      touchZoom: true,
    });

    mapInstanceRef.current = map;

    // Agregar capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Crear el marcador con popup
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // Contenido del popup
    const popupContent = `
      <div style="text-align: center; padding: 8px;">
        <strong style="color: #2d5a4c; font-size: 14px;">${title}</strong>
        ${address ? `<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${address}</p>` : ''}
      </div>
    `;
    
    marker.bindPopup(popupContent).openPopup();
    markerRef.current = marker;

    // Agregar controles de zoom personalizados
    map.zoomControl.setPosition('topright');

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title, address]);

  // Actualizar posición si cambian las coordenadas
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = L.latLng(lat, lng);
      mapInstanceRef.current.setView(newLatLng, 16);
      markerRef.current.setLatLng(newLatLng);
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
