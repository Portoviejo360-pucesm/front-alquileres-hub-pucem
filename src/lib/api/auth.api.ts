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
    const response = await api<{ success: boolean; message: string; data: any }>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
    return { message: response.message || 'Usuario registrado exitosamente' };
  },

  /**
   * Iniciar sesión
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await api<{ success: boolean; message: string; data: LoginResponse }>("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });

    // Extraer data de la respuesta envuelta
    const { token, usuario } = response.data;

    // Guardar token en localStorage
    tokenStorage.set(token);

    return { token, usuario };
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async perfil(): Promise<PerfilResponse> {
    const response = await api<{ success: boolean; data: PerfilResponse }>("/auth/perfil", {
      method: "GET",
      auth: true
    });
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    tokenStorage.clear();
  },
};