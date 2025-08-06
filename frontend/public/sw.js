const CACHE_NAME = 'item-swap-cache-v2';
const API_CACHE_NAME = 'item-swap-api-cache-v2';

// Lista de arquivos do "App Shell" que devem ser cacheados.
// Esta lista precisa ser ajustada com os nomes dos arquivos gerados pelo seu processo de build (Vite, etc.).
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  // Adicione aqui os caminhos para os principais arquivos JS e CSS gerados pelo build.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando o App Shell');
      // O addAll é atômico. Se um arquivo falhar, a instalação inteira falha.
      return cache.addAll(APP_SHELL_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Deleta caches antigos para manter o ambiente limpo.
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições que não são GET, pois não podem ser cacheadas.
  if (request.method !== 'GET') {
    return;
  }

  // Estratégia para a API: Network First, com fallback para o Cache.
  // Ideal para dados que mudam com frequência, como a lista de itens.
  // Inclui tanto /api/ quanto rotas de auth que são proxied pelo Vite
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/auth/') ||
      url.pathname.startsWith('/users/') ||
      url.pathname.startsWith('/items/') ||
      url.pathname.startsWith('/chats/') ||
      url.pathname.startsWith('/health'))
  ) {
    // Em modo de desenvolvimento com mock, deixa o fetch passar direto
    // para ser interceptado pelo mockInterceptor
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Se a resposta da rede for bem-sucedida, clona e armazena no cache da API.
          // Mas só cacheia se não for uma resposta mockada
          if (networkResponse.ok && !networkResponse.headers.get('x-mock-response')) {
            const responseToCache = networkResponse.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se a rede falhar, tenta buscar do cache da API.
          return caches.match(request, { cacheName: API_CACHE_NAME });
        })
    );
    return;
  }

  // Estratégia para o App Shell e outros assets: Cache First.
  // Ideal para arquivos que não mudam com frequência.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request);
    })
  );
});
