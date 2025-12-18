"use client";

import { useEffect } from "react";
import { socket } from "@/services/socket";

export const usePropiedadesSocket = () => {
  useEffect(() => {
    socket.on("propiedad:estado-cambiado", (data) => {
      console.log("📡 Estado cambiado (WS):", data);
    });

    socket.on("propiedad:servicios", (data) => {
      console.log("🛠 Servicios actualizados (WS):", data);
    });

    return () => {
      socket.off("propiedad:estado-cambiado");
      socket.off("propiedad:servicios");
    };
  }, []);
};
