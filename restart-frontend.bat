@echo off
chcp 65001 >nul
echo 🔄 Reiniciando frontend com configurações atualizadas...
echo.
echo ⚠️  Por favor, pare o servidor atual (Ctrl+C) se estiver rodando
echo.
echo 📁 Entrando na pasta frontend...
cd frontend

echo 🔧 Verificando variáveis de ambiente...
echo VITE_USE_MOCK=true
echo VITE_API_URL=http://localhost:3001/api
echo.

echo 🚀 Iniciando servidor de desenvolvimento...
echo 📱 Sistema será aberto em: http://localhost:5173
echo ✨ Funcionando com dados de exemplo (mock)!
echo 💡 Para parar: Ctrl+C
echo.

call npm run dev