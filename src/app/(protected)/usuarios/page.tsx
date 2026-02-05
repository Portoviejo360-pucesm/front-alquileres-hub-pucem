'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getUsuarios } from '@/services/api';
import type { PerfilResponse } from '@/types/auth';
import AdminGuard from '@/components/guards/AdminGuard';
import '@/styles/components/arrendadores.css';

function UsuariosContent() {
  const { token } = useAuthStore();
  const [usuarios, setUsuarios] = useState<PerfilResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'all' | 'admin' | 'user'>('all');
  const [filterVerificacion, setFilterVerificacion] = useState<'all' | 'verificados' | 'pendientes' | 'sin-verificar'>('all');

  // Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!token) {
        setError('No hay token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching usuarios con token:', token?.substring(0, 20) + '...');
        const response = await getUsuarios(token);
        console.log('Respuesta del servidor:', response);
        
        if (response.success && response.data) {
          setUsuarios(response.data);
        } else {
          setError('No se pudieron cargar los usuarios');
        }
      } catch (err: any) {
        console.error('Error al cargar usuarios:', err);
        setError(err.message || 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [token]);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    // Filtro de búsqueda
    const matchSearch = usuario.nombresCompletos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de rol
    let matchRol = true;
    if (filterRol === 'admin') matchRol = usuario.rolId === 1;
    if (filterRol === 'user') matchRol = usuario.rolId === 2;

    // Filtro de verificación
    let matchVerificacion = true;
    if (filterVerificacion === 'verificados') {
      matchVerificacion = usuario.perfilVerificado?.estaVerificado === true;
    }
    if (filterVerificacion === 'pendientes') {
      matchVerificacion = usuario.perfilVerificado !== undefined && !usuario.perfilVerificado.estaVerificado;
    }
    if (filterVerificacion === 'sin-verificar') {
      matchVerificacion = usuario.perfilVerificado === undefined;
    }

    return matchSearch && matchRol && matchVerificacion;
  });

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="arrendadores-container">
      {/* Header */}
      <div className="arrendadores-header">
        <h1 className="arrendadores-title">Gestión de Usuarios</h1>
        {!loading && !error && (
          <div className="arrendadores-stats">
            <div className="stat-badge">
              <span className="stat-badge-label">Total:</span>
              <span className="stat-badge-value">{usuarios.length}</span>
            </div>
            <div className="stat-badge stat-badge-blue">
              <span className="stat-badge-label">Administradores:</span>
              <span className="stat-badge-value">{usuarios.filter(u => u.rolId === 1).length}</span>
            </div>
            <div className="stat-badge stat-badge-green">
              <span className="stat-badge-label">Verificados:</span>
              <span className="stat-badge-value">{usuarios.filter(u => u.perfilVerificado?.estaVerificado).length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Content - Solo mostrar si no hay loading ni error */}
      {!loading && !error && (
        <>
          {/* Toolbar */}
          <div className="arrendadores-toolbar">
            <div className="toolbar-row">
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="toolbar-search"
              />

              <select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value as any)}
                className="toolbar-select"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="user">Usuarios</option>
              </select>

              <select
                value={filterVerificacion}
                onChange={(e) => setFilterVerificacion(e.target.value as any)}
                className="toolbar-select"
              >
                <option value="all">Todas las verificaciones</option>
                <option value="verificados">Verificados</option>
                <option value="pendientes">Pendientes</option>
                <option value="sin-verificar">Sin verificar</option>
              </select>
            </div>
          </div>

          {/* Tabla */}
          {usuariosFiltrados.length > 0 ? (
        <div className="arrendadores-table-container">
          <table className="arrendadores-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado Verificación</th>
                <th>Propiedades</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {usuario.nombresCompletos.charAt(0).toUpperCase()}
                      </div>
                      <span>{usuario.nombresCompletos}</span>
                    </div>
                  </td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`badge ${usuario.rolId === 1 ? 'badge-admin' : 'badge-user'}`}>
                      {usuario.rol.nombre}
                    </span>
                  </td>
                  <td>
                    {usuario.perfilVerificado ? (
                      <span className={`badge ${usuario.perfilVerificado.estaVerificado ? 'verificado' : 'pendiente'}`}>
                        {usuario.perfilVerificado.estaVerificado ? 'Verificado' : 'Pendiente'}
                      </span>
                    ) : (
                      <span className="badge badge-neutral">No aplica</span>
                    )}
                  </td>
                  <td>
                    <span className="property-count">
                      {usuario.totalPropiedades || usuario.propiedades?.length || 0}
                    </span>
                  </td>
                  <td>{formatearFecha(usuario.fechaRegistro)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon view" title="Ver detalles">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {usuario.rolId !== 1 && (
                        <button className="btn-icon delete" title="Suspender usuario">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="empty-state-text">No se encontraron usuarios</p>
        </div>
      )}
      </>
    )}
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <AdminGuard>
      <UsuariosContent />
    </AdminGuard>
  );
}
