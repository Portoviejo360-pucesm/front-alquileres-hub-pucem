"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/arrendadores", label: "Arrendadores" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/documentacion", label: "Documentación" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 260,
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
      }}
    >
      {/* Logo / Title */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Portoviejo360</h2>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Gestión de Arriendos
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                textDecoration: "none",
                color: active ? "#0f172a" : "#e5e7eb",
                background: active ? "#e5e7eb" : "transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.6 }}>
        © {new Date().getFullYear()} PUCE Manabí
      </div>
    </aside>
  );
}
