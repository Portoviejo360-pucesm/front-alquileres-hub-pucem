// types/auth.ts

export type LoginRequest = { 
  email: string; 
  password: string 
};

export type LoginResponse = { 
  token: string 
};

export type RegisterRequest = {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
};

export type PerfilResponse = {
  id: string;
  email: string;
  nombre?: string;
  role?: string;
  telefono?: string;
  rolId?: number;
  esArrendadorVerificado?: boolean;
};