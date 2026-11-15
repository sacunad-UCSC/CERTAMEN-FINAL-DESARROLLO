const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  nombre: { type: String, required: true },
  imagenUrl: { type: String },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true, min: [1, 'Mínimo 1 unidad'] },
  subtotal: { type: Number, required: true },
});

const pedidoSchema = new mongoose.Schema(
  {
    numeroPedido: {
      type: String,
      required: true,
      unique: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
    },
    cliente: {
      nombre: { type: String, required: true, trim: true },
      correo: { type: String, required: true, trim: true, lowercase: true },
      telefono: { type: String, required: true, trim: true },
      rut: { type: String, trim: true },
    },
    direccionDespacho: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
      region: { type: String, required: true, default: 'Región del Biobío' },
      codigoPostal: { type: String, default: '' },
    },
    items: [itemPedidoSchema],
    metodoPago: {
      type: String,
      enum: ['Webpay Plus (Débito/Crédito)', 'Transferencia Bancaria', 'Mercado Pago'],
      default: 'Webpay Plus (Débito/Crédito)',
    },
    estadoPago: {
      type: String,
      enum: ['Pendiente', 'Pagado', 'Rechazado', 'Reembolsado'],
      default: 'Pendiente',
    },
    estadoPedido: {
      type: String,
      enum: ['Recibido', 'En Preparación', 'Despachado', 'Entregado', 'Cancelado'],
      default: 'Recibido',
    },
    subtotal: { type: Number, required: true, min: 0 },
    costoEnvio: { type: Number, required: true, default: 0 },
    descuento: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    numeroSeguimiento: { type: String, default: '' },
    empresaTransporte: {
      type: String,
      enum: ['Chilexpress', 'Starken', 'Blue Express', 'Retiro en Tienda'],
      default: 'Chilexpress',
    },
    correoEnviado: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'pedidos',
  }
);

pedidoSchema.index({ 'cliente.correo': 1 });
pedidoSchema.index({ estadoPedido: 1, createdAt: -1 });

module.exports = mongoose.model('Pedido', pedidoSchema);
