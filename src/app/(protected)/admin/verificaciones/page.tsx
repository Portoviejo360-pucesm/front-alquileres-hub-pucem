'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getTodasVerificaciones, aprobarVerificacion, rechazarVerificacion } from '@/services/api';
import AdminGuard from '@/components/guards/AdminGuard';
import Modal from '@/components/ui/Modal';
import '@/styles/components/arrendadores.css';

interface PerfilVerificado {
    id: number;
    usuarioId: string;
    cedulaRuc: string;
    telefonoContacto: string;
    biografiaCorta?: string;
    fotoDocumentoUrl?: string;
    estaVerificado: boolean;
    estadoVerificacion: 'NO_SOLICITADO' | 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';
    fechaSolicitud: string;
    fechaVerificacion?: string;
    notasVerificacion?: string;
    usuario: {
        id: string;
        nombresCompletos: string;
        correo: string;
        fechaRegistro: string;
        rol: {
            nombre: string;
        };
    };
}

function VerificacionesContent() {
    const { token } = useAuthStore();
    const [verificaciones, setVerificaciones] = useState<PerfilVerificado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<string>('PENDIENTE');
    const [busqueda, setBusqueda] = useState('');
    const [selectedVerificacion, setSelectedVerificacion] = useState<PerfilVerificado | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<'aprobar' | 'rechazar'>('aprobar');
    const [motivo, setMotivo] = useState('');
    const [notas, setNotas] = useState('');
    const [procesando, setProcesando] = useState(false);

    // Cargar verificaciones
    useEffect(() => {
        fetchVerificaciones();
    }, [token, filtroEstado, busqueda]);

    const fetchVerificaciones = async () => {
        if (!token) {
            setError('No hay token de autenticación');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getTodasVerificaciones(token, {
                estado: filtroEstado === 'TODAS' ? undefined : filtroEstado,
                busqueda: busqueda || undefined
            });

            if (response.success && response.data) {
                setVerificaciones(response.data);
            } else {
                setError('No se pudieron cargar las verificaciones');
            }
        } catch (err: any) {
            console.error('Error al cargar verificaciones:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = (verificacion: PerfilVerificado) => {
        setSelectedVerificacion(verificacion);
        setModalAction('aprobar');
        setNotas('');
        setShowModal(true);
    };

    const handleRechazar = (verificacion: PerfilVerificado) => {
        setSelectedVerificacion(verificacion);
        setModalAction('rechazar');
        setMotivo('');
        setShowModal(true);
    };

    const confirmarAccion = async () => {
        if (!token || !selectedVerificacion) return;

        if (modalAction === 'rechazar' && !motivo.trim()) {
            alert('Debes proporcionar un motivo de rechazo');
            return;
        }

        try {
            setProcesando(true);

            if (modalAction === 'aprobar') {
                await aprobarVerificacion(token, selectedVerificacion.id, notas || undefined);
            } else {
                await rechazarVerificacion(token, selectedVerificacion.id, motivo);
            }

            // Recargar verificaciones
            await fetchVerificaciones();

            setShowModal(false);
            setSelectedVerificacion(null);
            setMotivo('');
            setNotas('');
        } catch (err: any) {
            console.error('Error al procesar verificación:', err);
            alert(err.message || 'Error al procesar la solicitud');
        } finally {
            setProcesando(false);
        }
    };

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBadgeClass = (estado: string) => {
        switch (estado) {
            case 'VERIFICADO':
                return 'badge verificado';
            case 'PENDIENTE':
                return 'badge pendiente';
            case 'RECHAZADO':
                return 'badge badge-neutral';
            default:
                return 'badge badge-neutral';
        }
    };

    const estadisticas = {
        total: verificaciones.length,
        pendientes: verificaciones.filter(v => v.estadoVerificacion === 'PENDIENTE').length,
        verificados: verificaciones.filter(v => v.estadoVerificacion === 'VERIFICADO').length,
        rechazados: verificaciones.filter(v => v.estadoVerificacion === 'RECHAZADO').length,
    };

    return (
        <div className="arrendadores-container">
            {/* Header */}
            <div className="arrendadores-header">
                <h1 className="arrendadores-title">Verificación de Arrendadores</h1>
                {!loading && !error && (
                    <div className="arrendadores-stats">
                        <div className="stat-badge">
                            <span className="stat-badge-label">Total:</span>
                            <span className="stat-badge-value">{estadisticas.total}</span>
                        </div>
                        <div className="stat-badge stat-badge-blue">
                            <span className="stat-badge-label">Pendientes:</span>
                            <span className="stat-badge-value">{estadisticas.pendientes}</span>
                        </div>
                        <div className="stat-badge stat-badge-green">
                            <span className="stat-badge-label">Verificados:</span>
                            <span className="stat-badge-value">{estadisticas.verificados}</span>
                        </div>
                        <div className="stat-badge" style={{ backgroundColor: '#6b7280' }}>
                            <span className="stat-badge-label">Rechazados:</span>
                            <span className="stat-badge-value">{estadisticas.rechazados}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando verificaciones...</p>
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

            {/* Content */}
            {!loading && !error && (
                <>
                    {/* Toolbar */}
                    <div className="arrendadores-toolbar">
                        <div className="toolbar-row">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, correo o cédula..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="toolbar-search"
                            />

                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="toolbar-select"
                            >
                                <option value="TODAS">Todos los estados</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="VERIFICADO">Verificados</option>
                                <option value="RECHAZADO">Rechazados</option>
                            </select>
                        </div>
                    </div>

                    {/* Tabla */}
                    {verificaciones.length > 0 ? (
                        <div className="arrendadores-table-container">
                            <table className="arrendadores-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Cédula/RUC</th>
                                        <th>Teléfono</th>
                                        <th>Estado</th>
                                        <th>Fecha Solicitud</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verificaciones.map((verificacion) => (
                                        <tr key={verificacion.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {verificacion.usuario.nombresCompletos.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{verificacion.usuario.nombresCompletos}</div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{verificacion.usuario.correo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{verificacion.cedulaRuc}</td>
                                            <td>{verificacion.telefonoContacto}</td>
                                            <td>
                                                <span className={getBadgeClass(verificacion.estadoVerificacion)}>
                                                    {verificacion.estadoVerificacion}
                                                </span>
                                            </td>
                                            <td>{formatearFecha(verificacion.fechaSolicitud)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    {verificacion.estadoVerificacion === 'PENDIENTE' && (
                                                        <>
                                                            <button
                                                                className="btn-icon view"
                                                                onClick={() => handleAprobar(verificacion)}
                                                                title="Aprobar verificación"
                                                                style={{ backgroundColor: '#10b981', color: 'white' }}
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="btn-icon delete"
                                                                onClick={() => handleRechazar(verificacion)}
                                                                title="Rechazar verificación"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                    {verificacion.fotoDocumentoUrl && (
                                                        <a
                                                            href={verificacion.fotoDocumentoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn-icon view"
                                                            title="Ver documento"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </a>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="empty-state-text">No se encontraron verificaciones</p>
                        </div>
                    )}
                </>
            )}

            {/* Modal de Confirmación */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalAction === 'aprobar' ? '✅ Aprobar Verificación' : '❌ Rechazar Verificación'}
            >
                {selectedVerificacion && (
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                            <p><strong className="text-gray-900 dark:text-white">Usuario:</strong> {selectedVerificacion.usuario.nombresCompletos}</p>
                            <p><strong className="text-gray-900 dark:text-white">Correo:</strong> {selectedVerificacion.usuario.correo}</p>
                            <p><strong className="text-gray-900 dark:text-white">Cédula/RUC:</strong> {selectedVerificacion.cedulaRuc}</p>
                            <p><strong className="text-gray-900 dark:text-white">Teléfono:</strong> {selectedVerificacion.telefonoContacto}</p>
                            {selectedVerificacion.biografiaCorta && (
                                <p><strong className="text-gray-900 dark:text-white">Biografía:</strong> {selectedVerificacion.biografiaCorta}</p>
                            )}
                        </div>

                        {modalAction === 'aprobar' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Notas (opcional):
                                </label>
                                <textarea
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Agregar notas sobre la aprobación..."
                                    rows={3}
                                    className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                    Motivo de rechazo *:
                                </label>
                                <textarea
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Explica por qué se rechaza la verificación..."
                                    rows={4}
                                    required
                                    className="w-full rounded-md border-red-300 dark:border-red-900 dark:bg-red-900/10 dark:text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                                />
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                                type="button"
                                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 ${modalAction === 'aprobar'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600'
                                    : 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={confirmarAccion}
                                disabled={procesando || (modalAction === 'rechazar' && !motivo.trim())}
                            >
                                {procesando ? 'Procesando...' : (modalAction === 'aprobar' ? 'Aprobar' : 'Rechazar')}
                            </button>
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 sm:col-start-1 sm:mt-0"
                                onClick={() => setShowModal(false)}
                                disabled={procesando}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function VerificacionesPage() {
    return (
        <AdminGuard>
            <VerificacionesContent />
        </AdminGuard>
    );
}
