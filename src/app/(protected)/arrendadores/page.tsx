'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_USUARIOS } from '@/lib/mockData/admin.mock';
import AdminGuard from '@/components/guards/AdminGuard';

function ArrendadoresContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');

  // Obtener solo usuarios que tienen perfilVerificado (arrendadores)
  const arrendadoresData = MOCK_USUARIOS.filter(u => u.perfilVerificado).map(u => ({
    id: u.id,
    nombre: u.nombresCompletos,
    cedula: u.perfilVerificado!.cedulaRuc,
    email: u.correo,
    telefono: u.perfilVerificado!.telefonoContacto,
    verificado: u.perfilVerificado!.estaVerificado,
    propiedades: u.propiedades?.length || 0,
    fechaSolicitud: u.perfilVerificado!.fechaSolicitud,
    biografiaCorta: u.perfilVerificado?.biografiaCorta
  }));

  const [arrendadores] = useState(arrendadoresData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerificado, setFilterVerificado] = useState(filterParam === 'pendientes' ? 'pendientes' : 'todos');

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filtrar arrendadores
  const arrendadoresFiltrados = arrendadores.filter(arr => {
    const matchSearch = 
      arr.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arr.cedula.includes(searchTerm) ||
      arr.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVerificado = 
      filterVerificado === 'todos' ||
      (filterVerificado === 'verificados' && arr.verificado) ||
      (filterVerificado === 'pendientes' && !arr.verificado);

    return matchSearch && matchVerificado;
  });

  const handleAprobar = (id: string, nombre: string) => {
    if (confirm(`¿Aprobar verificación de ${nombre}?`)) {
      // TODO: Llamar al API para aprobar
      console.log('Aprobar arrendador:', id);
      alert('Arrendador aprobado exitosamente');
    }
  };

  const handleRechazar = (id: string, nombre: string) => {
    if (confirm(`¿Rechazar solicitud de ${nombre}?`)) {
      // TODO: Llamar al API para rechazar
      console.log('Rechazar arrendador:', id);
      alert('Solicitud rechazada');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este arrendador?')) {
      // TODO: Llamar al API para eliminar
      console.log('Eliminar arrendador:', id);
    }
  };

  const pendientesCount = arrendadores.filter(a => !a.verificado).length;
  const verificadosCount = arrendadores.filter(a => a.verificado).length;

  return (
    <div className="arrendadores-container">
      {/* Header */}
      <div className="arrendadores-header">
        <h1 className="arrendadores-title">Gestión de Arrendadores</h1>
        <div className="arrendadores-stats">
          <div className="stat-badge stat-badge-green">
            <span className="stat-badge-label">Verificados:</span>
            <span className="stat-badge-value">{verificadosCount}</span>
          </div>
          <div className="stat-badge stat-badge-orange">
            <span className="stat-badge-label">Pendientes:</span>
            <span className="stat-badge-value">{pendientesCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="arrendadores-toolbar">
        <div className="toolbar-row">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o email..."
            className="toolbar-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="toolbar-select"
            value={filterVerificado}
            onChange={(e) => setFilterVerificado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="verificados">Verificados</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="arrendadores-table-container">
        {arrendadoresFiltrados.length > 0 ? (
          <table className="arrendadores-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha Solicitud</th>
                <th>Propiedades</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {arrendadoresFiltrados.map((arrendador) => (
                <tr key={arrendador.id}>
                  <td>{arrendador.nombre}</td>
                  <td>{arrendador.cedula}</td>
                  <td>{arrendador.email}</td>
                  <td>{arrendador.telefono}</td>
                  <td>
                    <span className={`badge ${arrendador.verificado ? 'verificado' : 'pendiente'}`}>
                      {arrendador.verificado ? 'Verificado' : 'Pendiente'}
                    </span>
                  </td>
                  <td>{formatearFecha(arrendador.fechaSolicitud)}</td>
                  <td>{arrendador.propiedades}</td>
                  <td>
                    <div className="table-actions">
                      {!arrendador.verificado && (
                        <>
                          <button 
                            onClick={() => handleAprobar(arrendador.id, arrendador.nombre)} 
                            className="btn-icon approve"
                            title="Aprobar verificación"
                          >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleRechazar(arrendador.id, arrendador.nombre)} 
                            className="btn-icon reject"
                            title="Rechazar solicitud"
                          >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      )}
                      <Link href={`/arrendadores/${arrendador.id}`} className="btn-icon view">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="empty-state-title">No se encontraron arrendadores</h3>
            <p className="empty-state-text">
              {searchTerm || filterVerificado !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay solicitudes de arrendadores en este momento'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArrendadoresPage() {
  return (
    <AdminGuard>
      <ArrendadoresContent />
    </AdminGuard>
  );
}