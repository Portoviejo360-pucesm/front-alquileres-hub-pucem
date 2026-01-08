'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPropiedadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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

  // Cargar datos de la propiedad
  useEffect(() => {
    // TODO: Cargar desde API
    const propiedadMock = {
      titulo: 'Departamento Moderno en el Centro',
      descripcion: 'Hermoso departamento de 2 habitaciones con vista panorámica.',
      direccion: 'Av. Universitaria #123, Portoviejo',
      precio: '350',
      esAmoblado: true,
      estadoId: '1',
      publicoObjetivoId: '1',
      arrendadorId: '1'
    };
    
    setFormData(propiedadMock);
    setServiciosSeleccionados([1, 2, 3, 5]); // Agua, Luz, Internet, Gas
  }, [id]);

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
      console.log('Actualizar propiedad:', id, propiedadData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Propiedad actualizada exitosamente');
      router.push(`/propiedades/${id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="propiedad-form-container">
      <div className="form-header">
        <h1 className="form-title">Editar Propiedad</h1>
        <p className="form-subtitle">Actualiza la información de la propiedad</p>
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
              </div>
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

          {/* Acciones */}
          <div className="form-actions">
            <Link href={`/propiedades/${id}`} className="btn-cancelar">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="btn-guardar"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}