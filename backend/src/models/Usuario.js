const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  ciudad: { type: String, required: true },
  region: { type: String, default: 'Región del Biobío' },
  codigoPostal: { type: String, default: '' },
  esPredeterminada: { type: Boolean, default: false },
});

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido'],
    },
    telefono: {
      type: String,
      default: '',
    },
    rut: {
      type: String,
      default: '',
    },
    clave: {
      type: String,
      required: [true, 'La clave es obligatoria'],
      minlength: [6, 'La clave debe tener al menos 6 caracteres'],
      select: false, // DevSecOps: exclusión de contraseña por defecto
    },
    rol: {
      type: String,
      enum: ['Administrador', 'Usuario registrado'],
      default: 'Usuario registrado',
    },
    direcciones: [direccionSchema],
    activo: {
      type: Boolean,
      default: true,
    },
    // MFA fields
    mfaSecret: { type: String, default: '' },
    mfaPendingSecret: { type: String, default: '' },
    mfaLastStep: { type: String, enum: ['setup', 'confirm', 'verify', null], default: null },
    mfaFailures: { type: Number, default: 0 },
    mfaLockedUntil: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'usuarios',
  }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('clave')) return next();
  const argon2 = require('argon2');
  // Cifrado de última generación con Argon2id (Requisito DevSecOps & Rúbrica)
  this.clave = await argon2.hash(this.clave, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB de memoria
    timeCost: 3,         // 3 iteraciones
    parallelism: 1,
  });
  next();
});

usuarioSchema.methods.compararClave = async function (claveIngresada) {
  const argon2 = require('argon2');
  // Si la clave ya está en Argon2id
  if (this.clave && this.clave.startsWith('$argon2')) {
    return await argon2.verify(this.clave, claveIngresada);
  }
  // Compatibilidad hacia atrás si hubiera hashes previos en bcrypt
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(claveIngresada, this.clave);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
