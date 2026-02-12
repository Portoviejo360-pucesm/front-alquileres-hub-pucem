'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAdmin = user?.rolId === 1;
  const isArrendadorVerificado = user?.rolId === 2 && user?.perfilVerificado?.estaVerificado;

  const menuItems = [
    {
      name: isAdmin ? 'Panel administrador' : 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      roles: ['all'] // visible para todos
    },
    {
      name: 'Mapa',
      href: '/mapa',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['all'] // Mapa público para todos
    },
    // Opciones solo para Administrador
    {
      name: 'Usuarios',
      href: '/usuarios',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      roles: ['admin']
    },
    {
      name: 'Arrendadores',
      href: '/arrendadores',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['admin']
    },
    // Opciones solo para Arrendadores verificados
    {
      name: 'Mis Propiedades',
      href: '/propiedades',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['arrendador']
    },
    // Opciones para usuarios comunes y arrendadores
    {
      name: 'Mis Arriendos',
      href: '/alquileres',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['user', 'arrendador']
    },
    {
      name: 'Incidencias',
      href: '/incidencias',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['user', 'arrendador']
    },
    {
      name: 'Mi Perfil',
      href: '/perfil',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['all']
    },
  ];

  // Filtrar items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (item.roles.includes('admin') && isAdmin) return true;
    if (item.roles.includes('arrendador') && isArrendadorVerificado) return true;
    if (item.roles.includes('user') && user?.rolId === 2) return true;
    return false;
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Portoviejo360</h2>
          <p className="sidebar-subtitle">Gestión de Arriendos</p>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="sidebar-icon">
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          © {new Date().getFullYear()} PUCE Manabí
        </div>
      </aside>
    </>
  );
}