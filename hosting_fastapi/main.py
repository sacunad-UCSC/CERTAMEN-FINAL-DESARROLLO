import random
"""
NexoPC - Servidor de Hosting y API en FastAPI (Python)
Plataforma Segura de Venta y Cotización de Hardware Gamer
"""

import os
from dotenv import load_dotenv
load_dotenv()
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import jwt
import pyotp
import mfa_security
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from cart_api import router as cart_router
import time, datetime


# Inicialización de FastAPI con metadatos Swagger
app = FastAPI(
    title="NexoPC API & Hosting Server",
    description="Servidor de Hosting y API REST de alto rendimiento en FastAPI para NexoPC (UCSC 2026).",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Configuración de CORS
app.include_router(cart_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB NoSQL
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/pc_nfactory_db")
client = MongoClient(MONGODB_URI)
db = client.get_database("pc_nfactory_db")

# Cargar catálogo con especificaciones enriquecidas desde productos.json
ENRICHED_SPECS = {}
try:
    p_json_paths = [
        os.path.join(os.path.dirname(__file__), "productos.json"),
        os.path.join(os.path.dirname(__file__), "..", "backend", "backups", "backup_2026-11-15T01-28-35-677Z", "productos.json")
    ]
    for p_path in p_json_paths:
        if os.path.exists(p_path):
            import json
            with open(p_path, "r", encoding="utf-8") as f:
                p_data = json.load(f)
                for p_item in p_data:
                    sku = p_item.get("codigoSku")
                    specs = p_item.get("especificacionesTecnicas", {})
                    if sku and specs:
                        clean_s = {k: v for k, v in specs.items() if v and str(v).strip()}
                        if clean_s:
                            ENRICHED_SPECS[sku] = clean_s
            break
    print(f"✅ Catálogo enriquecido cargado: {len(ENRICHED_SPECS)} productos con especificaciones completas.")
except Exception as e:
    print(f"Aviso al cargar especificaciones de respaldo: {e}")

@app.on_event("startup")
def on_startup():
    try:
        # Sincronizar automáticamente especificaciones completas en MongoDB Atlas si están vacías
        for sku, specs in ENRICHED_SPECS.items():
            if specs:
                db["productos"].update_one(
                    {"codigoSku": sku},
                    {"$set": {"especificacionesTecnicas": specs}}
                )
        print("✅ Especificaciones técnicas enriquecidas sincronizadas en la base de datos.")
    except Exception as e:
        print(f"Aviso en sincronización de arranque: {e}")

# Seguridad JWT y Cifrado Argon2id
JWT_SECRET = os.getenv("JWT_SECRET", "clave_secreta_jwt_ucsc_2026")
JWT_ALGORITHM = "HS256"
ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=1)

# Configuración del Servicio Transaccional de Correo (Brevo / HTTP API)
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
MAIL_FROM_EMAIL = os.getenv("MAIL_FROM_EMAIL", "nexopc@gmail.com")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "NexoPC")
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


# Modelos Pydantic
class MFAChallengeRequest(BaseModel):
    challengeToken: str

class MFAVerifyRequest(BaseModel):
    challengeToken: str
    code: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    subject: str
    message: str

class CreateUserAdminRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Administrador"

class CreateProductRequest(BaseModel):
    name: str
    category: str
    brand: str
    price: float
    originalPrice: Optional[float] = None
    stock: Optional[int] = 10
    imageUrl: str
    specs: Optional[Dict[str, Any]] = None

class UpsertSocialLinkRequest(BaseModel):
    platform: str
    url: str
    isActive: Optional[bool] = True

class OrderItem(BaseModel):
    productId: Optional[str] = ""
    name: Optional[str] = ""
    price: Optional[float] = 0
    quantity: Optional[int] = 1

class CreateOrderRequest(BaseModel):
    items: List[Dict[str, Any]]
    total: Optional[float] = 0
    paymentMethod: Optional[str] = "Webpay Plus"
    customer: Optional[Dict[str, Any]] = None
    shippingAddress: Optional[Dict[str, Any]] = None

class UpsertFaqRequest(BaseModel):
    category: str
    question: str
    answer: str

