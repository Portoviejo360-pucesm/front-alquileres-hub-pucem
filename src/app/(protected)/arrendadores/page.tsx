'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ArrendadoresPage() {
  // Datos mock
  const [arrendadores] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez García',
      cedula: '1234567890',
      email: 'juan.perez@email.com',
      telefono: '0987654321',
      verificado: true,
      propiedades: 3
    },
    {
      id: 2,
      nombre: 'María Rodríguez López',
      cedula: '0987654321',
      email: 'maria.rodriguez@email.com',
      telefono: '0998877665',
      verificado: true,
      propiedades: 5
    },
    {
      id: 3,
      nombre: 'Carlos Mendoza Silva',
      cedula: '1122334455',
      email: 'carlos.mendoza@email.com',
      telefono: '0987123456',
      verificado: false,
      propiedades: 1
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerificado, setFilterVerificado] = useState('todos');

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

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este arrendador?')) {
      // TODO: Llamar al API para eliminar
      console.log('Eliminar arrendador:', id);
    }
  };

  return (
    <div className="arrendadores-container">
      {/* Header */}
      <div className="arrendadores-header">
        <h1 className="arrendadores-title">Arrendadores</h1>
        <Link href="/arrendadores/new" className="btn-nuevo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Arrendador
        </Link>
      </div>

      {/* Toolbar */}
      <div className="arrendadores-toolbar">
        <div className="toolbar-row">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
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
                  <td>{arrendador.propiedades}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/arrendadores/${arrendador.id}`} className="btn-icon view">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link href={`/arrendadores/${arrendador.id}/edit`} className="btn-icon edit">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(arrendador.id)} 
                        className="btn-icon delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
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
                : 'Comienza agregando tu primer arrendador'}
            </p>
            {!searchTerm && filterVerificado === 'todos' && (
              <Link href="/arrendadores/new" className="btn-nuevo">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nuevo Arrendador
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}