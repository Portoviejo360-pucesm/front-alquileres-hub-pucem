import { api } from "@/lib/api/client";
import type { EstadoPropiedad, Servicio, TipoPublico, Rol } from "@/types/catalogos";

export const catalogosApi = {
  servicios: () => api<Servicio[]>("/catalogos/servicios", { auth: false }),
  estados: () => api<EstadoPropiedad[]>("/catalogos/estados", { auth: false }),
  tiposPublico: () => api<TipoPublico[]>("/catalogos/tipos-publico", { auth: false }),
  roles: () => api<Rol[]>("/catalogos/roles", { auth: false }),
};
