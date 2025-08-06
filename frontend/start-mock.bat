@echo off
echo 🎭 Iniciando frontend em modo mock...
echo.
echo ✅ Dados simulados serão utilizados
echo ✅ Login automático ativado
echo ✅ Sem necessidade de backend
echo.
set VITE_USE_MOCK=true
set VITE_AUTO_LOGIN=true
npm run dev