'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    nombresCompletos: '',
    correo: '',
    password: '',
    confirmPassword: ''
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

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    // Validar que tenga mayúscula, minúscula y número
    if (!/[A-Z]/.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra mayúscula');
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra minúscula');
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('La contraseña debe contener al menos un número');
      setLoading(false);
      return;
    }

    try {
      await register({
        nombresCompletos: formData.nombresCompletos,
        correo: formData.correo,
        password: formData.password
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
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
        <h2 className="auth-card-title">Crear Cuenta</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Mensaje de Error */}
          {error && (
            <div className="auth-error-message">
              {error}
            </div>
          )}

          {/* Nombre Completo */}
          <input
            type="text"
            name="nombresCompletos"
            placeholder="Nombre completo"
            value={formData.nombresCompletos}
            onChange={handleChange}
            required
            minLength={3}
            className="auth-input"
          />

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
          <input
            type="password"
            name="password"
            placeholder="Contraseña (mín. 8 caracteres, mayúscula, minúscula y número)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="auth-input"
          />

          {/* Confirmar Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="auth-input"
          />

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-ingresar"
          >
            {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
          </button>
        </form>

        {/* Link a Login */}
        <p className="auth-footer-text">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="auth-footer-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}