import Link from 'next/link';

export default function CTABanner() {
  return (
    <div className="dashboard-card" style={{ 
      background: 'linear-gradient(135deg, #2d5a4c 0%, #3d7a66 100%)',
      color: 'white',
      padding: '2.5rem',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Beneficio Premium
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            ¿Tienes propiedades para arrendar?
          </h3>
          <p style={{ fontSize: '1.125rem', opacity: 0.95, marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Conviértete en arrendador verificado y empieza a publicar tus propiedades con todas las herramientas que necesitas
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {[
              'Publica propiedades ilimitadas',
              'Gestión de contratos digitales',
              'Verificación de arrendatarios'
            ].map((item, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link 
            href="/perfil" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 2rem',
              background: 'white',
              color: '#2d5a4c',
              fontWeight: '700',
              borderRadius: '12px',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}
          >
            Solicitar Verificación
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Decoración */}
      <svg 
        style={{
          position: 'absolute',
          right: '-50px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          width: '400px',
          height: '400px'
        }}
        viewBox="0 0 20 20" 
        fill="white"
      >
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
  );
}
