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
   * Soporta credenciales estáticas de administrador para testing:
   * - Email: admin@portoviejo360.com
   * - Password: Admin123!
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Verificar si son las credenciales del administrador estático
    const ADMIN_EMAIL = 'admin@portoviejo360.com';
    const ADMIN_PASSWORD = 'Admin123!';

    if (payload.correo === ADMIN_EMAIL && payload.password === ADMIN_PASSWORD) {
      // Generar token mock para admin
      const adminToken = 'admin-static-token-' + Date.now();
      
      // Usuario administrador mock
      const adminUser: PerfilResponse = {
        id: 'admin-1',
        nombresCompletos: 'Administrador Principal',
        correo: ADMIN_EMAIL,
        rolId: 1, // Administrador
        fechaRegistro: '2024-01-01T00:00:00.000Z',
        rol: {
          nombre: 'Administrador'
        }
      };

      // Guardar token en localStorage
      tokenStorage.set(adminToken);

      return { 
        token: adminToken, 
        usuario: adminUser 
      };
    }

    // Si no son credenciales de admin, usar la API normal de Supabase
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
   * Retorna perfil de admin si el token es estático
   */
  async perfil(): Promise<PerfilResponse> {
    // Verificar si es un token de admin estático
    const currentToken = tokenStorage.get();
    if (currentToken?.startsWith('admin-static-token-')) {
      return {
        id: 'admin-1',
        nombresCompletos: 'Administrador Principal',
        correo: 'admin@portoviejo360.com',
        rolId: 1, // Administrador
        fechaRegistro: '2024-01-01T00:00:00.000Z',
        rol: {
          nombre: 'Administrador'
        }
      };
    }

    // Si no es admin estático, usar la API normal
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