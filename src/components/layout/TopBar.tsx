"use client";

import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import Link from 'next/link';
import '../../styles/theme.css';

function getTitle(pathname: string) {
  if (pathname.startsWith("/arrendadores")) return "Arrendadores";
  if (pathname.startsWith("/propiedades")) return "Propiedades";
  if (pathname.startsWith("/documentacion")) return "Documentación";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Panel";
}

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    authApi.logout();
    router.replace("/login");
  }

  return (
    <header
      style={{
        height: 64,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Page title */}
      <h1 style={{ margin: 0, fontSize: 20 }}>
        {getTitle(pathname)}
      </h1>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Usuario (placeholder) */}
        <span style={{ fontSize: 14, color: "#374151" }}>
          Usuario
        </span>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
