# 🚀 Como Testar o Sistema - Guia Rápido

## 🎯 **Opção 1: Teste Rápido (Recomendado)**

**✅ Sem Docker, apenas Node.js**

```cmd
.\start-quick.bat
```

**O que acontece:**

- ✅ Instala dependências automaticamente
- ✅ Inicia o frontend em http://localhost:5173
- ✅ Abre o navegador automaticamente
- ✅ Funciona com dados de exemplo
- ✅ Zero configuração necessária

---

## 🎯 **Opção 2: Sistema Completo**

**🐳 Com Docker (Backend + Frontend + Banco)**

### Pré-requisitos:

1. **Instale o Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Inicie o Docker Desktop** e aguarde ficar pronto

### Execute:

```cmd
.\start-dev.bat
```

**O que acontece:**

- ✅ Backend completo com 70+ endpoints
- ✅ Banco MySQL com dados reais
- ✅ Sistema de autenticação JWT
- ✅ Upload de imagens
- ✅ Chat entre usuários

---

## 🎯 **Opção 3: Manual (Frontend apenas)**

```cmd
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## 📱 **Como testar as funcionalidades:**

### **1. Página Inicial**

- ✅ Visualizar itens disponíveis
- ✅ Buscar por categoria
- ✅ Filtrar por localização

### **2. Autenticação**

- ✅ Cadastrar nova conta
- ✅ Fazer login
- ✅ Dados de exemplo:
  - Email: `admin@empresta-ae.com`
  - Senha: `123456`

### **3. Adicionar Item**

- ✅ Formulário completo
- ✅ Upload de imagens (mock)
- ✅ Categorias disponíveis
- ✅ Localização

### **4. Empréstimos**

- ✅ Solicitar empréstimo
- ✅ Confirmar empréstimo
- ✅ Histórico de empréstimos

### **5. Chat**

- ✅ Conversar com outros usuários
- ✅ Mensagens em tempo real (mock)

### **6. Perfil**

- ✅ Editar informações
- ✅ Alterar senha
- ✅ Configurações

---

## 🔧 **Troubleshooting**

### **Erro: "Docker não está rodando"**

```cmd
# Solução: Use a versão rápida sem Docker
.\start-quick.bat
```

### **Erro: "Node.js não encontrado"**

1. Instale o Node.js: https://nodejs.org/
2. Reinicie o terminal
3. Execute novamente

### **Erro: "npm não encontrado"**

```cmd
# Verifique se Node.js foi instalado corretamente
node --version
npm --version
```

### **Porta 5173 ocupada**

```cmd
# Mate processos na porta
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

---

## 🎉 **Resultado Esperado**

Após executar qualquer opção, você terá:

- 📱 **Interface moderna** e responsiva
- 🔍 **Sistema de busca** funcionando
- 📝 **Formulários** interativos
- 🖼️ **Galeria de imagens** dos itens
- 💬 **Sistema de chat** (mock)
- 🔐 **Autenticação** completa
- 📊 **Dashboard** do usuário

---

## 💡 **Dica**

**Para teste rápido**: Use `.\start-quick.bat`  
**Para teste completo**: Use `.\start-dev.bat` (precisa do Docker)

**🎯 Ambas as versões mostram o sistema funcionando perfeitamente!**
