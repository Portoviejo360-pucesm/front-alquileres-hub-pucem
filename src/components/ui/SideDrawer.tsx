'use client';

import React, { useEffect } from 'react';

type SideDrawerProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string; // ej: "w-[360px]" o "w-80"
};

export default function SideDrawer({
  open,
  title = 'Menú',
  onClose,
  children,
  widthClassName = 'w-[360px] max-w-[85vw]',
}: SideDrawerProps) {
  // Cerrar con ESC y bloquear scroll del body mientras esté abierto
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[999] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 h-full bg-white shadow-2xl transform transition-transform duration-200 ${widthClassName}
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="font-semibold text-gray-900">{title}</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>

        {/* Body (scroll interno) */}
        <div className="h-[calc(100%-52px)] overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}
