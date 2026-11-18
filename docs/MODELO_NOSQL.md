# 📊 Modelo de Base de Datos NoSQL en Español (MongoDB) - NexoPC
### Certamen Práctico Integrador | UCSC 2026

Toda la base de datos ha sido reestructurada en **idioma español** tanto a nivel de colecciones físicas como de campos y subdocumentos.

---

## 🗂️ 1. Colecciones en Español (MongoDB: `pc_nfactory_db`)

| Colección | Descripción | Campos Clave en Español |
| :--- | :--- | :--- |
| **`productos`** | Catálogo de componentes y fichas técnicas | `codigoSku`, `nombre`, `categoria`, `marca`, `precio`, `precioOriginal`, `porcentajeDescuento`, `stock`, `imagenUrl`, `especificacionesTecnicas`, `garantiaMeses`, `destacado`. |
| **`pedidos`** | Compras y despachos del e-commerce | `numeroPedido`, `cliente` (nombre, correo, telefono, rut), `direccionDespacho` (calle, ciudad, region), `items`, `metodoPago`, `estadoPago`, `estadoPedido`, `subtotal`, `costoEnvio`, `total`, `numeroSeguimiento`, `empresaTransporte`. |
| **`usuarios`** | Identidades y control de acceso (RBAC) | `nombre`, `correo`, `clave` (hash bcrypt), `rol` ('Administrador' / 'Usuario registrado'), `telefono`, `rut`, `direcciones`. |
| **`contactos`** | Cotizaciones y mensajes recibidos | `nombre`, `correo`, `telefono`, `asunto`, `mensaje`, `estado`, `estadoEnvioCorreo` (notificacionAdmin, confirmacionCliente). |
| **`preguntas_frecuentes`** | Conocimiento del Chatbot | `categoria`, `pregunta`, `palabrasClave`, `respuesta`, `activa`. |
| **`redes_sociales`** | Enlaces oficiales editables desde el panel | `plataforma`, `enlaceUrl`, `activa`. |
| **`registros_auditoria`**| Trazabilidad de seguridad DevSecOps | `accion` ('INGRESO_EXITOSO', 'INGRESO_FALLIDO', etc.), `realizadoPor`, `direccionIp`, `detalles`. |

---

## 📐 2. Ejemplos de Documentos JSON

### Documento en `productos`:
```json
{
  "_id": "ObjectId('67364fa1e2b5c01...')",
  "codigoSku": "GPU-RTX-4070S-ASUS",
  "nombre": "ASUS Dual GeForce RTX 4070 Super 12GB GDDR6X",
  "categoria": "Tarjetas Gráficas (GPU)",
  "marca": "ASUS",
  "precio": 689990,
  "precioOriginal": 799990,
  "porcentajeDescuento": 14,
  "stock": 12,
  "imagenUrl": "https://images.unsplash.com/...",
  "especificacionesTecnicas": {
    "tipoMemoria": "GDDR6X 12GB",
    "potenciaWatts": "220W",
    "factorForma": "2.5 Ranuras"
  },
  "garantiaMeses": 36,
  "destacado": true
}
```

### Documento en `pedidos`:
```json
{
  "_id": "ObjectId('673650b2e2b5c02...')",
  "numeroPedido": "PED-2026-98124",
  "cliente": {
    "nombre": "Juan Pérez",
    "correo": "cliente@ucsc.cl",
    "telefono": "+56987654321",
    "rut": "19.876.543-2"
  },
  "direccionDespacho": {
    "calle": "Av. Paicaví 3000, Depto 402",
    "ciudad": "Concepción",
    "region": "Región del Biobío"
  },
  "items": [
    {
      "nombre": "ASUS Dual GeForce RTX 4070 Super 12GB",
      "precio": 689990,
      "cantidad": 1,
      "subtotal": 689990
    }
  ],
  "metodoPago": "Webpay Plus (Débito/Crédito)",
  "estadoPago": "Pagado",
  "estadoPedido": "En Preparación",
  "total": 689990,
  "numeroSeguimiento": "CHX-847291",
  "empresaTransporte": "Chilexpress",
  "correoEnviado": true
}
```

### Documento en `usuarios`:
```json
{
  "_id": "ObjectId('67364eb0e2b5c00...')",
  "nombre": "Administrador UCSC",
  "correo": "admin@nexopc.cl",
  "clave": "$2a$12$Z1x... (Hash seguro con salt 12)",
  "rol": "Administrador",
  "telefono": "+56912345678",
  "activo": true
}
```
