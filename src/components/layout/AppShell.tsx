'use client';

import { useState, useEffect } from 'react';
import TopBar from './PrivateTopBar';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En móvil, sidebar cerrado por defecto
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    // Solo cerrar en móvil al hacer click en un link
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--brand-bg)' }}>
      <TopBar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {children}
      </main>
    </div>
  );
}