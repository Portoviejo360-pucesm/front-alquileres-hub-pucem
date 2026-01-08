'use client';

import Link from 'next/link';

export default function PublicTopBar() {
  return (
    <header className="header-protected">
      {/* Lado izquierdo - Logo */}
      <div className="header-left">
        <Link href="/" className="logo-container">
          <div className="logo-circle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="logo-text">Portoviejo360</span>
        </Link>
      </div>

      {/* Lado derecho - Botones */}
      <div className="header-actions">
        <Link href="/login" className="user-menu-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Ingresar</span>
        </Link>

        <Link href="/register" className="btn-primary">
          Registrarse
        </Link>
      </div>
    </header>
  );
}