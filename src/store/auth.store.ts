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
  login: (correo: string, password: string) => Promise<void>;
  register: (data: {
    correo: string;
    password: string;
    nombresCompletos: string;
    rolId?: number
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: PerfilResponse) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = tokenStorage.get();

  return {
    user: null,
    token: initialToken,
    isAuthenticated: false,
    loading: !!initialToken, // Si hay token, empezar en loading para evitar redirect prematuro

    login: async (correo: string, password: string) => {
      set({ loading: true });

      try {
        // authApi.login retorna { token: string } y lo guarda automáticamente
        const response = await authApi.login({ correo, password });

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
        await get().login(data.correo, data.password);
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
        // Intentar obtener token de localStorage
        const storedToken = tokenStorage.get();

        if (storedToken) {
          set({ token: storedToken, loading: true });
        } else {
          set({ isAuthenticated: false, loading: false });
          return;
        }
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
  };
});