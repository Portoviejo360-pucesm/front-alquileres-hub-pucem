'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import EstadoBadge from '@/components/propiedades/EstadoBadge';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  estado: string;
}

export default function PropertyGallery({ images, title, estado }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0);

  const safeImages = images?.length ? images : [];
  if (!safeImages.length) return null;

  const total = safeImages.length;

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  return (
    <div className="carousel-wrapper">
      {/* Main image */}
      <div className="carousel-main">
        <Image
          src={safeImages[current]}
          alt={`${title} - ${current + 1} de ${total}`}
          fill
          className="carousel-main-image"
          style={{ objectFit: 'cover' }}
          priority={current === 0}
        />

        {/* Badge */}
        <div className="carousel-badge">
          <EstadoBadge estado={estado} />
        </div>

        {/* Counter */}
        {total > 1 && (
          <div className="carousel-counter">
            {current + 1} / {total}
          </div>
        )}

        {/* Arrows */}
        {total > 1 && (
          <>
            <button onClick={prev} className="carousel-arrow carousel-arrow-left" aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button onClick={next} className="carousel-arrow carousel-arrow-right" aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="carousel-thumbs">
          {safeImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              onClick={() => setCurrent(i)}
              className={`carousel-thumb ${i === current ? 'active' : ''}`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
