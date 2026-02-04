'use client';

import { useState } from 'react';
import Image from 'next/image';
import EstadoBadge from '@/components/propiedades/EstadoBadge';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  estado: string;
}

export default function PropertyGallery({ images, title, estado }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images?.length) return null;

  const showThumbnails = images.length > 1;

  return (
    <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
      <div className="property-gallery">
        {/* Imagen principal */}
        <div className="gallery-main">
          <Image
            src={images[selectedIndex]}
            alt={title}
            fill
            className="gallery-main-image"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="gallery-badge">
            <EstadoBadge estado={estado} />
          </div>
        </div>

        {/* Miniaturas */}
        {showThumbnails && (
          <div className="gallery-thumbnails">
            {images.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`gallery-thumbnail ${index === selectedIndex ? 'active' : ''}`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${title} - Imagen ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
