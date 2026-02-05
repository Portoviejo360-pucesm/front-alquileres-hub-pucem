import React from 'react';
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

export const getDocumentoIcon = (tipo: string) => {
  const icons: Record<string, React.ReactElement> = {
    'Contrato': (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    'Pago': (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    'Verificación': (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  };

  return icons[tipo] || (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
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
