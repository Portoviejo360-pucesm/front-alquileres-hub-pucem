// lib/api/reservas.api.ts

import { api } from './client';
import type { Reserva, CrearReservaRequest } from '@/types/reserva';
import { getUserIdFromToken } from '@/lib/auth/jwt';

export const reservasApi = {
    /**
     * Crea una nueva reserva
     */
    crearReserva: async (data: CrearReservaRequest): Promise<Reserva> => {
        const userId = getUserIdFromToken();

        if (!userId) {
            throw new Error('No hay sesión activa. Por favor, inicia sesión.');
        }

        // El backend extraerá el userId del token JWT
        return api<Reserva>('/reservas', {
            method: 'POST',
            body: data,
            auth: true
        });
    },

    /**
     * Obtiene el historial de reservas del usuario actual
     */
    misReservas: async (): Promise<Reserva[]> => {
        const userId = getUserIdFromToken();

        if (!userId) {
            throw new Error('No hay sesión activa. Por favor, inicia sesión.');
        }

        // El backend extraerá el userId del token JWT
        return api<Reserva[]>('/reservas/mis-viajes', {
            method: 'GET',
            auth: true
        });
    },

    /**
     * Cancela una reserva existente
     */
    cancelarReserva: async (reservaId: string): Promise<Reserva> => {
        const userId = getUserIdFromToken();

        if (!userId) {
            throw new Error('No hay sesión activa. Por favor, inicia sesión.');
        }

        // El backend extraerá el userId del token JWT
        return api<Reserva>(`/reservas/${reservaId}/cancelar`, {
            method: 'PATCH',
            auth: true
        });
    },
};
