export type Propiedad = {
  id_propiedad: number;
  titulo_anuncio: string;
  direccion_texto?: string;
  estado?: string;
  precio_mensual?: number;
  lat?: number;
  lng?: number;
  servicios?: string[];
  imagenes?: string[];
  // campos adicionales permitidos
  [key: string]: any;
};