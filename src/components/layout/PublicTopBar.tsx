// NAVBAR PÚBLICO (Inicio de sesión / Registro)
// A MEJORAR

"use client";

import Link from "next/link";
import '../../styles/components/topbar.css';
import '../../styles/theme.css';

export default function PublicTopBar() {
  return (
    <header className="header-public">
      {/* Logo */}
          <Link href="/dashboard" className="logo-container">
            <div className="logo-circle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="logo-text">Portoviejo360</span>
          </Link>

      {/* Botones de Acción */}
      <nav className="nav-actions">
        <Link href="/login" className="btn-nav-login">
          Iniciar Sesión
        </Link>

        <Link href="/register" className="btn-nav-register">
          Regístrate
        </Link>
      </nav>
    </header>
  );
}