'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const notifications = [
    {
      id: 1,
      title: 'Nueva solicitud de arrendamiento',
      time: 'Hace 2 horas',
      unread: true
    },
    {
      id: 2,
      title: 'Propiedad verificada',
      time: 'Hace 5 horas',
      unread: false
    },
  ];

  return (
    <header className="header-protected">
      {/* Lado izquierdo */}
      <div className="header-left">
        {/* Botón Hamburguesa */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="logo-container">
          <div className="logo-circle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="logo-text">Portoviejo360</span>
        </Link>
      </div>

      {/* Right Actions */}
      <div className="header-actions">
        {/* Notifications */}
        <div className="dropdown" ref={notificationsRef}>
          <button
            className="notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#6b7280' }}>
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="notification-badge" />
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <h3 style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', marginBottom: '8px' }}>
                Notificaciones
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.unread ? 'unread' : ''}`}
                  >
                    <p className="notification-title">{notif.title}</p>
                    <p className="notification-time">{notif.time}</p>
                  </div>
                ))}
              </div>
              <Link href="/notificaciones" className="notification-link">
                Ver todas
              </Link>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="dropdown" ref={userMenuRef}>
          <button
            className="user-menu-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar">
              {getInitials(user?.nombresCompletos)}
            </div>

            <div className="user-info">
              <span className="user-name">
                {user?.nombresCompletos || 'Usuario'}
              </span>
              <span className="user-status">
                {user?.perfilVerificado?.estaVerificado ? '✓ Verificado' : 'Usuario'}
              </span>
            </div>

            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#9ca3af' }}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-user-name">
                  {user?.nombresCompletos || 'Usuario'}
                </p>
                <p className="dropdown-user-email">
                  {user?.correo || 'email@ejemplo.com'}
                </p>
              </div>

              <Link href="/perfil" className="dropdown-item">
                <div className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Mi Perfil
              </Link>

              <Link href="/propiedades" className="dropdown-item">
                <div className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                Mis Propiedades
              </Link>

              <Link href="/documentacion" className="dropdown-item">
                <div className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                Documentos
              </Link>

              <div className="dropdown-divider" />

              <button onClick={handleLogout} className="dropdown-item danger">
                <div className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </div>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}