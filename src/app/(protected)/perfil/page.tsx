'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { arrendadoresApi } from '@/lib/api/arrendadores.api';

export default function PerfilPage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Usar datos reales del usuario
  const userData = {
    nombre: user?.nombresCompletos || '',
    email: user?.correo || '',
    telefono: user?.perfilVerificado?.telefonoContacto || '',
    cedula: user?.perfilVerificado?.cedulaRuc || '',
    direccion: '',
    ciudad: 'Portoviejo',
    esArrendadorVerificado: user?.perfilVerificado?.estaVerificado || false,
    fechaRegistro: user?.fechaRegistro || ''
  };

  const [editData, setEditData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estadísticas reales desde propiedades del usuario
  const stats = {
    propiedades: user?.propiedades?.length || 0,
    arrendamientos: user?.propiedades?.filter(p => p.estado.nombre === 'ocupada').length || 0,
    tiempoRegistrado: user?.fechaRegistro
      ? `${Math.floor((new Date().getTime() - new Date(user.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses`
      : '0 meses'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Llamar al API para actualizar perfil
      await arrendadoresApi.actualizarPerfil({
        nombresCompletos: editData.nombre,
        telefonoContacto: editData.telefono,
        cedulaRuc: editData.cedula,
        biografiaCorta: ''
      });

      // Actualizar el usuario en el store
      if (user) {
        setUser({
          ...user,
          nombresCompletos: editData.nombre,
          perfilVerificado: {
            ...user.perfilVerificado!,
            telefonoContacto: editData.telefono,
            cedulaRuc: editData.cedula
          }
        });
      }

      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // TODO: Llamar al API para cambiar contraseña
      console.log('Cambiar contraseña');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarVerificacion = async () => {
    if (!userData.telefono || !userData.cedula) {
      alert('Por favor completa tu perfil (teléfono y cédula) antes de solicitar verificación');
      return;
    }

    if (confirm('¿Deseas solicitar la verificación como arrendador?')) {
      setLoading(true);
      try {
        // Llamar al API para solicitar verificación
        await arrendadoresApi.solicitarVerificacion({
          cedulaRuc: userData.cedula,
          telefonoContacto: userData.telefono,
          biografiaCorta: 'Solicitud de verificación'
        });

        alert('Solicitud enviada exitosamente. Recibirás una notificación cuando sea procesada.');
      } catch (error: any) {
        console.error('Error:', error);
        alert(error.message || 'Error al enviar solicitud');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="perfil-container">
      {/* Header */}
      <div className="perfil-header">
        <h1 className="perfil-title">Mi Perfil</h1>
        <p className="perfil-subtitle">
          Gestiona tu información personal y configuración
        </p>
      </div>

      {/* Grid */}
      <div className="perfil-grid">
        {/* Sidebar */}
        <div className="perfil-sidebar">
          {/* Avatar Card */}
          <div className="perfil-avatar-card">
            <div className="perfil-avatar">
              {getInitials(userData.nombre)}
            </div>
            <h2 className="perfil-name">{userData.nombre}</h2>
            <p className="perfil-email">{userData.email}</p>
            <span className={`perfil-status ${userData.esArrendadorVerificado ? 'verificado' : 'pendiente'}`}>
              {userData.esArrendadorVerificado ? '✓ Arrendador Verificado' : 'Usuario Regular'}
            </span>
            <button className="btn-upload-avatar">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              Cambiar Foto
            </button>
          </div>

          {/* Estadísticas */}
          <div className="perfil-stats-card">
            <h3 className="perfil-stats-title">Estadísticas</h3>
            <div className="perfil-stat-item">
              <span className="perfil-stat-label">Propiedades</span>
              <span className="perfil-stat-value">{stats.propiedades}</span>
            </div>
            <div className="perfil-stat-item">
              <span className="perfil-stat-label">Arrendamientos</span>
              <span className="perfil-stat-value">{stats.arrendamientos}</span>
            </div>
            <div className="perfil-stat-item">
              <span className="perfil-stat-label">Tiempo registrado</span>
              <span className="perfil-stat-value">{stats.tiempoRegistrado}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="perfil-main">
          {/* Alert de verificación */}
          {!userData.esArrendadorVerificado && (
            <div className="verificacion-alert">
              <div className="verificacion-icon warning">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="verificacion-content">
                <h3 className="verificacion-title">Conviértete en Arrendador Verificado</h3>
                <p className="verificacion-text">
                  Solicita la verificación para publicar propiedades y acceder a más funciones.
                </p>
                <button
                  className="btn-solicitar-verificacion"
                  onClick={handleSolicitarVerificacion}
                  disabled={loading}
                >
                  Solicitar Verificación
                </button>
              </div>
            </div>
          )}

          {/* Información Personal */}
          <div className="perfil-card">
            <div className="perfil-card-header">
              <h3 className="perfil-card-title">Información Personal</h3>
              {!isEditing && (
                <button
                  className="btn-editar-perfil"
                  onClick={() => setIsEditing(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Editar Perfil
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="perfil-info-grid">
                <div className="perfil-info-item">
                  <div className="perfil-info-label">Nombre Completo</div>
                  <div className="perfil-info-value">{userData.nombre}</div>
                </div>

                <div className="perfil-info-item">
                  <div className="perfil-info-label">Email</div>
                  <div className="perfil-info-value">{userData.email}</div>
                </div>

                <div className="perfil-info-item">
                  <div className="perfil-info-label">Teléfono</div>
                  <div className="perfil-info-value">{userData.telefono}</div>
                </div>

                <div className="perfil-info-item">
                  <div className="perfil-info-label">Cédula</div>
                  <div className="perfil-info-value">{userData.cedula}</div>
                </div>

                <div className="perfil-info-item">
                  <div className="perfil-info-label">Dirección</div>
                  <div className="perfil-info-value">{userData.direccion}</div>
                </div>

                <div className="perfil-info-item">
                  <div className="perfil-info-label">Ciudad</div>
                  <div className="perfil-info-value">{userData.ciudad}</div>
                </div>
              </div>
            ) : (
              <div className="perfil-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Nombre Completo</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-input"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-input"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Cédula</label>
                    <input
                      type="text"
                      name="cedula"
                      className="form-input"
                      value={editData.cedula}
                      onChange={handleEditChange}
                      required
                      maxLength={10}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Ciudad</label>
                    <select
                      name="ciudad"
                      className="form-select"
                      value={editData.ciudad}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="Portoviejo">Portoviejo</option>
                      <option value="Manta">Manta</option>
                      <option value="Chone">Chone</option>
                      <option value="Jipijapa">Jipijapa</option>
                    </select>
                  </div>
                </div>

                <div className="form-row single">
                  <div className="form-group">
                    <label className="form-label required">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-input"
                      value={editData.direccion}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>

                <div className="perfil-form-actions">
                  <button
                    className="btn-cancelar-edit"
                    onClick={() => {
                      setEditData({ ...userData });
                      setIsEditing(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-guardar-edit"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cambio de Contraseña */}
          <div className="perfil-card">
            <div className="perfil-card-header">
              <h3 className="perfil-card-title">Seguridad</h3>
            </div>

            <div className="password-card">
              <p className="password-hint">
                Cambia tu contraseña regularmente para mantener tu cuenta segura.
              </p>

              <div className="perfil-edit-form">
                <div className="form-row single">
                  <div className="form-group">
                    <label className="form-label required">Contraseña Actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-input"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-input"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Confirmar Contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="perfil-form-actions">
                  <button
                    className="btn-guardar-edit"
                    onClick={handleChangePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  >
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}