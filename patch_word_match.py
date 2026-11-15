path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

old_check = """        if any(p.lower() in q for p in palabras) or pregunta in q or q in pregunta:"""

new_check = """        # Coincidencia exacta por palabras clave completas o similitud de frase
        palabras_usuario = set(q.replace('?', '').replace('¿', '').split())
        palabras_clave_set = set([p.lower() for p in palabras])
        
        # Debe coincidir al menos una palabra clave exacta o la pregunta
        tiene_palabra_clave = bool(palabras_usuario.intersection(palabras_clave_set))
        if tiene_palabra_clave or (len(pregunta) > 8 and (pregunta in q or q in pregunta)):"""

if old_check in text:
    text = text.replace(old_check, new_check)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Coincidencia de palabras clave corregida con éxito!")
else:
    print("No se encontró old_check")
