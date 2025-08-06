import { ApiResponse } from './api/ApiService';

// Dados mockados
const mockUsers = [
  {
    id: '1',
    email: 'usuario@exemplo.com',
    name: 'Usuário Teste',
    first_name: 'Usuário',
    last_name: 'Teste',
    phone: '(11) 99999-9999',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockItems = [
  {
    id: '1',
    title: 'Furadeira Elétrica',
    description: 'Furadeira elétrica em ótimo estado, ideal para trabalhos domésticos',
    category: 'Ferramentas',
    condition: 'Bom',
    images: ['/api/placeholder/400/300'],
    ownerId: '1',
    owner: mockUsers[0],
    isAvailable: true,
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Livro de Programação',
    description: 'Clean Code - Robert C. Martin, livro em excelente estado',
    category: 'Livros',
    condition: 'Excelente',
    images: ['/api/placeholder/300/400'],
    ownerId: '1',
    owner: mockUsers[0],
    isAvailable: true,
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockChats = [
  {
    id: '1',
    itemId: '1',
    item: mockItems[0],
    participants: [mockUsers[0]],
    messages: [
      {
        id: '1',
        senderId: '1',
        content: 'Olá! Gostaria de emprestar sua furadeira.',
        timestamp: new Date().toISOString(),
        isRead: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simula delay de rede
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiService {
  private isLoggedIn = false;
  private currentUser = mockUsers[0];

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    await delay();

    if (email && password) {
      this.isLoggedIn = true;
      localStorage.setItem('accessToken', 'mock-access-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      return {
        success: true,
        data: {
          user: this.currentUser,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      };
    }

    return {
      success: false,
      message: 'Credenciais inválidas',
    };
  }

  async register(userData: any): Promise<ApiResponse> {
    await delay();

    const newUser = {
      ...userData,
      id: String(mockUsers.length + 1),
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;
    this.isLoggedIn = true;

    localStorage.setItem('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    return {
      success: true,
      data: {
        user: newUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  }

  async refreshToken(): Promise<ApiResponse> {
    await delay(200);

    return {
      success: true,
      data: {
        accessToken: 'mock-access-token-refreshed',
        refreshToken: 'mock-refresh-token-refreshed',
      },
    };
  }

  async logout(): Promise<ApiResponse> {
    await delay(200);

    this.isLoggedIn = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return {
      success: true,
      data: null,
    };
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    return {
      success: true,
      data: this.currentUser,
    };
  }

  async updateProfile(userData: any): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    this.currentUser = { ...this.currentUser, ...userData, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: this.currentUser,
    };
  }

  // Items endpoints
  async getItems(params?: any): Promise<ApiResponse> {
    await delay();

    let filteredItems = [...mockItems];

    if (params?.search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(params.search.toLowerCase()) ||
          item.description.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params?.category) {
      filteredItems = filteredItems.filter((item) => item.category === params.category);
    }

    return {
      success: true,
      data: filteredItems,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredItems.length,
        totalPages: 1,
      },
    };
  }

  async getItem(id: string): Promise<ApiResponse> {
    await delay();

    const item = mockItems.find((item) => item.id === id);

    if (!item) {
      return { success: false, message: 'Item não encontrado' };
    }

    return {
      success: true,
      data: item,
    };
  }

  async createItem(itemData: any): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    const newItem = {
      ...itemData,
      id: String(mockItems.length + 1),
      ownerId: this.currentUser.id,
      owner: this.currentUser,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockItems.push(newItem);

    return {
      success: true,
      data: newItem,
    };
  }

  async updateItem(id: string, itemData: any): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    const itemIndex = mockItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return { success: false, message: 'Item não encontrado' };
    }

    mockItems[itemIndex] = {
      ...mockItems[itemIndex],
      ...itemData,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockItems[itemIndex],
    };
  }

  async deleteItem(id: string): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    const itemIndex = mockItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return { success: false, message: 'Item não encontrado' };
    }

    mockItems.splice(itemIndex, 1);

    return {
      success: true,
      data: null,
    };
  }

  // Chat endpoints
  async getChats(): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    return {
      success: true,
      data: mockChats,
    };
  }

  async getChat(id: string): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    const chat = mockChats.find((chat) => chat.id === id);

    if (!chat) {
      return { success: false, message: 'Chat não encontrado' };
    }

    return {
      success: true,
      data: chat,
    };
  }

  async sendMessage(chatId: string, content: string): Promise<ApiResponse> {
    await delay();

    if (!this.isLoggedIn) {
      return { success: false, message: 'Não autenticado' };
    }

    const chat = mockChats.find((chat) => chat.id === chatId);

    if (!chat) {
      return { success: false, message: 'Chat não encontrado' };
    }

    const newMessage = {
      id: String(chat.messages.length + 1),
      senderId: this.currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    chat.messages.push(newMessage);
    chat.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: newMessage,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    await delay(100);
    return true;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('accessToken');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Auto login para desenvolvimento
  async autoLogin(): Promise<void> {
    this.isLoggedIn = true;
    localStorage.setItem('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  }
}

export const mockApiService = new MockApiService();
