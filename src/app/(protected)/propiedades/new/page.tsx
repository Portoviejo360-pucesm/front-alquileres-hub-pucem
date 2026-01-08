'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPropiedadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    precio: '',
    esAmoblado: false,
    estadoId: '1',
    publicoObjetivoId: '1',
    arrendadorId: '1'
  });

  const [servicios] = useState([
    { id: 1, nombre: 'Agua' },
    { id: 2, nombre: 'Luz' },
    { id: 3, nombre: 'Internet' },
    { id: 4, nombre: 'Cable' },
    { id: 5, nombre: 'Gas' }
  ]);

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleServicioToggle = (servicioId: number) => {
    setServiciosSeleccionados(prev =>
      prev.includes(servicioId)
        ? prev.filter(id => id !== servicioId)
        : [...prev, servicioId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propiedadData = {
        ...formData,
        precio: parseFloat(formData.precio),
        servicios: serviciosSeleccionados.map(id => ({
          servicioId: id,
          incluidoEnPrecio: true
        }))
      };

      // TODO: Llamar al API
      console.log('Crear propiedad:', propiedadData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Propiedad creada exitosamente');
      router.push('/propiedades');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="propiedad-form-container">
      <div className="form-header">
        <h1 className="form-title">Nueva Propiedad</h1>
        <p className="form-subtitle">Completa la información de la propiedad</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <div className="form-section">
            <h3 className="form-section-title">Información Básica</h3>
            
            <div className="form-row single">
              <div className="form-group">
                <label className="form-label required">Título del Anuncio</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-input"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Departamento moderno cerca de la PUCE"
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group">
                <label className="form-label required">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-textarea"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  placeholder="Describe las características principales de la propiedad..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Precio Mensual ($)</label>
                <input
                  type="number"
                  name="precio"
                  className="form-input"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="350.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Estado</label>
                <select
                  name="estadoId"
                  className="form-select"
                  value={formData.estadoId}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Disponible</option>
                  <option value="2">Ocupada</option>
                  <option value="3">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="esAmoblado"
                name="esAmoblado"
                className="checkbox-input"
                checked={formData.esAmoblado}
                onChange={handleChange}
              />
              <label htmlFor="esAmoblado" className="checkbox-label">
                Propiedad amoblada
              </label>
            </div>
          </div>

          {/* Ubicación */}
          <div className="form-section">
            <h3 className="form-section-title">Ubicación</h3>
            
            <div className="form-row single">
              <div className="form-group">
                <label className="form-label required">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Av. Principal #123, Portoviejo"
                />
                <span className="form-hint">
                  Dirección completa de la propiedad
                </span>
              </div>
            </div>

            <div className="map-preview">
              📍 Vista previa del mapa (por implementar)
            </div>
          </div>

          {/* Público Objetivo */}
          <div className="form-section">
            <h3 className="form-section-title">Público Objetivo</h3>
            
            <div className="form-row single">
              <div className="form-group">
                <label className="form-label required">Dirigido a</label>
                <select
                  name="publicoObjetivoId"
                  className="form-select"
                  value={formData.publicoObjetivoId}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Estudiantes</option>
                  <option value="2">Familias</option>
                  <option value="3">Profesionales</option>
                  <option value="4">Comercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="form-section">
            <h3 className="form-section-title">Servicios Incluidos</h3>
            
            <div className="servicios-grid">
              {servicios.map(servicio => (
                <div key={servicio.id} className="servicio-item">
                  <input
                    type="checkbox"
                    id={`servicio-${servicio.id}`}
                    className="checkbox-input"
                    checked={serviciosSeleccionados.includes(servicio.id)}
                    onChange={() => handleServicioToggle(servicio.id)}
                  />
                  <label htmlFor={`servicio-${servicio.id}`} className="checkbox-label">
                    {servicio.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos */}
          <div className="form-section">
            <h3 className="form-section-title">Fotografías</h3>
            
            <div className="photo-upload-area">
              <svg className="photo-upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="photo-upload-text">
                Haz clic para subir fotos
              </div>
              <div className="photo-upload-hint">
                PNG, JPG hasta 10MB (por implementar)
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <Link href="/propiedades" className="btn-cancelar">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="btn-guardar"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Publicar Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}