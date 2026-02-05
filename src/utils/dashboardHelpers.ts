import { Arriendo } from '@/types/dashboard';

export const getEstadoBadgeClass = (estado: string): string => {
  const badges: Record<string, string> = {
    'Activo': 'badge-success',
    'Pendiente': 'badge-warning',
    'Finalizado': 'badge-neutral',
    'Cancelado': 'badge-error'
  };
  return badges[estado] || 'badge-neutral';
};

export const formatFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
};

export const formatFechaCompleta = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export const calcularEstadisticas = (arriendos: Arriendo[]) => {
  const activos = arriendos.filter(a => a.estado === 'Activo').length;
  const pendientes = arriendos.filter(a => a.estado === 'Pendiente').length;
  const gastoTotal = arriendos
    .filter(a => a.estado === 'Activo')
    .reduce((sum, a) => sum + Number(a.precioMensual || 0), 0);

  return { activos, pendientes, gastoTotal: Number(gastoTotal) };
};
