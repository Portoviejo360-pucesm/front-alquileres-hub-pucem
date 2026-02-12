export function getColorByEstado(estado: string) {
  const estadoUpper = estado?.toUpperCase() || '';

  switch (estadoUpper) {
    case 'DISPONIBLE':
      return 'badge-disponible';
    case 'OCUPADO':
      return 'badge-ocupado';
    case 'MANTENIMIENTO':
      return 'badge-mantenimiento';
    default:
      return 'badge-default';
  }
}
