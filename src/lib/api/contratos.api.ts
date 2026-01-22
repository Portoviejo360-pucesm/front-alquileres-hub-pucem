// lib/api/contratos.api.ts

import { api } from './client';
import type { Contrato, GenerarContratoRequest } from '@/types/reserva';

const USER_ID = '05849b45-3a8b-4cd3-b2d8-5de2162c42f3';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';

export const contratosApi = {
    /**
     * Genera el PDF del contrato de arrendamiento
     */
    generarContrato: async (data: GenerarContratoRequest): Promise<Contrato> => {
        return api<Contrato>('/contratos/generar', {
            method: 'POST',
            body: data,
            headers: {
                'x-user-id': USER_ID,
            },
        });
    },

    /**
     * Descarga el archivo PDF del contrato
     * Retorna un Blob que puede ser descargado
     */
    descargarContrato: async (reservaId: string): Promise<Blob> => {
        const url = `${API_URL}${API_PREFIX}/contratos/${reservaId}/descargar`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-user-id': USER_ID,
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
