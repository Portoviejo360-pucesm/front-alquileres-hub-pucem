// store/auth.store.ts

import { create } from 'zustand';
import { authApi } from '@/lib/api/auth.api';
import { tokenStorage } from '@/lib/auth/token';
import type { PerfilResponse } from '@/types/auth';

interface AuthState {
  user: PerfilResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { 
    email: string; 
    password: string; 
    nombre: string; 
    telefono?: string 
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: PerfilResponse) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: tokenStorage.get(),
  isAuthenticated: false,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    
    try {
      // authApi.login retorna { token: string } y lo guarda automáticamente
      const response = await authApi.login({ email, password });
      
      set({ 
        token: response.token,
        isAuthenticated: true,
        loading: false 
      });

      // Cargar los datos del usuario después del login
      await get().loadUser();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });
    
    try {
      await authApi.register(data);
      // Después de registrar, hacer login automáticamente
      await get().login(data.email, data.password);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  loadUser: async () => {
    const token = get().token;
    
    if (!token) {
      set({ isAuthenticated: false, loading: false });
      return;
    }
    
    set({ loading: true });
    
    try {
      const user = await authApi.perfil();
      set({ 
        user, 
        isAuthenticated: true,
        loading: false 
      });
    } catch (error) {
      authApi.logout();
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        loading: false 
      });
    }
  },

  setUser: (user: PerfilResponse) => {
    set({ user });
  },
}));