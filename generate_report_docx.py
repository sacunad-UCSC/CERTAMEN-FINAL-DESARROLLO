# -*- coding: utf-8 -*-
"""
Generador de Informe Técnico Oficial en Formato Microsoft Word (.docx)
PcÑactory - Certamen Práctico Integrador UCSC
"""

import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import shutil
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Configuración de márgenes estándar de 2.5 cm (aprox 1 pulgada)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Colores institucionales
    COLOR_PRIMARY = RGBColor(0, 142, 204)   # Azul Cyan PcÑactory
    COLOR_NAVY = RGBColor(15, 23, 42)       # Azul Marino Oscuro
    COLOR_GRAY = RGBColor(100, 116, 139)    # Gris neutro
    COLOR_RED = RGBColor(200, 16, 46)       # Rojo UCSC

    # ==========================================
    # 1. PORTADA
    # ==========================================
    p_kicker = doc.add_paragraph()
    p_kicker.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_kicker = p_kicker.add_run("UNIVERSIDAD CATÓLICA DE LA SANTÍSIMA CONCEPCIÓN\nFACULTAD DE INGENIERÍA · DEPARTAMENTO DE INFORMÁTICA")
    r_kicker.font.size = Pt(11)
    r_kicker.font.bold = True
    r_kicker.font.color.rgb = COLOR_RED

    doc.add_paragraph("\n")

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("INFORME TÉCNICO Y MANUAL DE ARQUITECTURA\nPLATAFORMA WEB PCÑACTORY")
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Certamen Práctico Integrador: Desarrollo Web Seguro, DevOps y DevSecOps (100 Puntos)\nE-Commerce de Hardware de Alto Rendimiento, Módulo de Ensamble con Algoritmo de Compatibilidad y Cifrado Argon2id")
    r_sub.font.size = Pt(13)
    r_sub.font.italic = True
    r_sub.font.color.rgb = COLOR_PRIMARY

    doc.add_paragraph("\n\n")

    # Tabla de Integrantes
    table_team = doc.add_table(rows=1, cols=3)
    table_team.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table_team.rows[0].cells
    hdr[0].text = "N.º"
    hdr[1].text = "Nombre del Integrante"
    hdr[2].text = "Rol en el Proyecto"
    for c in hdr:
        set_cell_background(c, "0F172A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    team_data = [
        ("1", "Marcelo Oyanedel", "Líder de Proyecto & Fullstack"),
        ("2", "Sebastián Acuña", "Desarrollo Backend & Base de Datos NoSQL"),
        ("3", "Benjamín Baeza", "Frontend UI/UX & Responsive Multiplataforma"),
        ("4", "Ricardo Tapia", "DevSecOps, Auditoría SCA & Seguridad Argon2"),
    ]

    for num, name, role in team_data:
        row = table_team.add_row().cells
        row[0].text = num
        row[1].text = name
        row[2].text = role
        for c in row:
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)

    doc.add_paragraph("\n\n")

    p_loc = doc.add_paragraph()
    p_loc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_loc = p_loc.add_run("Los Ángeles, Región del Biobío, Chile — Noviembre 2026")
    r_loc.font.size = Pt(11)
    r_loc.font.bold = True
    r_loc.font.color.rgb = COLOR_GRAY

    doc.add_page_break()

    # ==========================================
    # 2. RESUMEN EJECUTIVO Y CASO DE NEGOCIO
    # ==========================================
    h1 = doc.add_heading("1. Resumen Ejecutivo y Caso de Negocio", level=1)
    h1.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "PcÑactory es una plataforma web integral de comercio electrónico de tecnología y cotización personalizada "
        "de hardware de alto rendimiento para el mercado chileno. El proyecto resuelve la necesidad crítica de gamers, "
        "diseñadores y profesionales de adquirir y armar estaciones de trabajo garantizando 100% de compatibilidad física "
        "y eléctrica, erradicando cuellos de botella técnicos antes de concretar la inversión."
    )

    doc.add_paragraph(
        "La plataforma fue desarrollada cumpliendo estrictamente con los 14 estándares del Certamen Práctico Integrador "
        "de la UCSC (Desarrollo Web Seguro, DevOps y DevSecOps, 100 puntos), incorporando arquitectura en capas, control "
        "de acceso basado en roles (RBAC) con tokens JWT, protección criptográfica de contraseñas mediante Argon2id, "
        "base de datos NoSQL MongoDB, doble correo transaccional Nodemailer, chatbot de atención al cliente y pipeline CI/CD."
    )

    # ==========================================
    # 3. ARQUITECTURA TÉCNICA
    # ==========================================
    h2 = doc.add_heading("2. Arquitectura de la Solución", level=1)
    h2.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "El sistema se estructura en una arquitectura de desacoplamiento total cliente-servidor (SPA + API REST):"
    )

    arch_bullets = [
        ("Frontend (React + Vite):", "Single Page Application (SPA) ultra rápida construida con React 18, empaquetador Vite, "
         "animaciones de aceleración por hardware (cubic-bezier) y diseño multiplataforma 100% responsivo para teléfonos inteligentes, tablets y computadores de escritorio."),
        ("Backend (Node.js + Express):", "API RESTful estructurada bajo el patrón Controlador-Modelo-Ruta, securizada con Helmet (cabeceras HTTP seguras), "
         "CORS restringido, express-rate-limit para mitigación de ataques DoS y fuerza bruta, y validación estricta de payloads con express-validator."),
        ("Base de Datos NoSQL (MongoDB):", "Base de datos pc_nfactory_db modelada en Mongoose con esquemas estrictos en español (usuarios, productos, pedidos, contactos, preguntas_frecuentes, redes_sociales, registros_auditoria), índices de búsqueda optimizados y scripts automatizados de respaldo en formato JSON."),
        ("Autenticación & Autorización (JWT + RBAC):", "Emisión de tokens JSON Web Tokens (HS256) con expiración de 2 horas y verificación de roles: Administrador, Usuario registrado y Visitante."),
        ("Criptografía de Contraseñas (Argon2id):", "Cifrado irreversible de última generación con algoritmo Argon2id (ganador del Password Hashing Competition), configurado con 64 MB de memoria RAM y 3 iteraciones, garantizando resistencia ante ataques con clústeres GPU y hardware ASIC."),
    ]

    for title, desc in arch_bullets:
        p = doc.add_paragraph(style='List Bullet')
        r_b = p.add_run(title + " ")
        r_b.bold = True
        r_b.font.color.rgb = COLOR_PRIMARY
        p.add_run(desc)

    # ==========================================
    # 4. SEGURIDAD AVANZADA: ARGON2ID
    # ==========================================
    h3 = doc.add_heading("3. Criptografía Avanzada de Contraseñas con Argon2id", level=1)
    h3.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "En cumplimiento de los requerimientos de DevSecOps y las directrices de la rúbrica (Sección 4.2), se implementó "
        "Argon2id como motor criptográfico de cabecera en el modelo de usuarios (Usuario.js). A diferencia de algoritmos "
        "tradicionales, Argon2id ofrece características de seguridad de grado militar:"
    )

    argon_table = doc.add_table(rows=1, cols=3)
    argon_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = argon_table.rows[0].cells
    hdr[0].text = "Parámetro"
    hdr[1].text = "Configuración PcÑactory"
    hdr[2].text = "Beneficio de Seguridad Defensiva"
    for c in hdr:
        set_cell_background(c, "008ECC")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    argon_rows = [
        ("Variante de Algoritmo", "Argon2id (v=19)", "Combina resistencia contra ataques de canal lateral (Argon2i) y ataques de fuerza bruta paralelos en GPU (Argon2d)."),
        ("Costo de Memoria (m)", "65.536 KB (64 MB)", "Exige 64 MB de memoria por cada intento de hash, haciendo inviable el cracking masivo con placas de video o chips dedicados."),
        ("Costo de Tiempo (t)", "3 Iteraciones", "Garantiza un retardo computacional controlado en el servidor sin degradar la experiencia de login."),
        ("Exclusión en Consultas", "select: false en Mongoose", "Impide que el hash viaje accidentalmente en respuestas JSON hacia el frontend."),
    ]

    for p, v, b in argon_rows:
        row = argon_table.add_row().cells
        row[0].text = p
        row[1].text = v
        row[2].text = b
        for c in row:
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)

    # ==========================================
    # 5. MÓDULOS DE LA PLATAFORMA
    # ==========================================
    doc.add_page_break()
    h4 = doc.add_heading("4. Módulos y Funcionalidades del Sistema", level=1)
    h4.runs[0].font.color.rgb = COLOR_NAVY

    modules = [
        ("Módulo 1: Inicio y Vitrina Retail Dinámica (Hero Banner con Desplazamiento)",
         "El front principal exhibe los componentes en stock mediante un Hero Banner auto-rotativo cada 4.5 segundos con "
         "animaciones de aceleración física (cubic-bezier), silueta con efecto respiración y tarjeta flotante con levitación. "
         "Incluye botones de navegación manual anterior/siguiente y pausa inteligente al pasar el cursor (pause on hover)."),

        ("Módulo 2: Visualizador Detallado y Ficha Técnica de Hardware",
         "Al hacer clic en cualquier componente o foto de la tienda, se despliega un modal interactivo con ampliación de imagen "
         "y zoom óptico, tabla formal de especificaciones técnicas (Socket, tipo de memoria, consumo TDP, factor de forma), "
         "garantía oficial directa (36 a 120 meses), selector de cantidad y botón directo 'Armar mi PC con este componente'."),

        ("Módulo 3: 'Arma tu PC' con Motor de Compatibilidad y Bottleneck Engine",
         "Permite ensamblar un computador paso a paso por ranuras (CPU, Placa Madre, RAM, GPU, Almacenamiento, Fuente, Gabinete y Cooler). "
         "Incorpora un algoritmo en tiempo real que ejecuta cuatro análisis críticos:\n"
         "  a) Validación física de Socket: Cruza pines y sockets (ej: alerta error bloqueante si se intenta montar un CPU AM5 en una placa LGA1700).\n"
         "  b) Compatibilidad de Generación RAM: Verifica sincronización entre memorias DDR4 y DDR5.\n"
         "  c) Calculadora de Potencia Eléctrica (TDP): Estima el consumo bajo carga pesada y compara contra la fuente de poder, exigiendo un margen de seguridad del 30%.\n"
         "  d) Calculadora de Cuello de Botella (CPU vs GPU): Evalúa tiers de rendimiento relativos, proyecta el porcentaje de impacto en FPS (ej: 4% balance óptimo vs 35% cuello por CPU) y entrega recomendaciones.\n"
         "  e) Asistente de Reemplazo en 1 Clic: Si una pieza es incompatible o insuficiente, consulta automáticamente el catálogo de la tienda y despliega sugerencias compatibles con fotos, precios y diferencia monetaria (+/- $CLP) para cambiarlas instantáneamente."),

        ("Módulo 4: Formulario de Contacto y Doble Correo Transaccional (Nodemailer)",
         "Canal de comunicación seguro con validación de entradas. Guarda la consulta en la colección 'contactos' de MongoDB y "
         "dispara simultáneamente dos correos electrónicos vía SMTP:\n"
         "  1. Correo Institucional: Notifica al equipo de ventas con datos del cliente y consulta.\n"
         "  2. Confirmación al Cliente: Acuse de recibo inmediato con copia de su mensaje."),

        ("Módulo 5: Chatbot Flotante de Atención al Cliente",
         "Widget interactivo persistente en todas las vistas con menú dinámico de preguntas frecuentes (FAQ) administrables desde MongoDB. "
         "Permite responder dudas de envíos, métodos de pago, garantías y solicitar derivación directa con un asesor humano."),

        ("Módulo 6: Panel Administrativo Seguro (RBAC)",
         "Panel reservado para el rol 'Administrador' con herramientas integradas:\n"
         "  • Gestión de Productos: Creación y eliminación de piezas de hardware con validación de fotos y especificaciones.\n"
         "  • Gestión de Usuarios: Monitoreo de cuentas registradas y creación de nuevos administradores con clave Argon2id.\n"
         "  • Bandeja de Cotizaciones: Seguimiento del estado de consultas de clientes (Pendiente, En revisión, Respondido).\n"
         "  • Redes Sociales Dinámicas: Edición y activación de enlaces oficiales sin tocar código fuente."),
    ]

    for title, desc in modules:
        h_mod = doc.add_heading(title, level=2)
        h_mod.runs[0].font.color.rgb = COLOR_PRIMARY
        doc.add_paragraph(desc)

    # ==========================================
    # 6. DISEÑO MULTIPLATAFORMA
    # ==========================================
    doc.add_page_break()
    h5 = doc.add_heading("5. Diseño Multiplataforma y Responsivo (Celulares, Tablets y PCs)", level=1)
    h5.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "Para asegurar una experiencia de usuario perfecta en cualquier dispositivo, la interfaz fue diseñada bajo estándares "
        "modernos de CSS Flexbox y CSS Grid con puntos de quiebre (breakpoints) específicos:"
    )

    resp_table = doc.add_table(rows=1, cols=3)
    resp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = resp_table.rows[0].cells
    hdr[0].text = "Dispositivo / Resolución"
    hdr[1].text = "Punto de Quiebre (Breakpoint)"
    hdr[2].text = "Comportamiento y Adaptación UI"
    for c in hdr:
        set_cell_background(c, "0F172A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    resp_rows = [
        ("Smartphones (Celulares)", "max-width: 540px", "Grilla a 1 columna en catálogo y PC Builder, buscador a ancho completo, chatbot flotante en ventana modal táctil adaptada al 75% del alto de pantalla."),
        ("Tablets & Dispositivos Medianos", "max-width: 768px", "Grilla a 2 columnas en productos, Hero Banner reorganizado en orientación vertical centrada, botones táctiles con zonas de pulsación de 44px."),
        ("Laptops & Pantallas Medianas", "max-width: 1024px", "PC Builder con inspector de compatibilidad adaptado a ancho fluido, panel modal de detalle reajustado a proporción 1fr."),
        ("Escritorio & Monitores Gamer", "min-width: 1200px", "Diseño en 2 columnas principales con panel de compatibilidad fijo (sticky) a 380px, carrusel panorámico con flechas de navegación lateral."),
    ]

    for d, b, c in resp_rows:
        row = resp_table.add_row().cells
        row[0].text = d
        row[1].text = b
        row[2].text = c
        for cell in row:
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)

    # ==========================================
    # 7. DEVOPS, DEVSECOPS Y VERIFICACIÓN
    # ==========================================
    doc.add_page_break()
    h6 = doc.add_heading("6. Prácticas DevOps, DevSecOps y Resultados de Auditoría", level=1)
    h6.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "La plataforma implementa un ciclo de vida seguro del software (SDLC) con automatización integral:"
    )

    dev_points = [
        ("Pipeline CI/CD en GitHub Actions (.github/workflows/ci-devsecops.yml):", 
         "Automatiza en cada push y pull request: 1) Checkout de código, 2) Instalación de dependencias, 3) Auditoría de vulnerabilidades con npm audit --audit-level=high, 4) Ejecución de pruebas unitarias automatizadas del motor de compatibilidad (node --test), 5) Compilación de producción con Vite."),
        ("Auditoría de Dependencias (SCA):", 
         "El escaneo estático de paquetes en Backend y Frontend arrojó 0 vulnerabilidades conocidas (found 0 vulnerabilities), cumpliendo con el estándar más alto de seguridad."),
        ("Respaldo y Exportación NoSQL (scripts/backup_db.js):", 
         "Script automatizado que genera instantáneas completas de las 7 colecciones de MongoDB en formato JSON con marcas de tiempo para recuperación ante desastres."),
    ]

    for t, d in dev_points:
        p = doc.add_paragraph(style='List Bullet')
        r_b = p.add_run(t + " ")
        r_b.bold = True
        r_b.font.color.rgb = COLOR_PRIMARY
        p.add_run(d)

    # ==========================================
    # 8. HOSTING EN FASTAPI (PYTHON) Y SWAGGER
    # ==========================================
    h_fast = doc.add_heading("8. Servidor de Hosting en FastAPI (Python) y Swagger UI", level=1)
    h_fast.runs[0].font.color.rgb = COLOR_NAVY

    doc.add_paragraph(
        "Como capacidad avanzada de despliegue y compatibilidad multiplataforma, se implementó un servidor de hosting "
        "completo en FastAPI (Python 3.14 + Uvicorn) en la carpeta hosting_fastapi/:\n"
        "  • URL Pública en Internet (HTTPS): https://emily-intermediate-cosmetics-serving.trycloudflare.com\n"
        "  • Hosting de la SPA: Aloja y sirve la aplicación compilada de React en la raíz con enrutamiento fallback para Single Page Application.\n"
        "  • API REST Integrada: Endpoints de catálogo, productos, autenticación con Argon2id, contacto y chatbot conectados a MongoDB pc_nfactory_db.\n"
        "  • Documentación Interactiva OpenAPI (Swagger UI): Disponible en https://emily-intermediate-cosmetics-serving.trycloudflare.com/docs para pruebas interactivas de endpoints.\n"
        "  • Documentación ReDoc: Disponible en https://emily-intermediate-cosmetics-serving.trycloudflare.com/redoc.\n"
        "  • Script de Inicio Rápido: Ejecutable mediante start_fastapi_hosting.bat o python hosting_fastapi/run_server.py."
    )

    # ==========================================
    # 9. CREDENCIALES DE DEMOSTRACIÓN
    # ==========================================
    h7 = doc.add_heading("9. Credenciales de Demostración para Evaluación", level=1)
    h7.runs[0].font.color.rgb = COLOR_NAVY

    cred_table = doc.add_table(rows=1, cols=4)
    cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = cred_table.rows[0].cells
    hdr[0].text = "Rol"
    hdr[1].text = "Correo Electrónico"
    hdr[2].text = "Contraseña"
    hdr[3].text = "Permisos Habilitados"
    for c in hdr:
        set_cell_background(c, "008ECC")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    cred_rows = [
        ("Administrador", "admin@pcnfactory.cl", "AdminPassword2026!", "Panel de control total, agregar productos, ver pedidos, gestionar usuarios y redes sociales."),
        ("Usuario Registrado", "cliente@ucsc.cl", "UserPassword2026!", "Navegación segura, armado de PC, adición al carro y checkout simulado."),
        ("Visitante", "Sin credenciales", "Público", "Acceso al catálogo público, uso del chatbot y envío de cotizaciones."),
    ]

    for r, e, p, perm in cred_rows:
        row = cred_table.add_row().cells
        row[0].text = r
        row[1].text = e
        row[2].text = p
        row[3].text = perm
        for cell in row:
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)

    # Guardar documento
    output_path = r"c:\Users\marce\OneDrive\Desktop\trabajo_desarrollo\docs\INFORME_TECNICO_PCNACTORY.docx"
    doc.save(output_path)
    print(f"Informe Word generado con éxito en: {output_path}")

    # Copiar a Descargas para acceso inmediato del usuario
    downloads_path = r"C:\Users\marce\Downloads\INFORME_TECNICO_PCNACTORY.docx"
    shutil.copyfile(output_path, downloads_path)
    print(f"Copia guardada en Descargas: {downloads_path}")

if __name__ == "__main__":
    create_report()
