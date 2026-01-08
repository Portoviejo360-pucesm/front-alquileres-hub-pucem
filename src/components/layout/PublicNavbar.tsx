'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function PublicNavbar() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header-protected">
            {/* Lado izquierdo */}
            <div className="header-left">
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
                {/* Botones de Login/Register */}
                <Link
                    href="/login"
                    className="btn-login"
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Ingresar
                </Link>

                <Link
                    href="/register"
                    className="btn-register"
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Registrarse
                </Link>
            </div>
        </header>
    );
}
