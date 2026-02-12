import type { Propiedad } from '@/types/propiedad';

// ==================== CONSTANTES ====================
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267';
const DEFAULT_STATUS = 'DISPONIBLE';

// ==================== UTILIDADES BÁSICAS ====================

/**
 * Parsea un valor de precio a número de forma segura.
 */
export function parsePrice(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const cleaned = String(value).replace(/[^\d.]/g, '');
  const num = cleaned ? Number(cleaned) : NaN;
  return Number.isFinite(num) ? num : null;
}

/**
 * Mapeo de nombres de servicios de la BD a keys de filtro.
 */
const SERVICE_NAME_TO_KEY: Record<string, string> = {
  'internet / wifi': 'internet',
  'internet/wifi': 'internet',
  'internet': 'internet',
  'wifi': 'internet',
  'agua potable': 'agua_potable',
  'luz electrica': 'luz_electrica',
  'bano privado': 'bano_privado',
  'cocina compartida': 'cocina_compartida',
  'garaje': 'garaje',
  'aire acondicionado': 'aire_acondicionado',
  'zona lavanderia': 'zona_lavanderia',
};

/**
 * Normaliza una clave de amenidad removiendo acentos y espacios.
 */
export function normalizeAmenityKey(s: string): string {
  const stripped = String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Check direct map first
  if (SERVICE_NAME_TO_KEY[stripped]) {
    return SERVICE_NAME_TO_KEY[stripped];
  }

  // Fallback: normalize to snake_case
  return stripped
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// ==================== EXTRACTORES DE DATOS ====================

/**
 * Obtiene el ID de la propiedad.
 */
export function getPropertyId(p: any, fallbackIndex: number = 0): string {
  if (!p) return String(fallbackIndex);
  return String(p.id ?? p.id_propiedad ?? p.uuid ?? fallbackIndex);
}

/**
 * Obtiene el título de la propiedad.
 */
export function getPropertyTitle(p: any): string {
  if (!p) return 'Propiedad';
  return p.tituloAnuncio ?? p.titulo_anuncio ?? p.title ?? p.titulo ?? 'Propiedad';
}

/**
 * Obtiene la ubicación/dirección de la propiedad.
 */
export function getPropertyLocation(p: any): string {
  if (!p) return '';
  return (
    p.direccionTexto ??
    p.direccion_texto ??
    p.location ??
    p.direccion ??
    p.sector ??
    p.ciudad ??
    ''
  );
}

/**
 * Obtiene la imagen principal de la propiedad.
 */
export function getPropertyImage(p: any): string {
  if (!p) return DEFAULT_IMAGE;

  // 1. Buscar en campos directos de imagen
  const directImage = p.image ?? p.imagen ?? p.foto ?? p.urlImagen;
  if (directImage && typeof directImage === 'string' && directImage.trim()) {
    return directImage;
  }

  // 2. Buscar en arrays de imágenes
  const photos = p.fotos ?? p.imagenes ?? p.images ?? [];
  if (Array.isArray(photos) && photos.length > 0) {
    const first = photos[0];
    const imageUrl = typeof first === 'string' ? first : first?.urlImagen ?? first?.url;
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      return imageUrl;
    }
  }

  return DEFAULT_IMAGE;
}

/**
 * Obtiene el estado de la propiedad.
 */
export function getPropertyStatus(p: any): string {
  if (!p) return DEFAULT_STATUS;
  
  const estado = p.estado ?? p.status;
  
  if (typeof estado === 'object' && estado !== null) {
    return estado.nombre ?? estado.name ?? DEFAULT_STATUS;
  }

  return typeof estado === 'string' ? estado : DEFAULT_STATUS;
}

/**
 * Genera etiqueta legible para el precio.
 */
