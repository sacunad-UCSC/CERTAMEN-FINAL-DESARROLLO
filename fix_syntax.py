path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'items_text = "' in line:
        new_lines.append("            items_list = [f\"• {p.get('nombre')} - ${int(p.get('precio', 0)):,} CLP (Stock: {p.get('stock', 0)} un.)\" for p in found]\n")
        new_lines.append("            items_text = '\\n'.join(items_list)\n")
        skip = True
        continue
    if skip and '".join(' in line:
        skip = False
        continue
    if not skip:
        new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Sintaxis corregida en main.py!")
