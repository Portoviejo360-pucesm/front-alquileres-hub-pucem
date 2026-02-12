'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propiedadesApi } from '@/lib/api/propiedades.api';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LocationPicker } from '@/components/ui/LocationPicker';
import { searchAddress, debounce, AddressSuggestion } from '@/lib/services/geocoding';

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
    latitudMapa: -1.05458,
    longitudMapa: -80.45445
  });

  const [fotos, setFotos] = useState<string[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitudMapa: lat, longitudMapa: lng }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({ ...prev, direccion: address }));
    setShowSuggestions(false);
  };

  // Búsqueda de direcciones con debounce
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchAddress(query);
        setAddressSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error buscando direcciones:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, direccion: value }));
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({
      ...prev,
      direccion: suggestion.displayName,
      latitudMapa: suggestion.lat,
      longitudMapa: suggestion.lon
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImagesChange = (urls: string[]) => {
    setFotos(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (fotos.length === 0) {
        alert('Debes subir al menos una foto');
        setLoading(false);
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
          esPrincipal: index === 0 // La primera foto es la principal
        }))
      };

      await propiedadesApi.crear(payload);

      alert('Propiedad creada exitosamente');
      router.push('/propiedades');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al crear propiedad');
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
              <div className="form-group" style={{ position: 'relative' }} ref={suggestionRef}>
                <label className="form-label required">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleAddressInputChange}
                  onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                  required
                  placeholder="Escribe una dirección o haz clic en el mapa..."
                  autoComplete="off"
                />
                {isSearching && (
                  <span className="form-hint" style={{ color: '#10b981' }}>
                    🔍 Buscando direcciones...
                  </span>
                )}
                {!isSearching && (
                  <span className="form-hint">
                    Escribe para buscar o haz clic en el mapa para obtener la dirección automáticamente
                  </span>
                )}

                {/* Dropdown de sugerencias */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                  }}>
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < addressSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '2px' }}>
                          📍 {suggestion.address.road || suggestion.address.neighbourhood || 'Dirección'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {suggestion.displayName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación en Mapa</label>
              <LocationPicker
                onLocationChange={handleLocationChange}
                onAddressChange={handleAddressChange}
                initialLat={formData.latitudMapa}
                initialLng={formData.longitudMapa}
              />
              <span className="form-hint">
                Haz clic en el mapa para seleccionar la ubicación y obtener la dirección automáticamente
              </span>
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
            <ImageUpload onImagesChange={handleImagesChange} />
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