export function getPropertyPriceLabel(p: any): string {
  if (!p) return '$0.00';
  
  const rawPrice = p.precio ?? p.precioMensual ?? p.precio_mensual ?? p.price ?? p.valor;
  const numericPrice = parsePrice(rawPrice);
  
  if (numericPrice != null) {
    return `$${numericPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  
  return '$0.00';
}

/**
 * Obtiene la lista de amenidades/servicios normalizadas.
 */
export function getPropertyAmenities(p: any): string[] {
  if (!p) return [];
  
  const raw = p.amenities ?? p.servicios ?? p.amenidades ?? p.caracteristicas;
  if (!raw) return [];

  // Si es un array
  if (Array.isArray(raw)) {
    return raw
      .map((item: any) => {
        if (typeof item === 'string') return normalizeAmenityKey(item);
        if (item?.servicio?.nombre) return normalizeAmenityKey(item.servicio.nombre);
        if (item?.nombre) return normalizeAmenityKey(item.nombre);
        return '';
      })
      .filter(Boolean);
  }

  // Si es un objeto
  if (typeof raw === 'object') {
    return Object.entries(raw)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => normalizeAmenityKey(key));
  }

  // Si es un string separado por comas
  return String(raw)
    .split(',')
    .map(s => normalizeAmenityKey(s.trim()))
    .filter(Boolean);
}

// ==================== NORMALIZACIÓN COMPLETA ====================

/**
 * Capitaliza la primera letra de cada palabra.
 */
function capitalizeWords(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extrae el objeto de datos de respuestas API anidadas.
 */
function extractData(raw: any): any {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (raw.data !== undefined) return extractData(raw.data);
  if (raw.propiedad !== undefined) return extractData(raw.propiedad);
  return raw;
}

/**
 * Extrae y normaliza las imágenes de la propiedad.
 */
function extractImages(p: any): string[] {
  const mainImage = getPropertyImage(p);
  const rawImages = p.fotos ?? p.imagenes ?? p.images ?? [];
  
  if (!Array.isArray(rawImages)) return [mainImage];
  
  const validImages = rawImages
    .map(img => {
      if (typeof img === 'string') return img;
      return img?.urlImagen ?? img?.url ?? '';
    })
    .filter(img => img.trim() !== '');

  return validImages.length > 0 ? validImages : [mainImage];
}

/**
 * Extrae información del arrendador.
 */
function extractArrendador(p: any) {
  const owner = p.propietario ?? p.arrendador ?? {};
  const profile = owner.perfilVerificado ?? owner.profile ?? {};

  return {
    id: String(owner.id ?? ''),
    nombre: owner.nombresCompletos ?? owner.nombre ?? owner.name ?? 'Arrendador disponible',
    telefono: profile.telefonoContacto ?? owner.telefono ?? owner.phone ?? owner.celular ?? '',
    email: owner.correo ?? owner.email ?? '',
  };
}

/**
 * Normaliza un objeto de propiedad del backend para uso en UI.
 * Esta es la función principal que debe usarse para transformar datos de API.
 */
export function sanitizeProperty(raw: any): Propiedad {
  const p = extractData(raw);
  if (!p) return {} as Propiedad;

  return {
    // Mantener datos originales
    ...p,
    
    // IDs y básicos
    id: String(p.id_propiedad ?? p.id ?? ''),
    title: p.titulo_anuncio ?? p.tituloAnuncio ?? p.title ?? p.titulo ?? 'Propiedad',
    location: p.direccion_texto ?? p.direccionTexto ?? p.location ?? p.direccion ?? '',
    descripcion: p.descripcion ?? p.description ?? 'Sin descripción disponible.',
    
    // Precio
    precio: p.precio_mensual ?? p.precioMensual ?? p.precio ?? p.price,
    priceLabel: getPropertyPriceLabel({ 
      precio_mensual: p.precio_mensual ?? p.precioMensual ?? p.precio ?? p.price 
    }),
    
    // Imágenes
    mainImage: getPropertyImage(p),
    images: extractImages(p),
    
    // Estado
    estado: getPropertyStatus(p),
    
    // Amenidades formateadas para mostrar
    amenities: getPropertyAmenities(p).map(capitalizeWords),
    
    // Características numéricas
    superficie: p.superficie ?? p.area ?? p.metros_cuadrados ?? p.m2,
    habitaciones: p.habitaciones ?? p.bedrooms ?? p.rooms ?? p.cuartos,
    banos: p.banos ?? p.bathrooms ?? p.banios,
    garaje: p.garaje ?? p.parking ?? p.estacionamiento,
    
    // Coordenadas para mapa (CAMPOS CORRECTOS DE LA BD)
    lat: p.latitud_mapa ?? p.lat,
    lng: p.longitud_mapa ?? p.lng,
    
    // Datos adicionales
    esAmoblado: p.es_amoblado ?? p.esAmoblado,
    createdAt: p.fecha_creacion ?? p.createdAt,
    
    // Arrendador
    arrendador: extractArrendador(p),
  };
}
