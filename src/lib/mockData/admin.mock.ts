// lib/mockData/admin.mock.ts

import type { PerfilResponse } from '@/types/auth';

/**
 * Usuarios mock del sistema (incluye administradores, usuarios comunes y arrendadores)
 */
export const MOCK_USUARIOS: PerfilResponse[] = [
  // Administrador
  {
    id: 'admin-1',
    nombresCompletos: 'Administrador Principal',
    correo: 'admin@portoviejo360.com',
    rolId: 1,
    fechaRegistro: '2024-01-01T00:00:00.000Z',
    rol: {
      nombre: 'Administrador'
    }
  },
  
  // Usuario Común (sin verificar)
  {
    id: '2',
    nombresCompletos: 'Juan Pérez García',
    correo: 'juan.perez@example.com',
    rolId: 2,
    fechaRegistro: '2024-06-15T10:30:00.000Z',
    rol: {
      nombre: 'Usuario'
    }
  },
  
  // Arrendador Verificado
  {
    id: '3',
    nombresCompletos: 'María González López',
    correo: 'maria.gonzalez@example.com',
    rolId: 2,
    fechaRegistro: '2024-03-10T08:00:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '1234567890',
      telefonoContacto: '+593987654321',
      biografiaCorta: 'Arrendadora con 5 años de experiencia en el mercado inmobiliario de Portoviejo',
      estaVerificado: true,
      fechaSolicitud: '2024-03-12T00:00:00.000Z',
      estadoVerificacion: 'VERIFICADO' as const
    },
    propiedades: [
      {
        id: '1',
        tituloAnuncio: 'Departamento en el Centro',
        precioMensual: 350,
        estado: { nombre: 'disponible' }
      },
      {
        id: '2',
        tituloAnuncio: 'Casa Los Tamarindos',
        precioMensual: 500,
        estado: { nombre: 'ocupada' }
      },
      {
        id: '3',
        tituloAnuncio: 'Local Comercial',
        precioMensual: 800,
        estado: { nombre: 'disponible' }
      }
    ]
  },
  
  // Arrendador con solicitud pendiente
  {
    id: '4',
    nombresCompletos: 'Carlos Rodríguez Silva',
    correo: 'carlos.rodriguez@example.com',
    rolId: 2,
    fechaRegistro: '2024-07-20T14:15:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '0987654321',
      telefonoContacto: '+593912345678',
      biografiaCorta: 'Propietario de viviendas familiares',
      estaVerificado: false,
      fechaSolicitud: '2024-07-22T09:30:00.000Z',
      estadoVerificacion: 'PENDIENTE' as const
    },
    propiedades: []
  },

  // Otro usuario común
  {
    id: '5',
    nombresCompletos: 'Ana Martínez Torres',
    correo: 'ana.martinez@example.com',
    rolId: 2,
    fechaRegistro: '2024-08-05T16:45:00.000Z',
    rol: {
      nombre: 'Usuario'
    }
  },

  // Arrendador verificado activo
  {
    id: '6',
    nombresCompletos: 'Roberto Campos Vera',
    correo: 'roberto.campos@example.com',
    rolId: 2,
    fechaRegistro: '2024-02-14T11:20:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '1122334455',
      telefonoContacto: '+593998877665',
      biografiaCorta: 'Inversionista inmobiliario',
      estaVerificado: true,
      fechaSolicitud: '2024-02-15T00:00:00.000Z',
      estadoVerificacion: 'VERIFICADO' as const
    },
    propiedades: [
      {
        id: '4',
        tituloAnuncio: 'Departamento Moderno',
        precioMensual: 420,
        estado: { nombre: 'disponible' }
      },
      {
        id: '5',
        tituloAnuncio: 'Suite Amoblada',
        precioMensual: 380,
        estado: { nombre: 'ocupada' }
      }
    ]
  },

  // Usuario con solicitud pendiente reciente
  {
    id: '7',
    nombresCompletos: 'Patricia Morales Ruiz',
    correo: 'patricia.morales@example.com',
    rolId: 2,
    fechaRegistro: '2024-12-10T13:00:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '5544332211',
      telefonoContacto: '+593987123456',
      biografiaCorta: 'Propietaria de departamentos',
      estaVerificado: false,
      fechaSolicitud: '2026-01-25T10:00:00.000Z', // Solicitud muy reciente
      estadoVerificacion: 'PENDIENTE' as const
    },
    propiedades: []
  }
];

