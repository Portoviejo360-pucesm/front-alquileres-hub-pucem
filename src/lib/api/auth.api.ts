// lib/api/auth.api.ts

import { api } from "@/lib/api/client";
import { tokenStorage } from "@/lib/auth/token";
import type { 
  LoginRequest, 
  LoginResponse, 
  PerfilResponse, 
  RegisterRequest 
} from "@/types/auth";

export const authApi = {
  /**
   * Registrar nuevo usuario
   */
  async register(payload: RegisterRequest): Promise<{ message: string }> {
    return api<{ message: string }>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },

  /**
   * Iniciar sesión
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const data = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });

    // Guardar token en localStorage
    tokenStorage.set(data.token);
    return data;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async perfil(): Promise<PerfilResponse> {
    return api<PerfilResponse>("/auth/perfil", { 
      method: "GET", 
      auth: true 
    });
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    tokenStorage.clear();
  },
};