import type { Propiedad } from '@/types/propiedad';

export function parsePrice(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const cleaned = String(value).replace(/[^\d.]/g, '');
  const num = cleaned ? Number(cleaned) : NaN;
  return Number.isFinite(num) ? num : null;
}

export function getPropertyId(p: Propiedad, index: number): string | number {
  return p.id ?? p.uuid ?? p._id ?? p.propiedad_id ?? p.codigo ?? index;
}

export function getPropertyTitle(p: Propiedad): string {
  return p.title ?? p.nombre ?? p.titulo ?? p.tituloAnuncio ?? 'Propiedad';
}

export function getPropertyLocation(p: Propiedad): string {
  return p.location ?? p.ubicacion ?? p.direccion ?? p.ciudad ?? '';
}

export function getPropertyImage(p: Propiedad): string {
  return (
    p.image ??
    p.imagen ??
    p.imagen_url ??
    p.foto ??
    (Array.isArray(p.fotos) && p.fotos[0]) ??
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  );
}

export function getPropertyStatus(p: Propiedad): string {
  if (typeof p.estado === 'object' && p.estado !== null && 'nombre' in p.estado) {
    return p.estado.nombre;
  }
  return p.estado ?? p.status ?? p.estado_propiedad ?? 'DISPONIBLE';
}

export function getPropertyPriceLabel(p: Propiedad): string {
  const raw = p.price ?? p.precio ?? p.precio_mensual ?? p.precioMensual ?? p.precioMes ?? p.valor;
  const n = parsePrice(raw);
  if (n != null) return `$${n.toFixed(2)}`;
  return raw != null ? String(raw) : '$0.00';
}

export function normalizeAmenityKey(s: string): string {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');
}

export function getPropertyAmenities(p: Propiedad): string[] {
  const raw =
    p.amenities ??
    p.servicios ??
    p.servicios_incluidos ??
    p.caracteristicas ??
    p.extras;

  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((x) => normalizeAmenityKey(String(x)));
  }

  if (typeof raw === 'object') {
    return Object.entries(raw)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => normalizeAmenityKey(k));
  }

  return String(raw)
    .split(',')
    .map((s) => normalizeAmenityKey(s.trim()))
    .filter(Boolean);
}
