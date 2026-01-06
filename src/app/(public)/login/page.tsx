'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-main-content">
      <div className="login-card">
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--brand-red)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="white"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            color: 'var(--text-dark)'
          }}>
            Portoviejo360
          </span>
        </div>

        {/* Título */}
        <h2 className="login-title">Iniciar Sesión</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Mensaje de Error */}
          {error && (
            <div style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />

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
        <p style={{ 
          marginTop: '24px', 
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          ¿No tienes cuenta?{' '}
          <Link 
            href="/register" 
            style={{ 
              color: 'var(--brand-green)', 
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}