'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VerificationGuard } from '@/components/guards/VerificationGuard';

export default function DocumentacionPage() {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Datos mock de documentos
  const documents = [
    {
      id: 1,
      nombre: 'Contrato Departamento Av. Universitaria',
      tipo: 'contrato',
      categoria: 'Contratos',
      fechaSubida: '2024-01-15',
      tamaño: '2.3 MB',
      formato: 'PDF',
      estado: 'aprobado',
      propiedadId: 1,
      arrendadorId: 3
    },
    {
      id: 2,
      nombre: 'Cédula Juan Pérez',
      tipo: 'identificacion',
      categoria: 'Identificación',
      fechaSubida: '2024-01-10',
      tamaño: '1.1 MB',
      formato: 'PDF',
      estado: 'aprobado',
      propiedadId: null,
      arrendadorId: 1
    },
    {
      id: 3,
      nombre: 'Escritura Casa Calle 10',
      tipo: 'escritura',
      categoria: 'Propiedades',
      fechaSubida: '2024-01-12',
      tamaño: '3.5 MB',
      formato: 'PDF',
      estado: 'pendiente',
      propiedadId: 2,
      arrendadorId: null
    },
    {
      id: 4,
      nombre: 'Comprobante de Domicilio - María González',
      tipo: 'comprobante',
      categoria: 'Comprobantes',
      fechaSubida: '2024-01-14',
      tamaño: '0.8 MB',
      formato: 'JPG',
      estado: 'aprobado',
      propiedadId: null,
      arrendadorId: 2
    },
    {
      id: 5,
      nombre: 'Certificado Libertad Gravamen',
      tipo: 'certificado',
      categoria: 'Propiedades',
      fechaSubida: '2024-01-13',
      tamaño: '1.5 MB',
      formato: 'PDF',
      estado: 'rechazado',
      propiedadId: 3,
      arrendadorId: null
    },
  ];

  const stats = [
    {
      label: 'Total Documentos',
      value: documents.length.toString(),
      icon: '📄',
      colorClass: 'blue'
    },
    {
      label: 'Aprobados',
      value: documents.filter(d => d.estado === 'aprobado').length.toString(),
      icon: '✅',
      colorClass: 'green'
    },
    {
      label: 'Pendientes',
      value: documents.filter(d => d.estado === 'pendiente').length.toString(),
      icon: '⏳',
      colorClass: 'orange'
    },
    {
      label: 'Rechazados',
      value: documents.filter(d => d.estado === 'rechazado').length.toString(),
      icon: '❌',
      colorClass: 'red'
    },
  ];

  const categorias = ['Todos', 'Contratos', 'Identificación', 'Propiedades', 'Comprobantes'];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = selectedFilter === 'todos' || doc.categoria.toLowerCase() === selectedFilter;
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (estado: string) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };

    switch (estado) {
      case 'aprobado':
        return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'pendiente':
        return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' };
      case 'rechazado':
        return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'pendiente': return 'Pendiente';
      case 'rechazado': return 'Rechazado';
      default: return estado;
    }
  };

  return (
    <VerificationGuard>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Documentación</h1>
            <p className="dashboard-subtitle">
              Gestiona todos los documentos de propiedades y arrendadores
            </p>
          </div>
          <button
            className="quick-action-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Subir Documento
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
                <div className={`stat-icon ${stat.colorClass}`}>
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros y Búsqueda */}
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Búsqueda */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Filtros de categoría */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat.toLowerCase())}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: selectedFilter === cat.toLowerCase() ? '#4F46E5' : 'white',
                    color: selectedFilter === cat.toLowerCase() ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Documentos */}
        <div className="dashboard-card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <h2 className="card-title">
              Documentos ({filteredDocuments.length})
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Documento
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Categoría
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Formato
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Tamaño
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Fecha
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Estado
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          📄
                        </div>
                        <div>
                          <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            {doc.nombre}
                          </p>
                          {doc.propiedadId && (
                            <Link
                              href={`/propiedades/${doc.propiedadId}`}
                              style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}
                            >
                              Ver propiedad →
                            </Link>
                          )}
                          {doc.arrendadorId && (
                            <Link
                              href={`/arrendadores/${doc.arrendadorId}`}
                              style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}
                            >
                              Ver arrendador →
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {doc.categoria}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#f3f4f6',
                        color: '#374151'
                      }}>
                        {doc.formato}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {doc.tamaño}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {new Date(doc.fechaSubida).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={getBadgeStyle(doc.estado)}>
                        {getEstadoText(doc.estado)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: '#374151'
                          }}
                          title="Ver documento"
                        >
                          👁️
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: '#374151'
                          }}
                          title="Descargar"
                        >
                          ⬇️
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: '#dc2626'
                          }}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDocuments.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  No se encontraron documentos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de subida */}
        {showUploadModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Subir Documento</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Tipo de Documento
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <option value="">Seleccionar tipo</option>
                  <option value="contrato">Contrato</option>
                  <option value="identificacion">Identificación</option>
                  <option value="escritura">Escritura</option>
                  <option value="comprobante">Comprobante</option>
                  <option value="certificado">Certificado</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Relacionar con
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <option value="">Seleccionar relación</option>
                  <option value="propiedad">Propiedad</option>
                  <option value="arrendador">Arrendador</option>
                </select>
              </div>

              <div style={{
                marginBottom: '16px',
                border: '2px dashed #e5e7eb',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
                <p style={{ marginBottom: '4px', fontWeight: '500' }}>
                  Haz clic o arrastra archivos aquí
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  PDF, JPG, PNG (máx. 10MB)
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#374151'
                  }}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  Subir Documento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VerificationGuard>
  );
}