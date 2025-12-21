const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getPropiedades() {
  const res = await fetch(`${API_URL}/propiedades`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener propiedades');
  }

  return res.json();
}

export const getServiciosPorPropiedad = async (id: number) => {
  const res = await fetch(`${API_URL}/propiedades/${id}/servicios`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
};
