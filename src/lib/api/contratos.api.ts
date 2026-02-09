// lib/api/contratos.api.ts

import { api } from './client';
import type { Contrato, GenerarContratoRequest } from '@/types/reserva';
import { getUserIdFromToken } from '@/lib/auth/jwt';
import { tokenStorage } from '@/lib/auth/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';


export const contratosApi = {
    /**
     * Genera el PDF del contrato de arrendamiento
     */
    generarContrato: async (data: GenerarContratoRequest): Promise<Contrato> => {
        const userId = getUserIdFromToken();

        if (!userId) {
            throw new Error('No hay sesión activa. Por favor, inicia sesión.');
        }

        // El backend extraerá el userId del token JWT
        return api<Contrato>('/contratos/generar', {
            method: 'POST',
            body: data,
            auth: true
        });
    },

    /**
     * Descarga el archivo PDF del contrato
     * Retorna un Blob que puede ser descargado
     */
    descargarContrato: async (reservaId: string): Promise<Blob> => {
        const userId = getUserIdFromToken();

        if (!userId) {
            throw new Error('No hay sesión activa. Por favor, inicia sesión.');
        }

        const url = `${API_URL}${API_PREFIX}/contratos/${reservaId}/descargar`;
        const token = tokenStorage.get();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al descargar contrato: ${response.status}`);
        }

        return response.blob();
    },

    /**
     * Helper para iniciar la descarga del PDF en el navegador
     */
    downloadPDF: async (reservaId: string, fileName: string = 'contrato.pdf') => {
        const blob = await contratosApi.descargarContrato(reservaId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
};
