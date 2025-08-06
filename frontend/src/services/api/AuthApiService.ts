import { apiService } from './ApiService';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  full_name: string;
  items_count: number;
  reviews_count: number;
  average_rating: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export class AuthApiService {
  // Register new user
  async register(data: RegisterData): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/register', data);

    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    }

    throw new Error('Registration failed');
  }

  // Login user
  async login(data: LoginData): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/login', data);

    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    }

    throw new Error('Login failed');
  }

  // Logout user
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        await apiService.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API call failed:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Logout from all devices
  async logoutAll(): Promise<void> {
    try {
      await apiService.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all API call failed:', error);
    }

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get current user profile
  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiService.get<UserProfile>('/auth/me');

    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error('Failed to get current user');
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await apiService.post('/auth/change-password', data);

    if (!response.success) {
      throw new Error('Failed to change password');
    }
  }

  // Check if email is available
  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await apiService.get<{ available: boolean }>('/auth/check-email', {
      params: { email },
    });

    if (response.success && response.data) {
      return response.data.available;
    }

    return false;
  }

  // Refresh access token
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (response.success && response.data) {
      // Update stored tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    }

    throw new Error('Token refresh failed');
  }

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
