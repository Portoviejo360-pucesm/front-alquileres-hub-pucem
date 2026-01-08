import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PropiedadesProvider } from '@/context/PropiedadesContext';
import "./globals.css";

// Importar todos los estilos de componentes
import "@/styles/theme.css";
import "@/styles/components/topbar.css";
import "@/styles/components/dashboard.css";
import "@/styles/components/perfil.css";
import "@/styles/components/propiedades.css";
import "@/styles/components/arrendadores.css";
import "@/styles/components/documentacion.css";
import "@/styles/components/auth-pages.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquileres Hub - Portoviejo360",
  description: "Sistema de gestión de alquileres",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PropiedadesProvider>
          {children}
        </PropiedadesProvider>
      </body>
    </html>
  );
}
