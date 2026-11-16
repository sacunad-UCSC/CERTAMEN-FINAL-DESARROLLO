"""
Lanzador del Servidor de Hosting FastAPI
PcÑactory
"""

import uvicorn
import os

if __name__ == "__main__":
    print("=" * 60)
    print("  🚀 INICIANDO HOSTING DE PCÑACTORY EN FASTAPI (PYTHON)")
    print("  📍 Plataforma Web: http://localhost:8000")
    print("  📚 Documentación Swagger UI: http://localhost:8000/docs")
    print("  📖 Documentación ReDoc: http://localhost:8000/redoc")
    print("=" * 60)

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
