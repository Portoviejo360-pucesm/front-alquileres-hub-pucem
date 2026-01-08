'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { usePropiedades } from './usePropiedades';

const SOCKET_URL = 'http://localhost:3000';

type EstadoPayload = {
  id_propiedad: number | string;
  estado: string;
};

export function usePropiedadesSocket() {
  const { setPropiedades } = usePropiedades();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('🟢 WS conectado:', socket.id);
    });
    socket.on("propiedad:estado-cambiado", (payload) => {
    console.log("📦 Estado recibido por WS:", payload);

  setPropiedades(prev =>
    prev.map(p =>
      p.id === payload.id_propiedad
        ? { ...p, estado: payload.estado }
        : p
    )
  );
});

    return () => {
      socket.disconnect();
    };
  }, [setPropiedades]);
}
