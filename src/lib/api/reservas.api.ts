// lib/api/reservas.api.ts

import { api } from './client';
import type { Reserva, CrearReservaRequest } from '@/types/reserva';

const USER_ID = '05849b45-3a8b-4cd3-b2d8-5de2162c42f3';

export const reservasApi = {
    /**
     * Crea una nueva reserva
     */
    crearReserva: async (data: CrearReservaRequest): Promise<Reserva> => {
        return api<Reserva>('/reservas', {
            method: 'POST',
            body: data,
            headers: {
                'x-user-id': USER_ID,
            },
        });
    },

    /**
     * Obtiene el historial de reservas del usuario actual
     */
    misReservas: async (): Promise<Reserva[]> => {
        return api<Reserva[]>('/reservas/mis-viajes', {
            method: 'GET',
            headers: {
                'x-user-id': USER_ID,
            },
        });
    },

    /**
     * Cancela una reserva existente
     */
    cancelarReserva: async (reservaId: string): Promise<Reserva> => {
        return api<Reserva>(`/reservas/${reservaId}/cancelar`, {
            method: 'PATCH',
            headers: {
                'x-user-id': USER_ID,
            },
        });
    },
};
