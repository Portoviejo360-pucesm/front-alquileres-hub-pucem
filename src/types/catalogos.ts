// src/types/catalogos.ts

export type BaseCatalogo = {
  id: string;
  nombre: string;
};

// ================================
// SERVICIOS
// ================================
export type Servicio = BaseCatalogo & {
  descripcion?: string;
};

// ================================
// ESTADOS DE PROPIEDAD
// ================================
export type EstadoPropiedad = BaseCatalogo;
// Ej: disponible | ocupado | mantenimiento

// ================================
// TIPO DE PÚBLICO OBJETIVO
// ================================
export type TipoPublico = BaseCatalogo;
// Ej: estudiantes, familias, empresas, etc.

// ================================
// ROLES DE USUARIO
// ================================
export type Rol = BaseCatalogo;
// Ej: ADMIN, ARRENDADOR, USUARIO
