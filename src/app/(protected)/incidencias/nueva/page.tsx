'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IncidenciasService } from '@/services/incidencias.service';
import type {
    Prioridad,
    Categoria,
    PropiedadIncidencia,
    CreateIncidenciaDto,
} from '@/types/incidencias';

export default function NuevaIncidenciaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Catalogs
    const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [propiedades, setPropiedades] = useState<PropiedadIncidencia[]>([]);

    // Form data
    const [formData, setFormData] = useState<CreateIncidenciaDto>({
        titulo: '',
        descripcion: '',
        prioridad_codigo: '',
        categoria_codigo: '',
        propiedad_id: 0,
    });

    // Files
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    const loadCatalogs = async () => {
        try {
            setLoadingData(true);
            const [prioridadesData, categoriasData, propiedadesData] = await Promise.all([
                IncidenciasService.getPrioridades(),
                IncidenciasService.getCategorias(),
                IncidenciasService.getUserProperties(),
            ]);

            setPrioridades(prioridadesData);
            setCategorias(categoriasData);
            setPropiedades(propiedadesData);

            if (propiedadesData.length === 0) {
                setError('No tienes propiedades con contratos activos. Solo puedes reportar incidencias en propiedades que actualmente ocupas.');
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoadingData(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.titulo || formData.titulo.length < 3) {
            setError('El título debe tener al menos 3 caracteres');
            return;
        }

        if (!formData.descripcion || formData.descripcion.length < 10) {
            setError('La descripción debe tener al menos 10 caracteres');
            return;
        }

        if (!formData.prioridad_codigo) {
            setError('Debes seleccionar una prioridad');
            return;
        }

        if (!formData.propiedad_id || formData.propiedad_id === 0) {
            setError('Debes seleccionar una propiedad');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await IncidenciasService.create(formData, files);

            router.push('/incidencias');
        } catch (err: any) {
            setError(err.message || 'Error al crear incidencia');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/incidencias"
                    className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
                >
                    ← Volver a incidencias
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nueva Incidencia</h1>
                <p className="text-gray-600 mt-1">
                    Reporta un problema o solicita mantenimiento
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                {/* Propiedad */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Propiedad <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        value={formData.propiedad_id}
                        onChange={(e) =>
                            setFormData({ ...formData, propiedad_id: Number(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={propiedades.length === 0}
                    >
                        <option value={0}>Selecciona una propiedad</option>
                        {propiedades.map((propiedad) => (
                            <option key={propiedad.id_propiedad} value={propiedad.id_propiedad}>
                                {propiedad.titulo_anuncio}
                                {propiedad.direccion_texto && ` - ${propiedad.direccion_texto}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Título */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        minLength={3}
                        maxLength={200}
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ej: Fuga de agua en el baño"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                </div>

                {/* Descripción */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        required
                        minLength={10}
                        rows={5}
                        value={formData.descripcion}
                        onChange={(e) =>
                            setFormData({ ...formData, descripcion: e.target.value })
                        }
                        placeholder="Describe el problema con el mayor detalle posible..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                </div>

                {/* Prioridad */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridad <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        value={formData.prioridad_codigo}
                        onChange={(e) =>
                            setFormData({ ...formData, prioridad_codigo: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                        <option value="">Selecciona una prioridad</option>
                        {prioridades.map((prioridad) => (
                            <option key={prioridad.id} value={prioridad.codigo}>
                                {prioridad.nombre}
                                {prioridad.descripcion && ` - ${prioridad.descripcion}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Categoría */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría (Opcional)
                    </label>
                    <select
                        value={formData.categoria_codigo}
                        onChange={(e) =>
                            setFormData({ ...formData, categoria_codigo: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.codigo}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Archivos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fotografías (Opcional, máximo 5)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {files.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                                >
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || propiedades.length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Creando...' : 'Crear Incidencia'}
                    </button>
                    <Link
                        href="/incidencias"
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
