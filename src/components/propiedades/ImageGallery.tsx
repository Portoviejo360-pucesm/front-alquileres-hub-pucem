// components/propiedades/ImageGallery.tsx

'use client';

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    alt?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt = 'Propiedad' }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    // Si no hay imágenes, mostrar placeholder
    if (!images || images.length === 0) {
        return (
            <div className="gallery-container">
                <div className="gallery-hero">
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            borderRadius: '16px'
                        }}
                    >
                        Sin Imágenes
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-container">
            {/* Imagen Principal */}
            <div className="gallery-hero">
                <img
                    src={images[selectedImage]}
                    alt={`${alt} - Imagen ${selectedImage + 1}`}
                    className="gallery-hero-image"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="gallery-thumbnails">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`gallery-thumbnail ${index === selectedImage ? 'active' : ''}`}
                            type="button"
                        >
                            <img
                                src={img}
                                alt={`${alt} - Miniatura ${index + 1}`}
                                className="gallery-thumbnail-image"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
