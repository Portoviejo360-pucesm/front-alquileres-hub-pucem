'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Arriendo, Documento, DashboardStat } from '@/types/dashboard';
import { calcularEstadisticas } from '@/utils/dashboardHelpers';
import { mockDocumentos } from '@/utils/mockData';
import { getMisArriendos } from '@/services/api';
import { HomeIcon, MoneyIcon, DocumentIcon, UserIcon } from './icons';
import StatCard from './StatCard';
import ArriendoCard from './ArriendoCard';
import DocumentoItem from './DocumentoItem';
import EmptyState from './EmptyState';
import CTABanner from './CTABanner';

export default function DashboardUsuario() {
  const { user, token } = useAuthStore();
  const [arriendosActivos, setArriendosActivos] = useState<Arriendo[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      // Validar que tenemos todo lo necesario
      if (!token) {
        console.log('No hay token, finalizando carga');
        setLoading(false);
        return;
      }

      if (!user?.id) {
        console.log('Usuario aún no cargado, esperando...');
        return; // No cambiar loading, esperar a que user se cargue
      }

      try {
        console.log('Cargando arriendos para usuario:', user.id);
        setLoading(true);
        setError(null);
        
        // Obtener arriendos del backend
        const reservas = await getMisArriendos(token, user.id);
        console.log('Reservas obtenidas:', reservas);
        
        // Transformar reservas a formato Arriendo
        const arriendosTransformados: Arriendo[] = (reservas || []).map((reserva: any) => ({
          id: reserva.id,
          propiedad: {
            id: reserva.propiedadId?.toString() || '',
            titulo: reserva.propiedad?.nombre || 'Propiedad sin nombre',
            direccion: reserva.propiedad?.direccion || 'Dirección no disponible',
            imagenPrincipal: reserva.propiedad?.fotos?.[0]?.url || '/placeholder-property.jpg'
          },
          fechaInicio: reserva.fechaEntrada,
          fechaFin: reserva.fechaSalida,
          precioMensual: reserva.totalPagar || 0,
          estado: reserva.estado === 'CONFIRMADA' ? 'Activo' : 
                  reserva.estado === 'PENDIENTE' ? 'Pendiente' : 
                  reserva.estado === 'CANCELADA' ? 'Cancelado' : 'Finalizado',
          arrendador: {
            nombre: 'Propietario',
            telefono: '',
            email: ''
          }
        }));

        setArriendosActivos(arriendosTransformados);
        
        // Transformar contratos a formato Documento
        const documentosTransformados: Documento[] = (reservas || [])
          .filter((reserva: any) => reserva.contrato) // Solo reservas con contrato
          .map((reserva: any) => ({
            id: reserva.contrato.id,
            tipo: 'Contrato' as const,
            nombre: `Contrato - ${reserva.propiedad?.nombre || 'Propiedad'}`,
            fecha: reserva.contrato.fechaGeneracion,
            propiedadDireccion: reserva.propiedad?.direccion,
            url: `/api/contratos/${reserva.id}/descargar`
          }));

        setDocumentos(documentosTransformados);
      } catch (err) {
        console.error('Error al cargar arriendos:', err);
        setError('Error al cargar los arriendos. Por favor, intenta de nuevo.');
        setArriendosActivos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token, user?.id]);

  const estadisticas = useMemo(() => 
    calcularEstadisticas(arriendosActivos), 
    [arriendosActivos]
  );

  const stats: DashboardStat[] = useMemo(() => [
    {
      label: 'Arriendos Activos',
      value: estadisticas.activos.toString(),
      change: estadisticas.pendientes > 0 
        ? `${estadisticas.pendientes} pendiente${estadisticas.pendientes > 1 ? 's' : ''}` 
        : 'Al día',
      changeType: estadisticas.pendientes > 0 ? 'warning' : 'positive',
      icon: <HomeIcon />,
      colorClass: 'green'
    },
    {
      label: 'Gasto Mensual',
      value: `$${estadisticas.gastoTotal.toFixed(2)}`,
      change: `${estadisticas.activos} propiedad${estadisticas.activos !== 1 ? 'es' : ''}`,
      changeType: 'neutral',
      icon: <MoneyIcon />,
      colorClass: 'purple'
    },
    {
      label: 'Documentos',
      value: documentos.length.toString(),
      change: 'Todos firmados',
      changeType: 'positive',
      icon: <DocumentIcon />,
      colorClass: 'blue'
    },
    {
      label: 'Perfil',
      value: user?.perfilVerificado?.estaVerificado ? 'Verificado' : 'No Verificado',
      change: user?.perfilVerificado?.estaVerificado ? 'Cuenta activa' : 'Verificar ahora',
      changeType: user?.perfilVerificado?.estaVerificado ? 'positive' : 'warning',
      icon: <UserIcon />,
      colorClass: user?.perfilVerificado?.estaVerificado ? 'green' : 'orange'
    }
  ], [user, estadisticas, documentos.length]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Error Message */}
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#991b1b'
        }}>
          <p style={{ fontWeight: '500' }}>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-title">¡Bienvenido, {user?.nombresCompletos || 'Usuario'}!</h1>
        <p className="dashboard-subtitle">Gestiona tus arriendos y documentos desde aquí</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Contenido Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Arriendos Activos */}
          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2 className="section-title">Mis Arriendos</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {arriendosActivos.length} {arriendosActivos.length === 1 ? 'arriendo activo' : 'arriendos activos'}
                </p>
              </div>
              <Link href="/propiedades" className="section-link">
                Ver todas las propiedades →
              </Link>
            </div>

            {arriendosActivos.length === 0 ? (
              <EmptyState tipo="arriendos" />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {arriendosActivos.map((arriendo) => (
                  <ArriendoCard key={arriendo.id} arriendo={arriendo} />
                ))}
              </div>
            )}
          </div>

          {/* Documentos */}
          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2 className="section-title">Documentos y Contratos</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {documentos.length} {documentos.length === 1 ? 'documento disponible' : 'documentos disponibles'}
                </p>
              </div>
              <Link href="/alquileres" className="section-link">
                Ver todos →
              </Link>
            </div>

            <div className="dashboard-card">
              {documentos.length === 0 ? (
                <EmptyState tipo="documentos" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {documentos.slice(0, 5).map((doc, index) => (
                    <DocumentoItem key={doc.id} documento={doc} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          {!user?.perfilVerificado?.estaVerificado && <CTABanner />}
        </div>
      </div>
    </div>
  );
}