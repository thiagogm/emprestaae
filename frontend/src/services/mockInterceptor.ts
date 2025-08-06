import { mockApiService } from './mockApi';

// Intercepta todas as requisições fetch e retorna dados mockados
export function setupMockInterceptor() {
  // Salva o fetch original
  const originalFetch = window.fetch;

  // Substitui o fetch global
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';

    console.log(`[MOCK] Intercepting ${method} ${url}`);

    // Verifica se é uma requisição para a API
    if (
      url.includes('/api/') ||
      url.includes('/auth/') ||
      url.includes('/users/') ||
      url.includes('/items/') ||
      url.includes('/chats/')
    ) {
      try {
        let mockResponse;
        const body = init?.body ? JSON.parse(init.body as string) : null;

        // Auth endpoints
        if (url.includes('/auth/login') && method === 'POST') {
          mockResponse = await mockApiService.login(body.email, body.password);
        } else if (url.includes('/auth/register') && method === 'POST') {
          mockResponse = await mockApiService.register(body);
        } else if (url.includes('/auth/refresh') && method === 'POST') {
          mockResponse = await mockApiService.refreshToken();
        } else if (url.includes('/auth/logout') && method === 'POST') {
          mockResponse = await mockApiService.logout();
        }

        // User endpoints
        else if (url.includes('/users/profile') && method === 'GET') {
          mockResponse = await mockApiService.getProfile();
        } else if (url.includes('/users/profile') && method === 'PUT') {
          mockResponse = await mockApiService.updateProfile(body);
        }

        // Items endpoints
        else if (url.includes('/items') && method === 'GET') {
          const urlObj = new URL(url, window.location.origin);
          const params = Object.fromEntries(urlObj.searchParams);
          mockResponse = await mockApiService.getItems(params);
        } else if (url.includes('/items/') && method === 'GET') {
          const id = url.split('/items/')[1].split('?')[0];
          mockResponse = await mockApiService.getItem(id);
        } else if (url.includes('/items') && method === 'POST') {
          mockResponse = await mockApiService.createItem(body);
        } else if (url.includes('/items/') && method === 'PUT') {
          const id = url.split('/items/')[1].split('?')[0];
          mockResponse = await mockApiService.updateItem(id, body);
        } else if (url.includes('/items/') && method === 'DELETE') {
          const id = url.split('/items/')[1].split('?')[0];
          mockResponse = await mockApiService.deleteItem(id);
        }

        // Chat endpoints
        else if (url.includes('/chats') && method === 'GET') {
          mockResponse = await mockApiService.getChats();
        } else if (url.includes('/chats/') && method === 'GET') {
          const id = url.split('/chats/')[1].split('?')[0];
          mockResponse = await mockApiService.getChat(id);
        } else if (url.includes('/chats/') && url.includes('/messages') && method === 'POST') {
          const chatId = url.split('/chats/')[1].split('/messages')[0];
          mockResponse = await mockApiService.sendMessage(chatId, body.content);
        }

        // Health check
        else if (url.includes('/health')) {
          const isHealthy = await mockApiService.healthCheck();
          mockResponse = { success: true, data: { status: isHealthy ? 'ok' : 'error' } };
        }

        // Default response para endpoints não mapeados
        else {
          mockResponse = { success: false, message: 'Endpoint não implementado no mock' };
        }

        // Cria uma Response mockada
        const response = new Response(JSON.stringify(mockResponse), {
          status: mockResponse.success ? 200 : 400,
          statusText: mockResponse.success ? 'OK' : 'Bad Request',
          headers: {
            'Content-Type': 'application/json',
            'x-mock-response': 'true',
          },
        });

        console.log(`[MOCK] Response for ${method} ${url}:`, mockResponse);
        return response;
      } catch (error) {
        console.error(`[MOCK] Error handling ${method} ${url}:`, error);

        const errorResponse = {
          success: false,
          message: 'Erro interno do servidor mock',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    // Para outras requisições, usa o fetch original
    return originalFetch(input, init);
  };

  console.log('[MOCK] Mock interceptor configurado com sucesso!');
}

// Função para restaurar o fetch original (útil para testes)
export function restoreFetch() {
  // Esta implementação assume que você salvou o fetch original em algum lugar
  // Por simplicidade, vamos apenas recarregar a página
  window.location.reload();
}
