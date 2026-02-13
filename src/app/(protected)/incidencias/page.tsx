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

    // Landlord specific state
    const [userProperties, setUserProperties] = useState<any[]>([]);
    const [filtroPropiedad, setFiltroPropiedad] = useState<number | string>('');

    const isLandlordOrAdmin = user?.rolId === 1 || user?.rolId === 2; // 1 = Admin, 2 = Arrendador

    useEffect(() => {
        loadData();
    }, [filtroEstado, filtroPropiedad]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [incidenciasData, estadosData] = await Promise.all([
                IncidenciasService.getAll({
                    estado: filtroEstado || undefined,
                    propiedad: filtroPropiedad ? Number(filtroPropiedad) : undefined
                }),
                IncidenciasService.getEstados(),
            ]);

            setIncidencias(incidenciasData.data);
            setEstados(estadosData);

            // Load properties if user is landlord/admin and hasn't loaded them yet
            if (isLandlordOrAdmin && userProperties.length === 0) {
                // We re-use getUserProperties but in real scenario we might need a specific endpoint
                // For now, let's assume landlords can see their properties via a separate service call 
                // OR we can fetch them if available. 
                // Since IncidenciasService.getUserProperties fetches properties for TENANTS (contracts),
                // we need a way to fetch properties for LANDLORDS.
                // Ideally, we'd use PropiedadesService.getMyProperties or similar.
                // Given current context, let's skip fetching specific properties logic adjustment 
                // and focus on filtering if the API supported it, or just showing the filter UI.

                // CORRECTION: The current service method getUserProperties is for TENANTS.
                // We need to fetch properties owned by the landlord.
                // Let's assume for this refactor we just show all Incidents (backend filters by owner).
                // We will add the property filter dropdown populated by unique properties from the incidents list 
                // OR fetch from a proper endpoint if available.
                // To avoid breaking, let's extract unique properties from the loaded incidents for the filter.

                // Actually, let's rely on what we have. 
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar incidencias');
        } finally {
            setLoading(false);
        }
    };

    // Extract unique properties from incidents for the filter (client-side approach for now)
    // This is a safe fallback if we don't have a direct "getMyProperties" endpoint handy in this file context
    useEffect(() => {
        if (isLandlordOrAdmin && incidencias.length > 0 && userProperties.length === 0) {
            const uniqueProps = Array.from(new Map(incidencias.map(item => [item.propiedad?.id_propiedad || item.propiedad_id, item.propiedad])).values())
                .filter(p => p !== undefined && p !== null);
            setUserProperties(uniqueProps);
        }
    }, [incidencias, isLandlordOrAdmin]);


    const getPrioridadColor = (prioridad: string) => {
        const colors: Record<string, string> = {
            urgente: 'bg-red-100 text-red-800',
            alta: 'bg-orange-100 text-orange-800',
            media: 'bg-yellow-100 text-yellow-800',
            baja: 'bg-green-100 text-green-800',
        };
        return colors[prioridad?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoColor = (estado: string) => {
        const colors: Record<string, string> = {
            pendiente: 'bg-gray-100 text-gray-800',
            en_proceso: 'bg-blue-100 text-blue-800',
            resuelto: 'bg-green-100 text-green-800',
            cerrado: 'bg-purple-100 text-purple-800',
        };
        return colors[estado?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    if (loading && incidencias.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                        {isLandlordOrAdmin
                            ? 'Gestiona los reportes de tus propiedades'
                            : 'Gestiona reportes, quejas y mantenimiento'}
                    </p>
                </div>
                <Link
                    href="/incidencias/nueva"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Nueva Incidencia
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Estado:</label>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white min-w-[150px]"
                        >
                            <option value="">Todos</option>
                            {estados.map((estado) => (
                                <option key={estado.id} value={estado.codigo}>
                                    {estado.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isLandlordOrAdmin && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Propiedad:</label>
                            <select
                                value={filtroPropiedad}
                                onChange={(e) => setFiltroPropiedad(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white min-w-[200px]"
                            >
                                <option value="">Todas las propiedades</option>
                                {userProperties.map((prop: any) => (
                                    <option key={prop.id_propiedad || Math.random()} value={prop.id_propiedad}>
                                        {prop.titulo_anuncio}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Incidencias List */}
            {incidencias.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                    <p className="text-gray-500 text-lg">No hay incidencias registradas</p>
                    <Link
                        href="/incidencias/nueva"
                        className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
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
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 block group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                            {incidencia.titulo}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getEstadoColor(
                                                incidencia.estado?.codigo
                                            )}`}
                                        >
                                            {incidencia.estado?.nombre}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getPrioridadColor(
                                                incidencia.prioridad?.codigo
                                            )}`}
                                        >
                                            {incidencia.prioridad?.nombre}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {incidencia.descripcion}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                            {incidencia.propiedad?.titulo_anuncio}
                                        </span>
                                        {incidencia.categoria && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                                {incidencia.categoria.nombre}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {new Date(incidencia.fecha_creacion).toLocaleDateString()}
                                        </span>

                                        {isLandlordOrAdmin && incidencia.reportante && (
                                            <span className="flex items-center gap-1 text-primary">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                Reportado por: {incidencia.reportante.nombres_completos}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        #{incidencia.id}
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
