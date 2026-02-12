'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IncidenciasService } from '@/services/incidencias.service';
import type { Incidencia, Estado } from '@/types/incidencias';
import { useAuthStore } from '@/store/auth.store';

export default function IncidenciasPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<string>('');

    useEffect(() => {
        loadData();
    }, [filtroEstado]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [incidenciasData, estadosData] = await Promise.all([
                IncidenciasService.getAll({ estado: filtroEstado || undefined }),
                IncidenciasService.getEstados(),
            ]);

            setIncidencias(incidenciasData.data);
            setEstados(estadosData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar incidencias');
        } finally {
            setLoading(false);
        }
    };

    const getPrioridadColor = (prioridad: string) => {
        const colors: Record<string, string> = {
            urgente: 'bg-red-100 text-red-800',
            alta: 'bg-orange-100 text-orange-800',
            media: 'bg-yellow-100 text-yellow-800',
            baja: 'bg-green-100 text-green-800',
        };
        return colors[prioridad.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoColor = (estado: string) => {
        const colors: Record<string, string> = {
            pendiente: 'bg-gray-100 text-gray-800',
            en_proceso: 'bg-blue-100 text-blue-800',
            resuelto: 'bg-green-100 text-green-800',
            cerrado: 'bg-purple-100 text-purple-800',
        };
        return colors[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Incidencias</h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona reportes, quejas y mantenimiento
                    </p>
                </div>
                <Link
                    href="/incidencias/nueva"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    + Nueva Incidencia
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">
                        Filtrar por estado:
                    </label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                        <option value="">Todos los estados</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.codigo}>
                                {estado.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Incidencias List */}
            {incidencias.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No hay incidencias registradas</p>
                    <Link
                        href="/incidencias/nueva"
                        className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                    >
                        Crear la primera incidencia
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {incidencias.map((incidencia) => (
                        <Link
                            key={incidencia.id}
                            href={`/incidencias/${incidencia.id}`}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {incidencia.titulo}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                                                incidencia.estado.codigo
                                            )}`}
                                        >
                                            {incidencia.estado.nombre}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(
                                                incidencia.prioridad.codigo
                                            )}`}
                                        >
                                            {incidencia.prioridad.nombre}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {incidencia.descripcion}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>🏠 {incidencia.propiedad.titulo_anuncio}</span>
                                        {incidencia.categoria && (
                                            <span>📂 {incidencia.categoria.nombre}</span>
                                        )}
                                        <span>
                                            📅{' '}
                                            {new Date(incidencia.fecha_creacion).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-gray-500">
                                        ID: #{incidencia.id}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
