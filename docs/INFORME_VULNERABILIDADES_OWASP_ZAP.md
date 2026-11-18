# 🛡️ Informe de Análisis de Seguridad DAST & DevSecOps (OWASP ZAP / SCA)
### Plataforma Web Segura NexoPC — Certamen Práctico Integrador
**Universidad Católica de la Santísima Concepción (UCSC) · 2026**

---

## 👥 Equipo de Desarrollo
- **Marcelo Oyanedel**
- **Sebastián Acuña**
- **Benjamín Baeza**
- **Ricardo Tapia**

---

## 🎯 1. Resumen Ejecutivo y Metodología
En cumplimiento de los requerimientos DevSecOps del certamen, se ejecutó un ciclo completo de análisis de vulnerabilidades sobre la plataforma **NexoPC** combinando:
1. **DAST (Dynamic Application Security Testing):** Escaneo dinámico automatizado y manual con **OWASP ZAP (Zed Attack Proxy)** sobre los endpoints de la API REST y el frontend en producción (`https://nexopc.onrender.com`).
2. **SCA (Software Composition Analysis):** Auditoría estática de dependencias con `npm audit` en entornos Node.js y análisis de paquetes de Python en FastAPI.
3. **Control de Acceso & Autenticación:** Verificación de RBAC (Role-Based Access Control) y autenticación multifactor TOTP (**Google Authenticator**).

---

## 📊 2. Tabla Comparativa de Hallazgos (Antes vs. Después)

| ID | Vulnerabilidad / Riesgo Detectado | Herramienta | Riesgo Inicial | Corrección Técnica Implementada | Estado Verificado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **Exposición de Secretos MFA en Base de Datos**<br>El secreto TOTP generado se almacenaba en texto claro en MongoDB. | Auditoría de Código / DAST | **ALTO (High)** | Cifrado simétrico autenticado **AES-256-GCM** con vector de inicialización único (IV) derivado de `MFA_ENCRYPTION_KEY`. | ✅ **CORREGIDO**<br>(0 fugas en DB) |
| **SEC-02** | **Acceso a Rutas Privadas con Token Temporal**<br>Tokens con propósito `mfa` podían consultar datos protegidos antes de ingresar el código de 6 dígitos. | OWASP ZAP (Bypass Auth) | **CRÍTICO (Critical)** | Verificación estricta en middleware (`protect` en Express y `get_current_user` en FastAPI): se rechazan tokens con `purpose == 'mfa'`. | ✅ **CORREGIDO**<br>(HTTP 401 forzado) |
| **SEC-03** | **Fuerza Bruta en Códigos TOTP (Replay Attack)**<br>Posibilidad de reutilizar el mismo código de 6 dígitos dentro de la ventana de 30 segundos. | OWASP ZAP (Fuzzing) | **MEDIO (Medium)** | Control anti-replay con seguimiento de paso temporal (`mfaLastStep`) y bloqueo temporal de 5 minutos tras 5 intentos fallidos consecutivos (`mfaLockedUntil`). | ✅ **CORREGIDO**<br>(Rate-limit activo) |
| **SEC-04** | **Cabeceras de Seguridad Faltantes (Clickjacking / MIME)**<br>Ausencia de `X-Frame-Options`, `X-Content-Type-Options` y directivas de cabeceras seguras. | OWASP ZAP (Passive Scan) | **MEDIO (Medium)** | Inyección de cabeceras de protección HTTP (CORS restringido, sanitización de entradas, `nosniff`, `SAMEORIGIN`). | ✅ **CORREGIDO**<br>(Headers activos) |
| **SEC-05** | **Almacenamiento de Contraseñas Débiles**<br>Riesgo de ataques por diccionario si se utilizan funciones hash tradicionales sin costo computacional. | Revisión Estática / SAST | **ALTO (High)** | Hashes criptográficos de última generación mediante **Argon2id** (memoria 64MB, tiempo 3 iteraciones) y **bcrypt** con salt rounds = 12. | ✅ **CORREGIDO**<br>(Hash irreversible) |
| **SEC-06** | **Denegación de Servicio en Formulario de Contacto / Spam**<br>Riesgo de saturación del buzón institucional mediante envíos masivos automatizados. | OWASP ZAP (Stress Test) | **MEDIO (Medium)** | Limitación de frecuencia de peticiones (*Rate Limiting* en Express/FastAPI), normalización de campos y validación estricta de formato RFC 5322. | ✅ **CORREGIDO**<br>(Protegido) |
| **SEC-07** | **Dependencias Vulnerables de Terceros**<br>Potenciales fallas conocidas en dependencias de Node.js en backend. | `npm audit` (SCA) | **VARIABLE** | Depuración y actualización de árbol de dependencias en `backend/package.json`. | ✅ **CORREGIDO**<br>(`found 0 vulnerabilities`) |

---

## 🔬 3. Detalle de Pruebas de Demostración (Defensa Técnica)

### Escenario 1: Control de Acceso y Roles (RBAC)
- **Prueba:** Intentar consultar `/api/admin/users` o `/api/admin/social-links` con un token emitido para `Usuario registrado` o sin token.
- **Resultado:** Respuesta HTTP **401 Unauthorized** (sin token) o HTTP **403 Forbidden** (sin permisos de Administrador).

### Escenario 2: Protección MFA / Google Authenticator
- **Prueba:** Completar credenciales correctas (correo y clave) e intentar usar el token de desafío `challengeToken` para crear un producto en `/api/products`.
- **Resultado:** La API bloquea el acceso con mensaje *"Completa Google Authenticator para acceder"*. El acceso solo se habilita al ingresar el código TOTP válido generado en la app móvil.

### Escenario 3: Trazabilidad y Auditoría
- **Prueba:** Intentos de inicio de sesión fallidos registran automáticamente la IP y correo del remitente en la colección `registros_auditoria` de MongoDB.

---

## 📈 4. Conclusión DevSecOps
El ciclo iterativo de escaneo, remediación técnica y verificación posterior redujo la superficie de ataque a **0 vulnerabilidades de severidad Alta o Crítica**, garantizando que la plataforma **NexoPC** cumple cabalmente con los estándares de seguridad requeridos por la rúbrica del certamen.
