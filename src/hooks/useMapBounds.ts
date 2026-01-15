import { useState, useCallback } from 'react';
import { Propiedad } from '@/types/propiedad';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function useMapBounds() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [visibleProperties, setVisibleProperties] = useState<Propiedad[]>([]);

  const updateBounds = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds);
  }, []);

  const filterPropertiesByBounds = useCallback((properties: Propiedad[]) => {
    if (!bounds || !properties) {
      setVisibleProperties(properties || []);
      return properties || [];
    }

    const filtered = properties.filter((property) => {
      const lat = Number(property.lat);
      const lng = Number(property.lng);

      if (isNaN(lat) || isNaN(lng)) return false;

      return (
        lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east
      );
    });

    setVisibleProperties(filtered);
    return filtered;
  }, [bounds]);

  return {
    bounds,
    updateBounds,
    visibleProperties,
    filterPropertiesByBounds
  };
}
