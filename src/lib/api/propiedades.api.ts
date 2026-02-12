import { api } from "@/lib/api/client";
import type { Propiedad, PropiedadCreate, PropiedadUpdate } from "@/types/propiedad";

export type PropiedadesFiltros = {
  estadoId?: string;
  publicoObjetivoId?: string;
  precioMin?: number;
  precioMax?: number;
  esAmoblado?: boolean;
};

function toQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const propiedadesApi = {
  listarPublico: (filtros: PropiedadesFiltros = {}) =>
    api<Propiedad[]>(`/propiedades${toQuery(filtros)}`, { auth: false }),

  obtenerPorId: (id: string) =>
    api<Propiedad>(`/propiedades/${id}`, { auth: false }),

  misPropiedades: () =>
    api<Propiedad[]>(`/propiedades/registro/mis-propiedades`, { auth: true }),

  crear: (payload: PropiedadCreate) =>
    api<Propiedad>(`/propiedades/registro`, { method: "POST", body: payload, auth: true }),

  actualizar: (id: string, payload: PropiedadUpdate) =>
    api<Propiedad>(`/propiedades/registro/${id}`, { method: "PUT", body: payload, auth: true }),

  eliminar: (id: string) =>
    api<{ message: string }>(`/propiedades/registro/${id}`, { method: "DELETE", auth: true }),
};
