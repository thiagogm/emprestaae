#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento completo
# Tudo automático - apenas execute este script!

echo "🚀 Iniciando ambiente de desenvolvimento do Empresta aê..."
echo ""

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

echo "✅ Docker está rodando"

# Parar containers existentes se houver
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir e iniciar todos os serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose -f docker-compose.dev.yml up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose -f docker-compose.dev.yml ps

# Executar migrações e seed do banco
echo "🗄️ Configurando banco de dados..."
docker-compose -f docker-compose.dev.yml exec backend npm run migrate
docker-compose -f docker-compose.dev.yml exec backend npm run seed

echo ""
echo "🎉 Ambiente de desenvolvimento pronto!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001/api"
echo "📊 Health Check: http://localhost:3001/api/health"
echo ""
echo "🔍 Para ver os logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 Para parar tudo:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
echo "✨ Tudo está funcionando automaticamente!"