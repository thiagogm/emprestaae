@echo off
REM Versão mais simples - apenas frontend com dados mock
echo 🚀 Iniciando versão de testes simples (apenas frontend)...
echo.

cd frontend

echo 📦 Instalando dependências...
call npm install

echo 🔨 Iniciando servidor de desenvolvimento...
echo.
echo 📱 Abrindo em: http://localhost:5173
echo ✨ Sistema funcionando com dados de exemplo!
echo.
echo Para parar: Ctrl+C
echo.

call npm run dev