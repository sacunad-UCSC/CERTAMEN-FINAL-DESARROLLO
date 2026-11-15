@echo off
title PcNactory - Tunel Publico Cloudflare
color 0A
echo ======================================================================
echo           PCNACTORY - TUNEL PUBLICO HTTPS (ACCESO MUNDIAL)
echo ======================================================================
echo.
echo   Conectando http://localhost:8000 a la red mundial de Cloudflare...
echo   El link publico HTTPS aparecera abajo en unos segundos.
echo.
echo   (Copia el link que termine en .trycloudflare.com para entrar desde tu celular)
echo ======================================================================
echo.

cd /d "%~dp0"
if exist cloudflared.exe (
    cloudflared.exe tunnel --url http://localhost:8000
) else (
    echo [ERROR] No se encontro cloudflared.exe en esta carpeta.
    pause
)
