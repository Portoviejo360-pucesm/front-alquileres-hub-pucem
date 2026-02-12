// lib/api/reservas.api.ts

import { api } from './client';
import type { Reserva, CrearReservaRequest } from '@/types/reserva';

export const reservasApi = {
    /**
     * Crea una nueva reserva
     */
    crearReserva: async (data: CrearReservaRequest): Promise<Reserva> => {
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
        return api<Reserva[]>('/reservas/mis-viajes', {
            method: 'GET',
            auth: true
        });
    },

    /**
     * Cancela una reserva existente
     */
    cancelarReserva: async (reservaId: string): Promise<Reserva> => {
        return api<Reserva>(`/reservas/${reservaId}/cancelar`, {
            method: 'PATCH',
            auth: true
        });
    },
};
