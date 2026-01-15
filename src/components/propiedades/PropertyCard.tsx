'use client';

import Link from 'next/link';
import { getColorByEstado } from '@/utils/getColorByEstado';

interface PropertyCardProps {
  id: string | number;
  title: string;
  location: string;
  image: string;
  estado: string;
  price: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
  onViewDetails?: (id: string | number) => void;
}

export default function PropertyCard({
  id,
  title,
  location,
  image,
  estado,
  price,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: PropertyCardProps) {
  return (
    <div className="property-card">
      <span className={`property-badge ${getColorByEstado(estado)}`}>
        {estado}
      </span>

      <button
        onClick={() => onToggleFavorite(id)}
        className="favorite-btn"
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <div className="property-image-container">
        <img
          src={image}
          alt={title}
          className="property-image"
        />
      </div>

      <div className="property-content">
        <h3 className="property-title">{title}</h3>

        <div className="property-location">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{location || 'Portoviejo'}</span>
        </div>

        <div className="property-footer">
          <div className="property-price-container">
            <span className="property-price">{price}</span>
            <span className="property-price-period">/mes</span>
          </div>

          <Link href={`/propiedades/${id}/detalles`} className="btn-ver-detalles">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
