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