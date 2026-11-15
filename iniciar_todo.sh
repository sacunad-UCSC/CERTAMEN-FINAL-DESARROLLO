#!/usr/bin/env bash
# Script para iniciar el entorno completo de PcÑactory en Linux

PROJECT_DIR="/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux"

echo "============================================================"
echo "          PCÑACTORY - HOSTING & TUNEL CLOUDFLARE"
echo "============================================================"

# 1. Asegurar MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "[+] Iniciando MongoDB NoSQL..."
    mongod --dbpath "$PROJECT_DIR/data/db" --logpath "$PROJECT_DIR/data/mongod.log" --fork
else
    echo "[✓] MongoDB ya está corriendo."
fi

# 2. Iniciar Servidor FastAPI
echo "[+] Iniciando servidor FastAPI en http://localhost:8000..."
cd "$PROJECT_DIR/hosting_fastapi"
"$PROJECT_DIR/venv/bin/python" run_server.py &
FASTAPI_PID=$!

sleep 2

# 3. Iniciar Túnel Cloudflare
echo "[+] Conectando túnel público Cloudflare..."
"$PROJECT_DIR/cloudflared" tunnel --url http://127.0.0.1:8000

# Cleanup al salir (Ctrl + C)
trap "kill $FASTAPI_PID 2>/dev/null; exit" SIGINT SIGTERM
