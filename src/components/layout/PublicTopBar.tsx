// NAVBAR PÚBLICO (Inicio de sesión / Registro)

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import '../../styles/components/navbar.css';
import '../../styles/theme.css';

export default function PublicTopBar() {
  return (
    <header className="header-public">
      {/* Logo */}
      <Link href="/">
        <div className="logo-container">
          {/* Simulamos el icono de ubicación con la P */}
          <div className="logo-circle">P</div>
          <span className="logo-text">Portoviejo360</span>
        </div>
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