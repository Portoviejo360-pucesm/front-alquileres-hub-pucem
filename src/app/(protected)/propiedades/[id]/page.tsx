'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PropiedadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Datos mock
  const [propiedad] = useState({
    id: parseInt(id),
    titulo: 'Departamento Moderno en el Centro',
    descripcion: 'Hermoso departamento de 2 habitaciones con vista panorámica de la ciudad. Ubicado cerca de universidades, centros comerciales y servicios. Ideal para estudiantes o profesionales jóvenes. Cuenta con acabados modernos, cocina equipada y baño completo. El edificio tiene seguridad 24/7 y estacionamiento disponible.',
    direccion: 'Av. Universitaria #123, Portoviejo',
    precio: 350,
    estado: 'disponible',
    esAmoblado: true,
    publicoObjetivo: 'Estudiantes',
    fechaPublicacion: '2024-01-15',
    arrendador: {
      nombre: 'Juan Pérez García',
      telefono: '0987654321',
      email: 'juan.perez@email.com'
    },
    servicios: [
      { nombre: 'Agua', incluido: true },
      { nombre: 'Luz', incluido: true },
      { nombre: 'Internet', incluido: true },
      { nombre: 'Cable', incluido: false },
      { nombre: 'Gas', incluido: true }
    ]
  });

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      // TODO: Llamar al API
      console.log('Eliminar propiedad:', id);
      router.push('/propiedades');
    }
  };

  const getEstadoNombre = (estado: string) => {
    const estados: Record<string, string> = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      mantenimiento: 'En Mantenimiento'
    };
    return estados[estado] || estado;
  };

  return (
    <div className="propiedad-detail-container">
      {/* Header */}
      <div className="propiedad-detail-header">
        <div className="detail-title-section">
          <h1 className="detail-title">{propiedad.titulo}</h1>
          <p className="detail-subtitle">
            Publicado el {new Date(propiedad.fechaPublicacion).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="detail-actions">
          <Link href={`/propiedades/${id}/edit`} className="btn-editar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar
          </Link>
          <button onClick={handleDelete} className="btn-eliminar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Galería */}
      <div className="propiedad-detail-gallery">
        <div className="gallery-main">
          FOTO PRINCIPAL
        </div>
        <div className="gallery-thumbnails">
          <div className="gallery-thumbnail">FOTO 2</div>
          <div className="gallery-thumbnail">FOTO 3</div>
        </div>
      </div>

      {/* Grid de contenido */}
      <div className="propiedad-detail-grid">
        {/* Columna principal */}
        <div className="propiedad-detail-main">
          {/* Descripción */}
          <div className="info-card">
            <h3 className="info-card-title">Descripción</h3>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              {propiedad.descripcion}
            </p>
          </div>

          {/* Detalles */}
          <div className="info-card">
            <h3 className="info-card-title">Detalles de la Propiedad</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-label">Estado</div>
                <div className="info-item-value">
                  <span className={`badge ${propiedad.estado}`}>
                    {getEstadoNombre(propiedad.estado)}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Amoblado</div>
                <div className="info-item-value">
                  {propiedad.esAmoblado ? 'Sí' : 'No'}
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Público Objetivo</div>
                <div className="info-item-value">{propiedad.publicoObjetivo}</div>
              </div>

              <div className="info-item">
                <div className="info-item-label">Ubicación</div>
                <div className="info-item-value">{propiedad.direccion}</div>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="info-card">
            <h3 className="info-card-title">Servicios</h3>
            <div className="servicios-list">
              {propiedad.servicios.map((servicio, index) => (
                <div 
                  key={index} 
                  className={`servicio-badge ${servicio.incluido ? 'incluido' : ''}`}
                >
                  {servicio.incluido && (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {servicio.nombre}
                  {!servicio.incluido && ' (No incluido)'}
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="info-card">
            <h3 className="info-card-title">Ubicación</h3>
            <div className="map-preview">
              📍 Mapa (por implementar)
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="propiedad-detail-sidebar">
          {/* Precio */}
          <div className="price-card">
            <div className="price-card-amount">${propiedad.precio}</div>
            <div className="price-card-period">por mes</div>
            <button className="btn-contactar">
              Contactar al Arrendador
            </button>
          </div>

          {/* Información del arrendador */}
          <div className="info-card">
            <h3 className="info-card-title">Arrendador</h3>
            <div className="info-item" style={{ marginBottom: '12px' }}>
              <div className="info-item-label">Nombre</div>
              <div className="info-item-value">{propiedad.arrendador.nombre}</div>
            </div>
            <div className="info-item" style={{ marginBottom: '12px' }}>
              <div className="info-item-label">Teléfono</div>
              <div className="info-item-value">{propiedad.arrendador.telefono}</div>
            </div>
            <div className="info-item">
              <div className="info-item-label">Email</div>
              <div className="info-item-value" style={{ wordBreak: 'break-all' }}>
                {propiedad.arrendador.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}