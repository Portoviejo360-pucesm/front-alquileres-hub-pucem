'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { IncidenciasService } from '@/services/incidencias.service';
import type {
    Incidencia,
    Estado,
    UpdateStatusDto,
    CreateComentarioDto,
} from '@/types/incidencias';
import { useAuthStore } from '@/store/auth.store';

export default function IncidenciaDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const incidenciaId = Number(params.id);

    const [incidencia, setIncidencia] = useState<Incidencia | null>(null);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Status update
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusData, setStatusData] = useState<UpdateStatusDto>({
        estado_codigo: '',
        descripcion: '',
    });
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Bitácora
    const [showBitacoraModal, setShowBitacoraModal] = useState(false);
    const [bitacoraDescripcion, setBitacoraDescripcion] = useState('');
    const [addingBitacora, setAddingBitacora] = useState(false);

    // Comentarios
    const [comentario, setComentario] = useState('');
    const [addingComentario, setAddingComentario] = useState(false);

    useEffect(() => {
        loadData();
    }, [incidenciaId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [incidenciaData, estadosData] = await Promise.all([
                IncidenciasService.getById(incidenciaId),
                IncidenciasService.getEstados(),
            ]);

            setIncidencia(incidenciaData);
            setEstados(estadosData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar incidencia');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!statusData.estado_codigo) {
            alert('Debes seleccionar un estado');
            return;
        }

        if (statusData.estado_codigo === 'resuelto' && !statusData.descripcion) {
            alert('Debes proporcionar una descripción del arreglo realizado');
            return;
        }

        try {
            setUpdatingStatus(true);
            await IncidenciasService.updateStatus(incidenciaId, statusData);
            setShowStatusModal(false);
            setStatusData({ estado_codigo: '', descripcion: '' });
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Error al actualizar estado');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddBitacora = async () => {
        if (!bitacoraDescripcion || bitacoraDescripcion.length < 5) {
            alert('La descripción debe tener al menos 5 caracteres');
            return;
        }

        try {
            setAddingBitacora(true);
            await IncidenciasService.addBitacoraEntry(incidenciaId, bitacoraDescripcion);
            setShowBitacoraModal(false);
            setBitacoraDescripcion('');
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Error al agregar entrada');
        } finally {
            setAddingBitacora(false);
        }
    };

    const handleAddComentario = async () => {
        if (!comentario || comentario.length < 1) {
            alert('El comentario no puede estar vacío');
            return;
        }

        try {
            setAddingComentario(true);
            await IncidenciasService.addComentario(incidenciaId, { contenido: comentario });
            setComentario('');
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Error al agregar comentario');
        } finally {
            setAddingComentario(false);
        }
    };

    const isLandlordOrAdmin = user?.rolId === 2 || user?.rolId === 1; // 1=admin, 2=arrendador

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !incidencia) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error || 'Incidencia no encontrada'}
                </div>
                <Link href="/incidencias" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                    ← Volver a incidencias
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/incidencias"
                    className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
                >
                    ← Volver a incidencias
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{incidencia.titulo}</h1>
                        <p className="text-gray-600 mt-1">ID: #{incidencia.id}</p>
                    </div>
                    {isLandlordOrAdmin && (
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Actualizar Estado
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Detalles</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Descripción</label>
                                <p className="text-gray-900 mt-1">{incidencia.descripcion}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Estado</label>
                                    <p className="text-gray-900 mt-1">{incidencia.estado.nombre}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Prioridad</label>
                                    <p className="text-gray-900 mt-1">{incidencia.prioridad.nombre}</p>
                                </div>
                                {incidencia.categoria && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Categoría</label>
                                        <p className="text-gray-900 mt-1">{incidencia.categoria.nombre}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Propiedad</label>
                                    <p className="text-gray-900 mt-1">{incidencia.propiedad.titulo_anuncio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Adjuntos */}
                    {incidencia.adjuntos && incidencia.adjuntos.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Archivos Adjuntos</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {incidencia.adjuntos.map((adjunto) => (
                                    <a
                                        key={adjunto.id}
                                        href={adjunto.url_archivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {adjunto.nombre_archivo}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(adjunto.fecha_creacion).toLocaleDateString()}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bitácora */}
                    {isLandlordOrAdmin && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Bitácora de Mantenimiento</h2>
                                <button
                                    onClick={() => setShowBitacoraModal(true)}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    + Agregar Entrada
                                </button>
                            </div>
                            {incidencia.bitacora && incidencia.bitacora.length > 0 ? (
                                <div className="space-y-4">
                                    {incidencia.bitacora.map((entrada) => (
                                        <div key={entrada.id} className="border-l-4 border-blue-500 pl-4">
                                            <p className="text-gray-900">{entrada.descripcion}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {entrada.usuario.nombres_completos} •{' '}
                                                {new Date(entrada.fecha_creacion).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No hay entradas en la bitácora</p>
                            )}
                        </div>
                    )}

                    {/* Comentarios */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Comentarios</h2>

                        {/* Add Comment Form */}
                        <div className="mb-6">
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Escribe un comentario..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                            />
                            <button
                                onClick={handleAddComentario}
                                disabled={addingComentario}
                                className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {addingComentario ? 'Enviando...' : 'Enviar Comentario'}
                            </button>
                        </div>

                        {/* Comments List */}
                        {incidencia.comentarios && incidencia.comentarios.length > 0 ? (
                            <div className="space-y-4">
                                {incidencia.comentarios.map((com) => (
                                    <div key={com.id} className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-900">{com.contenido}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {com.usuario.nombres_completos} •{' '}
                                            {new Date(com.fecha_creacion).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay comentarios aún</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Historial */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Historial</h2>
                        {incidencia.historial && incidencia.historial.length > 0 ? (
                            <div className="space-y-3">
                                {incidencia.historial.map((hist) => (
                                    <div key={hist.id} className="text-sm">
                                        <p className="font-medium text-gray-900">{hist.accion}</p>
                                        {hist.descripcion && (
                                            <p className="text-gray-600 mt-1">{hist.descripcion}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(hist.fecha_cambio).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay historial</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Actualizar Estado</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nuevo Estado
                                </label>
                                <select
                                    value={statusData.estado_codigo}
                                    onChange={(e) =>
                                        setStatusData({ ...statusData, estado_codigo: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
                                >
                                    <option value="">Selecciona un estado</option>
                                    {estados.map((estado) => (
                                        <option key={estado.id} value={estado.codigo}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción {statusData.estado_codigo === 'resuelto' && '(Requerida)'}
                                </label>
                                <textarea
                                    value={statusData.descripcion}
                                    onChange={(e) =>
                                        setStatusData({ ...statusData, descripcion: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
                                    placeholder="Describe el cambio..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updatingStatus}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    {updatingStatus ? 'Actualizando...' : 'Actualizar'}
                                </button>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bitácora Modal */}
            {showBitacoraModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Agregar Entrada a Bitácora</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={bitacoraDescripcion}
                                    onChange={(e) => setBitacoraDescripcion(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
                                    placeholder="Describe el progreso realizado..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddBitacora}
                                    disabled={addingBitacora}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    {addingBitacora ? 'Agregando...' : 'Agregar'}
                                </button>
                                <button
                                    onClick={() => setShowBitacoraModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
