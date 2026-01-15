import { getColorByEstado } from '@/utils/getColorByEstado';

interface EstadoBadgeProps {
  estado: string;
}

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  return (
    <span className={`property-badge ${getColorByEstado(estado)}`}>
      {estado}
    </span>
  );
}
