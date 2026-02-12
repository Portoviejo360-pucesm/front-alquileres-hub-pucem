'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadApi } from '@/lib/api/upload.api';

interface ImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    maxImages?: number;
    initialImages?: string[];
}

export function ImageUpload({ onImagesChange, maxImages = 5, initialImages = [] }: ImageUploadProps) {
    const [images, setImages] = useState<string[]>(initialImages);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setImages(initialImages);
        }
    }, [initialImages]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const newImages = [...images];

        try {
            for (const file of Array.from(e.target.files)) {
                if (newImages.length >= maxImages) break;

                const result = await uploadApi.uploadImage(file);
                newImages.push(result.url);
            }

            setImages(newImages);
            onImagesChange(newImages);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error al subir imágenes');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <span className="text-sm text-gray-500">Subiendo...</span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs text-gray-500 mt-2">Agregar Foto</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
            />
            <p className="text-xs text-gray-500">
                Máximo {maxImages} fotos. Primera foto será la principal.
            </p>
        </div>
    );
}