/**
 * Estadísticas globales del sistema
 */
export interface EstadisticasGlobales {
  totalUsuarios: number;
  totalArrendadores: number;
  totalArrendadoresVerificados: number;
  solicitudesPendientes: number;
  totalPropiedades: number;
  propiedadesDisponibles: number;
  propiedadesOcupadas: number;
  ingresosMensualesEstimados: number;
}

export const calcularEstadisticasGlobales = (): EstadisticasGlobales => {
  const usuarios = MOCK_USUARIOS;
  
  const totalUsuarios = usuarios.length;
  const arrendadores = usuarios.filter(u => u.perfilVerificado);
  const arrendadoresVerificados = usuarios.filter(u => u.perfilVerificado?.estaVerificado);
  const solicitudesPendientes = usuarios.filter(u => u.perfilVerificado && !u.perfilVerificado.estaVerificado).length;
  
  const todasPropiedades = usuarios.flatMap(u => u.propiedades || []);
  const propiedadesDisponibles = todasPropiedades.filter(p => p.estado.nombre === 'disponible').length;
  const propiedadesOcupadas = todasPropiedades.filter(p => p.estado.nombre === 'ocupada').length;
  
  const ingresosMensualesEstimados = todasPropiedades
    .filter(p => p.estado.nombre === 'ocupada')
    .reduce((sum, p) => sum + p.precioMensual, 0);

  return {
    totalUsuarios,
    totalArrendadores: arrendadores.length,
    totalArrendadoresVerificados: arrendadoresVerificados.length,
    solicitudesPendientes,
    totalPropiedades: todasPropiedades.length,
    propiedadesDisponibles,
    propiedadesOcupadas,
    ingresosMensualesEstimados
  };
};

/**
 * Actividad reciente del sistema
 */
export interface ActividadSistema {
  id: string;
  tipo: 'registro' | 'verificacion' | 'propiedad' | 'solicitud';
  titulo: string;
  descripcion: string;
  usuario: string;
  fecha: string;
}

export const ACTIVIDADES_RECIENTES: ActividadSistema[] = [
  {
    id: '1',
    tipo: 'solicitud',
    titulo: 'Nueva Solicitud de Verificación',
    descripcion: 'Patricia Morales ha solicitado verificación de perfil',
    usuario: 'Patricia Morales Ruiz',
    fecha: '2026-01-25T10:00:00.000Z'
  },
  {
    id: '2',
    tipo: 'registro',
    titulo: 'Nuevo Usuario Registrado',
    descripcion: 'Ana Martínez se ha registrado en el sistema',
    usuario: 'Ana Martínez Torres',
    fecha: '2024-08-05T16:45:00.000Z'
  },
  {
    id: '3',
    tipo: 'verificacion',
    titulo: 'Arrendador Verificado',
    descripcion: 'María González ha sido verificada como arrendadora',
    usuario: 'María González López',
    fecha: '2024-03-12T10:00:00.000Z'
  },
  {
    id: '4',
    tipo: 'propiedad',
    titulo: 'Nueva Propiedad Publicada',
    descripcion: 'Departamento en el Centro - $350/mes',
    usuario: 'María González López',
    fecha: '2024-03-15T14:20:00.000Z'
  },
  {
    id: '5',
    tipo: 'solicitud',
    titulo: 'Solicitud de Verificación',
    descripcion: 'Carlos Rodríguez ha solicitado verificación',
    usuario: 'Carlos Rodríguez Silva',
    fecha: '2024-07-22T09:30:00.000Z'
  }
];
