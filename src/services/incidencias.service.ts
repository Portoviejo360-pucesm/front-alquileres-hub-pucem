import { api } from './api';
import { tokenStorage } from '@/lib/auth/token';
import type {
    Incidencia,
    IncidenciasResponse,
    CreateIncidenciaDto,
    UpdateIncidenciaDto,
    UpdateStatusDto,
    CreateComentarioDto,
    IncidenciaFilters,
    Estado,
    Prioridad,
    Categoria,
    PropiedadIncidencia,
    BitacoraMantenimiento,
    Comentario,
    Adjunto,
} from '@/types/incidencias';

const INCIDENCIAS_BASE = '/incidents';
const CATALOGOS_BASE = '/catalogos-mantenimiento';


export class IncidenciasService {
    // ==================== Catálogos ====================

    /**
     * Get all estados (incident states)
     */
    static async getEstados(): Promise<Estado[]> {
        const response = await api<{ status: string; data: Estado[] }>(`${CATALOGOS_BASE}/estados`);
        return response.data;
    }

    /**
     * Get all prioridades (incident priorities)
     */
    static async getPrioridades(): Promise<Prioridad[]> {
        const response = await api<{ status: string; data: Prioridad[] }>(`${CATALOGOS_BASE}/prioridades`);
        return response.data;
    }

    /**
     * Get all categorias (incident categories)
     */
    static async getCategorias(): Promise<Categoria[]> {
        const response = await api<{ status: string; data: Categoria[] }>(`${CATALOGOS_BASE}/categorias`);
        return response.data;
    }

    /**
     * Get user properties with active contracts
     */
    static async getUserProperties(): Promise<PropiedadIncidencia[]> {
        const response = await api<{ status: string; data: PropiedadIncidencia[] }>(`${INCIDENCIAS_BASE}/user-properties`);
        return response.data;
    }

    // ==================== Incidencias ====================

    /**
     * Create a new incident with optional file uploads
     */
    static async create(data: CreateIncidenciaDto, files?: File[]): Promise<Incidencia> {
        const formData = new FormData();

        // Add form fields
        formData.append('titulo', data.titulo);
        formData.append('descripcion', data.descripcion);
        formData.append('prioridad_codigo', data.prioridad_codigo);
        formData.append('propiedad_id', data.propiedad_id.toString());

        if (data.categoria_codigo) {
            formData.append('categoria_codigo', data.categoria_codigo);
        }

        // Add files if provided
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${INCIDENCIAS_BASE}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenStorage.get()}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear incidencia');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Get all incidents with optional filters
     */
    static async getAll(filters?: IncidenciaFilters): Promise<IncidenciasResponse> {
        const params = new URLSearchParams();

        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.propiedad) params.append('propiedad', filters.propiedad.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        const url = queryString ? `${INCIDENCIAS_BASE}?${queryString}` : INCIDENCIAS_BASE;

        return api<IncidenciasResponse>(url);
    }

    /**
     * Get incident by ID
     */
    static async getById(id: number): Promise<Incidencia> {
        const response = await api<{ status: string; data: Incidencia }>(`${INCIDENCIAS_BASE}/${id}`);
        return response.data;
    }

    /**
     * Update incident details
     */
    static async update(id: number, data: UpdateIncidenciaDto): Promise<Incidencia> {
        const response = await api<{ status: string; data: Incidencia }>(`${INCIDENCIAS_BASE}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    /**
     * Update incident status
     */
    static async updateStatus(id: number, data: UpdateStatusDto): Promise<Incidencia> {
        const response = await api<{ status: string; data: Incidencia }>(`${INCIDENCIAS_BASE}/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    /**
     * Delete incident
     */
    static async delete(id: number): Promise<void> {
        await api(`${INCIDENCIAS_BASE}/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== Bitácora ====================

    /**
     * Add entry to maintenance log
     */
    static async addBitacoraEntry(incidenciaId: number, descripcion: string): Promise<BitacoraMantenimiento> {
        const response = await api<{ status: string; data: BitacoraMantenimiento }>(
            `${INCIDENCIAS_BASE}/${incidenciaId}/bitacora`,
            {
                method: 'POST',
                body: JSON.stringify({ descripcion }),
            }
        );
        return response.data;
    }

    /**
     * Get maintenance log for an incident
     */
    static async getBitacora(incidenciaId: number): Promise<BitacoraMantenimiento[]> {
        const response = await api<{ status: string; data: BitacoraMantenimiento[] }>(
            `${INCIDENCIAS_BASE}/${incidenciaId}/bitacora`
        );
        return response.data;
    }

    // ==================== Comentarios ====================

    /**
     * Add comment to incident
     */
    static async addComentario(incidenciaId: number, data: CreateComentarioDto): Promise<Comentario> {
        const response = await api<{ status: string; data: Comentario }>(
            `${INCIDENCIAS_BASE}/${incidenciaId}/comentarios`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        return response.data;
    }

    /**
     * Get comments for an incident
     */
    static async getComentarios(incidenciaId: number): Promise<Comentario[]> {
        const response = await api<{ status: string; data: Comentario[] }>(
            `${INCIDENCIAS_BASE}/${incidenciaId}/comentarios`
        );
        return response.data;
    }

    // ==================== Adjuntos ====================

    /**
     * Upload attachment to incident
     */
    static async uploadAdjunto(incidenciaId: number, file: File): Promise<Adjunto> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api${INCIDENCIAS_BASE}/${incidenciaId}/adjuntos`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenStorage.get()}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al subir archivo');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Get attachments for an incident
     */
    static async getAdjuntos(incidenciaId: number): Promise<Adjunto[]> {
        const response = await api<{ status: string; data: Adjunto[] }>(
            `${INCIDENCIAS_BASE}/${incidenciaId}/adjuntos`
        );
        return response.data;
    }

    /**
     * Delete attachment
     */
    static async deleteAdjunto(incidenciaId: number, adjuntoId: number): Promise<void> {
        await api(`${INCIDENCIAS_BASE}/${incidenciaId}/adjuntos/${adjuntoId}`, {
            method: 'DELETE',
        });
    }
}
