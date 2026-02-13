// Incidencias Types
export interface Estado {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    orden: number;
}

export interface Prioridad {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    nivel: number;
    color?: string;
}

export interface Categoria {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
}

export interface PropiedadIncidencia {
    id_propiedad: number;
    titulo_anuncio: string;
    direccion_texto?: string;
    precio_mensual: number;
}

export interface Incidencia {
    id: number;
    titulo: string;
    descripcion: string;
    estado_id: number;
    prioridad_id: number;
    categoria_id?: number;
    propiedad_id: number;
    usuario_reportante_id: string;
    responsable_id?: string;
    fecha_creacion: string;
    fecha_actualizacion?: string;
    fecha_resolucion?: string;

    // Relations
    estado: Estado;
    prioridad: Prioridad;
    categoria?: Categoria;
    propiedad: {
        id_propiedad: number;
        titulo_anuncio: string;
    };
    reportante?: {
        nombres_completos: string;
        correo: string;
    };
    responsable?: {
        nombres_completos: string;
        correo: string;
    };
    historial?: HistorialIncidencia[];
    bitacora?: BitacoraMantenimiento[];
    comentarios?: Comentario[];
    adjuntos?: Adjunto[];
}

export interface HistorialIncidencia {
    id: number;
    incidencia_id: number;
    usuario_id: string;
    accion: string;
    descripcion?: string;
    valor_anterior?: string;
    valor_nuevo?: string;
    fecha_cambio: string;
    usuario: {
        nombres_completos: string;
    };
}

export interface BitacoraMantenimiento {
    id: number;
    incidencia_id: number;
    usuario_id: string;
    descripcion: string;
    fecha_creacion: string;
    usuario: {
        nombres_completos: string;
    };
}

export interface Comentario {
    id: number;
    incidencia_id: number;
    usuario_id: string;
    contenido: string;
    es_interno: boolean;
    fecha_creacion: string;
    fecha_actualizacion?: string;
    usuario: {
        nombres_completos: string;
    };
}

export interface Adjunto {
    id: number;
    incidencia_id: number;
    usuario_id: string;
    nombre_archivo: string;
    url_archivo: string;
    tipo_mime?: string;
    tamanio_bytes?: bigint;
    fecha_creacion: string;
    usuario: {
        nombres_completos: string;
    };
}

// DTOs
export interface CreateIncidenciaDto {
    titulo: string;
    descripcion: string;
    prioridad_codigo: string;
    categoria_codigo?: string;
    propiedad_id: number;
}

export interface UpdateIncidenciaDto {
    titulo?: string;
    descripcion?: string;
    prioridad_codigo?: string;
    categoria_codigo?: string;
    responsable_id?: string;
}

export interface UpdateStatusDto {
    estado_codigo: string;
    descripcion?: string;
}

export interface CreateComentarioDto {
    contenido: string;
    es_interno?: boolean;
}

export interface IncidenciaFilters {
    estado?: string;
    propiedad?: number;
    limit?: number;
    offset?: number;
}

export interface IncidenciasResponse {
    status: 'success';
    data: Incidencia[];
    total: number;
    limit: number;
    offset: number;
}
