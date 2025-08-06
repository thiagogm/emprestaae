@echo off
chcp 65001 >nul
REM Versão rápida - apenas frontend funcionando
echo 🚀 Iniciando versão de testes rápida (sem Docker)...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

REM Ir para a pasta do frontend
cd frontend

echo 📦 Instalando dependências (pode demorar na primeira vez)...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo ✅ Dependências instaladas

echo 🔨 Iniciando servidor de desenvolvimento...
echo.
echo 📱 Sistema será aberto em: http://localhost:5173
echo ✨ Funcionando com dados de exemplo (mock)!
echo 💡 Para parar: Ctrl+C
echo.

REM Aguardar um pouco e abrir o navegador
start "" "http://localhost:5173"

REM Iniciar o servidor
call npm run dev