// lib/auth/jwt.ts

import { tokenStorage } from './token';

/**
 * Estructura del payload del JWT
 */
export interface JWTPayload {
    id: string;           // UUID del usuario
    correo: string;
    rolId: number;
    iat: number;          // Issued at
    exp: number;          // Expiration
}

/**
 * Decodifica un token JWT y retorna el payload
 * NOTA: Esto NO valida la firma del token, solo lo decodifica
 * La validación de la firma se hace en el backend
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        // El JWT tiene 3 partes separadas por puntos: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Token JWT inválido: formato incorrecto');
            return null;
        }

        // Decodificar la segunda parte (payload) que está en base64
        const payload = parts[1];
        const decoded = atob(payload);
        const parsed = JSON.parse(decoded);

        return parsed as JWTPayload;
    } catch (error) {
        console.error('Error al decodificar JWT:', error);
        return null;
    }
}

/**
 * Obtiene el ID del usuario desde el token almacenado
 * @returns El UUID del usuario o null si no hay token o es inválido
 */
export function getUserIdFromToken(): string | null {
    const token = tokenStorage.get();

    if (!token) {
        console.warn('No hay token de autenticación');
        return null;
    }

    const payload = decodeJWT(token);

    if (!payload || !payload.id) {
        console.error('Token inválido o sin ID de usuario');
        return null;
    }

    return payload.id;
}

/**
 * Obtiene el payload completo del token almacenado
 */
export function getTokenPayload(): JWTPayload | null {
    const token = tokenStorage.get();

    if (!token) {
        return null;
    }

    return decodeJWT(token);
}

/**
 * Verifica si el token ha expirado
 */
export function isTokenExpired(): boolean {
    const payload = getTokenPayload();

    if (!payload || !payload.exp) {
        return true;
    }

    // exp está en segundos, Date.now() en milisegundos
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}
