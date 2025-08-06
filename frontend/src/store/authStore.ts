import { authService } from '@/services/auth';
import type { LoginCredentials, RegisterData, User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  autoLogin: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateLocation: (location: { lat: number; lng: number; address?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  // Initialize from stored data
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (data: LoginCredentials) => {
        console.log('🏪 authStore - Iniciando login:', data);
        set({ isLoading: true, error: null });

        try {
          console.log('🏪 authStore - Chamando authService.login...');
          const user = await authService.login(data);
          console.log('🏪 authStore - Login bem-sucedido, usuário:', user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('🏪 authStore - Estado atualizado com sucesso');
          return { success: true };
        } catch (error) {
          console.error('🏪 authStore - Erro no login:', error);
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.register(data);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Auto login action for demo mode
      autoLogin: async () => {
        console.log('🏪 authStore - Verificando auto login...');

        if (!authService.shouldAutoLogin()) {
          console.log('🏪 authStore - Auto login não disponível');
          return { success: false, error: 'Auto login not available' };
        }

        console.log('🏪 authStore - Iniciando auto login...');
        set({ isLoading: true, error: null });

        try {
          const user = await authService.autoLogin();
          console.log('🏪 authStore - Auto login resultado:', user);

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log('🏪 authStore - Auto login bem-sucedido');
            return { success: true };
          } else {
            console.log('🏪 authStore - Auto login retornou null');
            set({ isLoading: false });
            return { success: false, error: 'Auto login failed' };
          }
        } catch (error) {
          console.error('🏪 authStore - Erro no auto login:', error);
          const errorMessage = error instanceof Error ? error.message : 'Auto login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        if (!get().isAuthenticated) return;

        set({ isLoading: true, error: null });

        try {
          const user = await authService.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to refresh user data';
          set({ error: errorMessage, isLoading: false });

          // If refresh fails due to auth error, logout
          if (error instanceof Error && error.message.includes('401')) {
            get().logout();
          }
        }
      },

      // Change password
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          await authService.updatePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Update profile
      updateProfile: async (data: any) => {
        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Update location
      updateLocation: async (_location: { lat: number; lng: number; address?: string }) => {
        set({ isLoading: true, error: null });

        try {
          // This would call the users API service
          // For now, we'll just refresh the user data
          await get().refreshUser();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update location';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Upload avatar
      uploadAvatar: async (_file: File) => {
        set({ isLoading: true, error: null });

        try {
          // This would call the users API service
          // For now, we'll just refresh the user data
          await get().refreshUser();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // Initialize from stored data
      initialize: () => {
        console.log('🏪 authStore - Inicializando store...');

        // Check for auto login in demo mode
        if (authService.shouldAutoLogin()) {
          console.log('🏪 authStore - Auto login disponível, iniciando...');
          // Execute auto login asynchronously
          get().autoLogin().catch(console.error);
        } else {
          console.log('🏪 authStore - Auto login não disponível, inicialização padrão');
          // Mock initialization - in real implementation would check stored tokens
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth store on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
