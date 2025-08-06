# 🎭 Modo Demo - Item Swap

Este documento explica como usar o sistema em modo demonstração, que funciona
completamente offline com dados simulados.

## 🚀 Como Iniciar

### Opção 1: Script Automático (Recomendado)

```bash
# No diretório frontend
./start-mock.bat
```

### Opção 2: Manual

```bash
# No diretório frontend
npm run dev
```

## 🎯 Funcionalidades do Demo

### ✅ O que funciona:

- ✅ Login automático (sem necessidade de credenciais reais)
- ✅ Navegação completa pela aplicação
- ✅ Visualização de itens simulados
- ✅ Sistema de chat mockado
- ✅ Perfil de usuário
- ✅ Adição de novos itens
- ✅ Busca e filtros
- ✅ Interface responsiva
- ✅ Service Worker (PWA)

### 🔧 Configurações Ativas:

- `VITE_USE_MOCK=true` - Ativa o sistema de mock
- `VITE_AUTO_LOGIN=true` - Login automático
- `VITE_DEMO_MODE=true` - Modo demonstração

## 🎮 Como Usar

### 1. Acesso Inicial

- Abra o navegador em `http://localhost:5173`
- Você verá uma barra amarela indicando "MODO DEMONSTRAÇÃO"
- Na tela de login, clique em "🎭 Entrar como Demo"

### 2. Credenciais Demo (opcional)

Se preferir fazer login manual:

- **Email:** `demo@test.com`
- **Senha:** `demo123`

### 3. Dados Simulados

O sistema inclui:

- **Usuário Demo:** Usuário pré-configurado
- **Itens Mock:** Lista de itens para empréstimo
- **Chats Simulados:** Conversas de exemplo
- **Localização:** São Paulo, SP (simulada)

## 🛠️ Arquitetura do Mock

### Interceptador de Requisições

```typescript
// Intercepta todas as chamadas fetch()
window.fetch = async (input, init) => {
  // Verifica se é uma requisição da API
  if (url.includes('/api/')) {
    // Retorna dados mockados
    return mockResponse;
  }
  // Passa requisições normais adiante
  return originalFetch(input, init);
};
```

### Endpoints Mockados

- `POST /auth/login` - Login com qualquer credencial
- `POST /auth/register` - Registro simulado
- `GET /users/profile` - Perfil do usuário demo
- `GET /items` - Lista de itens simulados
- `POST /items` - Criação de novos itens
- `GET /chats` - Conversas simuladas

## 🎨 Indicadores Visuais

### Barra de Status

- **Amarela:** Modo demonstração ativo
- **Verde:** Operação bem-sucedida
- **Vermelha:** Erro (raro em modo demo)

### Console do Navegador

```
🎭 Modo mock ativado - dados simulados serão utilizados
[MOCK] Intercepting GET /api/items
[MOCK] Response for GET /api/items: {success: true, data: [...]}
```

## 🔍 Troubleshooting

### Problema: Tela de login não carrega

**Solução:** Verifique se as variáveis de ambiente estão corretas:

```bash
# Verifique o arquivo .env.development
VITE_USE_MOCK=true
VITE_AUTO_LOGIN=true
VITE_DEMO_MODE=true
```

### Problema: Erro "setupMockInterceptor is not defined"

**Solução:** Verifique se os imports estão corretos no `main.tsx`

### Problema: Service Worker causando erros

**Solução:** Limpe o cache do navegador ou desative o Service Worker
temporariamente

## 📱 Teste em Dispositivos

### Desktop

- Chrome, Firefox, Safari, Edge
- Resolução mínima: 1024x768

### Mobile

- iOS Safari, Chrome Mobile, Firefox Mobile
- Teste responsivo no DevTools

### PWA

- Instale como aplicativo
- Funciona offline
- Notificações simuladas

## 🎯 Cenários de Demonstração

### 1. Usuário Novo

1. Acesse a aplicação
2. Clique em "Entrar como Demo"
3. Explore a interface
4. Adicione um item
5. Inicie uma conversa

### 2. Busca e Filtros

1. Use a barra de busca
2. Teste filtros por categoria
3. Visualize detalhes dos itens

### 3. Chat Simulado

1. Clique em um item
2. Inicie conversa
3. Envie mensagens
4. Veja respostas automáticas

## 🚀 Deploy do Demo

### Vercel/Netlify

```bash
# Build para produção com mock
VITE_USE_MOCK=true npm run build
```

### Docker

```dockerfile
ENV VITE_USE_MOCK=true
ENV VITE_DEMO_MODE=true
ENV VITE_AUTO_LOGIN=true
```

## 📊 Métricas do Demo

- **Tempo de carregamento:** < 2s
- **Tamanho do bundle:** ~500KB
- **Itens simulados:** 36
- **Usuários mock:** 5
- **Chats simulados:** 10

## 🎉 Próximos Passos

Após testar o demo:

1. Configure o backend real
2. Conecte ao banco de dados
3. Desative o modo mock
4. Configure autenticação real
5. Implemente notificações push

---

**💡 Dica:** Use este modo para demonstrações, testes de interface e
desenvolvimento frontend sem dependências de backend!
