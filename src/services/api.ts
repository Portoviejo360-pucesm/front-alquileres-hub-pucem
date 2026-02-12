import { tokenStorage } from '@/lib/auth/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const API_PREFIX = '/api';

export async function getPropiedades() {
  const res = await fetch(`${API_URL}${API_PREFIX}/propiedades`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener propiedades');
  }

  return res.json();
}

export const getServiciosPorPropiedad = async (id: number) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/propiedades/${id}/servicios`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
};

export const getMisArriendos = async (token: string, userId: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/reservas/mis-viajes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener arriendos');
  }

  return res.json();
};

export const getUsuarios = async (token: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/auth/usuarios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Generic API helper function for authenticated requests
 */
export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = tokenStorage.get();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options?.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const url = `${API_URL}${API_PREFIX}${endpoint}`;
  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}