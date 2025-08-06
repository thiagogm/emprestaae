@echo off
chcp 65001 >nul
echo 🚀 Construindo versão demo para GitHub Pages...
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

echo 📦 Instalando dependências...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo ✅ Dependências instaladas

echo 🔧 Copiando configuração demo...
copy .env.demo .env.production

echo 🏗️ Construindo versão de produção (demo)...
call npm run build-demo

if %errorlevel% neq 0 (
    echo ❌ Erro ao construir projeto
    pause
    exit /b 1
)

echo ✅ Build concluído!
echo.
echo 📁 Arquivos gerados em: frontend/dist/
echo 🌐 Para testar localmente: npm run preview
echo 📤 Para deploy no GitHub Pages: copie o conteúdo de frontend/dist/ para o repositório
echo.
pause