path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Intercambiar orden para que FAQ tenga prioridad ante una pregunta frecuente exacta
# O solo buscar catálogo si la pregunta no coincide con una FAQ
old_order = """    # 2. Búsqueda y Recomendación de Productos en Catálogo MongoDB (Sales Agent Catalog Search)"""
new_order = """    # 2. Primero: Consulta a FAQs de la Base de Datos NoSQL
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

    # 3. Búsqueda y Recomendación de Productos en Catálogo MongoDB (Sales Agent Catalog Search)"""

if old_order in text:
    # Eliminar el bloque 3 antiguo
    import re
    text = text.replace(old_order, new_order)
    old_faq_block = """    # 3. Consulta a FAQs de la Base de Datos NoSQL
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
            }"""
    text = text.replace(old_faq_block, "")
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Prioridad de FAQs vs Catálogo organizada!")
else:
    print("No se encontró old_order")
