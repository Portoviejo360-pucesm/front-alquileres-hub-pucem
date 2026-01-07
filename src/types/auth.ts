// types/auth.ts

export type LoginRequest = {
  correo: string;
  password: string
};

export type LoginResponse = {
  token: string;
  usuario: Partial<PerfilResponse>;
};

export type RegisterRequest = {
  nombresCompletos: string;
  correo: string;
  password: string;
  rolId?: number;
};

export type PerfilResponse = {
  id: string;
  nombresCompletos: string;
  correo: string;
  rolId: number;
  fechaRegistro: string;
  rol: {
    nombre: string;
  };
  perfilVerificado?: {
    cedulaRuc: string;
    telefonoContacto: string;
    biografiaCorta?: string;
    estaVerificado: boolean;
    fechaSolicitud: string;
  };
  propiedades?: Array<{
    id: string;
    tituloAnuncio: string;
    precioMensual: number;
    estado: {
      nombre: string;
    };
  }>;
};