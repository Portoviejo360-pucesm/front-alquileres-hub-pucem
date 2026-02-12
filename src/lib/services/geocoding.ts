// src/lib/services/geocoding.ts
// Servicio de geocodificación usando Nominatim (OpenStreetMap)

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PortoViejo360-AlquileresHub/1.0';

// Rate limiting: máximo 1 request por segundo
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 segundo

async function waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    lastRequestTime = Date.now();
}

export interface AddressSuggestion {
    displayName: string;
    lat: number;
    lon: number;
    address: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        state?: string;
        country?: string;
    };
}

/**
 * Geocodificación inversa: Obtener dirección desde coordenadas
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        await waitForRateLimit();

        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            format: 'json',
            addressdetails: '1',
            zoom: '18' // Nivel de detalle alto
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Construir dirección legible
        const address = data.address;
        const parts = [];

        if (address.road) parts.push(address.road);
        if (address.house_number) parts.push(address.house_number);
        if (address.neighbourhood) parts.push(address.neighbourhood);
        if (address.suburb) parts.push(address.suburb);
        if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village);
        }

        return parts.join(', ') || data.display_name;
    } catch (error) {
        console.error('Error en geocodificación inversa:', error);
        throw new Error('No se pudo obtener la dirección. Por favor, ingrésala manualmente.');
    }
}

/**
 * Búsqueda de direcciones: Obtener sugerencias basadas en texto
 */
export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
    try {
        if (!query || query.trim().length < 3) {
            return [];
        }

        await waitForRateLimit();

        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '5',
            countrycodes: 'ec', // Limitar a Ecuador
            bounded: '1',
            viewbox: '-81.0,-2.5,-79.0,1.5' // Bounding box aproximado de Ecuador
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item: any) => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            address: item.address || {}
        }));
    } catch (error) {
        console.error('Error en búsqueda de direcciones:', error);
        return [];
    }
}

/**
 * Debounce helper para búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
