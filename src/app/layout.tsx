import type { Metadata } from 'next';
import '@/styles/theme.css';
import '@/styles/components/topbar.css';
import '@/styles/components/dashboard.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portoviejo360 - Sistema de Alquileres',
  description: 'Gestión de propiedades y arrendadores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}