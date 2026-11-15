@echo off
title PcÑactory - Hosting FastAPI Server
echo ========================================================
echo   Iniciando Hosting de PcÑactory en FastAPI (Python)
echo   Plataforma Web: http://localhost:8000
echo   Swagger Docs:   http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0\hosting_fastapi"
python run_server.py
pause
