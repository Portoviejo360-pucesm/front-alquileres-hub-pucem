export type PropiedadEstado = "disponible" | "ocupada" | "mantenimiento";

// Tipo para el arrendador
export type Arrendador = {
  id?: string;
  nombre?: string;
  name?: string;
  email?: string;
  correo?: string;
  telefono?: string;
  phone?: string;
  celular?: string;
};

// Tipo flexible que soporta ambos formatos (backend y socket)
export type Propiedad = {
  // Campos del backend principal
  id?: string;
  tituloAnuncio?: string;
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  direccion?: string;
  direccionTexto?: string;
  ciudad?: string;
  sector?: string;
  location?: string;
  precio?: number;
  precioMensual?: number;
  precioMes?: number;
  price?: number;
  valor?: number;
  esAmoblado?: boolean;
  estadoId?: string;
  estado?: { id: string; nombre: string } | string;
  servicios?: Array<{ id: string; nombre: string }> | string[];
  amenities?: string[];
  amenidades?: string[];
  fotos?: string[];
  imagenes?: string[];
  images?: string[];
  image?: string;
  createdAt?: string;

  // Información adicional
  superficie?: number;
  area?: number;
  metros_cuadrados?: number;
  habitaciones?: number;
  bedrooms?: number;
  rooms?: number;
  banos?: number;
  bathrooms?: number;
  banios?: number;
  garaje?: boolean | string | number;
  parking?: boolean | string | number;
  estacionamiento?: boolean | string | number;

  // Arrendador
  arrendador?: Arrendador;

  // Campos del socket/mapa
  id_propiedad?: number;
  titulo_anuncio?: string;
  direccion_texto?: string;
  precio_mensual?: number;
  lat?: number;
  lng?: number;

  // Campos adicionales normalizados
  priceLabel?: string;
  mainImage?: string;
};

export type PropiedadCreate = {
  tituloAnuncio: string;
  descripcion?: string;
  precioMensual: number;
  direccionTexto?: string;
  latitudMapa: number;
  longitudMapa: number;
  esAmoblado: boolean;
  estadoId: number;
  publicoObjetivoId?: number;
  servicios: {
    servicioId: number;
    incluidoEnPrecio: boolean;
  }[];
  fotos: {
    urlImagen: string;
    esPrincipal: boolean;
  }[];
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
