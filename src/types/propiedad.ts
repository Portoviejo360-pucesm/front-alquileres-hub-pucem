export type PropiedadEstado = "disponible" | "ocupada" | "mantenimiento";

// Tipo flexible que soporta ambos formatos (backend y socket)
export type Propiedad = {
  // Campos del backend principal
  id?: string;
  tituloAnuncio?: string;
  titulo?: string;
  descripcion?: string;
  direccion?: string;
  direccionTexto?: string;
  ciudad?: string;
  sector?: string;
  precio?: number;
  precioMensual?: number;
  esAmoblado?: boolean;
  estadoId?: string;
  estado?: { id: string; nombre: string } | string;
  servicios?: Array<{ id: string; nombre: string }> | string[];
  fotos?: string[];
  imagenes?: string[];
  createdAt?: string;

  // Campos del socket/mapa
  id_propiedad?: number;
  titulo_anuncio?: string;
  direccion_texto?: string;
  precio_mensual?: number;
  lat?: number;
  lng?: number;

  // Permitir campos adicionales
  [key: string]: any;
};

export type PropiedadCreate = {
  // lo que pide crearPropiedadSchema
  direccion: string;
  precio: number;
  estadoId: string;
  publicoObjetivoId?: string;
  esAmoblado?: boolean;
  serviciosIds?: string[];
  fotos?: string[];
};

export type PropiedadUpdate = Partial<PropiedadCreate>;

// Filtros para propiedades
export interface PropiedadesFiltros {
  search?: string;
  estadoId?: string;
  precioMin?: number;
  precioMax?: number;
  esAmoblado?: boolean;
  ciudad?: string;
  sector?: string;
}
