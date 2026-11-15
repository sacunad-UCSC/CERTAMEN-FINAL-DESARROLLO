path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Reemplazar cualquier literal multilínea roto con f-string seguro
old_ans = '''            return {
                "success": True,
                "answer": f"🚀 He encontrado estos componentes en nuestro inventario oficial:

{items_text}

Puedes pulsar 'Ver Detalle' en la tienda para conocer la ficha técnica o incorporarlo a 'Arma tu PC'.",'''

new_ans = '''            res_text = f"🚀 He encontrado estos componentes en nuestro inventario:\\n\\n{items_text}\\n\\nPuedes pulsar 'Ver Detalle' o agregarlo a tu ensamble."
            return {
                "success": True,
                "answer": res_text,'''

if '"answer": f"🚀' in text:
    import re
    text = re.sub(r'\"answer\":\s*f\"🚀[^\"]*\"', '\"answer\": f\"🚀 He encontrado estos componentes en nuestro inventario:\\n\\n{items_text}\\n\\nPuedes pulsar \'Ver Detalle\' o agregarlo a tu ensamble.\"', text, flags=re.DOTALL)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("f-string reparado con regex!")
else:
    print("No se encontró el patrón.")
