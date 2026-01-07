'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Datos mock para demostración
  const stats = [
    {
      label: 'Propiedades Activas',
      value: '12',
      change: '+3 este mes',
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      colorClass: 'green'
    },
    {
      label: 'Arrendadores',
      value: '8',
      change: '+2 este mes',
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      colorClass: 'blue'
    },
    {
      label: 'Propiedades Ocupadas',
      value: '7',
      change: '+1 este mes',
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      colorClass: 'orange'
    },
    {
      label: 'Ingresos Mensuales',
      value: '$2,450',
      change: '+$320 este mes',
      changeType: 'positive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'purple'
    },
  ];

  const recentActivities = [
    {
      title: 'Nueva propiedad registrada',
      description: 'Departamento en Av. Universitaria',
      time: 'Hace 2 horas',
      type: 'success'
    },
    {
      title: 'Documento verificado',
      description: 'Contrato de Juan Pérez aprobado',
      time: 'Hace 4 horas',
      type: 'info'
    },
    {
      title: 'Pago recibido',
      description: '$350.00 - Propiedad #123',
      time: 'Hace 1 día',
      type: 'success'
    },
    {
      title: 'Mantenimiento programado',
      description: 'Departamento Calle 10',
      time: 'Hace 2 días',
      type: 'warning'
    },
  ];

  const recentProperties = [
    {
      id: 1,
      title: 'Departamento Moderno',
      location: 'Av. Universitaria, Portoviejo',
      price: '$350',
      status: 'disponible',
      image: null
    },
    {
      id: 2,
      title: 'Casa Familiar',
      location: 'Calle 10 de Agosto',
      price: '$450',
      status: 'ocupada',
      image: null
    },
    {
      id: 3,
      title: 'Estudio Céntrico',
      location: 'Centro Histórico',
      price: '$280',
      status: 'disponible',
      image: null
    },
  ];

  const monthlyData = [
    { month: 'Ene', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 80 },
    { month: 'Abr', value: 70 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 90 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Bienvenido de vuelta, {user?.nombre || 'Usuario'}. Aquí está un resumen de tu actividad.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <p className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`stat-icon ${stat.colorClass}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Acciones Rápidas</h2>
        <div className="quick-actions">
          <Link href="/propiedades/new" className="quick-action-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Propiedad
          </Link>
          <Link href="/arrendadores/new" className="quick-action-btn secondary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Nuevo Arrendador
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        {/* Actividad Reciente */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Actividad Reciente</h2>
            <Link href="/actividad" className="card-link">Ver todo</Link>
          </div>
          
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="activity-content">
                  <h3 className="activity-title">{activity.title}</h3>
                  <p className="activity-description">{activity.description}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Propiedades Recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Propiedades Recientes</h2>
            <Link href="/propiedades" className="card-link">Ver todas</Link>
          </div>
          
          <div className="properties-list">
            {recentProperties.map((property) => (
              <Link 
                key={property.id} 
                href={`/propiedades/${property.id}`}
                className="property-item"
              >
                <div 
                  className="property-image"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  SIN FOTO
                </div>
                <div className="property-info">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="property-price">{property.price}/mes</span>
                    <span className={`property-badge ${property.status}`}>
                      {property.status === 'disponible' ? 'Disponible' : 
                       property.status === 'ocupada' ? 'Ocupada' : 'Mantenimiento'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Actividad */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Propiedades Registradas por Mes</h2>
        </div>
        <div className="chart-container">
          {monthlyData.map((data, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                className="chart-bar"
                style={{ height: `${data.value}%` }}
                title={`${data.month}: ${data.value}%`}
              />
              <div className="chart-label">{data.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}