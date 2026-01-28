'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import PasswordInput from '@/components/forms/PasswordInput';
import EmailInput from '@/components/forms/EmailInput';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    correo: '',
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
          <EmailInput
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
          />

          {/* Password */}
          <PasswordInput
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
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