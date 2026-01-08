'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-brand-dark/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Nombre */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-brand-dark to-brand-brown rounded-2xl flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
              <Image
                src="/icon360.png"
                alt="AlquileresHub Logo"
                width={48}
                height={48}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5"></div>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 cursor-pointer hover:text-brand-dark transition-colors duration-300">
                Portoviejo360
              </h1>
              <p className="text-xs font-medium text-gray-600">
                Encuentra tu hogar ideal
              </p>
            </div>
          </Link>

          {/* Links de navegación - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
            >
              Explorar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
            >
              Favoritos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
            >
              Ayuda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Botones de Acción - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-800 border-2 border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Ingresar
            </Link>

            <Link href="/register" className="px-5 py-2.5 text-sm font-semibold text-gray-900 border-2 border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Registro
            </Link>
          </div>

          {/* Menú Hamburguesa - Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6 text-brand-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <a
              href="#"
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Explorar
            </a>
            <a
              href="#"
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Favoritos
            </a>
            <a
              href="#"
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Ayuda
            </a>

            <div className="pt-3 space-y-2">
              <Link href="/login" className="block w-full px-5 py-2.5 text-sm font-semibold text-gray-800 border-2 border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 text-center">
                Ingresar
              </Link>
              <Link href="/register" className="block w-full px-5 py-2.5 text-sm font-semibold text-gray-900 border-2 border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 text-center">
                Registro
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
