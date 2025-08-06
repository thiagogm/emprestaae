import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    changePassword,
    updateProfile,
    updateLocation,
    uploadAvatar,
    setLoading,
    setError,
    clearError,
    reset,
  } = useAuthStore();

  console.log('🔍 useAuth - Estado atual:', {
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    isAuthenticated,
    isLoading,
    error,
  });

  // Mock data for missing properties
  const isVerified = user ? true : false;

  // Wrap login with debug logs
  const debugLogin = async (credentials: any) => {
    console.log('🔐 useAuth - Iniciando login com:', credentials);
    try {
      const result = await login(credentials);
      console.log('✅ useAuth - Login resultado:', result);
      return result;
    } catch (error) {
      console.error('❌ useAuth - Erro no login:', error);
      throw error;
    }
  };

  // Wrap register with debug logs
  const debugRegister = async (data: any) => {
    console.log('📝 useAuth - Iniciando registro com:', data);
    try {
      const result = await register(data);
      console.log('✅ useAuth - Registro resultado:', result);
      return result;
    } catch (error) {
      console.error('❌ useAuth - Erro no registro:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isVerified,
    login: debugLogin,
    register: debugRegister,
    logout,
    refreshUser,
    changePassword,
    updateProfile,
    updateLocation,
    uploadAvatar,
    setLoading,
    setError,
    clearError,
    reset,
  };
};
