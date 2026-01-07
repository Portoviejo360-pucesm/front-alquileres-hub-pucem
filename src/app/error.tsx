"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Algo salió mal 😵‍💫</h2>
        <p style={{ color: "#555" }}>
          {error?.message || "Ocurrió un error inesperado."}
        </p>

        <button
          onClick={() => reset()}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
