path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

bad_block = """            return {
                "success": True,
            res_msg = f"🚀 He encontrado estos componentes en nuestro inventario:\\n\\n{items_text}\\n\\nPuedes pulsar 'Ver Detalle' o agregarlo a tu ensamble."
            return {
                "success": True,
                "answer": res_msg,"""

good_block = """            res_msg = f"🚀 He encontrado estos componentes en nuestro inventario:\\n\\n{items_text}\\n\\nPuedes pulsar 'Ver Detalle' o agregarlo a tu ensamble."
            return {
                "success": True,
                "answer": res_msg,"""

text = text.replace(bad_block, good_block)
with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Bloque corregido!")
