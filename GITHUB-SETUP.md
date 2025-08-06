# 🚀 Setup GitHub Pages - Item Swap Go Demo

## Passo a Passo Completo

### 1. 📤 Preparar o Repositório

```bash
# 1. Criar repositório no GitHub
# 2. Clonar localmente
git clone https://github.com/SEU-USUARIO/item-swap-go.git
cd item-swap-go

# 3. Adicionar todos os arquivos
git add .
git commit -m "Initial commit - Item Swap Go with demo mode"
git push origin main
```

### 2. 🔧 Configurar GitHub Pages

1. **Acesse seu repositório no GitHub**
2. **Vá em Settings > Pages**
3. **Configure:**
   - Source: "GitHub Actions"
   - Deixe o workflow fazer o deploy automaticamente

### 3. 🚀 Deploy Automático

O deploy acontece automaticamente quando você:

- Faz push para `main` ou `master`
- Ou executa manualmente em Actions > "Deploy Demo to GitHub Pages" > "Run workflow"

### 4. 📱 Acessar a Demo

Após o deploy (2-5 minutos):

- **URL**: `https://SEU-USUARIO.github.io/item-swap-go`
- **Login**: Automático (sem credenciais necessárias)
- **Dados**: 36+ itens de exemplo carregados

## 🔄 Atualizações

Para atualizar a demo:

```bash
# 1. Fazer alterações no código
# 2. Commit e push
git add .
git commit -m "Update demo"
git push origin main

# 3. GitHub Actions fará o deploy automaticamente
```

## 🛠️ Deploy Manual (Alternativo)

Se preferir deploy manual:

```bash
# 1. Build local
.\build-demo.bat

# 2. Criar branch gh-pages
git checkout --orphan gh-pages
git rm -rf .
cp -r frontend/dist/* .
git add .
git commit -m "Deploy demo"
git push origin gh-pages

# 3. Configurar Pages para usar branch gh-pages
```

## ✅ Verificar se Funcionou

1. **Acesse a URL do GitHub Pages**
2. **Verifique se:**
   - ✅ Página carrega sem erros
   - ✅ Login acontece automaticamente
   - ✅ Itens são exibidos
   - ✅ Navegação funciona
   - ✅ Busca e filtros respondem

## 🐛 Problemas Comuns

### Página em Branco

```bash
# Verificar se o build foi bem-sucedido
cd frontend
npm run build-demo
npm run preview-demo
# Se funcionar local, problema é no GitHub Pages
```

### Auto-login Não Funciona

- Verificar console do navegador (F12)
- Confirmar variáveis de ambiente no build
- Limpar cache do navegador

### Imagens Não Carregam

- Usar URLs absolutas ou relativas corretas
- Verificar se imagens estão em `frontend/public/`

## 📊 Monitoramento

- **Actions**: Acompanhe builds em GitHub > Actions
- **Pages**: Status em Settings > Pages
- **Logs**: Console do navegador para debug

## 🎯 URLs de Exemplo

Substitua `SEU-USUARIO` pelo seu username do GitHub:

- **Demo**: `https://SEU-USUARIO.github.io/item-swap-go`
- **Repositório**: `https://github.com/SEU-USUARIO/item-swap-go`
- **Actions**: `https://github.com/SEU-USUARIO/item-swap-go/actions`

---

**🎉 Pronto!** Sua demo estará disponível publicamente com login automático e dados de exemplo.
