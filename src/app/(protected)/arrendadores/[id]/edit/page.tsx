'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditArrendadorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Portoviejo',
    observaciones: ''
  });

  // Cargar datos del arrendador (mock)
  useEffect(() => {
    // TODO: Cargar desde API
    const arrendadorMock = {
      nombre: 'Juan Pérez García',
      cedula: '1234567890',
      email: 'juan.perez@email.com',
      telefono: '0987654321',
      direccion: 'Av. Principal #123',
      ciudad: 'Portoviejo',
      observaciones: 'Arrendador confiable con buen historial.'
    };
    
    setFormData(arrendadorMock);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Llamar al API para actualizar arrendador
      console.log('Actualizar arrendador:', id, formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Arrendador actualizado exitosamente');
      router.push(`/arrendadores/${id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar arrendador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Editar Arrendador</h1>
        <p className="form-subtitle">
          Actualiza la información del arrendador
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div className="form-section">
            <h3 className="form-section-title">Información Personal</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez García"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  className="form-input"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                  placeholder="1234567890"
                  maxLength={10}
                />
                <span className="form-hint">10 dígitos sin guiones</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="0987654321"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="form-section">
            <h3 className="form-section-title">Ubicación</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Calle Principal #123"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Ciudad</label>
                <select
                  name="ciudad"
                  className="form-select"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                >
                  <option value="Portoviejo">Portoviejo</option>
                  <option value="Manta">Manta</option>
                  <option value="Chone">Chone</option>
                  <option value="Jipijapa">Jipijapa</option>
                  <option value="Montecristi">Montecristi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="form-section">
            <h3 className="form-section-title">Observaciones</h3>
            
            <div className="form-row single">
              <div className="form-group">
                <label className="form-label">Notas Adicionales</label>
                <textarea
                  name="observaciones"
                  className="form-textarea"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Información adicional sobre el arrendador (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <Link href={`/arrendadores`} className="btn-cancelar">
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