# Item Swap Go - Versão Demo

🚀 **Versão automática com login instantâneo e dados de exemplo**

## 🌟 Características da Versão Demo

- ✅ **Login automático** - Sem necessidade de credenciais
- ✅ **Dados mock** - 36+ itens de exemplo
- ✅ **Funcionalidade completa** - Navegação, busca, filtros
- ✅ **Sem backend** - Funciona 100% no frontend
- ✅ **GitHub Pages ready** - Pronto para deploy estático

## 🚀 Como Usar

### Opção 1: Acesso Direto (GitHub Pages)

1. Acesse: `https://seu-usuario.github.io/item-swap-go`
2. O sistema fará login automaticamente
3. Navegue livremente pela aplicação

### Opção 2: Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/item-swap-go.git
cd item-swap-go

# Execute a versão demo
.\build-demo.bat

# Ou manualmente:
cd frontend
npm install
npm run build-demo
npm run preview-demo
```

## 🔧 Configuração para GitHub Pages

### 1. Preparar o Build

```bash
# Execute o script de build
.\build-demo.bat
```

### 2. Deploy no GitHub

1. Copie todo o conteúdo da pasta `frontend/dist/`
2. Cole na branch `gh-pages` do seu repositório
3. Ou use GitHub Actions (veja arquivo `.github/workflows/deploy.yml`)

### 3. Configurar GitHub Pages

1. Vá em Settings > Pages
2. Selecione source: "Deploy from a branch"
3. Branch: `gh-pages` / `/ (root)`
4. Salve e aguarde o deploy

## 📱 Funcionalidades Disponíveis

### ✅ Funcionando no Modo Demo

- Login automático com usuário demo
- Visualização de 36+ itens de exemplo
- Busca e filtros por categoria, preço, localização
- Navegação entre páginas
- Visualização de detalhes dos itens
- Interface responsiva (mobile/desktop)
- Modo escuro/claro
- Mapa com localização (Google Maps)

### ❌ Limitações do Modo Demo

- Não é possível criar novos itens
- Não é possível fazer upload de imagens
- Não há persistência real de dados
- Chat/mensagens são simulados
- Não há notificações push

## 🛠️ Desenvolvimento

### Estrutura de Arquivos Demo

```
frontend/
├── .env.demo              # Configurações demo
├── vite.config.demo.ts    # Build config para demo
├── src/
│   ├── services/
│   │   ├── auth.ts        # Auto-login implementado
│   │   ├── items.ts       # Dados mock
│   │   └── categories.ts  # Categorias mock
│   └── store/
│       └── authStore.ts   # Store com auto-login
```

### Variáveis de Ambiente Demo

```env
VITE_USE_MOCK=true
VITE_AUTO_LOGIN=true
VITE_DEMO_MODE=true
VITE_APP_NAME=Item Swap Go - Demo
```

### Scripts Disponíveis

```bash
npm run build-demo      # Build para demo/GitHub Pages
npm run preview-demo    # Preview local da versão demo
npm run dev            # Desenvolvimento normal
```

## 🔄 Atualizando a Demo

1. Faça suas alterações no código
2. Execute `.\build-demo.bat`
3. Faça commit dos arquivos em `frontend/dist/`
4. Push para a branch `gh-pages`

## 🐛 Troubleshooting

### Problema: Página em branco no GitHub Pages

- Verifique se o `base: './'` está configurado no `vite.config.demo.ts`
- Confirme que todos os arquivos estão na branch `gh-pages`

### Problema: Auto-login não funciona

- Verifique se `VITE_AUTO_LOGIN=true` no `.env.demo`
- Limpe o localStorage: `localStorage.clear()`

### Problema: Imagens não carregam

- Use URLs absolutas para imagens
- Verifique se as imagens estão na pasta `public/`

## 📞 Suporte

Para dúvidas sobre a versão demo:

1. Verifique os logs no console do navegador (F12)
2. Teste primeiro localmente com `npm run preview-demo`
3. Abra uma issue no GitHub com detalhes do problema

---

**🎯 Objetivo**: Demonstrar as funcionalidades do Item Swap Go de forma rápida e acessível, sem necessidade de configuração de backend ou banco de dados.
