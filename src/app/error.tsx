'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px' }}>¡Algo salió mal!</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        {error.message || 'Ha ocurrido un error inesperado'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}