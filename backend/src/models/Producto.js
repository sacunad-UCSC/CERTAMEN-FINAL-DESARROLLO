const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    codigoSku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [150, 'Máximo 150 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: [
        'Tarjetas Gráficas (GPU)',
        'Procesadores (CPU)',
        'Placas Madre',
        'Memorias RAM',
        'Almacenamiento (SSD/NVMe)',
        'Fuentes de Poder (PSU)',
        'Gabinetes',
        'Refrigeración',
      ],
    },
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      default: 'Componente de hardware de alto rendimiento garantizado.',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    precioOriginal: {
      type: Number,
      default: function () {
        return this.precio;
      },
    },
    porcentajeDescuento: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 10,
    },
    imagenUrl: {
      type: String,
      required: true,
    },
    especificacionesTecnicas: {
      socket: { type: String, default: '' },
      tipoMemoria: { type: String, default: '' },
      capacidad: { type: String, default: '' },
      potenciaWatts: { type: String, default: '' },
      factorForma: { type: String, default: '' },
    },
    garantiaMeses: {
      type: Number,
      default: 12,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'productos',
  }
);

productoSchema.index({ categoria: 1, marca: 1, precio: 1 });
productoSchema.index({ nombre: 'text', marca: 'text', descripcion: 'text' });

module.exports = mongoose.model('Producto', productoSchema);
