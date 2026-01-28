'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.correo, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-container">
          <div className="auth-logo-circle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="auth-logo-text">Portoviejo360</span>
        </div>

        {/* Título */}
        <h2 className="auth-card-title">Iniciar Sesión</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Mensaje de Error */}
          {error && (
            <div className="auth-error-message">
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
            className="auth-input"
          />

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!formData.password}
              style={{
                position: 'absolute',
                right: '12px',
                top: '35%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: formData.password ? 'pointer' : 'not-allowed',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: formData.password ? '#6b7280' : '#d1d5db',
                transition: 'color 0.2s',
                opacity: formData.password ? 1 : 0.5
              }}
              onMouseEnter={(e) => formData.password && (e.currentTarget.style.color = '#374151')}
              onMouseLeave={(e) => formData.password && (e.currentTarget.style.color = '#6b7280')}
            >
              {showPassword ? (
                // Ojo cerrado
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                // Ojo abierto
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-ingresar"
          >
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
        </form>

        {/* Link a Registro */}
        <p className="auth-footer-text">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="auth-footer-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}