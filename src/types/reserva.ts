// types/reserva.ts

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';

export interface Reserva {
    id: string;
    propiedadId: number;
    usuarioId: string;
    fechaEntrada: string;
    fechaSalida: string;
    estado: EstadoReserva;
    totalPagar: string;
    createdAt: string;
    updatedAt: string;
    propiedad?: {
        id: number;
        tituloAnuncio: string;
        precioMensual: string;
        direccion: string;
        ciudad: string;
        fotos?: string[];
    };
}

export interface CrearReservaRequest {
    propiedadId: number;
    fechaEntrada: string;
    fechaSalida: string;
}

export interface Contrato {
    id: string;
    reservaId: string;
    urlArchivo: string;
    fechaGeneracion: string;
    reserva?: Reserva;
}

export interface GenerarContratoRequest {
    reservaId: string;
}