def create_jwt(user_id: str, role: str) -> str:
    payload = {
        "id": str(user_id),
        "rol": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autorización ausente o inválido")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("purpose") == "mfa":
            raise HTTPException(status_code=401, detail="Completa Google Authenticator para acceder")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado. Por favor inicia sesión nuevamente.")
    except Exception:
        raise HTTPException(status_code=401, detail="Token no válido")

# ==============================================================
# RUTAS DE API REST (/api)
# ==============================================================

@app.get("/api/health", tags=["Salud del Sistema"])
def health_check():
    return {
        "status": "online",
        "hosting": "FastAPI (Python 3.14 + Uvicorn)",
        "database": "MongoDB NoSQL (pc_nfactory_db)",
        "security": "Argon2id + JWT + CORS",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/products", tags=["Productos & Catálogo"])
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {"activo": True}
    if category:
        query["categoria"] = category
    if search:
        query["$or"] = [
            {"nombre": {"$regex": search, "$options": "i"}},
            {"marca": {"$regex": search, "$options": "i"}}
        ]
    
    cursor = db["productos"].find(query).sort("createdAt", -1)
    products = []
    for p in cursor:
        sku = p.get("codigoSku", "")
        # Priorizar especificaciones ricas y fusionar con catálogo enriquecido
        raw_db_specs = p.get("especificacionesTecnicas", {})
        clean_db_specs = {k: v for k, v in raw_db_specs.items() if v and str(v).strip()} if isinstance(raw_db_specs, dict) else {}
        fallback_specs = ENRICHED_SPECS.get(sku, {})
        # Fusionar dando prioridad a las más detalladas
        final_specs = {**fallback_specs, **clean_db_specs} if len(clean_db_specs) >= len(fallback_specs) else {**clean_db_specs, **fallback_specs}

        products.append({
            "_id": str(p["_id"]),
            "sku": sku,
            "name": p.get("nombre", ""),
            "category": p.get("categoria", ""),
            "brand": p.get("marca", ""),
            "description": p.get("descripcion", ""),
            "price": p.get("precio", 0),
            "originalPrice": p.get("precioOriginal", 0),
            "discountPercent": p.get("porcentajeDescuento", 0),
            "stock": p.get("stock", 0),
            "imageUrl": p.get("imagenUrl", ""),
            "specs": final_specs,
            "warrantyMonths": p.get("garantiaMeses", 36),
            "featured": p.get("destacado", False)
        })
    return {"success": True, "count": len(products), "products": products}

@app.post("/api/products", tags=["Productos & Catálogo"])
def create_product(data: CreateProductRequest, user_payload: dict = Depends(get_current_user)):
    sku = f"PROD-{int(time.time())}"
    doc = {
        "codigoSku": sku,
        "nombre": data.name,
        "categoria": data.category,
        "marca": data.brand,
        "descripcion": f"Componente gamer de alta gama {data.name}",
        "precio": data.price,
        "precioOriginal": data.originalPrice or data.price,
        "porcentajeDescuento": int(((data.originalPrice - data.price) / data.originalPrice * 100)) if data.originalPrice and data.originalPrice > data.price else 0,
        "stock": data.stock or 10,
        "imagenUrl": data.imageUrl,
        "especificacionesTecnicas": data.specs or {},
        "garantiaMeses": 36,
        "destacado": False,
        "activo": True,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["productos"].insert_one(doc)
    return {"success": True, "id": str(res.inserted_id), "sku": sku}

@app.delete("/api/products/{product_id}", tags=["Productos & Catálogo"])
def delete_product(product_id: str, user_payload: dict = Depends(get_current_user)):
    db["productos"].delete_one({"_id": ObjectId(product_id)})
    return {"success": True, "message": "Producto eliminado"}

# ==============================================================
# MFA GOOGLE AUTHENTICATOR (TOTP + CIFRADO AES-256-GCM)
# ==============================================================

def mfa_prompt(user):
    challenge = jwt.encode(
        {
            "id": str(user["_id"]),
            "purpose": "mfa",
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    return {
        "success": True,
        "mfaRequired": True,
        "setupRequired": not bool(user.get("mfaSecret")),
        "challengeToken": challenge
    }

def mfa_challenge_user(challenge):
    try:
        payload = jwt.decode(challenge, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("purpose") != "mfa":
            raise ValueError('Propósito incorrecto')
        user = db["usuarios"].find_one({"_id": ObjectId(payload["id"]), "activo": {"$ne": False}})
        if not user:
            raise ValueError('Usuario inactivo')
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Desafío expirado; vuelve a iniciar sesión")

def mfa_validate(user, code, encrypted_or_plain_secret):
    if user.get("mfaLockedUntil", 0) > time.time():
        raise HTTPException(status_code=429, detail="Demasiados intentos; espera cinco minutos")
    
    try:
        secret = mfa_security.decrypt(encrypted_or_plain_secret)
    except Exception:
        secret = encrypted_or_plain_secret

    delta = mfa_security.verify_delta(secret, str(code))
    current_step = int(time.time() // 30)
    valid_step = (current_step + delta) if delta is not None else None

    if valid_step is None or valid_step <= user.get("mfaLastStep", -1):
        fails = user.get("mfaFailures", 0) + 1
        db["usuarios"].update_one(
            {"_id": user["_id"]},
            {"$set": {
                "mfaFailures": 0 if fails >= 5 else fails,
                "mfaLockedUntil": time.time() + 300 if fails >= 5 else 0
            }}
        )
        raise HTTPException(status_code=401, detail="Código inválido o ya utilizado")

    db["usuarios"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "mfaLastStep": valid_step,
            "mfaFailures": 0,
            "mfaLockedUntil": 0
        }}
    )

def mfa_success(user):
    return {
        "success": True,
        "token": create_jwt(str(user["_id"]), user.get("rol", "Usuario registrado")),
        "user": {
            "id": str(user["_id"]),
            "name": user.get("nombre", ""),
            "email": user.get("correo", ""),
            "role": user.get("rol", "Usuario registrado")
        }
    }

@app.post("/api/auth/mfa/setup", tags=["Autenticación MFA"])
def mfa_setup(data: MFAChallengeRequest):
    user = mfa_challenge_user(data.challengeToken)
    if user.get("mfaSecret"):
        raise HTTPException(status_code=400, detail="Authenticator ya está activado")
    secret = pyotp.random_base32()
    enc_secret = mfa_security.encrypt(secret)
    db["usuarios"].update_one({"_id": user["_id"]}, {"$set": {"mfaPendingSecret": enc_secret}})
    otp_url = pyotp.TOTP(secret).provisioning_uri(name=user["correo"], issuer_name="NexoPC")
    return {"success": True, "secret": secret, "otpauthUrl": otp_url}

@app.post("/api/auth/mfa/confirm", tags=["Autenticación MFA"])
def mfa_confirm(data: MFAVerifyRequest):
    user = mfa_challenge_user(data.challengeToken)
    if user.get("mfaSecret") or not user.get("mfaPendingSecret"):
        raise HTTPException(status_code=400, detail="Primero inicia la vinculación MFA")
    mfa_validate(user, data.code, user["mfaPendingSecret"])
    db["usuarios"].update_one(
        {"_id": user["_id"]},
        {"$set": {"mfaSecret": user["mfaPendingSecret"]}, "$unset": {"mfaPendingSecret": ""}}
    )
    return mfa_success(user)

@app.post("/api/auth/mfa/verify", tags=["Autenticación MFA"])
def mfa_verify(data: MFAVerifyRequest):
    user = mfa_challenge_user(data.challengeToken)
    if not user.get("mfaSecret"):
        raise HTTPException(status_code=400, detail="Primero vincula Authenticator")
    mfa_validate(user, data.code, user["mfaSecret"])
    return mfa_success(user)

@app.post("/api/auth/login", tags=["Autenticación JWT & Argon2id"])
def login(data: LoginRequest):
    user = db["usuarios"].find_one({"correo": data.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    clave_guardada = user.get("clave", "")
    es_valida = False

    if clave_guardada.startswith("$argon2"):
        try:
            ph.verify(clave_guardada, data.password)
            es_valida = True
        except VerifyMismatchError:
            es_valida = False
    else:
        if clave_guardada == data.password:
            es_valida = True
            nuevo_hash = ph.hash(data.password)
            db["usuarios"].update_one({"_id": user["_id"]}, {"$set": {"clave": nuevo_hash}})

    if not es_valida:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # MFA: contraseña válida; se exige TOTP antes de emitir el token de sesión.
    return mfa_prompt(user)

@app.post("/api/auth/register", tags=["Autenticación JWT & Argon2id"])
def register(data: RegisterRequest):
    existing = db["usuarios"].find_one({"correo": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado")
    
    hash_argon2 = ph.hash(data.password)
    nuevo_doc = {
        "nombre": data.name,
        "correo": data.email.lower(),
        "clave": hash_argon2,
        "rol": "Usuario registrado",
        "activo": True,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["usuarios"].insert_one(nuevo_doc)
    nuevo_doc["_id"] = res.inserted_id
    # MFA: registro completado; se exige vincular Authenticator antes de la sesión.
    return mfa_prompt(nuevo_doc)
    existing = db["usuarios"].find_one({"correo": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado")
    
    hash_argon2 = ph.hash(data.password)
    nuevo_doc = {
        "nombre": data.name,
        "correo": data.email.lower(),
        "clave": hash_argon2,
        "rol": "Usuario registrado",
        "activo": True,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["usuarios"].insert_one(nuevo_doc)
    token = create_jwt(str(res.inserted_id), "Usuario registrado")
    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(res.inserted_id),
            "name": data.name,
            "email": data.email.lower(),
            "role": "Usuario registrado"
        }
    }

@app.post("/api/auth/change-password", tags=["Autenticación JWT & Argon2id"])
def change_password(data: ChangePasswordRequest, user_payload: dict = Depends(get_current_user)):
    user = db["usuarios"].find_one({"_id": ObjectId(user_payload["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    clave_guardada = user.get("clave", "")
    es_valida = False
    if clave_guardada.startswith("$argon2"):
        try:
            ph.verify(clave_guardada, data.currentPassword)
            es_valida = True
        except VerifyMismatchError:
            es_valida = False
    else:
        if clave_guardada == data.currentPassword:
            es_valida = True

    if not es_valida:
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")

    nuevo_hash = ph.hash(data.newPassword)
    db["usuarios"].update_one({"_id": user["_id"]}, {"$set": {"clave": nuevo_hash}})
    return {"success": True, "message": "Contraseña actualizada exitosamente con Argon2id"}

@app.get("/api/auth/me", tags=["Autenticación JWT & Argon2id"])
def get_me(user_payload: dict = Depends(get_current_user)):
    user = db["usuarios"].find_one({"_id": ObjectId(user_payload["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "name": user.get("nombre", ""),
            "email": user.get("correo", ""),
            "role": user.get("rol", "Usuario registrado")
        }
    }

@app.post("/api/contact", tags=["Contacto & Cotización"])
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
    <h2>Nueva Solicitud de Cotización / Contacto - NexoPC</h2>
    <p><strong>Cliente:</strong> {data.name}</p>
    <p><strong>Correo:</strong> {data.email}</p>
    <p><strong>Teléfono:</strong> {data.phone or 'No registrado'}</p>
    <p><strong>Asunto:</strong> {data.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #008ecc;">{data.message}</blockquote>
    <hr>
    <p style="color: #64748b; font-size: 12px;">Mensaje despachado automáticamente desde la plataforma NexoPC.</p>
    '''
    send_brevo_email(INSTITUTIONAL_EMAIL, "Coordinación UCSC", f"[Consulta Web NexoPC] {data.subject}", html_admin, reply_to=data.email)

    # 2. Correo de confirmación al cliente
    html_client = f'''
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
            <h1 style="color: #008ecc; margin: 0;">NexoPC</h1>
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
            <small style="color: #64748b;">NexoPC - Los Ángeles / Concepción, Región del Biobío, Chile.</small>
        </div>
    </div>
    '''
    send_brevo_email(data.email, data.name, f"Confirmación de Recepción: {data.subject} - NexoPC", html_client)

    return {
        "success": True,
        "message": "Consulta registrada y despachada con doble correo institucional y confirmación.",
        "id": str(res.inserted_id)
    }

@app.get("/api/contact", tags=["Contacto & Cotización"])
def get_contacts(user_payload: dict = Depends(get_current_user)):
    cursor = db["contactos"].find().sort("createdAt", -1)
    contacts = []
    for c in cursor:
        contacts.append({
            "_id": str(c["_id"]),
            "name": c.get("nombre", ""),
            "email": c.get("correo", ""),
            "subject": c.get("asunto", ""),
            "message": c.get("mensaje", ""),
            "createdAt": str(c.get("createdAt", ""))
        })
    return {"success": True, "contacts": contacts}


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
            "answer": "🛠️ ¡NexoPC cuenta con un Motor de Compatibilidad en vivo! Puedes ir a 'Arma tu PC' para elegir procesador, placa madre y tarjeta gráfica sin riesgos de incompatibilidad ni cuellos de botella.",
            "options": ["¿Qué tarjetas gráficas tienen disponibles?", "¿Tienen procesadores Ryzen 7 o Intel i9?", "Solicitar contacto con un ejecutivo"]
        }

    # 2. Primero: Consulta a FAQs de la Base de Datos NoSQL
    faqs = list(db["preguntas_frecuentes"].find({"activa": True}))
    for f in faqs:
        pregunta = f.get("pregunta", "").lower()
        palabras = f.get("palabrasClave", [])
        # Coincidencia exacta por palabras clave completas o similitud de frase
        palabras_usuario = set(q.replace('?', '').replace('¿', '').split())
        palabras_clave_set = set([p.lower() for p in palabras])
        
        # Debe coincidir al menos una palabra clave exacta o la pregunta
        tiene_palabra_clave = bool(palabras_usuario.intersection(palabras_clave_set))
        if tiene_palabra_clave or (len(pregunta) > 8 and (pregunta in q or q in pregunta)):
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

    # 3. Búsqueda y Recomendación de Productos en Catálogo MongoDB (Sales Agent Catalog Search)
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
            items_list = [f"• {p.get('nombre')} - ${int(p.get('precio', 0)):,} CLP (Stock: {p.get('stock', 0)} un.)" for p in found]
            items_text = '\n'.join(items_list)
            res_msg = f"🚀 He encontrado estos componentes en nuestro inventario:\n\n{items_text}\n\nPuedes pulsar 'Ver Detalle' o agregarlo a tu ensamble."
            return {
                "success": True,
                "answer": res_msg,
                "options": [
                    "¿Tiempos de despacho a regiones?",
                    "¿Qué garantía tienen los productos?",
                    "Arma tu PC",
                    "Solicitar contacto con un ejecutivo"
                ]
            }



    # 4. Asistencia de Ventas por Defecto
    return {
        "success": True,
        "answer": "Soy tu Asistente de Ventas y Hardware de NexoPC. Puedo ayudarte a buscar tarjetas gráficas RTX/Radeon, procesadores Ryzen/Intel, verificar compatibilidad en 'Arma tu PC' o responder sobre garantías y despachos.",
        "options": [
            "¿Qué garantía tienen las GPUs?",
            "¿Tiempos de despacho a regiones?",
            "¿Cuáles son los métodos de pago?",
            "Solicitar contacto con un ejecutivo"
        ]
    }

@app.get("/api/chatbot/faqs", tags=["Chatbot Inteligente"])
def get_chatbot_faqs():
    cursor = db["preguntas_frecuentes"].find({"activa": True})
    faqs = []
    for f in cursor:
        faqs.append({
            "_id": str(f["_id"]),
            "category": f.get("categoria", ""),
            "question": f.get("pregunta", ""),
            "answer": f.get("respuesta", "")
        })
    return {"success": True, "faqs": faqs}

@app.get("/api/admin/faqs", tags=["Chatbot Inteligente"])
def get_all_faqs_admin(user_payload: dict = Depends(get_current_user)):
    cursor = db["preguntas_frecuentes"].find()
    faqs = []
    for f in cursor:
        faqs.append({
            "_id": str(f["_id"]),
            "category": f.get("categoria", "General"),
            "question": f.get("pregunta", ""),
            "answer": f.get("respuesta", ""),
            "isActive": f.get("activa", True)
        })
    return {"success": True, "faqs": faqs}

@app.post("/api/admin/faqs", tags=["Chatbot Inteligente"])
def upsert_faq(data: UpsertFaqRequest, user_payload: dict = Depends(get_current_user)):
    doc = {
        "categoria": data.category,
        "pregunta": data.question,
        "respuesta": data.answer,
        "activa": True,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["preguntas_frecuentes"].insert_one(doc)
    return {"success": True, "id": str(res.inserted_id)}

@app.delete("/api/admin/faqs/{faq_id}", tags=["Chatbot Inteligente"])
def delete_faq(faq_id: str, user_payload: dict = Depends(get_current_user)):
    db["preguntas_frecuentes"].delete_one({"_id": ObjectId(faq_id)})
    return {"success": True, "message": "FAQ eliminada"}

@app.get("/api/social-links/public", tags=["Redes Sociales"])
def get_social_links():
    cursor = db["redes_sociales"].find({"activa": True})
    links = []
    for r in cursor:
        links.append({
            "_id": str(r["_id"]),
            "platform": r.get("plataforma", ""),
            "url": r.get("enlaceUrl", ""),
            "isActive": r.get("activa", True)
        })
    return {"success": True, "links": links}

@app.get("/api/admin/social-links", tags=["Redes Sociales"])
def get_all_social_links_admin(user_payload: dict = Depends(get_current_user)):
    cursor = db["redes_sociales"].find()
    links = []
    for r in cursor:
        links.append({
            "_id": str(r["_id"]),
            "platform": r.get("plataforma", ""),
            "url": r.get("enlaceUrl", ""),
            "isActive": r.get("activa", True)
        })
    return {"success": True, "links": links}

@app.post("/api/admin/social-links", tags=["Redes Sociales"])
def upsert_social_link(data: UpsertSocialLinkRequest, user_payload: dict = Depends(get_current_user)):
    db["redes_sociales"].update_one(
        {"plataforma": data.platform},
        {"$set": {"plataforma": data.platform, "enlaceUrl": data.url, "activa": data.isActive}},
        upsert=True
    )
    return {"success": True, "message": "Red social actualizada"}

@app.get("/api/admin/users", tags=["Administración"])
def get_admin_users(user_payload: dict = Depends(get_current_user)):
    cursor = db["usuarios"].find({}, {"clave": 0}).sort("createdAt", -1)
    users = []
    for u in cursor:
        users.append({
            "_id": str(u["_id"]),
            "name": u.get("nombre", ""),
            "email": u.get("correo", ""),
            "role": u.get("rol", "Usuario registrado"),
            "isActive": u.get("activo", True)
        })
    return {"success": True, "users": users}

@app.post("/api/admin/users", tags=["Administración"])
def create_admin_user(data: CreateUserAdminRequest, user_payload: dict = Depends(get_current_user)):
    existing = db["usuarios"].find_one({"correo": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    hash_p = ph.hash(data.password)
    res = db["usuarios"].insert_one({
        "nombre": data.name,
        "correo": data.email.lower(),
        "clave": hash_p,
        "rol": data.role or "Administrador",
        "activo": True,
        "createdAt": datetime.datetime.utcnow().isoformat()
    })
    return {"success": True, "id": str(res.inserted_id)}

@app.post("/api/orders", tags=["Pedidos"])
def create_order_endpoint(data: CreateOrderRequest, request: Request):
    user_id = None
    user_email = ""
    user_name = ""

    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = ObjectId(payload["id"])
            user_doc = db["usuarios"].find_one({"_id": user_id})
            if user_doc:
                user_email = user_doc.get("correo", "").lower()
                user_name = user_doc.get("nombre", "")
        except Exception as e:
            print(f"Aviso decodificando token en pedido: {e}")

    # Si vino customer en el payload, complementar datos
    if data.customer:
        if not user_email:
            user_email = (data.customer.get("email") or data.customer.get("correo") or "").lower()
        if not user_name:
            user_name = data.customer.get("name") or data.customer.get("nombre") or ""

    order_num = f"PED-{int(time.time())}"
    track_num = f"CHX-{random.randint(100000, 999999)}"

    # Procesar items
    items_db = []
    subtotal = 0
    for it in data.items:
        p_name = it.get("name") or it.get("nombre") or "Componente Gamer"
        p_price = float(it.get("price") or it.get("precio") or 0)
        p_qty = int(it.get("quantity") or it.get("cantidad") or 1)
        st = p_price * p_qty
        subtotal += st
        items_db.append({
            "productId": str(it.get("productId") or it.get("_id") or ""),
            "nombre": p_name,
            "name": p_name,
            "precio": p_price,
            "price": p_price,
            "cantidad": p_qty,
            "quantity": p_qty,
            "subtotal": st
        })

    final_total = data.total if data.total and data.total > 0 else subtotal

    order_doc = {
        "numeroPedido": order_num,
        "orderNumber": order_num,
        "usuario": user_id,
        "usuarioId": str(user_id) if user_id else None,
        "cliente": {
            "nombre": user_name or "Cliente NexoPC",
            "name": user_name or "Cliente NexoPC",
            "correo": user_email or "cliente@pcnfactory.cl",
            "email": user_email or "cliente@pcnfactory.cl",
            "telefono": data.customer.get("phone", "+56987654321") if data.customer else "+56987654321"
        },
        "customer": {
            "name": user_name or "Cliente NexoPC",
            "email": user_email or "cliente@pcnfactory.cl"
        },
        "direccionDespacho": data.shippingAddress or {"calle": "Av. Paicaví 3280", "ciudad": "Concepción", "region": "Biobío"},
        "items": items_db,
        "metodoPago": data.paymentMethod or "Webpay Plus (Débito/Crédito)",
        "estadoPago": "Pagado",
        "estadoPedido": "En Preparación",
        "orderStatus": "En Preparación",
        "total": final_total,
        "numeroSeguimiento": track_num,
        "empresaTransporte": "Chilexpress",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["pedidos"].insert_one(order_doc)
    return {
        "success": True,
        "id": str(res.inserted_id),
        "orderNumber": order_num,
        "trackingNumber": track_num
    }

@app.get("/api/orders", tags=["Pedidos"])
def get_orders(user_payload: dict = Depends(get_current_user)):
    cursor = db["pedidos"].find().sort("createdAt", -1)
    orders = []
    for o in cursor:
        orders.append({
            "_id": str(o["_id"]),
            "orderNumber": o.get("numeroPedido", "") or o.get("orderNumber", ""),
            "customer": o.get("cliente", {}),
            "shippingAddress": o.get("direccionDespacho", {}),
            "orderStatus": o.get("estadoPedido", "En Preparación"),
            "total": o.get("total", 0),
            "trackingNumber": o.get("numeroSeguimiento", "CHX-654321"),
            "items": o.get("items", []),
            "createdAt": str(o.get("createdAt", ""))
        })
    return {"success": True, "orders": orders}

@app.get("/api/orders/my-orders", tags=["Pedidos"])
def get_my_orders(user_payload: dict = Depends(get_current_user)):
    user_id = ObjectId(user_payload["id"])
    user = db["usuarios"].find_one({"_id": user_id})
    user_email = user.get("correo", "").lower() if user else ""
    
    query = {
        "$or": [
            {"usuario": user_id},
            {"usuario": str(user_id)},
            {"usuarioId": str(user_id)},
            {"cliente.correo": {"$regex": f"^{user_email}$", "$options": "i"}},
            {"cliente.email": {"$regex": f"^{user_email}$", "$options": "i"}},
            {"customer.email": {"$regex": f"^{user_email}$", "$options": "i"}},
            {"customer.correo": {"$regex": f"^{user_email}$", "$options": "i"}}
        ]
    }
    cursor = db["pedidos"].find(query).sort("createdAt", -1)
    orders = []
    for o in cursor:
        orders.append({
            "_id": str(o["_id"]),
            "orderNumber": o.get("numeroPedido", "") or o.get("orderNumber", ""),
            "numeroPedido": o.get("numeroPedido", "") or o.get("orderNumber", ""),
            "orderStatus": o.get("estadoPedido", "En Preparación"),
            "estadoPedido": o.get("estadoPedido", "En Preparación"),
            "total": o.get("total", 0),
            "trackingNumber": o.get("numeroSeguimiento", "CHX-654321"),
            "numeroSeguimiento": o.get("numeroSeguimiento", "CHX-654321"),
            "empresaTransporte": o.get("empresaTransporte", "Chilexpress"),
            "items": o.get("items", []),
            "createdAt": str(o.get("createdAt", ""))
        })
    return {"success": True, "orders": orders}

# ==============================================================
# HOSTING DE LA APLICACIÓN WEB FRONTEND (REACT + VITE SPA)
# ==============================================================

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/logo.png")
    def get_logo():
        logo_path = os.path.join(FRONTEND_DIST, "logo.png")
        if os.path.exists(logo_path):
            return FileResponse(logo_path)
        return FileResponse(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "logo.png"))

    @app.head("/", include_in_schema=False)
    @app.head("/{full_path:path}", include_in_schema=False)
    def head_check(full_path: str = ""):
        return JSONResponse(status_code=200, content={"status": "ok"})

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_path = os.path.join(FRONTEND_DIST, "index.html")
        return FileResponse(index_path)
else:
    @app.get("/")
    def index_fallback():
        return {"message": "NexoPC FastAPI Server Activo. Ejecuta 'npm run build' en frontend para hospedar la SPA."}
