const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'Máximo 100 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo inválido'],
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: [20, 'Máximo 20 caracteres'],
      default: '',
    },
    asunto: {
      type: String,
      required: [true, 'El asunto es obligatorio'],
      trim: true,
      maxlength: [150, 'Máximo 150 caracteres'],
    },
    mensaje: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true,
      maxlength: [1000, 'Máximo 1000 caracteres'],
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Respondida', 'Cerrada'],
      default: 'Pendiente',
    },
    estadoEnvioCorreo: {
      notificacionAdmin: { type: Boolean, default: false },
      confirmacionCliente: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    collection: 'contactos',
  }
);

module.exports = mongoose.model('Contacto', contactoSchema);
