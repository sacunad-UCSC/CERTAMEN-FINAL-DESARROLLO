@echo off
title PcNactory - Lanzador Maestro
color 0E
echo ======================================================================
echo           PCNACTORY - LANZADOR AUTOMATICO DE TODO EL SISTEMA
echo ======================================================================
echo.
echo   1. Levantando Servidor FastAPI en http://localhost:8000
echo   2. Abriendo Tunel Publico Cloudflare para acceso desde celulares
echo.
echo ======================================================================

start "PcÑactory - Hosting FastAPI" cmd.exe /k "cd /d %~dp0\hosting_fastapi && python run_server.py"

timeout /t 3 /nobreak >nul

start "PcÑactory - Tunel Cloudflare" cmd.exe /k "cd /d %~dp0 && cloudflared.exe tunnel --url http://localhost:8000"

echo.
echo   [OK] Ambas ventanas fueron iniciadas.
echo   En la ventana de Cloudflare veras el enlace HTTPS publico generado.
echo.
pause
