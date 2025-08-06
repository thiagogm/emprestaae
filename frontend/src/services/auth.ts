import type { LoginCredentials, RegisterData, User } from '@/types';
import { apiService } from './api';

// Mock data para demonstração
const MOCK_USER: User = {
  id: 'demo-user-123',
  name: 'Usuário Demo',
  email: 'demo@example.com',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  rating: 4.5,
  location: {
    latitude: -23.55052,
    longitude: -46.633308,
    address: 'São Paulo, SP',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock_jwt_token_' + Date.now();
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const AUTO_LOGIN = import.meta.env.VITE_AUTO_LOGIN === 'true';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Debug das variáveis de ambiente
console.log('🔧 authService - Variáveis de ambiente carregadas:', {
  'import.meta.env.VITE_USE_MOCK': import.meta.env.VITE_USE_MOCK,
  'import.meta.env.VITE_AUTO_LOGIN': import.meta.env.VITE_AUTO_LOGIN,
  'import.meta.env.VITE_DEMO_MODE': import.meta.env.VITE_DEMO_MODE,
  USE_MOCK,
  AUTO_LOGIN,
  DEMO_MODE,
});

// Mock delay function
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Auto login user for demo mode
const AUTO_LOGIN_USER: User = {
  id: 'demo-auto-user',
  name: 'Usuário Demo',
  email: 'demo@itemswapgo.com',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  rating: 4.8,
  location: {
    latitude: -23.55052,
    longitude: -46.633308,
    address: 'São Paulo, SP, Brasil',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authService = {
  // Auto login for demo mode
  async autoLogin(): Promise<User | null> {
    console.log('🔧 authService - autoLogin chamado');
    console.log('🔧 authService - Variáveis:', { USE_MOCK, AUTO_LOGIN, DEMO_MODE });

    if (USE_MOCK && AUTO_LOGIN && DEMO_MODE) {
      console.log('🚀 Auto login ativado - modo demo');
      await mockDelay(500);
      localStorage.setItem('token', MOCK_TOKEN);
      console.log('🔧 authService - Token salvo, retornando usuário:', AUTO_LOGIN_USER);
      return AUTO_LOGIN_USER;
    }

    console.log('🔧 authService - Auto login não disponível');
    return null;
  },

  // Check if user should be auto-logged in
  shouldAutoLogin(): boolean {
    const shouldAuto = USE_MOCK && AUTO_LOGIN && DEMO_MODE && !localStorage.getItem('token');
    console.log('🔍 Verificando auto-login:', {
      USE_MOCK,
      AUTO_LOGIN,
      DEMO_MODE,
      hasToken: !!localStorage.getItem('token'),
      shouldAuto,
    });
    return shouldAuto;
  },
  async login(credentials: LoginCredentials): Promise<User> {
    console.log('🔧 authService - login chamado com:', credentials);
    console.log('🔧 authService - USE_MOCK:', USE_MOCK);

    if (USE_MOCK) {
      console.log('🔧 authService - Usando modo mock');
      await mockDelay(1000);
      console.log('🔐 Login mock com credenciais:', credentials);

      // Em modo demo, aceita qualquer credencial ou credenciais vazias
      if (DEMO_MODE && AUTO_LOGIN) {
        console.log('🎭 Modo demo ativo - aceitando qualquer credencial');
        const mockUser = { ...AUTO_LOGIN_USER };
        if (credentials.email) {
          mockUser.email = credentials.email;
          mockUser.name = credentials.email.includes('admin') ? 'Admin Demo' : 'Usuário Demo';
        }
        localStorage.setItem('token', MOCK_TOKEN);
        console.log('🔧 authService - Login bem-sucedido (demo), retornando:', mockUser);
        return mockUser;
      }

      // Validação normal para modo mock sem demo
      if (!credentials.email || !credentials.password) {
        console.error('🔧 authService - Credenciais inválidas');
        throw new Error('Email e senha são obrigatórios');
      }

      // Simular diferentes usuários baseado no email
      let mockUser = { ...MOCK_USER };
      if (credentials.email.includes('admin')) {
        mockUser.name = 'Admin Demo';
        mockUser.email = credentials.email;
      } else {
        mockUser.name = 'Usuário Demo';
        mockUser.email = credentials.email;
      }

      localStorage.setItem('token', MOCK_TOKEN);
      console.log('🔧 authService - Login bem-sucedido, retornando:', mockUser);
      return mockUser;
    }

    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/login',
      credentials
    );
    localStorage.setItem('token', token);
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    if (USE_MOCK) {
      await mockDelay(1500);
      console.log('📝 Registro mock com dados:', data);

      // Simular validação básica
      if (!data.email || !data.password || !data.name) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const mockUser: User = {
        ...MOCK_USER,
        name: data.name,
        email: data.email,
        id: 'user_' + Date.now(),
      };

      localStorage.setItem('token', MOCK_TOKEN);
      return mockUser;
    }

    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/register',
      data
    );
    localStorage.setItem('token', token);
    return user;
  },

  async loginWithGoogle(accessToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Google - Token:', accessToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/google', { accessToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Google',
      email: 'google@example.com',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async loginWithFacebook(accessToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Facebook - Token:', accessToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/facebook', { accessToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Facebook',
      email: 'facebook@example.com',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async loginWithApple(identityToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Apple - Token:', identityToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/apple', { identityToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Apple',
      email: 'apple@example.com',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await mockDelay(500);
      console.log('👋 Logout mock');
      localStorage.removeItem('token');
      return;
    }

    await apiService.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      await mockDelay(300);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      console.log('👤 Obtendo usuário atual (mock)');
      return MOCK_USER;
    }

    return apiService.get<User>('/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.patch<User>('/auth/profile', data);
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.patch('/auth/password', { currentPassword, newPassword });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/reset-password/confirm', { token, newPassword });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  },

  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  },
};
