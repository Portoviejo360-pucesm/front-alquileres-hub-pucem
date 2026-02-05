export interface Arriendo {
  id: string;
  propiedad: {
    id: string;
    titulo: string;
    direccion: string;
    imagenPrincipal: string;
  };
  fechaInicio: string;
  fechaFin: string;
  precioMensual: number;
  estado: 'Activo' | 'Pendiente' | 'Finalizado' | 'Cancelado';
  arrendador: {
    nombre: string;
    telefono: string;
    email: string;
  };
}

export interface Documento {
  id: string;
  tipo: 'Contrato' | 'Pago' | 'Verificación' | 'Otro';
  nombre: string;
  fecha: string;
  arrendadorNombre?: string;
  propiedadDireccion?: string;
  url?: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'warning' | 'neutral';
  icon: React.ReactNode;
  colorClass: string;
}
