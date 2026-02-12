import { tokenStorage } from '@/lib/auth/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const API_PREFIX = '/api/v1';

export async function getPropiedades() {
  const res = await fetch(`${API_URL}${API_PREFIX}/propiedades/registro`, {
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

// ============================================
// VERIFICACIÓN - ENDPOINTS DE USUARIO
// ============================================

export const solicitarVerificacion = async (token: string, data: {
  cedulaRuc: string;
  telefonoContacto: string;
  biografiaCorta?: string;
  fotoDocumentoUrl?: string;
}) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/verificacion/solicitar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al solicitar verificación');
  }

  return res.json();
};

export const obtenerMiEstadoVerificacion = async (token: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/verificacion/mi-estado`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener estado de verificación');
  }

  return res.json();
};

// ============================================
// VERIFICACIÓN - ENDPOINTS DE ADMIN
// ============================================

export const getVerificacionesPendientes = async (token: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/admin/verificaciones/pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener verificaciones pendientes');
  }

  return res.json();
};

export const getTodasVerificaciones = async (token: string, filtros?: {
  estado?: string;
  busqueda?: string;
}) => {
  const params = new URLSearchParams();
  if (filtros?.estado) params.append('estado', filtros.estado);
  if (filtros?.busqueda) params.append('busqueda', filtros.busqueda);

  const url = `${API_URL}${API_PREFIX}/admin/verificaciones${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener verificaciones');
  }

  return res.json();
};

export const aprobarVerificacion = async (token: string, perfilId: number, notas?: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/admin/verificaciones/${perfilId}/aprobar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ notas }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al aprobar verificación');
  }

  return res.json();
};

export const rechazarVerificacion = async (token: string, perfilId: number, motivo: string) => {
  const res = await fetch(`${API_URL}${API_PREFIX}/admin/verificaciones/${perfilId}/rechazar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ motivo }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al rechazar verificación');
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