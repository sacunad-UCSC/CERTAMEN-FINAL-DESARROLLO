@echo off
title PcNactory - Servidor Hosting FastAPI
color 0B
echo ======================================================================
echo           PCNACTORY - SERVIDOR DE HOSTING FASTAPI (PYTHON)
echo ======================================================================
echo.
echo   [1] Verificando MongoDB...
echo   [2] Iniciando servidor en el puerto 8000...
echo.
echo   - Web Local:      http://localhost:8000
echo   - Documentacion:  http://localhost:8000/docs
echo.
echo   (Para detener el servidor presiona Ctrl + C)
echo ======================================================================
echo.

cd /d "%~dp0\hosting_fastapi"
python run_server.py

pause
