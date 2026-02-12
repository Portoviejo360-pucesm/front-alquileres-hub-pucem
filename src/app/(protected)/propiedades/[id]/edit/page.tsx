'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propiedadesApi } from '@/lib/api/propiedades.api';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LocationPicker } from '@/components/ui/LocationPicker';

export default function EditPropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    precio: '',
    esAmoblado: false,
    estadoId: '1',
    publicoObjetivoId: '1',
    latitudMapa: -1.05458,
    longitudMapa: -80.45445
  });

  const [fotos, setFotos] = useState<string[]>([]);

  const [servicios] = useState([
    { id: 1, nombre: 'Agua' },
    { id: 2, nombre: 'Luz' },
    { id: 3, nombre: 'Internet' },
    { id: 4, nombre: 'Cable' },
    { id: 5, nombre: 'Gas' }
  ]);

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const response = await propiedadesApi.obtenerPorId(id);
        const prop = (response as any).data || response;

        setFormData({
          titulo: prop.tituloAnuncio || '',
          descripcion: prop.descripcion || '',
          direccion: prop.direccionTexto || '',
          precio: prop.precioMensual?.toString() || '',
          esAmoblado: prop.esAmoblado || false,
          estadoId: prop.estadoId?.toString() || '1',
          publicoObjetivoId: prop.publicoObjetivoId?.toString() || '1',
          latitudMapa: Number(prop.latitudMapa) || -1.05458,
          longitudMapa: Number(prop.longitudMapa) || -80.45445
        });

        if (prop.fotos) {
          // Ordenar por esPrincipal primero
          const sortedFotos = [...prop.fotos].sort((a, b) => (b.esPrincipal ? 1 : 0) - (a.esPrincipal ? 1 : 0));
          setFotos(sortedFotos.map((f: any) => f.urlImagen));
        }

        if (prop.servicios) {
          setServiciosSeleccionados(prop.servicios.map((s: any) => s.servicioId));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar propiedad:', error);
        alert('Error al cargar la propiedad');
        router.push('/propiedades');
      }
    };

    fetchPropiedad();
  }, [id, router]);

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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitudMapa: lat, longitudMapa: lng }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFotos(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (fotos.length === 0) {
        alert('Debes subir al menos una foto');
        setSaving(false);
        return;
      }

      const payload = {
        tituloAnuncio: formData.titulo,
        descripcion: formData.descripcion,
        precioMensual: parseFloat(formData.precio),
        direccionTexto: formData.direccion,
        latitudMapa: formData.latitudMapa,
        longitudMapa: formData.longitudMapa,
        esAmoblado: formData.esAmoblado,
        estadoId: parseInt(formData.estadoId),
        publicoObjetivoId: parseInt(formData.publicoObjetivoId),
        servicios: serviciosSeleccionados.map(id => ({
          servicioId: id,
          incluidoEnPrecio: true
        })),
        fotos: fotos.map((url, index) => ({
          urlImagen: url,
          esPrincipal: index === 0
        }))
      };

      await propiedadesApi.actualizar(id, payload);

      alert('Propiedad actualizada exitosamente');
      router.push('/propiedades');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al actualizar propiedad');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando datos de la propiedad...</div>;
  }

  return (
    <div className="propiedad-form-container">
      <div className="form-header">
        <h1 className="form-title">Editar Propiedad</h1>
        <p className="form-subtitle">Actualiza la información de tu propiedad</p>
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
                  minLength={10}
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
                  minLength={50}
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

            <div className="form-group">
              <label className="form-label">Ubicación en Mapa</label>
              <LocationPicker
                onLocationChange={handleLocationChange}
                initialLat={formData.latitudMapa}
                initialLng={formData.longitudMapa}
              />
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
            <ImageUpload onImagesChange={handleImagesChange} initialImages={fotos} />
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <Link href="/propiedades" className="btn-cancelar">
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn-guardar"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Actualizar Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}