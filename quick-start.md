# 🚀 Quick Start - Ambiente de Desenvolvimento

## Para testar o sistema completo automaticamente:

### Windows:

```bash
# Apenas execute este comando:
start-dev.bat
```

### Linux/Mac:

```bash
# Torne o script executável e execute:
chmod +x start-dev.sh
./start-dev.sh
```

### Ou manualmente com Docker:

```bash
# Inicie todos os serviços
docker-compose -f docker-compose.dev.yml up --build -d

# Configure o banco (após 30 segundos)
docker-compose -f docker-compose.dev.yml exec backend npm run migrate
docker-compose -f docker-compose.dev.yml exec backend npm run seed
```

## 🌐 Acessos:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **MySQL**: localhost:3306 (user: user, password: password)
- **Redis**: localhost:6379

## 📱 Como testar:

1. **Abra o navegador** em http://localhost:5173
2. **Cadastre-se** ou faça login
3. **Explore os itens** disponíveis
4. **Adicione novos itens**
5. **Teste o sistema de empréstimos**

## 🛠️ Comandos úteis:

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Parar tudo
docker-compose -f docker-compose.dev.yml down

# Reiniciar apenas um serviço
docker-compose -f docker-compose.dev.yml restart backend

# Acessar o container do backend
docker-compose -f docker-compose.dev.yml exec backend bash

# Executar testes
docker-compose -f docker-compose.dev.yml exec backend npm test
```

## 🎯 O que está incluído:

✅ **Backend completo** com 70+ endpoints  
✅ **Frontend React** com todas as funcionalidades  
✅ **Banco MySQL** com dados de exemplo  
✅ **Redis** para cache  
✅ **Sistema de autenticação** JWT  
✅ **Upload de imagens**  
✅ **Sistema de empréstimos**  
✅ **Chat entre usuários**  
✅ **Avaliações e reviews**

## 🔧 Troubleshooting:

**Erro de porta ocupada?**

```bash
# Pare outros serviços que possam estar usando as portas
docker-compose -f docker-compose.dev.yml down
```

**Banco não conecta?**

```bash
# Aguarde mais tempo para o MySQL inicializar
sleep 60
docker-compose -f docker-compose.dev.yml exec backend npm run migrate
```

**Frontend não carrega?**

```bash
# Verifique se o Vite está rodando
docker-compose -f docker-compose.dev.yml logs frontend
```

## 🎉 Pronto!

Agora você tem o sistema completo rodando localmente com todos os dados de exemplo e funcionalidades ativas!
