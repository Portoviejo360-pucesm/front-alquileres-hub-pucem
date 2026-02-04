import Link from "next/link";
import '@/styles/components/layout.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2 className="not-found-title">Página no encontrada</h2>
        <p className="not-found-text">
          La ruta que intentaste abrir no existe.
        </p>

        <Link href="/dashboard" className="not-found-link">
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}
