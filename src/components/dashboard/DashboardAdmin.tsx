// components/dashboard/DashboardAdmin.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { getAdminDashboardStats } from '@/services/api';
import '@/styles/components/arrendadores.css';

export default function DashboardAdmin() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await getAdminDashboardStats(token);
        if (response.success) {
          setStats(response.data);
        } else {
          setError('No se pudieron cargar las estadísticas');
        }
      } catch (err: any) {
        console.error('Error cargando stats:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  // Formatear fecha relativa (Placeholder, ya que no tenemos actividades recientes reales aún complejas)
  const formatearFechaRelativa = (fecha: string) => {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diff = ahora.getTime() - fechaActividad.getTime();

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    const meses = Math.floor(diff / 2592000000);

    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias < 30) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    return `Hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
  };

  if (loading) {
    return (
      <div className="dashboard-admin">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-admin">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
        </div>
        <div className="error-state">
          <p>{error || 'No hay datos disponibles'}</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Total de Usuarios',
      value: stats.totalUsuarios.toString(),
      change: `${stats.totalArrendadores || 0} arrendadores`,
      changeType: 'info',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      colorClass: 'blue',
      link: '/usuarios'
    },
    {
      label: 'Arrendadores Verificados',
      value: stats.totalArrendadoresVerificados.toString(),
      change: `${stats.totalArrendadores} total`,
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'green',
      link: '/arrendadores'
    },
    {
      label: 'Solicitudes Pendientes',
      value: stats.solicitudesPendientes.toString(),
      change: stats.solicitudesPendientes > 0 ? 'Requiere atención' : 'Sin pendientes',
      changeType: stats.solicitudesPendientes > 0 ? 'warning' : 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'orange',
      link: '/arrendadores?filter=pendientes'
    },
    {
      label: 'Total de Propiedades',
      value: stats.totalPropiedades.toString(),
      change: `${stats.propiedadesDisponibles} disponibles, ${stats.propiedadesOcupadas} ocupadas`,
      changeType: 'info',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      colorClass: 'purple',
      link: '/propiedades'
    },
    {
      label: 'Ingresos Totales Estimados',
      value: `$${stats.ingresosMensualesEstimados.toFixed(0)}`,
      change: `${stats.propiedadesOcupadas} propiedades generando ingresos`,
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'indigo',
      link: '/propiedades'
    },
  ];

  return (
    <div className="dashboard-admin">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Administración</h1>
          <p className="dashboard-subtitle">
            Resumen general del sistema Portoviejo360
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stats-grid-admin">
        {statsCards.map((stat, index) => (
          <Link
            href={stat.link}
            key={index}
            className={`stat-card stat-card-${stat.colorClass} stat-card-clickable`}
          >
            <div className="stat-icon-wrapper">
              <div className={`stat-icon stat-icon-${stat.colorClass}`}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className={`stat-change stat-change-${stat.changeType}`}>
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Sección de Actividad Reciente y Acciones Rápidas */}
      <div className="dashboard-content-grid">
        {/* Actividad Reciente: Mantenemos estructura pero indicamos que no hay datos en vivo aún de actividad detallada, o podríamos implementarlo luego */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Acciones Rápidas</h2>
          </div>
          <div className="quick-actions">
            <Link href="/arrendadores?filter=pendientes" className="quick-action-btn">
              <div className="quick-action-icon quick-action-icon-orange">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="quick-action-content">
                <p className="quick-action-title">Revisar Solicitudes</p>
                <p className="quick-action-subtitle">{stats.solicitudesPendientes} pendientes</p>
              </div>
            </Link>

            <Link href="/usuarios" className="quick-action-btn">
              <div className="quick-action-icon quick-action-icon-blue">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="quick-action-content">
                <p className="quick-action-title">Gestionar Usuarios</p>
                <p className="quick-action-subtitle">{stats.totalUsuarios} usuarios</p>
              </div>
            </Link>

            <Link href="/arrendadores" className="quick-action-btn">
              <div className="quick-action-icon quick-action-icon-green">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="quick-action-content">
                <p className="quick-action-title">Arrendadores</p>
                <p className="quick-action-subtitle">{stats.totalArrendadoresVerificados} verificados</p>
              </div>
            </Link>

            <Link href="/propiedades" className="quick-action-btn">
              <div className="quick-action-icon quick-action-icon-purple">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div className="quick-action-content">
                <p className="quick-action-title">Ver Propiedades</p>
                <p className="quick-action-subtitle">{stats.totalPropiedades} total</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
