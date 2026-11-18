# 🛒 NexoPC - Plataforma Segura de Venta de Componentes de PC
### Certamen Práctico Integrador | Desarrollo Web Seguro, DevOps y DevSecOps (UCSC)

---

## 👥 Equipo de Desarrollo (Integrantes)
1. **Marcelo Oyanedel**
2. **Sebastián Acuña**
3. **Benjamín Baeza**
4. **Ricardo Tapia**

---

## 📌 1. Descripción del Proyecto y Caso de Negocio
**PCStore** es una plataforma web empresarial diseñada para la presentación, cotización y comercialización de componentes de hardware y computación de alto rendimiento en Chile (GPUs RTX serie 4000, CPUs AMD Ryzen, Placas Madre AM5, Memorias RAM DDR5 y Almacenamiento NVMe Gen4).

La plataforma resuelve la necesidad de los usuarios de cotizar configuraciones personalizadas de hardware y consultar dudas técnicas, proporcionando a la organización un sistema centralizado y seguro para administrar el catálogo, pedidos y mensajes de clientes.

---

## 🏗️ 2. Arquitectura de la Solución
- **Frontend**: Single Page Application (SPA) responsiva desarrollada en **React + Vite** con diseño moderno retail de tecnología.
- **Backend**: API REST construida con **Node.js + Express** organizada bajo el patrón arquitectónico Controlador-Modelo-Ruta.
- **Base de Datos NoSQL**: **MongoDB** administrado mediante **Mongoose** con validación de esquemas e índices optimizados.
- **Autenticación & Autorización**: Basada en **JSON Web Tokens (JWT)** con control de acceso basado en roles (**RBAC**).
- **Seguridad en Contraseñas**: Cifrado irreversible mediante **bcryptjs** con salt rounds = 12.
- **Mecanismo de Comunicación**: Formulario protegido con rate-limiting y envío de doble correo transaccional (**Nodemailer**):
  1. Notificación al buzón institucional de la empresa.
  2. Confirmación inmediata al correo del cliente.
- **Chatbot Integrado**: Widget flotante interactivo con gestión de preguntas frecuentes (FAQ) administrables desde MongoDB.

---

## 👥 3. Roles y Control de Acceso (RBAC)
| Rol | Permisos | Credenciales de Prueba |
| :--- | :--- | :--- |
| **Administrador** | Gestión de productos (CRUD), visualización de cotizaciones, administración de usuarios y configuración de redes sociales. | `admin@pcstore.cl` / `AdminPassword2026!` |
| **Usuario Registrado** | Navegación, compra y cotización de componentes, perfil de usuario. | `cliente@ucsc.cl` / `UserPassword2026!` |
| **Visitante** | Explorar catálogo público, interactuar con el chatbot y enviar consultas de cotización. | Sin credenciales |

---

## 🛡️ 4. Prácticas DevSecOps y Seguridad Aplicada
1. **Protección de Cabeceras HTTP**: Implementación de `helmet` para configurar CSP, HSTS, X-Content-Type-Options y anti-clickjacking.
2. **Control de Acceso Cruzado (CORS)**: Restricción estricta a orígenes autorizados.
3. **Mitigación de DoS y Fuerza Bruta**: `express-rate-limit` global y específico en endpoints de autenticación, contacto y chatbot.
4. **Protección contra Inyecciones**: Validación de esquemas en servidor mediante `express-validator` y consultas parametrizadas con Mongoose.
5. **Protección de Datos Sensibles**: Las contraseñas se excluyen por defecto en las consultas (`select: false`), evitando que viajen en respuestas JSON.
6. **Auditoría SCA Continua**: Pipeline automatizado con `npm audit` que bloquea despliegues ante vulnerabilidades altas o críticas.

---

## 🚀 5. Instrucciones para Ejecución Local

### Prerrequisitos
- Node.js (v18+)
- MongoDB en ejecución local o URI de MongoDB Atlas

### 1. Iniciar el Backend
```bash
cd backend
npm install
# Cargar datos de prueba iniciales (Productos, Admin, FAQs, Redes)
node src/seed.js
# Iniciar servidor
npm run dev
```
El backend quedará escuchando en `http://localhost:5000`.

### 2. Iniciar el Frontend
```bash
cd ../frontend
npm install
npm run dev
```
La aplicación web se abrirá en `http://localhost:5173`.

---

## ☁️ 6. Variables de Entorno Requeridas (.env)

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://tu-tienda.vercel.app
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/pcstore
JWT_SECRET=clave_secreta_jwt_ucsc_2026
JWT_EXPIRES_IN=2h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notificaciones@pcstore.cl
SMTP_PASS=tu_app_password
INSTITUTIONAL_EMAIL=contacto@pcstore.cl
```
