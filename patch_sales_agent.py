import os

main_path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
code = open(main_path, "r", encoding="utf-8").read()

sales_agent_code = """
class ChatbotAskRequest(BaseModel):
    query: str
    sessionId: Optional[str] = None

@app.post("/api/chatbot/ask", tags=["Chatbot Inteligente & Sales Agent"])
def ask_chatbot(data: ChatbotAskRequest):
    q = data.query.lower().strip()

    # 1. Intención de Carrito y Compras (Sales-Agent Feature)
    if any(k in q for k in ["mi carro", "mi carrito", "ver carro", "ver carrito", "que tengo en el carro", "compras"]):
        return {
            "success": True,
            "answer": "🛒 Puedes revisar tus componentes seleccionados y finalizar tu pedido directamente en el Carro de Compras.",
            "options": ["¿Cuáles son los métodos de pago?", "¿Tiempos de despacho a regiones?", "Arma tu PC"]
        }

    if any(k in q for k in ["pagar", "finalizar compra", "checkout", "comprar ahora"]):
        return {
            "success": True,
            "answer": "💳 Para concretar tu compra con despacho por Chilexpress y pago seguro Webpay Plus, ingresa a la pestaña Carro y presiona 'Finalizar Pedido'.",
            "options": ["¿Qué garantía tienen los componentes?", "Solicitar contacto con un ejecutivo"]
        }

    if any(k in q for k in ["armar pc", "arma tu pc", "compatibilidad", "cuello de botella", "ensamble"]):
        return {
            "success": True,
            "answer": "🛠️ ¡PcÑactory cuenta con un Motor de Compatibilidad en vivo! Puedes ir a 'Arma tu PC' para elegir procesador, placa madre y tarjeta gráfica sin riesgos de incompatibilidad ni cuellos de botella.",
            "options": ["¿Qué tarjetas gráficas tienen disponibles?", "¿Tienen procesadores Ryzen 7 o Intel i9?", "Solicitar contacto con un ejecutivo"]
        }

    # 2. Búsqueda y Recomendación de Productos en Catálogo MongoDB (Sales Agent Catalog Search)
    category_map = {
        "rtx": "Tarjetas Gráficas (GPU)",
        "gpu": "Tarjetas Gráficas (GPU)",
        "gráfica": "Tarjetas Gráficas (GPU)",
        "grafica": "Tarjetas Gráficas (GPU)",
        "tarjeta de video": "Tarjetas Gráficas (GPU)",
        "ryzen": "Procesadores (CPU)",
        "intel": "Procesadores (CPU)",
        "core i": "Procesadores (CPU)",
        "cpu": "Procesadores (CPU)",
        "procesador": "Procesadores (CPU)",
        "placa": "Placas Madre",
        "motherboard": "Placas Madre",
        "z790": "Placas Madre",
        "b650": "Placas Madre",
        "ram": "Memorias RAM",
        "ddr5": "Memorias RAM",
        "corsair": "Memorias RAM",
        "ssd": "Almacenamiento (SSD/NVMe)",
        "nvme": "Almacenamiento (SSD/NVMe)",
        "m.2": "Almacenamiento (SSD/NVMe)",
        "samsung": "Almacenamiento (SSD/NVMe)",
        "fuente": "Fuentes de Poder (PSU)",
        "psu": "Fuentes de Poder (PSU)",
        "watts": "Fuentes de Poder (PSU)",
        "gabinete": "Gabinetes",
        "case": "Gabinetes",
        "lian li": "Gabinetes",
        "cooler": "Refrigeración",
        "refrigeración": "Refrigeración",
        "refrigeracion": "Refrigeración",
        "watercooling": "Refrigeración"
    }

    matched_cat = None
    for kw, cat in category_map.items():
        if kw in q:
            matched_cat = cat
            break

    search_query = {"activo": True}
    if matched_cat:
        search_query["categoria"] = matched_cat
    else:
        terms = [t for t in q.split() if len(t) > 2 and t not in ["hola", "tienen", "busco", "precio", "cuanto", "venden", "para", "quiero"]]
        if terms:
            search_query["$or"] = [
                {"nombre": {"$regex": term, "$options": "i"}} for term in terms[:2]
            ]
        else:
            search_query = None

    if search_query:
        found = list(db["productos"].find(search_query, {"nombre": 1, "precio": 1, "marca": 1, "stock": 1, "categoria": 1}).limit(3))
        if found:
            items_text = "\\n".join([f"• {p.get('nombre')} - ${int(p.get('precio', 0)):,} CLP (Stock: {p.get('stock', 0)} un.)" for p in found])
            return {
                "success": True,
                "answer": f"🚀 He encontrado estos componentes en nuestro inventario oficial:\\n\\n{items_text}\\n\\nPuedes pulsar 'Ver Detalle' en la tienda para conocer la ficha técnica o incorporarlo a 'Arma tu PC'.",
                "options": [
                    "¿Tiempos de despacho a regiones?",
                    "¿Qué garantía tienen los productos?",
                    "Arma tu PC",
                    "Solicitar contacto con un ejecutivo"
                ]
            }

    # 3. Consulta a FAQs de la Base de Datos NoSQL
    faqs = list(db["preguntas_frecuentes"].find({"activa": True}))
    for f in faqs:
        pregunta = f.get("pregunta", "").lower()
        palabras = f.get("palabrasClave", [])
        if any(p.lower() in q for p in palabras) or pregunta in q or q in pregunta:
            return {
                "success": True,
                "answer": f.get("respuesta", ""),
                "category": f.get("categoria", ""),
                "options": [
                    "¿Qué garantía tienen las GPUs?",
                    "¿Tiempos de despacho a regiones?",
                    "¿Cuáles son los métodos de pago?",
                    "Solicitar contacto con un ejecutivo"
                ]
            }

    # 4. Asistencia de Ventas por Defecto
    return {
        "success": True,
        "answer": "Soy tu Asistente de Ventas y Hardware de PcÑactory. Puedo ayudarte a buscar tarjetas gráficas RTX/Radeon, procesadores Ryzen/Intel, verificar compatibilidad en 'Arma tu PC' o responder sobre garantías y despachos.",
        "options": [
            "¿Qué garantía tienen las GPUs?",
            "¿Tiempos de despacho a regiones?",
            "¿Cuáles son los métodos de pago?",
            "Solicitar contacto con un ejecutivo"
        ]
    }
"""

if "@app.post(\"/api/chatbot/ask\"" not in code:
    code = code.replace(
        '@app.get("/api/chatbot/faqs", tags=["Chatbot Inteligente"])',
        sales_agent_code + '\n@app.get("/api/chatbot/faqs", tags=["Chatbot Inteligente"])'
    )
    open(main_path, "w", encoding="utf-8").write(code)
    print("¡Endpoint /api/chatbot/ask de Sales Agent integrado con éxito!")
else:
    print("Ya estaba integrado.")
