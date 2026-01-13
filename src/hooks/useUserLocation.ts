'use client';

import { useEffect, useState } from 'react';

type Location = {
  lat: number;
  lng: number;
};

export function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      err => {
        setError('Permiso de ubicación denegado');
        console.warn('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  return { location, error };
}
