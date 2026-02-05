const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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