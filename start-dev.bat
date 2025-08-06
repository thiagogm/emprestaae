@echo off
REM Script para iniciar o ambiente de desenvolvimento completo no Windows
REM Tudo automático - apenas execute este script!

echo 🚀 Iniciando ambiente de desenvolvimento do Empresta aê...
echo.

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker está rodando

REM Parar containers existentes se houver
echo 🛑 Parando containers existentes...
docker-compose -f docker-compose.dev.yml down

REM Construir e iniciar todos os serviços
echo 🔨 Construindo e iniciando serviços...
docker-compose -f docker-compose.dev.yml up --build -d

REM Aguardar os serviços ficarem prontos
echo ⏳ Aguardando serviços ficarem prontos...
timeout /t 30 /nobreak >nul

REM Verificar status dos serviços
echo 📊 Status dos serviços:
docker-compose -f docker-compose.dev.yml ps

REM Executar migrações e seed do banco
echo 🗄️ Configurando banco de dados...
docker-compose -f docker-compose.dev.yml exec backend npm run migrate
docker-compose -f docker-compose.dev.yml exec backend npm run seed

echo.
echo 🎉 Ambiente de desenvolvimento pronto!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:3001/api
echo 📊 Health Check: http://localhost:3001/api/health
echo.
echo 🔍 Para ver os logs:
echo    docker-compose -f docker-compose.dev.yml logs -f
echo.
echo 🛑 Para parar tudo:
echo    docker-compose -f docker-compose.dev.yml down
echo.
echo ✨ Tudo está funcionando automaticamente!
echo.
pause