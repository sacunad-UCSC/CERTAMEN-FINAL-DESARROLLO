import re

main_path = "/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py"
code = open(main_path, "r", encoding="utf-8").read()

brevo_code = """
# Configuración del Servicio Transaccional de Correo (Brevo / HTTP API)
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
MAIL_FROM_EMAIL = os.getenv("MAIL_FROM_EMAIL", "pcnactory@gmail.com")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "PcÑactory")
INSTITUTIONAL_EMAIL = os.getenv("INSTITUTIONAL_EMAIL", "rtapiae@it.ucsc.cl")

def send_brevo_email(to_email: str, to_name: str, subject: str, html_content: str, reply_to: Optional[str] = None):
    try:
        import urllib.request
        import json
        payload = {
            "sender": {"name": MAIL_FROM_NAME, "email": MAIL_FROM_EMAIL},
            "to": [{"email": to_email, "name": to_name or to_email}],
            "subject": subject,
            "htmlContent": html_content
        }
        if reply_to:
            payload["replyTo"] = {"email": reply_to}
        
        req = urllib.request.Request(
            "https://api.brevo.com/v3/smtp/email",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": BREVO_API_KEY
            }
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            return True
    except Exception as e:
        print(f"[Brevo Error enviando a {to_email}]: {e}")
        return False
"""

contact_endpoint = """@app.post("/api/contact", tags=["Contacto & Cotización"])
def submit_contact(data: ContactRequest):
    doc = {
        "nombre": data.name,
        "correo": data.email.lower(),
        "telefono": data.phone,
        "asunto": data.subject,
        "mensaje": data.message,
        "estado": "Pendiente",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["contactos"].insert_one(doc)

    # Doble despacho de correos en tiempo real
    # 1. Correo al buzón institucional (UCSC)
    html_admin = f'''
    <h2>Nueva Solicitud de Cotización / Contacto - PcÑactory</h2>
    <p><strong>Cliente:</strong> {data.name}</p>
    <p><strong>Correo:</strong> {data.email}</p>
    <p><strong>Teléfono:</strong> {data.phone or 'No registrado'}</p>
    <p><strong>Asunto:</strong> {data.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #008ecc;">{data.message}</blockquote>
    <hr>
    <p style="color: #64748b; font-size: 12px;">Mensaje despachado automáticamente desde la plataforma PcÑactory.</p>
    '''
    send_brevo_email(INSTITUTIONAL_EMAIL, "Coordinación UCSC", f"[Consulta Web PcÑactory] {data.subject}", html_admin, reply_to=data.email)

    # 2. Correo de confirmación al cliente
    html_client = f'''
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
            <h1 style="color: #008ecc; margin: 0;">PcÑactory</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Confirmación de Recepción de Solicitud</p>
        </div>
        <div style="padding: 24px; color: #334155;">
            <h3>¡Hola {data.name}!</h3>
            <p>Hemos recibido tu consulta o solicitud de cotización con el asunto: <strong>"{data.subject}"</strong>.</p>
            <p>Un ejecutivo de hardware gamer revisará tus requerimientos y se pondrá en contacto contigo a la brevedad posible.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p><strong>Copia de tu mensaje enviado:</strong></p>
            <p style="background: #f8fafc; padding: 12px; border-radius: 8px; font-style: italic;">{data.message}</p>
            <br>
            <small style="color: #64748b;">PcÑactory - Los Ángeles / Concepción, Región del Biobío, Chile.</small>
        </div>
    </div>
    '''
    send_brevo_email(data.email, data.name, f"Confirmación de Recepción: {data.subject} - PcÑactory", html_client)

    return {
        "success": True,
        "message": "Consulta registrada y despachada con doble correo institucional y confirmación.",
        "id": str(res.inserted_id)
    }"""

if "def send_brevo_email" not in code:
    code = code.replace("ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=1)", "ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=1)\n" + brevo_code)

# Reemplazar la función submit_contact existente
pattern = r'@app\.post\(\"/api/contact\", tags=\[\"Contacto & Cotización\"\]\).*?return \{\s*\"success\": True,\s*\"message\":[^\}]*\}'
code = re.sub(pattern, contact_endpoint, code, flags=re.DOTALL)

open(main_path, "w", encoding="utf-8").write(code)
print("¡FastAPI main.py actualizado con el doble correo Brevo!")
