# -*- coding: utf-8 -*-
"""
Generador del Manual Integral de Funcionamiento y Construcción de PcÑactory
Formato Microsoft Word (.docx) para defensa de certamen y guía de estudio
"""

import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
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

def create_full_guide():
    doc = Document()

    # Márgenes estándar de 2.54 cm
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Paleta cromática corporativa y académica
    C_PRIMARY = RGBColor(0, 142, 204)   # Azul Cyan PcÑactory (#008ecc)
    C_NAVY = RGBColor(15, 23, 42)       # Azul Marino (#0f172a)
    C_DARK = RGBColor(30, 41, 59)       # Texto oscuro
    C_GRAY = RGBColor(100, 116, 139)    # Gris neutro
    C_RED = RGBColor(200, 16, 46)       # Rojo UCSC (#c8102e)
    C_GREEN = RGBColor(16, 185, 129)    # Verde éxito (#10b981)

    # ==========================================
    # PORTADA
    # ==========================================
    p_kicker = doc.add_paragraph()
    p_kicker.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_k = p_kicker.add_run("UNIVERSIDAD CATÓLICA DE LA SANTÍSIMA CONCEPCIÓN\nFACULTAD DE INGENIERÍA · DEPARTAMENTO DE INFORMÁTICA")
    r_k.font.size = Pt(11)
    r_k.font.bold = True
    r_k.font.color.rgb = C_RED

    doc.add_paragraph("\n")

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_title.add_run("MANUAL INTEGRAL DE ARQUITECTURA,\nCONSTRUCCIÓN Y FUNCIONAMIENTO\nPLATAFORMA WEB PCÑACTORY")
    r_t.font.size = Pt(22)
    r_t.font.bold = True
    r_t.font.color.rgb = C_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_s = p_sub.add_run("Guía Detallada Paso a Paso: Tecnologías, Seguridad Argon2id, Motor de Compatibilidad,\nCuello de Botella, Hosting en FastAPI y Guía de Defensa Técnica")
    r_s.font.size = Pt(12)
    r_s.font.italic = True
    r_s.font.color.rgb = C_PRIMARY

    doc.add_paragraph("\n\n")

    # Tabla de Integrantes
    t_team = doc.add_table(rows=1, cols=3)
    t_team.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = t_team.rows[0].cells
    hdr[0].text = "N.º"
    hdr[1].text = "Nombre del Integrante"
    hdr[2].text = "Rol Asignado"
    for c in hdr:
        set_cell_background(c, "0F172A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    team = [
        ("1", "Marcelo Oyanedel", "Líder de Proyecto & Arquitectura Frontend"),
        ("2", "Sebastián Acuña", "Desarrollo Backend & Base de Datos NoSQL"),
        ("3", "Benjamín Baeza", "Diseño UI/UX Multiplataforma & Responsividad"),
        ("4", "Ricardo Tapia", "DevSecOps, Auditoría SCA & Seguridad Argon2id"),
    ]
    for n, nom, rol in team:
        row = t_team.add_row().cells
        row[0].text = n
        row[1].text = nom
        row[2].text = rol
        for cell in row:
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)

    doc.add_paragraph("\n\n")

    p_loc = doc.add_paragraph()
    p_loc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_loc = p_loc.add_run("Sede Los Ángeles, Región del Biobío, Chile · Certamen Práctico Integrador")
    r_loc.font.size = Pt(10.5)
    r_loc.font.bold = True
    r_loc.font.color.rgb = C_GRAY

    doc.add_page_break()

    # ==========================================
    # SECCIÓN 1: CÓMO ESTÁ HECHA LA PÁGINA
    # ==========================================
    h1 = doc.add_heading("1. ¿Cómo está hecha la página? (Arquitectura y Tecnologías)", level=1)
    h1.runs[0].font.color.rgb = C_NAVY

    doc.add_paragraph(
        "PcÑactory es una solución web empresarial construida bajo el principio de desacoplamiento total "
        "entre el cliente (Frontend) y el servidor (Backend), garantizando escalabilidad, rendimiento de carga "
        "instantáneo y máxima seguridad informática. Las tecnologías empleadas son:"
    )

    t_tech = doc.add_table(rows=1, cols=3)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    th = t_tech.rows[0].cells
    th[0].text = "Capa del Sistema"
    th[1].text = "Tecnología Principal"
    th[2].text = "Función y Justificación Técnica"
    for c in th:
        set_cell_background(c, "008ECC")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    tech_rows = [
        ("Frontend (Cliente)", "React 18 + Vite", "Single Page Application (SPA) ultra rápida. Permite navegación fluida sin recargar la pantalla, gestión de estado con Context API (AuthContext y CartContext) y animaciones de inercia física (cubic-bezier)."),
        ("Diseño Visual & UI", "CSS3 Multiplataforma", "Diseño responsivo con CSS Grid y Flexbox adaptado a celulares (<= 540px), tablets (<= 768px) y computadores de escritorio. Iconografía SVG vectorial con Lucide React."),
        ("Backend Principal (Rúbrica)", "Node.js 20 + Express", "API RESTful estructurada en Controlador-Modelo-Ruta. Incluye protección con Helmet (cabeceras HTTP), CORS restrictivo, express-rate-limit contra ataques DoS y express-validator."),
        ("Servidor de Hosting Alternativo", "FastAPI (Python 3.14 + Uvicorn)", "Servidor ASGI de alto rendimiento que hospeda los archivos estáticos de la aplicación React y expone la API REST con documentación interactiva automática en Swagger UI (/docs) y ReDoc."),
        ("Base de Datos NoSQL", "MongoDB + Mongoose", "Base de datos pc_nfactory_db con 7 colecciones en español: usuarios, productos, pedidos, contactos, preguntas_frecuentes, redes_sociales y registros_auditoria. Índices optimizados y validación de esquemas."),
        ("Seguridad Criptográfica", "Argon2id (v=19)", "Algoritmo de cifrado de contraseñas de última generación con 64 MB de costo de memoria y 3 iteraciones. Inmune a ataques de fuerza bruta por tarjetas gráficas (GPU) o mineros ASIC."),
        ("Autenticación & RBAC", "JSON Web Tokens (JWT)", "Tokens seguros firmados con clave simétrica HS256 y expiración de 2 horas. Control de acceso por roles: Administrador, Usuario registrado y Visitante."),
        ("Comunicaciones Transaccionales", "Nodemailer (SMTP)", "Envío doble de correos automatizados: una alerta al buzón institucional de la empresa y un comprobante con copia de la consulta al correo del cliente."),
        ("Publicación en Internet", "Cloudflare Tunnel", "Túnel HTTPS seguro que expone la aplicación hacia todo el mundo sin abrir puertos en el router y protegiendo la dirección IP con el escudo anti-DDoS de Cloudflare."),
    ]

    for c1, c2, c3 in tech_rows:
        row = t_tech.add_row().cells
        row[0].text = c1
        row[1].text = c2
        row[2].text = c3
        for cell in row:
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)

    # ==========================================
    # SECCIÓN 2: CÓMO FUNCIONA CADA PARTE
    # ==========================================
    doc.add_page_break()
    h2 = doc.add_heading("2. ¿Cómo funciona cada parte de la página? (Manual de Uso)", level=1)
    h2.runs[0].font.color.rgb = C_NAVY

    doc.add_paragraph(
        "A continuación se explica paso a paso el funcionamiento interactivo de cada módulo de PcÑactory:"
    )

    # 2.1 Pantalla de Login
    doc.add_heading("2.1. Puerta de Acceso y Autenticación Segura (Login / Registro)", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "• Acceso Directo: Al entrar a la página, el usuario se encuentra con una pantalla moderna dividida (Split Screen) "
        "con el logo oficial de PcÑactory y formulario con diseño limpio.\n"
        "• Botones de Demostración: Incluye botones de un solo clic ('Administrador' y 'Cliente') que autorrellenan las credenciales "
        "para facilitar la evaluación técnica del profesor.\n"
        "• Proceso Interno: Al presionar 'Iniciar Sesión', el frontend envía las credenciales vía POST a /api/auth/login. "
        "El servidor consulta el usuario en MongoDB, valida la clave mediante Argon2id (ph.verify) y retorna un token JWT que se "
        "almacena en el localStorage del navegador, permitiendo la persistencia de la sesión."
    )

    # 2.2 Hero Banner
    doc.add_heading("2.2. Vitrina Dinámica con Animaciones de Desplazo (Hero Banner)", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "• Rotación Automática: Cada 4.5 segundos, el carrusel superior cambia automáticamente de componente destacado.\n"
        "• Animaciones Físicas: Los textos, precios y especificaciones se desplazan horizontalmente de derecha a izquierda "
        "con aceleración orgánica (cubic-bezier), mientras que la tarjeta del producto entra con deslizamiento elástico y mantiene "
        "un efecto de levitación continuo (floating hover).\n"
        "• Controles Interactivos: Cuenta con flechas de navegación lateral para deslizar los productos manualmente, puntos inferiores "
        "indicadores y función 'Pause on Hover' (al colocar el mouse encima, el carrusel se detiene para permitir una lectura cómoda)."
    )

    # 2.3 Visualizador de Ficha Técnica
    doc.add_heading("2.3. Modal de Detalle y Especificaciones Técnicas (Al pinchar imágenes)", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "• Inspección Visual: Al hacer clic en cualquier foto o nombre de un componente, se abre una ventana modal emergente con la "
        "imagen en alta resolución y efecto de zoom óptico al pasar el cursor.\n"
        "• Ficha Técnica Formal: Muestra una tabla con datos de ingeniería (Socket, frecuencia de reloj, potencia TDP en Watts, factor de forma, etc.).\n"
        "• Información Comercial: Detalla los meses de garantía oficial directa (de 36 a 120 meses), el stock exacto en bodega y el ahorro en pesos.\n"
        "• Acciones Rápidas: Permite seleccionar la cantidad, añadir directamente al carro de compras o presionar el botón 'Arma tu PC con este' "
        "para trasladar ese componente de inmediato al configurador."
    )

    # 2.4 Arma tu PC
    doc.add_heading("2.4. Módulo 'Arma tu PC' y Motor de Compatibilidad en Vivo", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "Es el componente tecnológico más avanzado de la plataforma (compatibilityEngine.js). Permite seleccionar pieza por pieza "
        "un computador gamer (CPU, Placa Madre, RAM, Tarjeta Gráfica, SSD, Fuente de Poder, Cooler y Gabinete) ejecutando cuatro análisis en vivo:\n\n"
        "1. Validación Física de Sockets:\n"
        "   El motor extrae el socket del procesador y de la placa. Si el usuario intenta montar un CPU AMD Ryzen (Socket AM5) "
        "   en una placa Intel (Socket LGA1700), el sistema emite una alerta roja bloqueante indicando que no encajarán físicamente.\n\n"
        "2. Validación de Generación de Memoria RAM:\n"
        "   Comprueba si la placa madre y la memoria pertenecen al mismo estándar (DDR5 o DDR4), impidiendo la compra de piezas incompatibles.\n\n"
        "3. Estimación de Consumo Energético (TDP):\n"
        "   Calcula en tiempo real la suma de Watts consumidos por el procesador, tarjeta de video, ventiladores y placa base bajo carga máxima. "
        "   Compara esta cifra contra la potencia de la fuente seleccionada y exige un margen de seguridad del 30%.\n\n"
        "4. Calculadora de Cuello de Botella (Bottleneck Engine):\n"
        "   Compara los tiers de rendimiento relativo (escala 1 a 10) entre la CPU y la GPU. Muestra una barra gráfica visual con el porcentaje "
        "   de pérdida de FPS (por ejemplo: 4% balance óptimo vs 35% cuello de botella por procesador débil con GPU RTX 4090) y entrega recomendaciones técnicas.\n\n"
        "5. Asistente Inteligente de Reemplazo en 1 Clic:\n"
        "   Si existe algún error de compatibilidad o cuello de botella, el sistema busca en todo el catálogo de la tienda las piezas alternativas que sí son "
        "   compatibles y las despliega en tarjetas con foto, precio y la diferencia en dinero (+/- $CLP) respecto a la pieza actual. "
        "   Con solo presionar 'Cambiar por este', la pieza defectuosa se sustituye instantáneamente sin reiniciar el armado."
    )

    # 2.5 Contacto y Doble Correo
    doc.add_heading("2.5. Formulario de Contacto y Doble Correo Transaccional (Nodemailer)", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "• Validaciones: Valida formato de correo, campos obligatorios y límites de caracteres en cliente y servidor.\n"
        "• Registro en Base de Datos: Cada mensaje se guarda en la colección 'contactos' de MongoDB con estado inicial 'Pendiente'.\n"
        "• Doble Notificación SMTP: Envía de manera automatizada dos correos electrónicos:\n"
        "   a) Notificación a la Empresa: Llega a contacto@pcnfactory.cl con los datos y el mensaje del cliente.\n"
        "   b) Confirmación al Cliente: Llega al correo personal del cliente como acuse de recibo con copia de su mensaje."
    )

    # 2.6 Chatbot Flotante
    doc.add_heading("2.6. Chatbot Flotante de Atención al Cliente", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "• Acceso Persistente: Botón flotante circular cyan en la esquina inferior derecha.\n"
        "• Menú de Opciones: Despliega preguntas frecuentes agrupadas por Envíos, Medios de Pago, Garantías y Cotizaciones.\n"
        "• Persistencia NoSQL: Las preguntas y respuestas se obtienen en tiempo real desde la colección 'preguntas_frecuentes' de MongoDB.\n"
        "• Derivación a Ejecutivo: Incluye un botón para solicitar contacto directo con un asesor humano trasladando al usuario al formulario."
    )

    # 2.7 Panel de Administración
    doc.add_heading("2.7. Panel Administrativo Protegido por Roles (RBAC)", level=2).runs[0].font.color.rgb = C_PRIMARY
    doc.add_paragraph(
        "Accesible únicamente para usuarios con rol 'Administrador' (admin@pcnfactory.cl). Permite:\n"
        "• Gestión de Productos: Agregar nuevos componentes con fotos de Google y especificaciones, o eliminar productos obsoletos.\n"
        "• Gestión de Usuarios: Ver usuarios registrados y crear nuevos administradores asignando contraseñas cifradas con Argon2id.\n"
        "• Seguimiento de Cotizaciones: Monitorear mensajes de clientes y cambiar su estado ('Pendiente', 'En revisión', 'Respondido').\n"
        "• Redes Sociales Dinámicas: Modificar los enlaces oficiales de Instagram, WhatsApp, Facebook y LinkedIn sin alterar el código."
    )

    # ==========================================
    # SECCIÓN 3: PREGUNTAS CLAVE PARA LA DEFENSA
    # ==========================================
    doc.add_page_break()
    h3 = doc.add_heading("3. Guía de Preguntas y Respuestas para la Defensa con el Docente", level=1)
    h3.runs[0].font.color.rgb = C_NAVY

    doc.add_paragraph(
        "Para obtener la calificación máxima (100 puntos), el equipo debe dominar las siguientes respuestas técnicas "
        "ante las preguntas habituales de la comisión evaluadora:"
    )

    qa_list = [
        ("¿Cómo protegen las contraseñas en la base de datos?",
         "Las contraseñas no se almacenan jamás en texto plano. Utilizamos Argon2id (v=19), el algoritmo ganador de la Password Hashing Competition. "
         "Está configurado con 64 MB de memoria RAM y 3 iteraciones de tiempo. Esto significa que un atacante que descargue la base de datos no puede "
         "utilizar granjas de tarjetas gráficas (GPU) ni chips ASIC para descifrar las claves, ya que el requerimiento de memoria hace inviable el cálculo paralelo masivo. "
         "Además, en el modelo Usuario.js definimos 'select: false' para que el hash nunca viaje en las respuestas JSON de la API."),

        ("¿Cómo funciona la autenticación con JWT y qué contiene el token?",
         "Al hacer login exitoso, el backend genera un JSON Web Token firmado con el algoritmo simétrico HS256 y una clave secreta almacenada en variables de entorno. "
         "El payload del token únicamente almacena el ID del usuario y su rol ('Administrador' o 'Usuario registrado'), junto con una expiración de 2 horas. "
         "Cumpliendo con la rúbrica, jamás incluimos contraseñas, secretos ni datos personales sensibles dentro del token."),

        ("¿Cómo validan que un usuario sin privilegios no entre al Panel Admin?",
         "Implementamos control de acceso basado en roles (RBAC) en dos capas:\n"
         "1. En el Backend (Seguridad Real): Creamos el middleware verificarToken y requerirRol('Administrador'). Si un usuario con rol cliente intenta hacer una petición al panel, el servidor responde con código HTTP 403 Forbidden.\n"
         "2. En el Frontend (UX): La barra de navegación y las rutas condicionan la vista; solo si user.role === 'Administrador' se renderiza el botón y el componente AdminPage."),

        ("¿Cómo funciona el motor de compatibilidad de 'Arma tu PC'?",
         "El motor opera con reglas algorítmicas desacopladas en compatibilityEngine.js. Toma el objeto con los componentes seleccionados y evalúa: "
         "1) Coincidencia de string de sockets físicos (AM5, LGA1700, AM4, LGA1851); 2) Generación de memoria RAM soportada (DDR4 vs DDR5); "
         "3) Sumatoria de TDP en Watts con margen de holgura del 30% contra la potencia de la fuente; y 4) Comparación de escalas de rendimiento "
         "entre procesador y tarjeta gráfica para alertar sobre cuello de botella. Si detecta fallas, consulta el catálogo activo de MongoDB y "
         "filtra piezas sustitutas compatibles para ofrecer un cambio en 1 solo clic."),

        ("¿Cómo garantizan la seguridad DevSecOps y 0 vulnerabilidades?",
         "Contamos con un pipeline de Integración Continua en GitHub Actions (.github/workflows/ci-devsecops.yml) que ejecuta 'npm audit --audit-level=high' "
         "y pruebas unitarias automatizadas con node --test en cada commit. Tanto el backend como el frontend cuentan con 0 vulnerabilidades conocidas en sus dependencias. "
         "Adicionalmente, el servidor utiliza Helmet para cabeceras seguras (anti-clickjacking, HSTS, XSS Protection) y rate limiting para prevenir ataques de fuerza bruta."),

        ("¿Dónde y cómo está alojada la plataforma para acceso público?",
         "La aplicación cuenta con hosting de alta velocidad en FastAPI (Python 3.14 + Uvicorn) que sirve la SPA compilada de React y expone la API REST con documentación interactiva Swagger en /docs. "
         "Para la publicación en internet con HTTPS, utilizamos un túnel oficial de Cloudflare Tunnel (cloudflared), permitiendo el ingreso seguro desde cualquier teléfono o computador del mundo sin abrir puertos inseguros."),
    ]

    for q, a in qa_list:
        p_q = doc.add_paragraph()
        r_q = p_q.add_run("Pregunta: " + q)
        r_q.bold = True
        r_q.font.color.rgb = C_RED

        p_a = doc.add_paragraph()
        r_a = p_a.add_run("Respuesta Técnica Recomendada:\n")
        r_a.bold = True
        r_a.font.color.rgb = C_GREEN
        p_a.add_run(a)
        doc.add_paragraph()

    # ==========================================
    # SECCIÓN 4: CREDENCIALES Y ENLACES
    # ==========================================
    doc.add_page_break()
    h4 = doc.add_heading("4. Resumen de Enlaces Públicos y Credenciales de Acceso", level=1)
    h4.runs[0].font.color.rgb = C_NAVY

    doc.add_paragraph(
        "Información oficial para la conexión y evaluación del proyecto:"
    )

    t_links = doc.add_table(rows=1, cols=3)
    t_links.alignment = WD_TABLE_ALIGNMENT.CENTER
    thl = t_links.rows[0].cells
    thl[0].text = "Recurso / Plataforma"
    thl[1].text = "Dirección URL (HTTPS)"
    thl[2].text = "Descripción de Uso"
    for c in thl:
        set_cell_background(c, "0F172A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    link_data = [
        ("Página Web Oficial (Tienda & Builder)", "https://emily-intermediate-cosmetics-serving.trycloudflare.com", "Acceso público desde internet (móvil, tablet o PC)."),
        ("Swagger UI (FastAPI Interactive Docs)", "https://emily-intermediate-cosmetics-serving.trycloudflare.com/docs", "Consola interactiva para probar endpoints de la API."),
        ("ReDoc (Documentación OpenAPI)", "https://emily-intermediate-cosmetics-serving.trycloudflare.com/redoc", "Documentación formal de endpoints, esquemas y modelos."),
        ("Servidor Local FastAPI", "http://localhost:8000", "Hosting local de producción."),
        ("Servidor Local Node.js + Express", "http://localhost:5000", "Backend original de desarrollo en Express."),
    ]
    for r, u, d in link_data:
        row = t_links.add_row().cells
        row[0].text = r
        row[1].text = u
        row[2].text = d
        for cell in row:
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)

    doc.add_paragraph("\n")
    p_cred_title = doc.add_paragraph()
    r_ct = p_cred_title.add_run("Credenciales de Demostración:")
    r_ct.bold = True
    r_ct.font.color.rgb = C_PRIMARY

    t_cred = doc.add_table(rows=1, cols=4)
    t_cred.alignment = WD_TABLE_ALIGNMENT.CENTER
    thc = t_cred.rows[0].cells
    thc[0].text = "Rol de Usuario"
    thc[1].text = "Correo Electrónico"
    thc[2].text = "Contraseña (Argon2id)"
    thc[3].text = "Privilegios"
    for c in thc:
        set_cell_background(c, "008ECC")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.bold = True

    cred_data = [
        ("Administrador", "admin@pcnfactory.cl", "AdminPassword2026!", "Acceso total, CRUD productos, gestión de usuarios y pedidos."),
        ("Usuario Registrado", "cliente@ucsc.cl", "UserPassword2026!", "Armar PC, carrito de compras, catálogo completo."),
        ("Visitante", "Sin credenciales", "Acceso público", "Navegación general, chatbot y formulario de contacto."),
    ]
    for rol, mail, pwd, priv in cred_data:
        row = t_cred.add_row().cells
        row[0].text = rol
        row[1].text = mail
        row[2].text = pwd
        row[3].text = priv
        for cell in row:
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)

    # Guardar en docs/ y en Downloads
    doc_docs = r"c:\Users\marce\OneDrive\Desktop\trabajo_desarrollo\docs\MANUAL_Y_FUNCIONAMIENTO_PCNACTORY.docx"
    doc_downloads = r"C:\Users\marce\Downloads\MANUAL_Y_FUNCIONAMIENTO_PCNACTORY.docx"
    
    doc.save(doc_docs)
    shutil.copyfile(doc_docs, doc_downloads)
    print(f"Manual guardado en docs: {doc_docs}")
    print(f"Manual guardado en Descargas: {doc_downloads}")

if __name__ == "__main__":
    create_full_guide()
