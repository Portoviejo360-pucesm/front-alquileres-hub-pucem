import { api } from "@/lib/api/client";
import type { 
  SolicitudVerificacion, 
  EstadoVerificacion, 
  ActualizarPerfil 
} from "@/types/arrendador";

export const arrendadoresApi = {
  /**
   * Solicitar verificación de perfil de arrendador
   */
  solicitarVerificacion: (payload: SolicitudVerificacion) =>
    api<{ message: string }>("/perfil/solicitar-verificacion", { 
      method: "POST", 
      body: payload, 
      auth: true 
    }),

  /**
   * Obtener estado de verificación del perfil
   */
  obtenerEstadoVerificacion: () =>
    api<EstadoVerificacion>("/perfil/estado-verificacion", { 
      method: "GET", 
      auth: true 
    }),

  /**
   * Actualizar perfil de arrendador
   */
  actualizarPerfil: (payload: ActualizarPerfil) =>
    api<{ message: string }>("/perfil", { 
      method: "PUT", 
      body: payload, 
      auth: true 
    }),
};
