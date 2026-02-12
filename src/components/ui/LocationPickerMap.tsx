'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { reverseGeocode } from '@/lib/services/geocoding';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerMapProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
}

function LocationMarker({
    onLocationSelect,
    onAddressChange,
    position
}: {
    onLocationSelect: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
    position: L.LatLngExpression;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const map = useMapEvents({
        async click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);

            // Obtener dirección si se proporcionó callback
            if (onAddressChange) {
                setIsLoading(true);
                try {
                    const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
                    onAddressChange(address);
                } catch (error) {
                    console.error('Error obteniendo dirección:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        },
    });

    useEffect(() => {
        map.flyTo(position as L.LatLngTuple, map.getZoom());
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}>
            {isLoading && (
                <Popup>
                    <div style={{ textAlign: 'center', padding: '4px' }}>
                        Obteniendo dirección...
                    </div>
                </Popup>
            )}
        </Marker>
    );
}

export default function LocationPickerMap({
    initialLat = -1.05458,
    initialLng = -80.45445,
    onLocationSelect,
    onAddressChange
}: LocationPickerMapProps) {
    const [position, setPosition] = useState<L.LatLngExpression>([initialLat, initialLng]);

    useEffect(() => {
        setPosition([initialLat, initialLng]);
    }, [initialLat, initialLng]);

    const handleSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    return (
        <MapContainer center={position as L.LatLngExpression} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
                onLocationSelect={handleSelect}
                onAddressChange={onAddressChange}
                position={position}
            />
        </MapContainer>
    );
}
