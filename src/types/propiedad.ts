export type PropiedadEstado = "disponible" | "ocupado" | "mantenimiento";

export type Propiedad = {
  id: string;
  titulo?: string;
  descripcion?: string;

  direccion?: string;
  ciudad?: string;
  sector?: string;

  precio: number;
  esAmoblado?: boolean;

  estadoId?: string; // si manejas catalogo por id
  estado?: { id: string; nombre: string }; // si backend lo incluye

  servicios?: Array<{ id: string; nombre: string }>;

  fotos?: string[]; // urls
  createdAt?: string;
};

export type PropiedadCreate = {
  // lo que pide crearPropiedadSchema
  // ejemplo base:
  direccion: string;
  precio: number;
  estadoId: string;
  publicoObjetivoId?: string;
  esAmoblado?: boolean;
  serviciosIds?: string[];
  fotos?: string[];
};

export type PropiedadUpdate = Partial<PropiedadCreate>;
