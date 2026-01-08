// types/arrendador.ts

/**
 * Solicitud de verificación de perfil de arrendador
 */
export interface SolicitudVerificacion {
    cedulaRuc: string;
    telefonoContacto: string;
    biografiaCorta?: string;
    fotoDocumentoUrl?: string;
}

/**
 * Estado de verificación del perfil
 */
export interface EstadoVerificacion {
    esVerificado: boolean;
    estadoSolicitud?: 'pendiente' | 'aprobada' | 'rechazada';
    fechaSolicitud?: string;
    motivoRechazo?: string;
}

/**
 * Datos para actualizar perfil de arrendador
 */
export interface ActualizarPerfil {
    nombresCompletos?: string;
    cedulaRuc: string;
    telefonoContacto: string;
    biografiaCorta?: string;
    fotoDocumentoUrl?: string;
}

/**
 * Respuesta de perfil de arrendador
 */
export interface PerfilArrendador {
    id: number;
    usuarioId: number;
    cedulaRuc: string;
    telefonoContacto: string;
    biografiaCorta?: string;
    fotoDocumentoUrl?: string;
    esVerificado: boolean;
    fechaVerificacion?: string;
    createdAt: string;
    updatedAt: string;
}
