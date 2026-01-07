import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h2 style={{ margin: 0 }}>Página no encontrada</h2>
        <p style={{ marginTop: 10, color: "#555" }}>
          La ruta que intentaste abrir no existe.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}
