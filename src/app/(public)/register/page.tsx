'use client';

import { useState, useEffect } from 'react';
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
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Validar contraseña en tiempo real
  useEffect(() => {
    const password = formData.password;
    const validation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
    
    setPasswordValidation(validation);

    // Cerrar la cajita si todos los requisitos se cumplen
    const allValid = validation.minLength && 
                     validation.hasUpperCase && 
                     validation.hasLowerCase && 
                     validation.hasNumber;
    
    if (allValid && showPasswordValidation) {
      // Pequeño delay para que el usuario vea el último check verde
      setTimeout(() => {
        setShowPasswordValidation(false);
      }, 500);
    }
  }, [formData.password]);

  // Validar coincidencia de contraseñas
  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      setPasswordMismatch(formData.password !== formData.confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const isPasswordValid = () => {
    return (
      passwordValidation.minLength &&
      passwordValidation.hasUpperCase &&
      passwordValidation.hasLowerCase &&
      passwordValidation.hasNumber
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación de contraseñas
    if (!isPasswordValid()) {
      setError('Por favor cumple con todos los requisitos de contraseña');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
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
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setShowPasswordValidation(true)}
            required
            minLength={8}
            className="auth-input"
          />

          {/* Validación de contraseña */}
          {showPasswordValidation && formData.password.length > 0 && (
            <div className="password-validation">
              <div className="password-validation-title">
                Tu contraseña debe contener:
              </div>
              <div className="password-requirements">
                <div className={`password-requirement ${passwordValidation.minLength ? 'valid' : ''}`}>
                  <svg 
                    className={`requirement-icon ${passwordValidation.minLength ? 'checked' : 'unchecked'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {passwordValidation.minLength ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  Mínimo 8 caracteres
                </div>

                <div className={`password-requirement ${passwordValidation.hasUpperCase ? 'valid' : ''}`}>
                  <svg 
                    className={`requirement-icon ${passwordValidation.hasUpperCase ? 'checked' : 'unchecked'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {passwordValidation.hasUpperCase ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  Al menos una letra mayúscula
                </div>

                <div className={`password-requirement ${passwordValidation.hasLowerCase ? 'valid' : ''}`}>
                  <svg 
                    className={`requirement-icon ${passwordValidation.hasLowerCase ? 'checked' : 'unchecked'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {passwordValidation.hasLowerCase ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  Al menos una letra minúscula
                </div>

                <div className={`password-requirement ${passwordValidation.hasNumber ? 'valid' : ''}`}>
                  <svg 
                    className={`requirement-icon ${passwordValidation.hasNumber ? 'checked' : 'unchecked'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {passwordValidation.hasNumber ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  Al menos un número
                </div>
              </div>
            </div>
          )}

          {/* Confirmar Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className={`auth-input ${passwordMismatch ? 'password-mismatch' : ''}`}
          />

          {/* Mensaje de error de coincidencia */}
          {passwordMismatch && (
            <div className="password-error-inline">
              <svg className="password-error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Las contraseñas no coinciden
            </div>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading || !isPasswordValid() || passwordMismatch}
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