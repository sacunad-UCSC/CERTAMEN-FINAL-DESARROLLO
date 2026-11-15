path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'f"🚀 He encontrado estos' in line:
        new_lines.append('            res_msg = f"🚀 He encontrado estos componentes en nuestro inventario:\\n\\n{items_text}\\n\\nPuedes pulsar \'Ver Detalle\' o agregarlo a tu ensamble."\n')
        new_lines.append('            return {\n')
        new_lines.append('                "success": True,\n')
        new_lines.append('                "answer": res_msg,\n')
        skip = True
        continue
    if skip and 'agregarlo a tu ensamble.",' in line:
        skip = False
        continue
    if not skip:
        # Evitar duplicar return {"success": True, ...
        if 'return {' in line and new_lines and '"answer": res_msg' in new_lines[-1]:
            continue
        if '"success": True,' in line and new_lines and '"answer": res_msg' in new_lines[-2]:
            continue
        new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Líneas de f-string reemplazadas limpiamente!")
