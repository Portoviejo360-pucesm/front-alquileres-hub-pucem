'use client';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Cargando mapa...</div>
});

interface LocationPickerProps {
    onLocationChange: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
    initialLat?: number;
    initialLng?: number;
}

export function LocationPicker({ onLocationChange, onAddressChange, initialLat, initialLng }: LocationPickerProps) {
    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300">
            <LocationPickerMap
                onLocationSelect={onLocationChange}
                onAddressChange={onAddressChange}
                initialLat={initialLat}
                initialLng={initialLng}
            />
        </div>
    );
}
