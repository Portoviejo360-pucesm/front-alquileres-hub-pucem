export function getColorByEstado(estado: string) {
  switch (estado) {
    case 'DISPONIBLE':
      return 'bg-green-500';
    case 'OCUPADO':
      return 'bg-red-500';
    case 'MANTENIMIENTO':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-400';
  }
}
