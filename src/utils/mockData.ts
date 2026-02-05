import { Arriendo, Documento } from '@/types/dashboard';

export const mockArriendos: Arriendo[] = [
  {
    id: '1',
    propiedad: {
      id: '1',
      titulo: 'Departamento moderno en el centro',
      direccion: 'Av. Universitaria #123, Portoviejo',
      imagenPrincipal: '/images/property-1.jpg'
    },
    fechaInicio: '2026-01-01',
    fechaFin: '2026-07-01',
    precioMensual: 350,
    estado: 'Activo',
    arrendador: {
      nombre: 'María González',
      telefono: '+593987654321',
      email: 'maria@example.com'
    }
  },
  {
    id: '2',
    propiedad: {
      id: '2',
      titulo: 'Casa con jardín',
      direccion: 'Calle Los Alamos #45, Portoviejo',
      imagenPrincipal: '/images/property-2.jpg'
    },
    fechaInicio: '2026-02-15',
    fechaFin: '2026-08-15',
    precioMensual: 450,
    estado: 'Pendiente',
    arrendador: {
      nombre: 'Carlos Rodríguez',
      telefono: '+593912345678',
      email: 'carlos@example.com'
    }
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: '1',
    tipo: 'Contrato',
    nombre: 'Contrato de Arriendo - Av. Universitaria',
    fecha: '2026-01-01',
    arrendadorNombre: 'María González',
    propiedadDireccion: 'Av. Universitaria #123',
    url: '/documentos/contrato-1.pdf'
  },
  {
    id: '2',
    tipo: 'Pago',
    nombre: 'Comprobante de Pago - Enero 2026',
    fecha: '2026-01-05',
    arrendadorNombre: 'María González',
    propiedadDireccion: 'Av. Universitaria #123',
    url: '/documentos/pago-enero-2026.pdf'
  },
  {
    id: '3',
    tipo: 'Verificación',
    nombre: 'Verificación de Identidad',
    fecha: '2025-12-20',
    url: '/documentos/verificacion.pdf'
  }
];
