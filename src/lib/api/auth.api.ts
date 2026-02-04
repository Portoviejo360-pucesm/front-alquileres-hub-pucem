// lib/api/auth.api.ts

import { tokenStorage } from "@/lib/auth/token";
import type {
  LoginRequest,
  LoginResponse,
  PerfilResponse,
  RegisterRequest
} from "@/types/auth";

// TEMPORAL: Conectar directamente al backend de auth (puerto 8001)
// hasta resolver el problema del proxy en el API Gateway
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8001";
const AUTH_API_PREFIX = "/api/v1/auth";

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${AUTH_API_URL}${AUTH_API_PREFIX}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const authApi = {
  /**
   * Registrar nuevo usuario
   */
  async register(payload: RegisterRequest): Promise<{ message: string }> {
    const response = await authFetch<{ success: boolean; message: string; data: any }>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { message: response.message || 'Usuario registrado exitosamente' };
  },

  /**
   * Iniciar sesión
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await authFetch<{ success: boolean; message: string; data: LoginResponse }>("/login", {
      method: "POST",
      body: JSON.stringify(payload),
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
    const token = tokenStorage.get();
    const response = await authFetch<{ success: boolean; data: PerfilResponse }>("/perfil", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
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